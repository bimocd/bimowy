import z from "zod";
import type { Context } from "./context";
import { NSError } from "./error";
import { executeNS } from "./execute";
import { functionRegistry } from "./functions";

/*
	NSNode (NS = Node System)
	> NSSimpleNode // number | string | null | boolean (??)[]
	> NSComplexNode // { _nstype: "xxxxx", ... }
 */

export function createSimpleNodeParser<Schema extends z.ZodType>({
	schema,
	execute
}: {
	schema: Schema;
	execute: (node: z.infer<Schema>, ctx: Context) => unknown;
}) {
	return {
		schema: schema,
		execute
	};
}

export type NSBaseComplexNode<NSType extends string, NSKey extends string> = { _nstype: NSType } & {
	[key in NSKey]: unknown;
};

export function createComplexNodeParser<
	T extends string,
	P extends string,
	Schema = z.ZodType<NSBaseComplexNode<T, P>>
>({
	nstype,
	props,
	execute
}: {
	nstype: T;
	props: P[];
	execute: (node: z.infer<Schema>, ctx: Context) => unknown;
}) {
	return {
		id: nstype,
		schema: z.object({
			_nstype: z.literal(nstype),
			...props.reduce((acc, prop) => ({ ...acc, [prop]: z.unknown().default(null) }), {})
		}) as Schema,
		execute
	};
}

export const NSSimpleNodeParsers = [
	createSimpleNodeParser({
		schema: z.undefined(),
		execute(node) {
			throw new NSError("Found 'undefined'", node);
		}
	}),
	createSimpleNodeParser({
		schema: z.union([z.string(), z.number(), z.boolean(), z.null()]),
		execute: (node) => node
	}),
	createSimpleNodeParser({
		schema: z.array(z.unknown()),
		execute: (nodes, ctx) => nodes.map((node) => executeNS(node, ctx))
	})
] as const;

export const NSComplexNodeParsers = [
	createComplexNodeParser({
		nstype: "if",
		props: ["if", "yes", "no"],
		execute: (node, ctx) =>
			executeNS(node.if, ctx) ? executeNS(node.yes, ctx) : executeNS(node.no, ctx)
	}),
	createComplexNodeParser({
		nstype: "var-get",
		props: ["id"],
		execute: (node, ctx) => ctx.getVar(executeNS(node.id, ctx) as string)
	}),
	createComplexNodeParser({
		nstype: "var-set",
		props: ["id", "value"],
		execute: (node, ctx) =>
			ctx.setVar(executeNS(node.id, ctx) as string, executeNS(node.value, ctx))
	}),
	createComplexNodeParser({
		nstype: "return",
		props: ["value"],
		execute: (node, ctx) => ({ ...node, value: executeNS(node.value, ctx) })
	}),
	createComplexNodeParser({
		nstype: "program",
		props: ["items"],
		execute(node, ctx) {
			const instructions = executeNS(node.items, ctx) as unknown[];
			const NSMiniReturnNodeSchema = z.object({
				_nstype: z.literal("return"),
				value: z.unknown()
			});
			let lastResult: unknown = null;
			for (const instruction of instructions) {
				lastResult = instruction;
				const parsedNode = NSMiniReturnNodeSchema.safeParse(instruction);
				if (parsedNode.success) return parsedNode.data.value;
			}
			return lastResult;
		}
	}),
	createComplexNodeParser({
		nstype: "call",
		props: ["id", "args"],
		execute(node, ctx) {
			const fn = functionRegistry.find((fn) => fn.id === node.id);
			if (!fn) throw new NSError(`Function with ID '${node.id}' not found`, node);
			const oldArgs = executeNS(node.args, ctx);
			const parsedArgs = fn.inputs.safeParse(oldArgs);
			if (!parsedArgs.success)
				throw new NSError("Invalid function args", {
					node,
					args: node.args,
					error: parsedArgs.error
				});
			// @ts-expect-error because ts don't understand that "execute" and "args" related
			return fn.execute(...parsedArgs.data);
		}
	})
] as const;

export const NSMinimumComplexNodeSchema = z.object({ _nstype: z.string() });
export const NSNode = z.union([
	...NSSimpleNodeParsers.map((n) => n.schema),
	...NSComplexNodeParsers.map((n) => n.schema)
]);
export type NSNode = z.infer<typeof NSNode>;
