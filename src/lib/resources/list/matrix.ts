import { $ } from "../builders";
import { ArticleResourceBuilder } from "../builders/article";

export default new ArticleResourceBuilder({
  id: "matrix",
  name: "Matrices 101",
  tags: ["linear-algebra"],
  beta: true,
  uiPlan: $.prgh([
    $.text(
      "This is a matrix: \\(\\begin{bmatrix}" +
        "\n1 & 2 & 3\\" +
        "\na & b & c" +
        "\nend{bmatrix}\\)",
      { latex: true },
    ),
  ]),
});
