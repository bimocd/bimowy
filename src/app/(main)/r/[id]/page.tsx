import type { Metadata } from "next";
import {
  ExerciseResourceBuilder,
  type ResourceId,
  resourceHandler,
  resourceTypeData,
} from "@/lib/resources";
import { BetaPage } from "./cpn/BetaPage";
import ExerciseResourcePage from "./types/exercise/ExercisePage";

type Params = {
  params: Promise<{ id: string }>;
};
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const id = (await params).id as ResourceId;

  const resource = await resourceHandler.fetch(id);
  const resourceType = resourceTypeData[resource.type];

  return {
    title: `${resourceType.emoji} ${resource.name}`,
  };
}

export default async function ResourcePage({ params }: Params) {
  const id = (await params).id as ResourceId;
  const resource = await resourceHandler.fetch(id);
  if (resource.beta) return <BetaPage />;
  if (resource instanceof ExerciseResourceBuilder)
    return <ExerciseResourcePage resource={resource.build()} />;
}
