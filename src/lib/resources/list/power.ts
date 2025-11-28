import * as z from "zod";
import { ExerciseResourceBuilder } from "../builders";
import { $ } from "../builders/bst/helpers";

export default new ExerciseResourceBuilder({
  seedType: z.tuple([z.int().min(0), z.int().min(0)]),
  exampleSeed: [5, 1],
  id: "power",
  name: "Power",
  options: {
    base_interval: $.intervaloption("Base", [0, 6], { min: 0 }),
    exponent_interval: $.intervaloption("Exponent", [0, 6], { min: 0 }),
  },
  randomSeedPlan: [
    $.fn("randomInt", $.var("base_interval")),
    $.fn("randomInt", $.var("exponent_interval")),
  ],
  solutionPlan: {
    n: $.fn("**", $.var("seed")),
  },
  tags: ["arithmetic"],
  uiPlan: $.prgh([
    $.concat(
      ["\\(", $.i($.var("seed"), 0), "^{", $.i($.var("seed"), 1), "}\\) ="],
      { latex: true },
    ),
    $.numinp("n"),
  ]),
});
