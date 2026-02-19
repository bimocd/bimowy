export class Context {
	public variables = new Map();
	getVar(id: string): unknown {
		return this.variables.get(id) ?? null;
	}
	setVar(id: string, value: unknown) {
		this.variables.set(id, value);
	}
}
