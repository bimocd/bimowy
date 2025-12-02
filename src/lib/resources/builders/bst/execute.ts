import { BSTType } from "./nodes";
import { executeFunctionCall } from "./nodes/functionCall";
import { executeIf } from "./nodes/if";
import { executeNumberInput } from "./nodes/number-input";
import { executeObject } from "./nodes/object";
import { executeParagraph } from "./nodes/paragraph";
import { executeText } from "./nodes/text";
import { executeVarGet } from "./nodes/varget";
import { executeWidget } from "./nodes/widget";
import type { Scope } from "./scope";

export function executeBST(node: any, ctx: Scope): any {
  if (Array.isArray(node)) return node.map((n) => executeBST(n, ctx));
  if (
    typeof node === "undefined" ||
    typeof node === "number" ||
    typeof node === "string" ||
    typeof node === "boolean"
  )
    return node;

  if (typeof node === "object" && !("_bsttype" in node))
    return Object.entries(node).reduce(
      (prev, [k, v]) => ({ ...prev, [k]: executeBST(v, ctx) }),
      {},
    );

  switch (node._bsttype) {
    case BSTType.CodeFunctionCall:
      return executeFunctionCall(node, ctx);
    case BSTType.CodeIf:
      return executeIf(node, ctx);
    case BSTType.CodeObject:
      return executeObject(node, ctx);
    case BSTType.UIParagraph:
      return executeParagraph(node, ctx);
    case BSTType.UISuperText:
      return executeText(node, ctx);
    case BSTType.CodeVarGet:
      return executeVarGet(node, ctx);
    case BSTType.UINumberInput:
      return executeNumberInput(node);
    case BSTType.UIWidget:
      return executeWidget(node, ctx);
    default:
      throw new Error(`Unknown BST node type: ${node._bsttype}`);
  }
}
