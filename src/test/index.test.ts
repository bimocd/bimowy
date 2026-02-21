import assert from "node:assert";
import test from "node:test";
import { executeNS } from "@/hns-BETA/execute";
import { $ } from "@/hns-BETA/helpers";

test("Node System", () => {
	const prgm1 = $.prgm([
		$.var.set("a_age", 15),
		$.var.set("b_age", 24),
		$.var.set("is_b_major", $.fn("compare", [">=", $.var.get("a_age"), 18])),
		$.var.set("is_a_major", $.fn("compare", [">=", $.var.get("b_age"), 18])),
		$.return([$.var.get("is_a_major"), $.var.get("is_b_major")])
	]);
	return assert.deepStrictEqual(executeNS(prgm1), [true, false]);
});
