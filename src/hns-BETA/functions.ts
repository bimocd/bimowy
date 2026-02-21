import z from "zod";

// Function creator
function $<In extends z.ZodArray | z.ZodTuple, Out extends z.ZodType>({
	id,
	inputs,
	output,
	execute
}: {
	id: string;
	inputs: In;
	output: Out;
	execute: (...args: z.infer<In>) => z.infer<Out>;
}) {
	return { id, inputs, output, execute };
}

const basicOperationsExecuters = {
	"+": (a, b) => a + b,
	"-": (a, b) => a - b,
	"*": (a, b) => a * b,
	"/": (a, b) => a / b,
	"**": (a, b) => a ** b
} satisfies Record<string, (a: number, b: number) => number>;

export const basicOperationFunction = $({
	id: "op",
	inputs: z.tuple([z.enum(Object.keys(basicOperationsExecuters)), z.number(), z.number()]),
	outputs: z.number(),
	// @ts-expect-error
	execute: (op, a, b) => basicOperationsExecuters[op](a, b)
});

const basicComparisonExecuters = {
	"=": (a, b) => a === b,
	">": (a, b) => a > b,
	"<": (a, b) => a < b,
	">=": (a, b) => a >= b,
	"<=": (a, b) => a <= b,
	"!=": (a, b) => a !== b
	// } satisfies Record<string, <T>(a: T, b: T) => boolean>;
} satisfies Record<string, (a: number, b: number) => boolean>;

export const basicComparisonFunction = $({
	id: "compare",
	inputs: z.tuple([z.enum(Object.keys(basicComparisonExecuters)), z.number(), z.number()]),
	outputs: z.boolean(),
	// @ts-expect-error
	execute: (op, a, b) => basicComparisonExecuters[op](a, b)
});

export const otherFunctions = [
	$({
		id: "concatTrim",
		inputs: z.array(z.string()),
		output: z.string(),
		execute: (...strs) => strs.map((str) => str.trim()).join(" ")
	})
	// ...
] as const;

export const functionRegistry = [
	basicOperationFunction,
	basicComparisonFunction,
	...otherFunctions
];
