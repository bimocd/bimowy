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

export type NSBaseComplexNode<NSType extends NSNodeID, NSKey extends string> = {
	_nstype: NSType;
} & {
	[key in NSKey]: unknown;
};

export function createComplexNodeParser<
	T extends NSNodeID,
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

// --

export const NSNodeIDSchema = z.enum([
	"if",
	"var-get",
	"var-set",
	"return",
	"program",
	"function-call"
]);
export type NSNodeID = z.infer<typeof NSNodeIDSchema>;

// --

export const NSPrimitiveNodeData = createSimpleNodeParser({
	schema: z.union([z.string(), z.number(), z.boolean(), z.null()]),
	execute: (node) => node
});
export type NSPrimitiveNode = z.infer<typeof NSPrimitiveNodeData.schema>;

export const NSArrayNodeData = createSimpleNodeParser({
	schema: z.array(z.unknown()),
	execute: (nodes, ctx) => nodes.map((node) => executeNS(node, ctx))
});
export type NSArrayNode = z.infer<typeof NSArrayNodeData.schema>;

export const NSIfNodeData = createComplexNodeParser({
	nstype: "if",
	props: ["if", "yes", "no"],
	// checks: [
	// 	{
	// 		code: "IF_BOOLEAN",
	// 		check: (node) => isSameType(z.boolean(), diagnose(node.if))
	// 	},
	// 	{
	// 		code: "YES_AND_NO_SAME_TYPE",
	// 		check: (node) => {
	// 			return isSameType(diagnose(node.yes), diagnose(node.no));
	// 		}
	// 	}
	// ],
	execute: (node, ctx) =>
		executeNS(node.if, ctx) ? executeNS(node.yes, ctx) : executeNS(node.no, ctx)
});
export type NSIfNode = z.infer<typeof NSIfNodeData.schema>;

export const NSVarGetNodeData = createComplexNodeParser({
	nstype: "var-get",
	props: ["id"],
	execute: (node, ctx) => ctx.getVar(executeNS(node.id, ctx) as string)
});
export type NSVarGetNode = z.infer<typeof NSVarGetNodeData.schema>;

export const NSVarSetNodeData = createComplexNodeParser({
	nstype: "var-set",
	props: ["id", "value"],
	execute: (node, ctx) => ctx.setVar(executeNS(node.id, ctx) as string, executeNS(node.value, ctx))
});
export type NSVarSetNode = z.infer<typeof NSVarSetNodeData.schema>;

export const NSReturnNodeData = createComplexNodeParser({
	nstype: "return",
	props: ["value"],
	execute: (node, ctx) => ({ ...node, value: executeNS(node.value, ctx) })
});
export type NSReturnNode = z.infer<typeof NSReturnNodeData.schema>;

export const NSProgramNodeData = createComplexNodeParser({
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
});
export type NSProgramNode = z.infer<typeof NSProgramNodeData.schema>;

export const NSFunctionCallNodeData = createComplexNodeParser({
	nstype: "function-call",
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
});
export type NSFunctionCallNode = z.infer<typeof NSFunctionCallNodeData.schema>;

export const NSMinimumComplexNodeSchema = z.object({ _nstype: NSNodeIDSchema });

export const NSSimpleNodesData = [NSPrimitiveNodeData, NSArrayNodeData];
export const NSComplexNodesData = [
	NSIfNodeData,
	NSVarGetNodeData,
	NSVarSetNodeData,
	NSReturnNodeData,
	NSProgramNodeData,
	NSFunctionCallNodeData
];
export const NSSimpleNodeSchema = z.union(NSSimpleNodesData.map((n) => n.schema));
export const NSComplexNodeSchema = z.union(NSComplexNodesData.map((n) => n.schema));

export const NSNodeSchema = z.union([NSSimpleNodeSchema, NSComplexNodeSchema]);
export type NSNode = z.infer<typeof NSNodeSchema>;
