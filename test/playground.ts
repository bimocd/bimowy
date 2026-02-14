import { inspect } from "node:util";
import factorial from "@/lib/resources/list/factorial";

console.log(
	inspect(
		factorial.generateExercise({
			interval: [0, 4],
		}),
		false,
		10,
		true,
	),
);
