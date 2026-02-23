import z from "zod";
import { isSameType } from "zod-compare";
import {
	type NSArrayNode,
	NSArrayNodeData,
	type NSIfNode,
	NSIfNodeData,
	type NSPrimitiveNode,
	NSPrimitiveNodeData
} from "@/ns/nodes";

type NSScan = {
	schema: z.ZodType;
	notes: NSDiagnostic[];
};

type NSDiagnostic = {
	level: "error" | "warning";
	code: string;
	message: string;
	extra?: unknown;
};

export function scan(node: unknown): NSScan {
	const scanners = [
		{ ...NSPrimitiveNodeData, scan: scanPrimitive },
		{ ...NSArrayNodeData, scan: scanArray },
		{ ...NSIfNodeData, scan: scanIf }
	] as const;

	for (const scanner of scanners) {
		const parsedNode = scanner.schema.safeParse(node);
		if (!parsedNode.success) continue;

		const { data } = parsedNode;
		// @ts-expect-error
		return scanner.scan(data);
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

export function scanArray(node: NSArrayNode): NSScan {
	const scans = node.map((n) => scan(n));
	const schemas = scans.map((s) => s.schema);
	const notes = scans.map((s) => s.notes);
	const totalSchema =
		schemas.length > 0 ? z.tuple(schemas as [z.ZodType, ...z.ZodType[]]) : z.array(z.never());
	return { notes: notes.flat(), schema: totalSchema };
}

export function scanPrimitive(node: NSPrimitiveNode): NSScan {
	const notes: NSDiagnostic[] = [];
	if (node === null) return { schema: z.null(), notes };
	const type_of = typeof node;
	if (type_of === "string" || type_of === "number" || type_of === "boolean")
		return {
			notes,
			schema: {
				string: z.string(),
				number: z.number(),
				boolean: z.boolean()
			}[type_of]
		};
	return { schema: z.never(), notes };
}

export function scanIf(node: NSIfNode): NSScan {
	const scannedIf = scan(node.if);
	const parsedIf = [true, false].every((bool) => scannedIf.schema.safeParse(bool).success);
	if (!parsedIf)
		return {
			schema: z.never(),
			notes: [
				{
					level: "error",
					code: "IF_NOT_BOOLEAN",
					message: "If node condition does not execute to a boolean",
					extra: node
				}
			]
		};
	const scannedYes = scan(node.yes);
	const scannedNo = scan(node.no);
	const NoAndYesSchema = isSameType(scannedYes.schema, scannedNo.schema) // Simplification when possible.
		? scannedYes.schema
		: z.intersection(scannedYes.schema, scannedNo.schema);
	return {
		schema: NoAndYesSchema,
		notes: [...scannedIf.notes, ...scannedYes.notes, ...scannedNo.notes]
	};
}
