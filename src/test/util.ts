import assert from "node:assert";
import test, { suite } from "node:test";

type TestCase<T = unknown> = [expected: T, testFn: () => T];

export function $<T>(name: string | number, testFn: () => T, expected: T) {
	test(`${name}`, () => assert.deepStrictEqual(testFn(), expected));
}

export function $group(name: string, testCases: TestCase[]) {
	suite(name, () => {
		for (const [i, [expected, testFn]] of testCases.entries()) {
			$(i, testFn, expected);
		}
	});
}
