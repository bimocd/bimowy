import type z from "zod";
import { NSIfNodeSchema, NSListNodeSchema, type NSNode, NSPrimitiveNodeSchema } from "./nodes";

// Parser
const $ = <Schema extends z.ZodType>({
	schemas,
	execute
}: {
	schemas: Schema[];
	execute: (node: z.infer<Schema>) => unknown;
}) => ({ schemas, execute });

const parserRegistry = [
	$({
		schemas: [NSListNodeSchema],
		execute: (nodes) => nodes.map((node) => executeNS(node))
	}),
	$({
		schemas: [NSPrimitiveNodeSchema],
		execute: (node) => node
	}),
	$({
		schemas: [NSIfNodeSchema],
		execute: node => executeNS(node.condition) ? executeNS(node.success) : executeNS(node.fail)
	})
] as const;

export function executeNS(node: NSNode): unknown {
	for (const parser of parserRegistry) {
		for (const schema of parser.schemas) {
			const result = schema.safeParse(node);
			if (!result.success) continue;
			// @ts-expect-error
			return parser.execute(result.data);
		}
	}
}
