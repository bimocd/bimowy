import z from "zod";
import type { Context } from "./context";

export function createSimpleNodeParser<Schema extends z.ZodType>({
	schema,
	execute
}: {
	schema: Schema;
	execute: (node: z.infer<Schema>, ctx: Context) => unknown;
}) {
	return {
		schema: schema,
		execute
	};
}

export type NSBaseComplexNode<NSType extends string, NSKey extends string> = { _nstype: NSType } & {
	[key in NSKey]: unknown;
};

export function createComplexNodeParser<
	T extends string,
	P extends string,
	Schema = z.ZodType<NSBaseComplexNode<T, P>>
>({
	nstype,
	props,
	execute
}: {
	nstype: T;
	props: P[];
	execute: (node: z.infer<Schema>, ctx: Context) => unknown;
}) {
	return {
		id: nstype,
		schema: z.object({
			_nstype: z.literal(nstype),
			...props.reduce((acc, prop) => ({ ...acc, [prop]: z.unknown().default(null) }), {})
		}) as Schema,
		execute
	};
}

export const $ = {
	return: (value: unknown) => ({ _nstype: "return", value }),
	if: (cond: unknown, { yes, no }: { yes: unknown; no: unknown }) => ({
		_nstype: "if",
		if: cond,
		yes,
		no
	}),
	prgm: (items: unknown) => ({
		_nstype: "program",
		items
	}),
	var: {
		set: (id: unknown, value: unknown) => ({
			_nstype: "var-set",
			id,
			value
		}),
		get: (id: unknown) => ({
			_nstype: "var-get",
			id
		})
	},
	fn: (id: unknown, args: unknown) => ({
		_nstype: "call",
		id,
		args
	})
};
