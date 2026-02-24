import z from "zod";
import { ScantimeContext } from "./context";
import { NSNodeData } from "./nodes";

export type NSScan = {
	schema: z.ZodType;
	notes: NSDiagnostic[];
};

export type NSDiagnostic = {
	level: "error" | "warning";
	code: string;
	message: string;
	extra?: unknown;
};

export function scanNS(node: unknown, ctx = new ScantimeContext()): NSScan {
	for (const nodeData of NSNodeData) {
		const parsedNode = nodeData.schema.safeParse(node);
		if (!parsedNode.success) continue;

		const { data } = parsedNode;
		// @ts-expect-error
		return nodeData.scan(data, ctx);
	}

	return {
		schema: z.never(),
		notes: [
			{
				level: "error",
				code: "UNSCANNABLE_NODE",
				message: "Node did not pass any scannner schema parsing."
			}
		]
	};
}
