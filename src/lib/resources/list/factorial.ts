import * as z from "zod";
import { $ } from "../builders/bst/helpers";
import { ExerciseTemplateResourceBuilder } from "../builders/exercise";

export default new ExerciseTemplateResourceBuilder({
  seedType: z.tuple([z.int().min(0)]),
  exampleSeed: [5],
  id: "factorial",
  name: "Factorial",
  tags: ["arithmetic"],
  options: {
    interval: $.intervaloption("Interval", [0, 6], { min: 0 }),
  },
  randomSeedPlan: [$.fn("randomInt", $.var("interval"))],
  solutionPlan: {
    n: $.fn("factorial", [$.i($.var("seed"), 0)]),
  },
  uiPlan: [
    $.layout([
      $.textBloc([
        $.prgh([$.concat([$.i($.var("seed"), 0), "! = "]), $.numinp("n")]),
      ]),
    ]),
  ],
});
