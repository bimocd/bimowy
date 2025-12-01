import type z from "zod";
import type { BSTCodeFunctionCallNode } from "./nodes/functionCall";
import type { BSTCodeIfNode } from "./nodes/if";
import type { BSTOptionInterval } from "./nodes/interval-option";
import type { BSTNUIumberInputNode } from "./nodes/number-input";
import type { BSTCodeObjectNode } from "./nodes/object";
import type { BSTUIParagraphNode } from "./nodes/paragraph";
import type { BSTUITextNode } from "./nodes/text";
import type { BSTOptionTogglables } from "./nodes/togglables-option";
import type { BSTCodeVarGetNode } from "./nodes/varget";
import type { BSTUIWidgetNode } from "./nodes/widget";

export enum BSTType {
  CodeObject,
  CodeIf,
  CodeFunctionCall,
  CodeVarGet,
  UIWidget,
  UIParagraph,
  UINumberInput,
  UISuperText,
  TypeNumber,
  OptionInterval,
  OptionTogglables,
}

export type BSTRawPrimitive = number | string | boolean;

export type BSTUINode =
  | BSTUITextNode
  | BSTUIParagraphNode
  | BSTNUIumberInputNode
  | BSTRawPrimitive
  | BSTUIWidgetNode;

export type BSTNode =
  | BSTCodeFunctionCallNode
  | BSTCodeIfNode
  | BSTRawPrimitive
  | BSTCodeObjectNode
  | BSTCodeVarGetNode
  | BSTUINode;

export type BSTOptionNode = BSTOptionInterval | BSTOptionTogglables<string[]>;

export type BSTOptionNodeSerialized<O extends BSTOptionNode = BSTOptionNode> =
  Omit<O, "_zodtype"> & { _zodtype: z.core.JSONSchema.BaseSchema };
