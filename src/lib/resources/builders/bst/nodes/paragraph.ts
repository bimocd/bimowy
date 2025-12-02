import { executeBST } from "../execute";
import type { BSTNode, BSTType } from "../nodes";
import type { Scope } from "../scope";

export type BSTUIParagraphNode = {
  _bsttype: BSTType.UIParagraph;
  items: BSTNode | BSTNode[];
};

export function executeParagraph(node: BSTUIParagraphNode, ctx: Scope) {
  const items = executeBST(node.items, ctx);
  return { ...node, items: Array.isArray(items) ? items : [items] };
}
