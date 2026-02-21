export const $ = {
	return: (value: unknown) => ({ _nstype: "return", value }),
	if: (cond: unknown, { yes, no }: { yes: unknown; no: unknown }) => ({
		_nstype: "if",
		if: cond,
		yes,
		no
	}),
	prgm: (items: unknown) => ({ _nstype: "program", items }),
	varSet: (id: unknown, value: unknown) => ({
		_nstype: "var-set",
		id,
		value
	}),
	varGet: (id: unknown) => ({
		_nstype: "var-get",
		id
	}),
	fn: (id: unknown, args: unknown) => ({
		_nstype: "call",
		id,
		args
	})
};
