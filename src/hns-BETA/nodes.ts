import z from "zod";

/*
	NS = Node System
	NSNode
	> NSPrimitiveNode // number | string
	> NSListNodeSchema // NSListNodeSchema
	> NSCompositeNode // { _bsttype: "xxxxx", ... }
 */

export type NSBaseCompositeNode<NSType extends string> = { _nstype: NSType }
export type NSCompositeNodeProps<NSKey extends string> = { [key in NSKey]: NSNode}

// Composite node schema creator
export function $
<NSType extends string, NSProp extends string>
(nstype: NSType, props: NSProp[])
: z.ZodType<NSBaseCompositeNode<NSType> & NSCompositeNodeProps<NSProp>> {
	// @ts-expect-error
  return z.object({
		_nstype: z.literal(nstype),
		...(props.reduce((acc,prop) => ({ ...acc, [prop]: z.lazy(() => NSNodeSchema)}),{}))
	})
}

export type NSPrimitiveNode = z.infer<typeof NSPrimitiveNodeSchema>;
export type NSListNode = NSNode[];
export type NSIfNode = NSBaseCompositeNode<"if"> & NSCompositeNodeProps<"if" | "yes" | "no">

export const NSPrimitiveNodeSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
export const NSListNodeSchema: z.ZodType<NSListNode> = z.array(z.lazy(() => NSNodeSchema));
export const NSIfNodeSchema: z.ZodType<NSIfNode> = $("if",["if","yes","no"]);

export type NSNode = NSPrimitiveNode | NSListNode | NSIfNode;

export const NSNodeSchema: z.ZodType<NSNode> = z.union([
	NSPrimitiveNodeSchema,
	NSListNodeSchema,
	NSIfNodeSchema
]);
