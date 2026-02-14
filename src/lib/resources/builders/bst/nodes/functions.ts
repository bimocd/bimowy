import { executeBST } from "../execute";
import { type BSTNode, BSTType } from "../nodes";
import type { Scope } from "../scope";

// ⚠️ Don't use BSTNode<> inside a parameter type it fucks up EVEYTHING IN ALL FILES i learnt this the hard way <3
export const ALL_FUNCTIONS = {
	"-": (a: number, b: number) => a - b,
	"*": (a: number, b: number) => a * b,
	"**": (a: number, b: number) => a ** b,
	"/": (a: number, b: number) => a / b,
	"%": (a: number, b: number) => a % b,
	"+": (a: number, b: number) => a + b,
	"<": (a: number, b: number) => a < b,
	"=": <T extends number | string>(a: T, b: T) => a === b,
	">": (a: number, b: number) => a > b,
	biasedRandomInt(min: number, max: number) {
		const r = Math.random();
		const biased = r ** 2;
		const value = min + Math.floor(biased * (max - min + 1));
		return value;
	},
	concat: (joined: (string | number)[]) => joined.join(""),
	factorial: (n: number): number => (n <= 0 ? 1 : n * ALL_FUNCTIONS.factorial(n - 1)),
	getIndex: (arr: number[], i: number): number => arr[i],
	randomInt: (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min,
	randomFromList: <T>(list: T[]) => list[Math.floor(Math.random() * list.length)]
} as const;

export type RecursivelyNestNode<U> =
	| U
	| BSTNode<U>
	| (U extends any[]
			? {
					[K in keyof U]: RecursivelyNestNode<U[K]>;
				}
			: never)
	| (U extends object
			? {
					[K in keyof U]: RecursivelyNestNode<U[K]>;
				}
			: never);

export type FnRegistry = typeof ALL_FUNCTIONS;
export type FnID = keyof FnRegistry;
export type Fn<ID extends FnID> = FnRegistry[ID];
export type RawArgsFn<ID extends FnID> = Parameters<Fn<ID>>;
export type ReturnFn<ID extends FnID> = ReturnType<Fn<ID>>;
export type NodeArgsFn<ID extends FnID> = RecursivelyNestNode<RawArgsFn<ID>>;
export type NodeArgsFnI<ID extends FnID, I extends number> = RecursivelyNestNode<RawArgsFn<ID>[I]>;

export type ReturnOfId<ID extends keyof FnRegistry> = FnRegistry[ID] extends (
	...args: any[]
) => infer R
	? R
	: never;

export type FnIDsThatReturn<R> = {
	[K in keyof FnRegistry]: ReturnOfId<K> extends R ? K : never;
}[keyof FnRegistry];

export type BSTFunctionCallNode<
	R extends ReturnFn<FnID>,
	ID extends FnIDsThatReturn<R> = FnIDsThatReturn<R>
> = {
	_bsttype: BSTType.FunctionCall;
	id: ID; // TODO: Make this can be a DSTNode<ID> and not necessarly directly a string yk
	args: NodeArgsFn<ID>;
};

export function executeFunctionCall<R extends ReturnFn<FnID>>(
	node: BSTFunctionCallNode<R, FnIDsThatReturn<R>>,
	ctx: Scope
): R {
	const id = executeBST(node.id, ctx);
	const f = ALL_FUNCTIONS[id];
	// @ts-expect-error
	const args = executeBST(node.args, ctx);
	// @ts-expect-error
	return f(...args);
}

export const FunctionHelpers = {
	fn: <R extends ReturnFn<FnID>, FnID extends FnIDsThatReturn<R> = FnIDsThatReturn<R>>(
		id: FnID,
		args: NodeArgsFn<FnID>
	): BSTFunctionCallNode<R, FnID> =>
		({
			_bsttype: BSTType.FunctionCall,
			id,
			args
		}) as const,
	i: (arr: NodeArgsFnI<"getIndex", 0>, index: NodeArgsFnI<"getIndex", 1>) => {
		return FunctionHelpers.fn("getIndex", [arr, index]);
	}
};
