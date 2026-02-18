import assert from "node:assert";
import test, { suite } from "node:test";
import { executeNS } from "@/hns-BETA/execute";

suite("Node System", () => {
	test("[xxx] executed returns itself", () => {
		const primitiveExamples = [
			"123",
			123,
			null,
			9,
			0,
			1e7,
			-1e7,
			Math.random(),
			"ok",
			["1234,54", 293, 1e7, null],
			false,
			true
		];

		for (const primitive of primitiveExamples) {
			const executed = executeNS(primitive);
			test(`${primitive}`, () => assert.deepEqual(executed, primitive));
		}
	});
});
