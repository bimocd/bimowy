import { CircleAlertIcon } from "lucide-react";
import { NumberInput } from "@/cpn/main/NumberInput";
import { type BSTNode, BSTType } from "@/lib/resources/builders/bst/nodes";
import type {
	BSTUINumberInputNode,
	BSTUITextBlockNode,
} from "@/lib/resources/builders/bst/nodes/ui";
import {
	LayoutNodeRenderer,
	ParagraphNodeRenderer,
	TextNodeRenderer,
	WidgetNodeRenderer,
} from "../../cpn/ui";
import { ExerciseState, useExerciseStore } from "./store";

export function UIElements() {
	const node = useExerciseStore((state) => state.getCurrentExercise().data.ui);
	return <UIElementRenderer {...{ node }} />;
}

export function UIElementRenderer({ node }: { node: BSTNode }) {
	if (typeof node === "string" || typeof node === "number" || typeof node === "boolean")
		return node;
	if (Array.isArray(node))
		return node.map((node, i) => <UIElementRenderer key={i} {...{ node }} />);
	if (!("_bsttype" in node)) {
		return <div>Invalid node</div>;
	}
	switch (node._bsttype) {
		case BSTType.Text:
			return <TextNodeRenderer {...{ node }} />;
		case BSTType.Paragraph:
			return <ParagraphNodeRenderer {...{ node }} />;
		case BSTType.WidgetBlock:
			return <WidgetNodeRenderer {...{ node }} />;
		case BSTType.NumberInput:
			return <NumberInputNodeRenderer {...{ node }} />;
		case BSTType.Layout:
			return <LayoutNodeRenderer {...{ node }} />;
		case BSTType.TextBlock:
			return <TextBlockNodeRenderer {...{ node }} />;
		default:
			return <CircleAlertIcon className="h-4 text-shadow-md text-shadow-red-500" stroke="red" />;
	}
}
export function TextBlockNodeRenderer({ node }: { node: BSTUITextBlockNode }) {
	return (
		<div className="w-full">
			<UIElementRenderer node={node.items} />
		</div>
	);
}

function NumberInputNodeRenderer({ node }: { node: BSTUINumberInputNode }) {
	const [index, correct, initExerciseInputRef, setCurrentExerciseInputValue, input, disabled] = [
		useExerciseStore((state) => state.currentIndex),
		useExerciseStore((state) => state.correct),
		useExerciseStore((state) => state.initExerciseInputRef),
		useExerciseStore((state) => state.setCurrentExerciseInputValue),
		useExerciseStore((state) => state.getCurrentExerciseInputFromID(node.id)),
		useExerciseStore((state) => {
			const input = state.getCurrentExerciseInputFromID(node.id);
			return !input
				? false
				: state.getCurrentExercise().state !== ExerciseState.OnGoing ||
						(input.correction.corrected && input.correction.correct);
		}),
	];

	const stateStr = !input
		? "?"
		: input.correction.corrected
			? input.correction.correct
				? "correct"
				: "incorrect"
			: "?";

	return (
		<NumberInput
			placeholder={node.id}
			disabled={disabled}
			data-state={stateStr}
			allowEmpty
			className={`data-[state=correct]:ring-2!
        data-[state=correct]:ring-green-400/50
        data-[state=correct]:bg-green-400/10!
        data-[state=incorrect]:ring-red-400/50
        data-[state=incorrect]:bg-red-400/10!
       duration-75`}
			onKeyDown={(e) => (e.key === "Enter" ? correct() : 0)}
			onNewValue={(newValue) => setCurrentExerciseInputValue(node.id, newValue)}
			id={`${index}-${node.id}`}
			key={`${index}-${node.id}`}
			ref={(el: HTMLInputElement | null) => {
				if (el) initExerciseInputRef(node.id, el);
			}}
		/>
	);
}
