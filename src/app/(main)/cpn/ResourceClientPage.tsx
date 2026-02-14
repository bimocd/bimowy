"use client";

import { useQueryState } from "nuqs";
import type { BaseResourceBuilder } from "@/lib/resources/builders/base";
import { ResourceCard } from "./ResourceCard";
import SearchBar from "./SearchBar";

export function ResourceClientPage({
	resources
}: {
	resources: ReturnType<BaseResourceBuilder["build"]>[];
}) {
	const [query, setQuery] = useQueryState("q");

	return (
		<>
			<SearchBar {...{ query, setQuery }} />
			<div className="flex gap-6 w-full flex-wrap justify-center">
				{resources
					.filter((r) => (query ? r.name.toLowerCase().includes(query.toLowerCase()) : true))
					.map((data) => (
						<ResourceCard key={data.id} {...{ data }} />
					))}
			</div>
		</>
	);
}
