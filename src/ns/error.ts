import { inspect } from "node:util";

export class NSError extends Error {
	constructor(message: string, extra: unknown) {
		console.error(inspect(extra, { colors: true, depth: Infinity }));
		super(message);
	}
}
