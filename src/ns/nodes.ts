import z from "zod";
import { NSError } from "./error";
import { executeNS } from "./execute";
import { functionRegistry } from "./functions";
import { createComplexNodeParser, createSimpleNodeParser } from "./nodes.util";
import { type NSDiagnostic, scanNS } from "./scan";
import { isSchemaSubset } from "./subset";
import { areSelfSubset } from "./subset.util";

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
	execute: (node) => node,
	scan(node) {
		const notes: NSDiagnostic[] = [];
		if (node === null) return { schema: z.null(), notes };
		return {
			notes,
			schema: z.literal(node)
		};
	}
});
export type NSPrimitiveNode = z.infer<typeof NSPrimitiveNodeData.schema>;

export const NSArrayNodeData = createSimpleNodeParser({
	schema: z.array(z.unknown()),
	execute: (nodes, ctx) => nodes.map((node) => executeNS(node, ctx)),
	scan: (node, ctx) => {
		const scans = node.map((n) => scanNS(n, ctx));
		const schemas = scans.map((s) => s.schema);
		const notes = scans.map((s) => s.notes);
		const totalSchema =
			schemas.length > 0 ? z.tuple(schemas as [z.ZodType, ...z.ZodType[]]) : z.array(z.never());
		return { notes: notes.flat(), schema: totalSchema };
	}
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
		executeNS(node.if, ctx) ? executeNS(node.yes, ctx) : executeNS(node.no, ctx),
	scan(node, ctx) {
		// should use .xor() ?
		const scannedIf = scanNS(node.if, ctx);
		const parsedIf = isSchemaSubset(z.boolean(), scannedIf.schema);
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
		const scannedYes = scanNS(node.yes, ctx);
		const scannedNo = scanNS(node.no, ctx);
		const NoAndYesSchema = areSelfSubset(scannedYes.schema, scannedNo.schema) // Simplification when possible.
			? scannedYes.schema
			: z.intersection(scannedYes.schema, scannedNo.schema);
		return {
			schema: NoAndYesSchema,
			notes: [...scannedIf.notes, ...scannedYes.notes, ...scannedNo.notes]
		};
	}
});
export type NSIfNode = z.infer<typeof NSIfNodeData.schema>;

export const NSVarGetNodeData = createComplexNodeParser({
	nstype: "var-get",
	props: ["id"],
	execute: (node, ctx) => ctx.getVar(executeNS(node.id, ctx) as string)
	// scan(node, ctx) {
	// 	const id = scan(node.id)
	// 	ctx.getVar(node.id)
	// } // Can't do this part yet bc "id" needs to be more specific.
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
	// scan(node, ctx) {
	// 	const notes = [];
	// 	const instructions = scanNS(node.items, ctx);
	// 	const NSMiniReturnNodeSchema = z.object({
	// 		_nstype: z.literal("return"),
	// 		value: z.unknown()
	// 	});

	// 	let lastResult: unknown = null;
	// 	for (const instruction of instructions.schema) {
	// 		lastResult = instruction;
	// 		const parsedNode = NSMiniReturnNodeSchema.safeParse(instruction);
	// 		if (parsedNode.success) return parsedNode.data.value;
	// 	}
	// 	return lastResult;

	// }
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
export const NSNodeData = [...NSSimpleNodesData, ...NSComplexNodesData];
export const NSSimpleNodeSchema = z.union(NSSimpleNodesData.map((n) => n.schema));
export const NSComplexNodeSchema = z.union(NSComplexNodesData.map((n) => n.schema));

export const NSNodeSchema = z.union([NSSimpleNodeSchema, NSComplexNodeSchema]);
export type NSNode = z.infer<typeof NSNodeSchema>;
