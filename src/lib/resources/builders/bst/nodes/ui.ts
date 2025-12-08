import type { RawWidgetProps, WidgetId, WidgetProps } from "@/cpn/widgets";
import { executeBST } from "../execute";
import { type BSTCodeNode, type BSTNode, BSTType } from "../nodes";
import type { Scope } from "../scope";
import { FunctionHelpers, type RecursivelyNestNode } from "./functions";

export type BSTUIBlockNode = BSTUITextBlockNode | BSTUIWidgetBlockNode;
export type BSTUILayoutNode = {
  _bsttype: BSTType.Layout;
  items: BSTUIBlockNode[];
};

export function executeLayout(
  node: BSTUILayoutNode,
  ctx: Scope,
): BSTUILayoutNode {
  return { ...node, items: executeBST(node.items, ctx) };
}

export type BSTUIParagraphItemNode = BSTUITextNode | BSTUINumberInputNode;
export type BSTUIParagraphNode = {
  _bsttype: BSTType.Paragraph;
  items: BSTUIParagraphItemNode[];
};

export function executeParagraph(
  node: BSTUIParagraphNode,
  ctx: Scope,
): BSTUIParagraphNode {
  const items = executeBST(node.items, ctx);
  return { ...node, items: Array.isArray(items) ? items : [items] };
}

export type BSTUINumberInputNode = {
  _bsttype: BSTType.NumberInput;
  id: string;
};

export const executeNumberInput = (
  node: BSTUINumberInputNode,
  ctx: Scope,
): BSTUINumberInputNode => {
  return { ...node, id: executeBST(node.id, ctx) };
};

export type BSTUITextBlockItemNode = BSTUIParagraphNode;
export type BSTUITextBlockNode = {
  _bsttype: BSTType.TextBlock;
  items: BSTNode<BSTUITextBlockItemNode[]>;
};

export function executeTextBlock(node: BSTUITextBlockNode, ctx: Scope) {
  return { ...node, items: executeBST(node.items, ctx) };
}

export type BSTUITextNode = {
  _bsttype: BSTType.Text;
  text: BSTCodeNode<string>;
  latex: BSTCodeNode<boolean>;
};

export function executeText(node: BSTUITextNode, ctx: Scope): BSTUITextNode {
  return {
    ...node,
    latex: executeBST(node.latex, ctx),
    text: executeBST(node.text, ctx),
  };
}

export type BSTUIWidgetBlockNode<Id extends WidgetId = WidgetId> = {
  _bsttype: BSTType.WidgetBlock;
  id: Id;
  props: WidgetProps<Id>;
};

export function executeWidget<Id extends WidgetId>(
  node: BSTUIWidgetBlockNode<Id>,
  ctx: Scope,
) {
  return { ...node, props: executeBST(node.props, ctx) as RawWidgetProps<Id> };
}

export const UIHelpers = {
  widget: <ID extends WidgetId>(
    id: ID,
    props: BSTUIWidgetBlockNode<ID>["props"],
  ): BSTUIWidgetBlockNode<ID> => ({
    _bsttype: BSTType.WidgetBlock,
    id,
    props,
  }),
  concat: (
    // TODO: why tf does this need recursively nest node i should put it in dstnode or smt
    strings: RecursivelyNestNode<(string | number)[]>,
    latex: BSTUITextNode["latex"] = false,
  ): BSTUITextNode => ({
    _bsttype: BSTType.Text,
    latex,
    text: FunctionHelpers.fn("concat", [strings]),
  }),
  textBloc: (items: BSTNode<BSTUITextBlockItemNode[]>): BSTUITextBlockNode => ({
    _bsttype: BSTType.TextBlock,
    items,
  }),
  text: (
    text: BSTUITextNode["text"],
    latex: BSTUITextNode["latex"] = false,
  ): BSTUITextNode => ({
    _bsttype: BSTType.Text,
    latex,
    text,
  }),
  numinp: (id: string): BSTUINumberInputNode => ({
    _bsttype: BSTType.NumberInput,
    id,
  }),
  layout: (items: BSTUILayoutNode["items"]): BSTUILayoutNode => ({
    _bsttype: BSTType.Layout,
    items,
  }),
  prgh: (items: BSTUIParagraphNode["items"]): BSTUIParagraphNode => ({
    _bsttype: BSTType.Paragraph,
    items,
  }),
};
