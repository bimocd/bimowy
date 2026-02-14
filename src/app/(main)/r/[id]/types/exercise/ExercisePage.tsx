"use client";
import { type ReactNode, useEffect, useRef } from "react";
import type { ExerciseTemplateResourceBuilder } from "@/lib/resources/builders/exercise";
import { EndPage } from "./EndPage";
import { MetaBar } from "./MetaBar";
import { OptionsPage } from "./OptionsPage";
import { createExerciseStore, ExerciseContext, PageState, useExerciseStore } from "./store";
import { UIElements } from "./UIElement";

export default function ExerciseResourcePage({
	resource,
}: {
	resource: ReturnType<ExerciseTemplateResourceBuilder["build"]>;
}) {
	return (
		<StoreProvider {...{ resource }}>
			<MainLayout />
		</StoreProvider>
	);
}

// TODO: Should prevent errors
function MainLayout() {
	const state = useExerciseStore((s) => s.pageState);
	return (
		<div
			className={`w-full flex flex-row h-full gap-5 
  ${state === PageState.Loading && "cursor-wait"}`}
		>
			<div
				className={`flex flex-col
          bg-white/5 rounded-md outline p-5
          size-full overflow-y-auto`}
			>
				<PageContent />
			</div>
			<MetaBar />
		</div>
	);
}

function StoreProvider({
	children,
	resource,
}: {
	children: ReactNode;
	resource: ReturnType<ExerciseTemplateResourceBuilder["build"]>;
}) {
	const store = useRef(createExerciseStore({ resource })).current;

	useEffect(() => {
		(window as any).store = store;
	}, []);

	return <ExerciseContext.Provider value={store}>{children}</ExerciseContext.Provider>;
}

function PageContent() {
	const [pageState, atLeastOneFetched] = [
		useExerciseStore((state) => state.pageState),
		useExerciseStore((state) => state.atLeastOneFetched),
	];

	if (!atLeastOneFetched) return <OptionsPage />;

	if (pageState === PageState.End) return <EndPage />;

	return <UIElements />;
}
