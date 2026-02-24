import type { ZodType } from "zod";

export class RuntimeContext {
	constructor(public variables = new Map()) {}
	getVar(id: string): unknown {
		return this.variables.get(id) ?? null;
	}
	setVar(id: string, value: unknown) {
		this.variables.set(id, value);
	}
}

export class ScantimeContext {
	constructor(public types = new Map<string, ZodType>()) {}

	getVar(id: string) {
		return this.types.get(id);
	}

	setVar(id: string, schema: ZodType) {
		this.types.set(id, schema);
	}
}
