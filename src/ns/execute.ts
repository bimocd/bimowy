import { RuntimeContext } from "./context";
import { NSError } from "./error";
import { NSComplexNodesData, NSMinimumComplexNodeSchema, NSSimpleNodesData } from "./nodes";

export function executeNS(node: unknown, ctx = new RuntimeContext()): unknown {
	for (const simpleParser of NSSimpleNodesData) {
		const parsedNode = simpleParser.schema.safeParse(node);
		if (!parsedNode.success) continue;
		// @ts-expect-error
		return simpleParser.execute(parsedNode.data, ctx);
	}
	const minimumNode = NSMinimumComplexNodeSchema.safeParse(node);
	if (!minimumNode.success) throw new NSError("Unknown Node", node);

	const complexParser = NSComplexNodesData.find((c) => c.id === minimumNode.data._nstype);
	if (!complexParser) throw new NSError("Unknown Node Type", node);
	// @ts-expect-error
	return complexParser.execute(node, ctx);
}
