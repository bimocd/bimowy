import { $ } from "../builders";
import { ArticleResourceBuilder } from "../builders/article";

export default new ArticleResourceBuilder({
  id: "matrix",
  name: "Matrices 101",
  tags: ["linear-algebra"],
  beta: true,
  uiPlan: [
    $.prgh(
      `A matrix is a 2D grid of values (most of the time numbers). We use matrices a lot:`,
    ),
    $.prgh(
      $.text(`\t- Point coordinates: ${$.matrix([["3", "1"]], "p")}`, {
        latex: true,
      }),
    ),
    $.prgh(
      $.text(`- Vector coordinates: ${$.matrix([["-2"], ["1"]], "p")}`, {
        latex: true,
      }),
    ),
  ],
});
