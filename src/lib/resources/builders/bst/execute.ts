import { type BSTNode, BSTType } from "./nodes";
import { executeIf, executeVarGet } from "./nodes/code";
import { executeFunctionCall } from "./nodes/functions";
import {
  executeLayout,
  executeNumberInput,
  executeParagraph,
  executeText,
  executeTextBlock,
  executeWidget,
} from "./nodes/ui";
import { Scope } from "./scope";

export function executeBST<V extends number | string | boolean>(
  node: V,
  ctx: Scope,
): V;
export function executeBST<R>(node: BSTNode<R>, ctx?: Scope): R;
export function executeBST(node: BSTNode<any>, ctx: Scope = new Scope()): any {
  if (
    typeof node === "number" ||
    typeof node === "string" ||
    typeof node === "boolean"
  )
    return node;
  if (Array.isArray(node)) return node.map((n) => executeBST(n, ctx));
  if (typeof node === "object" && !("_bsttype" in node)) {
    return Object.entries(node).reduce(
      (prev, curr) => ({
        ...prev,
        [curr[0]]: executeBST(curr[1], ctx),
      }),
      {},
    );
  }
  // TODO: figure out how to make this less ugly (typescript is too dumb to keep up with loops of an array of tuples [BSTTYPE, funciton :/])
  switch (node._bsttype) {
    case BSTType.FunctionCall:
      return executeFunctionCall(node, ctx);
    case BSTType.If:
      return executeIf(node, ctx);
    case BSTType.Layout:
      return executeLayout(node, ctx);
    case BSTType.NumberInput:
      return executeNumberInput(node, ctx);
    case BSTType.Paragraph:
      return executeParagraph(node, ctx);
    case BSTType.Text:
      return executeText(node, ctx);
    case BSTType.TextBlock:
      return executeTextBlock(node, ctx);
    case BSTType.VarGet:
      return executeVarGet(node, ctx);
    case BSTType.WidgetBlock:
      return executeWidget(node, ctx);
    default:
      console.error(node);
      throw new Error(`Unknown node type ${node._bsttype}`);
  }
}

// OLD EXECUTE LMAO
// export function executeBST(node: any, ctx: Scope): any {
//   if (Array.isArray(node)) return node.map((n) => executeBST(n, ctx));
//   if (
//     typeof node === "undefined" ||
//     typeof node === "number" ||
//     typeof node === "string" ||
//     typeof node === "boolean"
//   )
//     return node;

//   if (typeof node === "object" && !("_bsttype" in node))
//     return Object.entries(node).reduce(
//       (prev, [k, v]) => ({ ...prev, [k]: executeBST(v, ctx) }),
//       {},
//     );

//   switch (node._bsttype) {
//     case BSTType.CodeFunctionCall:
//       return executeFunctionCall(node, ctx);
//     case BSTType.CodeIf:
//       return executeIf(node, ctx);
//     case BSTType.CodeObject:
//       return executeObject(node, ctx);
//     case BSTType.UIParagraph:
//       return executeParagraph(node, ctx);
//     case BSTType.UIText:
//       return executeText(node, ctx);
//     case BSTType.CodeVarGet:
//       return executeVarGet(node, ctx);
//     case BSTType.UINumberInput:
//       return executeNumberInput(node);
//     case BSTType.UIWidget:
//       return executeWidget(node, ctx);
//     case BSTType.UIFlexBox:
//       return executeFlexBox(node, ctx);
//     default:
//       throw new Error(`Unknown node type: ${node}`);
//   }
// }
