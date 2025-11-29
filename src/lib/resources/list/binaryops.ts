import * as z from "zod";
import { ExerciseResourceBuilder } from "../builders";
import { $ } from "../builders/bst/helpers";

const binaryOperations = ["+", "-", "*"];

export default new ExerciseResourceBuilder({
  seedType: z.tuple([z.int(), z.enum(binaryOperations), z.int()]),
  exampleSeed: [6, "*", 3],
  id: "binaryops",
  name: "Binary Operations",
  tags: ["arithmetic"],
  options: {
    interval_a: $.intervaloption("Number A interval", [-10, 10]),
    allowed_operations: $.togl("Allowed Operations", binaryOperations, ["+"]),
    interval_b: $.intervaloption("Number B interval", [-10, 10]),
  },
  randomSeedPlan: [
    $.fn("randomInt", $.var("interval_a")),
    $.fn("randomFromList", $.var("allowed_operations")),
    $.fn("randomInt", $.var("interval_b")),
  ],
  solutionPlan: {
    n: $.fn($.i($.var("seed"), 1), [
      $.i($.var("seed"), 0),
      $.i($.var("seed"), 2),
    ]),
  },
  uiPlan: $.prgh([
    $.concat([
      $.i($.var("seed"), 0),
      " ",
      $.i($.var("seed"), 1),
      " ",
      $.i($.var("seed"), 2),
    ]),
    " = ",
    $.numinp("n"),
  ]),
});
