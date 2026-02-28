import z from "zod";
import type { RuntimeContext, ScantimeContext } from "./context";
import type { NSNodeID } from "./nodes";
import type { NSScan } from "./scan";

export function createSimpleNodeParser<Schema extends z.ZodType>({
	schema,
	execute,
	scan = () => ({ schema: z.never(), notes: [] })
}: {
	schema: Schema;
	execute: (node: z.infer<Schema>, ctx: RuntimeContext) => unknown;
	scan?: (node: z.infer<Schema>, ctx: ScantimeContext) => NSScan;
}) {
	return { schema, execute, scan };
}

export type NSBaseComplexNode<NSType extends NSNodeID, NSKey extends string> = {
	_nstype: NSType;
} & {
	[key in NSKey]: unknown;
};

export function createComplexNodeParser<
	T extends NSNodeID,
	P extends string,
	Schema = z.ZodType<NSBaseComplexNode<T, P>>
>({
	nstype,
	props,
	execute,
	scan = () => ({ schema: z.never(), notes: [] })
}: {
	nstype: T;
	props: P[];
	execute: (node: z.infer<Schema>, ctx: RuntimeContext) => unknown;
	scan?: (node: z.infer<Schema>, ctx: ScantimeContext) => NSScan;
}) {
	return {
		nstype,
		scan,
		schema: z.object({
			_nstype: z.literal(nstype),
			...props.reduce((acc, prop) => ({ ...acc, [prop]: z.unknown().default(null) }), {})
		}) as Schema,
		execute
	};
}
