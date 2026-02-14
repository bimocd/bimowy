import type { BSTIfNode, BSTVarGetNode } from "./nodes/code";
import type { BSTFunctionCallNode } from "./nodes/functions";
import type { BSTUIBlockNode, BSTUILayoutNode, BSTUIParagraphItemNode } from "./nodes/ui";

export enum BSTType {
	// Code
	If,
	FunctionCall,
	VarGet,

	// UI
	Layout,
	// > UI Blocks
	WidgetBlock,
	TextBlock,
	// > UI Text Block Nodes
	Paragraph,
	// > > UI Text Block Paragraph Inline Nodes
	Text,
	NumberInput,

	// Option
	IntervalOption,
	TogglablesOption,
}

// R = ReturnType
export type BSTCodeNode<R = any> = BSTIfNode<R> | BSTVarGetNode<R> | BSTFunctionCallNode<R> | R;

export type BSTUINode = BSTUILayoutNode | BSTUIBlockNode | BSTUIParagraphItemNode;

export type RawPrimitive = number | string | boolean;
export type Primitive = RawPrimitive | Primitive[];
export type BSTNode<R = any> = BSTCodeNode<R> | BSTUINode;
