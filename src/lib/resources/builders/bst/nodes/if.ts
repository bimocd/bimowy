import { executeBST } from "../execute";
import type { BSTNode, BSTRawPrimitive, BSTType } from "../nodes";
import type { Scope } from "../scope";

export type BSTCodeIfNode = {
  _bsttype: BSTType.CodeIf;
  condition: BSTNode;
  success: BSTNode;
  fail?: BSTNode;
};

export function executeIf(node: BSTCodeIfNode, ctx: Scope): BSTRawPrimitive {
  return executeBST(node.condition, ctx)
    ? executeBST(node.success, ctx)
    : executeBST(node.fail, ctx);
}
