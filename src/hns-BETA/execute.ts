import type z from "zod";
import { NSListNodeSchema, type NSNode, NSPrimitiveNodeSchema } from "./nodes";

const $parser = <Schema extends z.ZodType>({
	schemas,
	execute
}: {
	schemas: Schema[];
	execute: (node: z.infer<Schema>) => unknown;
}) => ({ schemas, execute });

const parserRegistry = [
	$parser({
		schemas: [NSListNodeSchema],
		execute: (nodes) => nodes.map((node) => executeNS(node))
	}),
	$parser({
		schemas: [NSPrimitiveNodeSchema],
		execute: (node) => node
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
