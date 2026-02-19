import z from "zod";

/*
	NS = Node System
	NSNode
	> NSPrimitiveNode // number | string
	> NSListNodeSchema // NSListNodeSchema
	> NSCompositeNode // { _bsttype: "xxxxx", ... }
 */

export type NSBaseCompositeNode<NSType extends string> = { _nstype: NSType }
export type BSCompositeNodeProps<NSKey extends string> = { [key in NSKey]: NSNode}


export type NSPrimitiveNode = z.infer<typeof NSPrimitiveNodeSchema>;
export type NSListNode = NSNode[];
export type NSIfNode = NSBaseCompositeNode<"if"> & BSCompositeNodeProps<"condition" | "success" | "fail">

export const NSPrimitiveNodeSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
export const NSListNodeSchema: z.ZodType<NSListNode> = z.array(z.lazy(() => NSNodeSchema));
export const NSIfNodeSchema: z.ZodType<NSIfNode> = z.object({
	_nstype: z.literal("if"),
	get condition(){ return NSNodeSchema },
	get success(){ return NSNodeSchema },
	get fail(){ return NSNodeSchema }
})

export type NSNode = NSPrimitiveNode | NSListNode | NSIfNode;

export const NSNodeSchema: z.ZodType<NSNode> = z.union([
	NSPrimitiveNodeSchema,
	NSListNodeSchema,
	NSIfNodeSchema
]);
