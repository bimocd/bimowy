import z from "zod";

/*
	NS = Node System
	NSNode
	> NSPrimitiveNode // number | string
	> NSListNodeSchema // NSListNodeSchema
	> NSCompositeNode // { _bsttype: "xxxxx", ... }
 */

export type NSPrimitiveNode = z.infer<typeof NSPrimitiveNodeSchema>;
export type NSListNode = NSNode[];
export type NSIfNode = { _nstype: "if", condition: NSNode, success: NSNode, fail: NSNode };

export const NSPrimitiveNodeSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
export const NSListNodeSchema: z.ZodType<NSListNode> = z.array(z.lazy(() => NSNodeSchema));
export const NSIfNodeSchema: z.ZodType<NSIfNode> = z.object({
	_nstype: z.literal("if"),
	get condition(){
		return NSNodeSchema
	},
	get success(){
		return NSNodeSchema
	},
	get fail(){
		return NSNodeSchema
	}
})


export type NSNode = NSPrimitiveNode | NSListNode | NSIfNode;

export const NSNodeSchema: z.ZodType<NSNode> = z.union([
	NSPrimitiveNodeSchema,
	NSListNodeSchema,
	NSIfNodeSchema
]);
