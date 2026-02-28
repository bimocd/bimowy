import { executeNS } from "@/ns/execute";
import { $ } from "@/ns/helpers";
import { $group } from "./util";

const programTestCases = [
	[
		15,
		$.prgm([
			$.varSet("x", 5),
			$.varSet("y", 10),
			$.varSet("z", $.fn("op", ["+", $.varGet("x"), $.varGet("y")])),
			$.return($.varGet("z"))
		])
	],
	[
		16,
		$.prgm([
			$.varSet("a", 20),
			$.varSet("b", 4),
			$.varSet("c", $.fn("op", ["-", $.varGet("a"), $.varGet("b")])),
			$.return($.varGet("c"))
		])
	],
	[
		12,
		$.prgm([
			$.varSet("a", 3),
			$.varSet("b", 4),
			$.varSet("c", $.fn("op", ["*", $.varGet("a"), $.varGet("b")])),
			$.return($.varGet("c"))
		])
	],
	[
		5,
		$.prgm([
			$.varSet("a", 10),
			$.varSet("b", 2),
			$.varSet("c", $.fn("op", ["/", $.varGet("a"), $.varGet("b")])),
			$.return($.varGet("c"))
		])
	],
	[
		8,
		$.prgm([
			$.varSet("a", 2),
			$.varSet("b", 3),
			$.varSet("c", $.fn("op", ["**", $.varGet("a"), $.varGet("b")])),
			$.return($.varGet("c"))
		])
	],
	[
		true,
		$.prgm([
			$.varSet("a", 5),
			$.varSet("b", 10),
			$.varSet("is_a_less_than_b", $.fn("compare", ["<", $.varGet("a"), $.varGet("b")])),
			$.return($.varGet("is_a_less_than_b"))
		])
	],
	[
		"b is greater",
		$.prgm([
			$.varSet("a", 5),
			$.varSet("b", 10),
			$.if($.fn("compare", [">", $.varGet("a"), $.varGet("b")]), {
				yes: $.return("a is greater"),
				no: $.return("b is greater")
			})
		])
	]
] satisfies [unknown, ReturnType<(typeof $)["prgm"]>][];

$group(
	"executeNS",
	programTestCases.map(([expected, program]) => [expected, () => executeNS(program)])
);
