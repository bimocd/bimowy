import { LatexProvider, LatexText } from "@/cpn/main/Latex";
import { type RawWidgetProps, WidgetsRegistry } from "@/cpn/widgets";
import { BSTType } from "@/lib/resources/builders/bst/nodes";
import type {
	BSTUILayoutNode,
	BSTUIParagraphNode,
	BSTUITextNode,
	BSTUIWidgetBlockNode,
} from "@/lib/resources/builders/bst/nodes/ui";
import { UIElementRenderer } from "../types/exercise/UIElement";

export function WidgetNodeRenderer({ node }: { node: BSTUIWidgetBlockNode }) {
	const Widget = WidgetsRegistry[node.id];
	const props = node.props as RawWidgetProps<typeof node.id>;
	return (
		<div className={`size-full`}>
			<Widget {...props} />
		</div>
	);
}

export function TextNodeRenderer({ node }: { node: BSTUITextNode }) {
	const text = node.text as string;
	return (
		<LatexText key={text}>
			<UIElementRenderer node={text} />
		</LatexText>
	);
}

export function ParagraphNodeRenderer({ node }: { node: BSTUIParagraphNode }) {
	return (
		<LatexProvider>
			{/* When I do inline-flex or flex, they act like blocks,
      but when I remove gap-2 and flex-wrap and text-wrap and everything
      and just do "inline" it works */}
			{/*
     // TODO: fix the text blocks being considered as individual blocks and not wrapping 
      */}
			<div className={`inline-flex flex-wrap text-wrap items-baseline gap-2 text-2xl`}>
				{node.items.map((node, i) => (
					<UIElementRenderer key={i} {...{ node }} />
				))}
			</div>
		</LatexProvider>
	);
}

export function UINode({
	node,
}: {
	node: BSTUIParagraphNode | BSTUITextNode | BSTUIWidgetBlockNode | BSTUILayoutNode;
}) {
	switch (node._bsttype) {
		case BSTType.Paragraph:
			return <ParagraphNodeRenderer {...{ node }} />;
		case BSTType.Text:
			return <TextNodeRenderer {...{ node }} />;
		case BSTType.WidgetBlock:
			return <WidgetNodeRenderer {...{ node }} />;
		case BSTType.Layout:
			return <LayoutNodeRenderer {...{ node }} />;
	}
}

export function LayoutNodeRenderer({ node }: { node: BSTUILayoutNode }) {
	return (
		<div
			className={`flex gap-5
    flex-col-reverse sm:flex-row`}
		>
			{node.items.map((node, i) => (
				<UIElementRenderer key={i} {...{ node }} />
			))}
		</div>
	);
}
