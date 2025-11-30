import { CircleAlertIcon } from "lucide-react";
import { LatexProvider, LatexText } from "@/cpn/main/Latex";
import { NumberInput } from "@/cpn/main/NumberInput";
import { type RawWidgetProps, WidgetsRegistry } from "@/cpn/widgets";
import { type BSTNode, BSTType } from "@/lib/resources";
import type { BSTNUIumberInputNode } from "@/lib/resources/builders/bst/nodes/number-input";
import type { BSTUIParagraphNode } from "@/lib/resources/builders/bst/nodes/paragraph";
import type { BSTUITextNode } from "@/lib/resources/builders/bst/nodes/text";
import type { BSTUIWidgetNode } from "@/lib/resources/builders/bst/nodes/widget";
import { ExerciseState, useExerciseStore } from "./store";

export function UIElements() {
  const node = useExerciseStore((state) => state.getCurrentExercise().data.ui);
  return <UIElementRenderer {...{ node }} big />;
}

function UIElementRenderer({ node, big }: { node: BSTNode; big?: boolean }) {
  if (
    typeof node === "string" ||
    typeof node === "number" ||
    typeof node === "boolean"
  )
    return node;
  if (Array.isArray(node))
    return node.map((node, i) => <UIElementRenderer key={i} {...{ node }} />);
  if (!("_bsttype" in node)) {
    return <div>Invalid node</div>;
  }
  switch (node._bsttype) {
    case BSTType.CodeObject:
      return;
    case BSTType.UISuperText:
      return <TextNode {...{ node }} />;
    case BSTType.UIParagraph:
      return <ParagraphNode {...{ big, node }} />;
    case BSTType.UINumberInput:
      return <NumberInputNode {...{ node }} />;
    case BSTType.UIWidget:
      return <WidgetNode {...{ node }} />;
    default:
      return (
        <CircleAlertIcon
          className="h-[0.9rem] text-shadow-md text-shadow-red-500"
          stroke="red"
        />
      );
  }
}

function WidgetNode({ node }: { node: BSTUIWidgetNode }) {
  const Widget = WidgetsRegistry[node.id];
  const props = node.props as RawWidgetProps<typeof node.id>;
  return (
    <div
      className={`flex items-center justify-center
    aspect-square
    size-full`}
    >
      <Widget {...props} />
    </div>
  );
}

function TextNode({ node }: { node: BSTUITextNode }) {
  const elem = <UIElementRenderer node={node.text} />;
  return <LatexText key={node.text as string}>{elem}</LatexText>;
}

function ParagraphNode({
  node,
  big,
}: {
  node: BSTUIParagraphNode;
  big?: boolean;
}) {
  const items = node.items as BSTNode[];
  return (
    <LatexProvider>
      <div
        className={`p-2 flex gap-2 flex-wrap items-center
        ${big ? "**:text-5xl h-full w-full justify-center" : "text-2xl"}`}
      >
        {items.map((node, i) => (
          <UIElementRenderer key={i} {...{ node }} />
        ))}
      </div>
    </LatexProvider>
  );
}

function NumberInputNode({ node }: { node: BSTNUIumberInputNode }) {
  const [
    index,
    correct,
    initExerciseInputRef,
    setCurrentExerciseInputValue,
    input,
    disabled
  ] = [
      useExerciseStore((state) => state.currentIndex),
      useExerciseStore((state) => state.correct),
      useExerciseStore((state) => state.initExerciseInputRef),
      useExerciseStore((state) => state.setCurrentExerciseInputValue),
      useExerciseStore((state) => state.getCurrentExerciseInputFromID(node.id)),
      useExerciseStore((state) => {
        const input = state.getCurrentExerciseInputFromID(node.id)
        return !input
          ? false
          : state.getCurrentExercise().state !== ExerciseState.OnGoing ||
          (input.correction.corrected && input.correction.correct)
      })
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
      onKeyDown={(e) => e.key === 'Enter' ? correct() : 0}
      onNewValue={(newValue) => setCurrentExerciseInputValue(node.id, newValue)}
      id={`${index}-${node.id}`}
      key={`${index}-${node.id}`}
      ref={(el: HTMLInputElement | null) => {
        if (el) initExerciseInputRef(node.id, el);
      }}
    />
  );
}
