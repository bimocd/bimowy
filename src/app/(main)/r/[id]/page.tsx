import type { Metadata } from "next";
import { ArticleResourceBuilder } from "@/lib/resources/builders/article";
import { ExerciseTemplateResourceBuilder } from "@/lib/resources/builders/exercise";
import { type ResourceId, resourceHandler } from "@/lib/resources/builders/handler";
import { resourceTypeData } from "@/lib/resources/types";
import { BetaPage } from "./cpn/BetaPage";
import ArticleResourcePage from "./types/article/ArticlePage";
import ExerciseResourcePage from "./types/exercise/ExercisePage";

type Params = {
	params: Promise<{ id: string }>;
};
export async function generateMetadata({ params }: Params): Promise<Metadata> {
	const id = (await params).id as ResourceId;

	const resource = await resourceHandler.fetch(id);
	const resourceType = resourceTypeData[resource.type];

	return {
		title: `${resourceType.emoji} ${resource.name}`
	};
}

export default async function ResourcePage({ params }: Params) {
	const id = (await params).id as ResourceId;
	const resource = await resourceHandler.fetch(id);
	if (resource.beta) return <BetaPage />;
	if (resource instanceof ExerciseTemplateResourceBuilder)
		return <ExerciseResourcePage resource={resource.build()} />;
	else if (resource instanceof ArticleResourceBuilder) {
		const ui = resource.generateUI();
		return <ArticleResourcePage resource={resource.build()} {...{ ui }} />;
	}
}
