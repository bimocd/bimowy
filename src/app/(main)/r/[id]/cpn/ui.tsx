import { LatexProvider, LatexText } from "@/cpn/main/Latex";
import { type RawWidgetProps, WidgetsRegistry } from "@/cpn/widgets";
import { type BSTNode, BSTType } from "@/lib/resources";
import type { BSTUIParagraphNode } from "@/lib/resources/builders/bst/nodes/paragraph";
import type { BSTUITextNode } from "@/lib/resources/builders/bst/nodes/text";
import type { BSTUIWidgetNode } from "@/lib/resources/builders/bst/nodes/widget";
import { UIElementRenderer } from "../types/exercise/UIElement";

export function WidgetNode({ node }: { node: BSTUIWidgetNode }) {
  const Widget = WidgetsRegistry[node.id];
  const props = node.props as RawWidgetProps<typeof node.id>;
  return (
    <div
      className={`flex items-center justify-center
    aspect-square
    size-full`}
    >
      <Widget {...props} />
    </div>
  );
}

export function TextNode({ node }: { node: BSTUITextNode }) {
  const elem = <UIElementRenderer node={node.text} />;
  return <LatexText key={node.text as string}>{elem}</LatexText>;
}

export function ParagraphNode({ node }: { node: BSTUIParagraphNode }) {
  const items = node.items as BSTNode[];
  return (
    <LatexProvider>
      <div className={`p-2 flex gap-2 flex-wrap items-center text-2xl`}>
        {items.map((node, i) => (
          <UIElementRenderer key={i} {...{ node }} />
        ))}
      </div>
    </LatexProvider>
  );
}

export function UINode({
  node,
}: {
  node: BSTUIParagraphNode | BSTUITextNode | BSTUIWidgetNode;
}) {
  switch (node._bsttype) {
    case BSTType.UIParagraph:
      return <ParagraphNode {...{ node }} />;
    case BSTType.UISuperText:
      return <TextNode {...{ node }} />;
    case BSTType.UIWidget:
      return <WidgetNode {...{ node }} />;
  }
}
