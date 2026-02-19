import type z from "zod";
import { Context } from "./context";
import { NSCompositeNodeSchemas as NSCNS, type NSNode } from "./nodes";

// Parser
const $ = <Schema extends z.ZodType>({
	schemas,
	execute
}: {
	schemas: Schema[];
	execute: (node: z.infer<Schema>, ctx: Context) => unknown;
}) => ({ schemas, execute });

const parserRegistry = [
	$({
		schemas: [NSCNS.NSListNodeSchema],
		execute: (nodes, ctx) => nodes.map((node) => executeNS(node, ctx))
	}),
	$({
		schemas: [NSCNS.NSPrimitiveNodeSchema],
		execute: (node) => node
	}),
	$({
		schemas: [NSCNS.NSIfNodeSchema],
		execute: (node, ctx) =>
			executeNS(node.if, ctx) ? executeNS(node.yes, ctx) : executeNS(node.no, ctx)
	}),
	$({
		schemas: [NSCNS.NSVarGetNodeSchema],
		execute: (node, ctx) => ctx.getVar(executeNS(node.id, ctx) as string)
	}),
	$({
		schemas: [NSCNS.NSVarSetNodeSchema],
		execute: (node, ctx) =>
			ctx.setVar(executeNS(node.id, ctx) as string, executeNS(node.value, ctx))
	})
] as const;

export function executeNS(node: NSNode, ctx = new Context()): unknown {
	for (const parser of parserRegistry) {
		for (const schema of parser.schemas) {
			const result = schema.safeParse(node);
			if (!result.success) continue;
			// @ts-expect-error
			return parser.execute(result.data, ctx);
		}
	}
}
