import * as z from "zod";
import { PlaneElementEnum } from "@/cpn/widgets/plane/util";
import { $ } from "../builders/bst/helpers";
import { ExerciseTemplateResourceBuilder } from "../builders/exercise";

export default new ExerciseTemplateResourceBuilder({
	seedType: z.array(z.int()).length(4),
	exampleSeed: [2, 1, -3, 2],
	id: "twodvectors",
	name: "Reading 2D Vectors",
	tags: ["2D", "new"],
	options: {
		x_interval: $.intervaloption("X Axis", [-5, 5]),
		y_interval: $.intervaloption("Y Axis", [-5, 5])
	},
	randomSeedPlan: [
		$.fn("randomInt", $.var("x_interval")), // x1
		$.fn("randomInt", $.var("y_interval")), // y1
		$.fn("randomInt", $.var("x_interval")), // x2
		$.fn("randomInt", $.var("y_interval")) // y2
	],
	solutionPlan: {
		x: $.fn("-", [$.i($.var("seed"), 2), $.i($.var("seed"), 0)]), // x2 - x1
		y: $.fn("-", [$.i($.var("seed"), 3), $.i($.var("seed"), 1)]), // y2 - y1
		x1: $.i($.var("seed"), 0),
		y1: $.i($.var("seed"), 1),
		x2: $.i($.var("seed"), 2),
		y2: $.i($.var("seed"), 3)
	},
	uiPlan: [
		$.layout([
			$.textBloc([
				$.prgh([
					$.text("The vector "),
					$.text("\\(\\vec{v}\\)", true),
					$.text(" = ("),
					$.numinp("x"),
					$.text(","),
					$.numinp("y"),
					// Temperary bc inline text problem in the UI i have to
					// split both of them
					$.text(")"),
					$.text(" starts at "),
					$.text("("),
					$.numinp("x1"),
					$.text(","),
					$.numinp("y1"),
					$.text(")"),
					$.text(" & ends at ("),
					$.numinp("x2"),
					$.text(", "),
					$.numinp("y2"),
					$.text(")")
				])
			]),
			$.widget("Plane", {
				// @ts-expect-error
				elems: [
					{
						type: PlaneElementEnum.Vector,
						x1: $.i($.var("seed"), 0),
						x2: $.i($.var("seed"), 2),
						y1: $.i($.var("seed"), 1),
						y2: $.i($.var("seed"), 3)
					}
				],
				ranges: {
					x: $.var("x_interval"),
					y: $.var("y_interval")
				}
			})
		])
	]
});

// $.prgh([
//   $.text("\\(\\vec{v}\\)", true),
//   $.text(" = ("),
//   $.numinp("x"),
//   $.text(", "),
//   $.numinp("y"),
//   $.text(")"),
// ]),
// $.prgh([
//   $.text("From ("),
//   $.numinp("x1"),
//   $.text(", "),
//   $.numinp("y1"),
//   $.text(")"),
// ]),
// $.prgh([
//   $.text("To ("),
//   $.numinp("x2"),
//   $.text(", "),
//   $.numinp("y2"),
//   $.text(")"),
// ]),
