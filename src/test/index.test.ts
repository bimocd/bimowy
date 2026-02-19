import assert from "node:assert";
import test, { skip, suite } from "node:test";
import { executeNS } from "@/hns-BETA/execute";
import { NSIfNode } from "@/hns-BETA/nodes";

suite("Node System", () => {
	test("PrimitiveNode & ListNode", () => {
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
			["1234,54", 293, 1e7, false, true, null],
			false,
			true
		];

		for (const primitive of primitiveExamples) {
			const executed = executeNS(primitive);
			assert.deepEqual(executed, primitive);
		}
	});
	test("IfNode", () =>{
		const ifNodes = [
			{ _nstype: "if", condition: false, success: 0, fail: 1 },
			{ _nstype: "if", condition: true, success: 1, fail: 0 },
			{ _nstype: "if", condition: true,  fail: 0,
				success: {
				_nstype: "if", condition: false, success: 0, fail: 1 
			} }
		] as NSIfNode[];

		for(const ifNode of ifNodes){
			const res = executeNS(ifNode)
			assert.deepEqual(res,1)
		}
	})
});
