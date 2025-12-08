"use client";
import type { BuiltArticleResource } from "@/lib/resources/builders/article";
import {
  type BSTNode,
  BSTType,
  type BSTUINode,
} from "@/lib/resources/builders/bst/nodes";
import { UINode } from "../../cpn/ui";

export default function ArticleResourcePage({
  resource,
  ui,
}: {
  resource: BuiltArticleResource;
  ui: BSTUINode;
}) {
  return (
    <div className="flex flex-col gap-8">
      <div className="w-full flex justify-center">
        <h1 className="text-4xl font-bold -rotate-0.5">{resource.name}</h1>
      </div>
      <div
        className={`size-full bg-white/5 rounded-md
    ring-2 ring-white/10
    p-6`}
      >
        <UIElement node={ui} />
      </div>
    </div>
  );
}

function UIElement({ node }: { node: BSTNode }) {
  if (!node) return;
  if (
    typeof node === "string" ||
    typeof node === "number" ||
    typeof node === "boolean"
  )
    return node;
  if (Array.isArray(node))
    return node.map((node, i) => <UIElement key={i} {...{ node }} />);
  switch (node._bsttype) {
    case BSTType.WidgetBlock:
    case BSTType.Paragraph:
    case BSTType.Layout:
    case BSTType.Text:
      return <UINode {...{ node }} />;
    default:
      return "?";
  }
}
