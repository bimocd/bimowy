import * as z from "zod";
import { $ } from "../builders/bst/helpers";
import { ExerciseTemplateResourceBuilder } from "../builders/exercise";

const binaryOperations = ["+", "-", "*", "**"];

export default new ExerciseTemplateResourceBuilder({
  seedType: z.tuple([z.int(), z.enum(binaryOperations), z.int()]),
  exampleSeed: [6, "*", 3],
  id: "binaryops",
  name: "Binary Operations",
  tags: ["arithmetic"],
  options: {
    allowed_operations: $.togl("Allowed Operations", binaryOperations, ["+"]),
    interval_a: $.intervaloption("Number A interval", [-10, 10]),
    interval_b: $.intervaloption("Number B interval", [-10, 10]),
  },
  randomSeedPlan: [
    $.fn("randomInt", $.var("interval_a")),
    $.fn("randomFromList", [$.var("allowed_operations")]),
    $.fn("randomInt", $.var("interval_b")),
  ],
  solutionPlan: {
    // @ts-expect-error because $.fn expects a function id instead of BSTNode<a function id>, to fix
    n: $.fn($.i($.var("seed"), 1), [
      $.i($.var("seed"), 0),
      $.i($.var("seed"), 2),
    ]),
  },
  uiPlan: [
    $.layout([
      $.textBloc(
        $.if(
          $.fn("=", ["**", $.i($.var("seed"), 1)]),
          [
            $.prgh([
              $.concat(
                [
                  "\\(",
                  $.i($.var("seed"), 0),
                  "^{",
                  $.i($.var("seed"), 2),
                  "}\\) =",
                ],
                true,
              ),
              $.numinp("n"),
            ]),
          ],
          [
            $.prgh([
              $.concat([
                $.i($.var("seed"), 0),
                " ",
                $.i($.var("seed"), 1),
                " ",
                $.i($.var("seed"), 2),
                " = ",
              ]),
              $.numinp("n"),
            ]),
          ],
        ),
      ),
    ]),
  ],
});
