type RawAllowedVariableValues = number | string | boolean;
export type AllowedVariableValues = RawAllowedVariableValues | RawAllowedVariableValues[];
export class Scope {
	private variables = new Map();
	constructor(
		private vars: Record<string, AllowedVariableValues> = {},
		private parent?: Scope
	) {
		for (const [varId, varValue] of Object.entries(this.vars)) {
			this.variables.set(varId, varValue);
		}
	}
	getVariable(name: string): any {
		if (this.variables.has(name)) {
			return this.variables.get(name);
		} else if (this.parent) {
			return this.parent.getVariable(name);
		} else {
			throw new Error(`Variable ${name} not found`);
		}
	}
	setVariable(name: string, value: any) {
		this.variables.set(name, value);
		return this;
	}
}
