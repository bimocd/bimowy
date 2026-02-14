import * as z from "zod";
import { PlaneElementEnum } from "@/cpn/widgets/plane/util";
import { $ } from "../builders/bst/helpers";
import { ExerciseTemplateResourceBuilder } from "../builders/exercise";

export default new ExerciseTemplateResourceBuilder({
	id: "twodpoints",
	name: "Reading 2D Points",
	tags: ["2D"],
	// Seed
	seedType: z.tuple([z.int(), z.int()]),
	exampleSeed: [2, 1],
	randomSeedPlan: [$.fn("randomInt", $.var("x_interval")), $.fn("randomInt", $.var("y_interval"))],
	// --
	options: {
		x_interval: $.intervaloption("X Axis", [-5, 5]),
		y_interval: $.intervaloption("Y Axis", [-5, 5])
	},
	solutionPlan: {
		x: $.i($.var("seed"), 0),
		y: $.i($.var("seed"), 1)
	},
	uiPlan: [
		$.layout([
			$.textBloc([
				$.prgh([
					$.text("P", true),
					$.text(" = ("),
					$.numinp("x"),
					$.text(", "),
					$.numinp("y"),
					$.text(")")
				])
			]),
			$.widget("Plane", {
				// @ts-expect-error TODO: fix ts
				elems: [
					{
						type: PlaneElementEnum.Point,
						x: $.i($.var("seed"), 0),
						y: $.i($.var("seed"), 1)
					}
				],
				ranges: { x: $.var("x_interval"), y: $.var("y_interval") }
			})
		])
	]
});

/**
 * 
  // uiPlan: [
  //  $.flex([
  //   $.bloc([
  //     "v = (x,y)",
  //     "P_i = (x1,y1)",
  //     "P_f = (x2,y2)"
  //   ]),
  //   $.widget("Plane",{
  //     ...
  //   })
  //  ])
  //  }
  // ],
 */
