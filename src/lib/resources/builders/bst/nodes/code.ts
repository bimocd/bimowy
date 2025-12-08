import { executeBST } from "../execute";
import { type BSTCodeNode, type BSTNode, BSTType } from "../nodes";
import type { Scope } from "../scope";

export type BSTIfNode<R = any> = {
  _bsttype: BSTType.If;
  condition: BSTCodeNode<boolean>;
  success: BSTNode<R>;
  fail: BSTNode<R>;
};

export function executeIf<R>(node: BSTIfNode<R>, ctx: Scope): R {
  const cond = executeBST(node.condition, ctx);
  if (cond) return executeBST(node.success, ctx);
  else return executeBST(node.fail, ctx);
}
export type BSTVarGetNode<_R> = {
  _bsttype: BSTType.VarGet;
  id: BSTNode<string>;
};

export function executeVarGet<R>(node: BSTVarGetNode<R>, ctx: Scope): R {
  const id = executeBST(node.id, ctx) as string;
  return ctx.getVariable(id);
}

export const CodeHelpers = {
  var: <R>(id: BSTNode<string>): BSTVarGetNode<R> => ({
    _bsttype: BSTType.VarGet,
    id,
  }),
  if: <R>(
    condition: BSTCodeNode<boolean>,
    success: BSTNode<R>,
    fail: BSTNode<R>,
  ): BSTIfNode<R> => ({
    _bsttype: BSTType.If,
    condition,
    success,
    fail,
  }),
};
