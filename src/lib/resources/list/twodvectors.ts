import * as z from "zod";
import { PlaneElementEnum } from "@/cpn/widgets/plane/util";
import { ExerciseResourceBuilder } from "../builders";
import { $ } from "../builders/bst/helpers";

export default new ExerciseResourceBuilder({
  seedType: z.tuple([z.int(), z.int(), z.int(), z.int()]),
  exampleSeed: [2, 1, -3, 2],
  id: "twodvectors",
  name: "Reading 2D Vectors",
  options: {
    x_interval: $.intervaloption("X Axis", [-5, 5]),
    y_interval: $.intervaloption("Y Axis", [-5, 5]),
  },
  randomSeedPlan: [
    $.fn("randomInt", $.var("x_interval")), // x1
    $.fn("randomInt", $.var("y_interval")), // y1
    $.fn("randomInt", $.var("x_interval")), // x2
    $.fn("randomInt", $.var("y_interval")), // y2
  ],
  solutionPlan: {
    x: $.fn("-", [$.i($.var("seed"), 2), $.i($.var("seed"), 0)]), // x2 - x1
    x1: $.i($.var("seed"), 0),
    x2: $.i($.var("seed"), 2),
    y: $.fn("-", [$.i($.var("seed"), 3), $.i($.var("seed"), 1)]), // y2 - y1
    y1: $.i($.var("seed"), 1),
    y2: $.i($.var("seed"), 3),
  },
  tags: ["2D"],
  uiPlan: [
    $.prgh([
      $.text("\\(\\vec{v}\\)", { latex: true }),
      " = (",
      $.numinp("x"),
      ", ",
      $.numinp("y"),
      ")",
    ]),
    $.prgh(["From (", $.numinp("x1"), ", ", $.numinp("y1"), ")"]),
    $.prgh(["To (", $.numinp("x2"), ", ", $.numinp("y2"), ")"]),
    $.widget("Plane", {
      // @ts-expect-error
      elems: [
        {
          type: PlaneElementEnum.Vector,
          x1: $.i($.var("seed"), 0),
          x2: $.i($.var("seed"), 2),
          y1: $.i($.var("seed"), 1),
          y2: $.i($.var("seed"), 3),
        },
      ],
      ranges: {
        x: $.var("x_interval"),
        y: $.var("y_interval"),
      },
    }),
  ],
});
