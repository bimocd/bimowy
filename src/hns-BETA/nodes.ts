import z from "zod";

export type NSPrimitiveNode = z.infer<typeof NSPrimitiveNodeSchema>;
export const NSPrimitiveNodeSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);

export type NSListNode = NSNode[];
export const NSListNodeSchema: z.ZodType<NSListNode> = z.array(z.lazy(() => NSNodeSchema));

export type NSNode = NSPrimitiveNode | NSListNode;
export const NSNodeSchema: z.ZodType<NSNode> = z.union([
	NSPrimitiveNodeSchema,
	z.lazy(() => NSListNodeSchema)
]);
