import * as z from "zod";
import type { WidgetId, WidgetProps } from "@/cpn/widgets";
import { type BSTNode, BSTType } from "./nodes";
import type { BSTCodeFunctionCallNode, FnID } from "./nodes/functionCall";
import type { BSTOptionInterval } from "./nodes/interval-option";
import type { BSTNUIumberInputNode } from "./nodes/number-input";
import type { BSTCodeObjectNode } from "./nodes/object";
import type { BSTUIParagraphNode } from "./nodes/paragraph";
import type { BSTUITextNode } from "./nodes/text";
import type { BSTCodeVarGetNode } from "./nodes/varget";
import type { BSTUIWidgetNode } from "./nodes/widget";

export const $ = {
  concat: (args: BSTNode[], extra?: BSTUITextNode["extra"]): BSTUITextNode => ({
    _bsttype: BSTType.UISuperText,
    extra,
    text: {
      _bsttype: BSTType.CodeFunctionCall,
      args,
      id: "concat",
    },
  }),
  fn: <ID extends FnID>(id: ID, args: any): BSTCodeFunctionCallNode =>
    ({
      _bsttype: BSTType.CodeFunctionCall,
      args,
      id,
    }) as const,
  i: (arr: BSTNode, index: BSTNode): BSTCodeFunctionCallNode =>
    $.fn("getIndex", [arr, index]),
  intervaloption: (
    name: string,
    defaultValue: [number, number],
    extra?: { min?: number; max?: number },
  ): BSTOptionInterval => ({
    _bsttype: BSTType.OptionInterval,
    _zodtype: z.tuple([z.number(), z.number()]),
    defaultValue,
    name,
    ...extra,
  }),
  numinp: (id: string): BSTNUIumberInputNode => ({
    _bsttype: BSTType.UINumberInput,
    id,
  }),
  obj: (obj: BSTCodeObjectNode["value"]): BSTCodeObjectNode => ({
    _bsttype: BSTType.CodeObject,
    value: obj,
  }),
  prgh: (items: BSTNode[]): BSTUIParagraphNode => ({
    _bsttype: BSTType.UIParagraph,
    items: items,
  }),
  text: (text: BSTNode, extra?: BSTUITextNode["extra"]): BSTUITextNode => ({
    _bsttype: BSTType.UISuperText,
    extra,
    text,
  }),
  var: (id: BSTNode): BSTCodeVarGetNode => ({
    _bsttype: BSTType.CodeVarGet,
    id,
  }),
  widget: <ID extends WidgetId>(
    id: ID,
    props: WidgetProps<ID>,
  ): BSTUIWidgetNode => ({
    _bsttype: BSTType.UIWidget,
    id,
    props,
  }),
};
