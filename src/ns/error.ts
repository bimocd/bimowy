import { echo } from "@/utils/echo";

export class NSError extends Error {
	constructor(message: string, extra: unknown) {
		echo("💥", extra);
		super(message);
	}
}
