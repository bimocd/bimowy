import type {
	NSFunctionCallNode,
	NSIfNode,
	NSNode,
	NSProgramNode,
	NSReturnNode,
	NSVarGetNode,
	NSVarSetNode
} from "./nodes";

export const $ = {
	return: (value: NSNode): NSReturnNode => ({ _nstype: "return", value }),
	if: (cond: NSNode, { yes, no }: { yes: NSNode; no: NSNode }): NSIfNode => ({
		_nstype: "if",
		if: cond,
		yes,
		no
	}),
	prgm: (items: NSNode): NSProgramNode => ({ _nstype: "program", items }),
	varSet: (id: NSNode, value: NSNode): NSVarSetNode => ({
		_nstype: "var-set",
		id,
		value
	}),
	varGet: (id: NSNode): NSVarGetNode => ({
		_nstype: "var-get",
		id
	}),
	fn: (id: NSNode, args: NSNode): NSFunctionCallNode => ({
		_nstype: "function-call",
		id,
		args
	})
};
