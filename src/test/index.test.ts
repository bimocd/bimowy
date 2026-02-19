import assert from "node:assert";
import test, { suite } from "node:test";
import { executeNS } from "@/hns-BETA/execute";
import { NSIfNode } from "@/hns-BETA/nodes";

suite("Node System", () => {
	test("PrimitiveNode & ListNode", () => {
		const primitiveExamples = [
			"123",
			123,
			9,
			0,
			1e7,
			-1e7,
			Math.random(),
			"ok",
			["1234,54", 293, 1e7, false, true],
			false,
			true
		];

		for (const primitive of primitiveExamples) {
			const executed = executeNS(primitive);
			assert.deepEqual(executed, primitive);
		}
	});
	test("IfNode", () => {
		const ifNodes = [
			{ _nstype: "if", if: false, yes: 0, no: 1 },
			{ _nstype: "if", if: true, yes: 1, no: 0 },
			{
				_nstype: "if",
				if: true,
				no: 0,
				yes: {
					_nstype: "if",
					if: false,
					yes: 0,
					no: 1
				}
			}
		] as NSIfNode[];

		for (const ifNode of ifNodes) {
			const res = executeNS(ifNode);
			assert.deepEqual(res, 1);
		}
	});
});
