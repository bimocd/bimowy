"use client";
import type { BuiltArticleResource } from "@/lib/resources/builders/article";

export default function ArticleResourcePage({
  resource,
}: {
  resource: BuiltArticleResource;
}) {
  return (
    <div className="flex flex-col gap-8">
      <div className="w-full flex justify-center">
        <h1 className="text-4xl font-bold -rotate-0.5">{resource.name}</h1>
      </div>
      <div
        className="size-full bg-white/5 rounded-md
    ring-2 ring-white/10
    p-6"
      >
        not done yet
      </div>
    </div>
  );
}