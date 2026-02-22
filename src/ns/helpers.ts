import type {
	NSFunctionCallNode,
	NSIfNode,
	NSProgramNode,
	NSVarGetNode,
	NSVarSetNode
} from "./nodes";

export const $ = {
	return: (value: unknown) => ({ _nstype: "return", value }),
	if: (cond: unknown, { yes, no }: { yes: unknown; no: unknown }): NSIfNode => ({
		_nstype: "if",
		if: cond,
		yes,
		no
	}),
	prgm: (items: unknown): NSProgramNode => ({ _nstype: "program", items }),
	varSet: (id: unknown, value: unknown): NSVarSetNode => ({
		_nstype: "var-set",
		id,
		value
	}),
	varGet: (id: unknown): NSVarGetNode => ({
		_nstype: "var-get",
		id
	}),
	fn: (id: unknown, args: unknown): NSFunctionCallNode => ({
		_nstype: "function-call",
		id,
		args
	})
};
