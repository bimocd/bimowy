import { Context } from "./context";
import { NSError } from "./error";
import { NSComplexNodeParsers, NSMinimumComplexNodeSchema, NSSimpleNodeParsers } from "./nodes";

export function executeNS(node: unknown, ctx = new Context(node)): unknown {
	for (const simpleParser of NSSimpleNodeParsers) {
		const parsedNode = simpleParser.schema.safeParse(node);
		if (!parsedNode.success) continue;
		// @ts-expect-error
		return simpleParser.execute(parsedNode.data, ctx);
	}
	const minimumNode = NSMinimumComplexNodeSchema.safeParse(node);
	if (!minimumNode.success) throw new NSError("Unknown Node", node);

	const complexParser = NSComplexNodeParsers.find((c) => c.id === minimumNode.data._nstype);
	if (!complexParser) throw new NSError("Unknown Node Type", node);
	// @ts-expect-error
	return complexParser.execute(node, ctx);
}
