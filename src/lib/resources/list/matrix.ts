import { ArticleResourceBuilder } from "../builders/article";
import { $ } from "../builders/bst/helpers";

export default new ArticleResourceBuilder({
	id: "matrix",
	name: "Matrices 101",
	tags: ["linear-algebra"],
	beta: true,
	uiPlan: [
		$.layout([
			$.textBloc([
				$.prgh([
					$.text(
						`A matrix is a 2D grid of values (most of the time numbers). We use matrices a lot:`
					)
				])
			])
		])
	]
});
