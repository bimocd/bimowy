import z from "zod";

/*
	NS = Node System
	NSNode
	> NSPrimitiveNode // number | string
	> NSListNodeSchema // NSListNodeSchema
	> NSCompositeNode // { _bsttype: "xxxxx", ... }
 */

export type NSBaseCompositeNode<NSType extends string> = { _nstype: NSType };
export type NSCompositeNodeProps<NSKey extends string> = { [key in NSKey]: NSNode };

// Composite node schema creator
export function $<NSType extends string, NSProp extends string>(
	nstype: NSType,
	props: NSProp[]
): z.ZodType<NSBaseCompositeNode<NSType> & NSCompositeNodeProps<NSProp>> {
	// @ts-expect-error
	return z.object({
		_nstype: z.literal(nstype),
		...props.reduce((acc, prop) => ({ ...acc, [prop]: z.lazy(() => NSNodeSchema) }), {})
	});
}

export type NSPrimitiveNode = string | number | boolean | null;
export type NSListNode = NSNode[];
export type NSIfNode = NSBaseCompositeNode<"if"> & NSCompositeNodeProps<"if" | "yes" | "no">;
export type NSVarGetNode = NSBaseCompositeNode<"var-get"> & NSCompositeNodeProps<"id">;
export type NSVarSetNode = NSBaseCompositeNode<"var-set"> & NSCompositeNodeProps<"id" | "value">;

export const NSCompositeNodeSchemas = {
	NSPrimitiveNodeSchema: z.union([z.string(), z.number(), z.boolean(), z.null()]),
	NSListNodeSchema: z.array(z.lazy(() => NSNodeSchema)) as z.ZodType<NSListNode>,
	NSIfNodeSchema: $("if", ["if", "yes", "no"]),
	NSVarGetNodeSchema: $("var-get", ["id"]),
	NSVarSetNodeSchema: $("var-set", ["id", "value"])
};

export type NSNode = NSPrimitiveNode | NSListNode | NSIfNode | NSVarGetNode | NSVarSetNode;

export const NSNodeSchema: z.ZodType<NSNode> = z.union([
	NSCompositeNodeSchemas.NSPrimitiveNodeSchema,
	NSCompositeNodeSchemas.NSListNodeSchema,
	NSCompositeNodeSchemas.NSIfNodeSchema,
	NSCompositeNodeSchemas.NSVarGetNodeSchema,
	NSCompositeNodeSchemas.NSVarSetNodeSchema
]);
