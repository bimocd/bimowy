import assert from "node:assert";
import test from "node:test";
import { executeNS } from "@/ns/execute";
import { $ } from "@/ns/helpers";

test("Node System", () => {
	test("executeNS", () => {
		const prgm1 = $.prgm([
			$.varSet("a_age", 15),
			$.varSet("b_age", 24),
			$.varSet("is_b_major", $.fn("compare", [">=", $.varGet("a_age"), 18])),
			$.varSet("is_a_major", $.fn("compare", [">=", $.varGet("b_age"), 18])),
			$.return([$.varGet("is_a_major"), $.varGet("is_b_major")])
		]);
		return assert.deepStrictEqual(executeNS(prgm1), [true, false]);
	});
});
