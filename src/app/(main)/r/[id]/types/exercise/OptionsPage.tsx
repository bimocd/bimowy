import { InfoIcon } from "lucide-react";
import { NumberInput } from "@/cpn/main/NumberInput";
import { BSTType } from "@/lib/resources/builders/bst/nodes";
import type {
	BSTIntervalOption,
	BSTTogglablesOption,
	SerializedOptionNode,
} from "@/lib/resources/builders/bst/nodes/option";
import { useExerciseStore } from "./store";

export function OptionsPage() {
	const [options] = [useExerciseStore((state) => state.resource.options)];

	return (
		<div
			className={`flex flex-col justify-center items-center gap-4
    size-full text-4xl`}
		>
			{Object.entries(options).map(([id, option]) => (
				<div
					className={`flex items-center justify-center gap-4
        bg-white/5 rounded-lg
        px-5 py-3`}
					key={id}
				>
					{option.name && <h1>{option.name}: </h1>}
					<OptionRenderer {...{ id, option }} />
				</div>
			))}
		</div>
	);
}

function OptionRenderer({ id, option }: { id: string; option: SerializedOptionNode }) {
	switch (option._bsttype) {
		case BSTType.IntervalOption:
			return (
				<IntervalOption {...{ id }} option={option as SerializedOptionNode<BSTIntervalOption>} />
			);
		case BSTType.TogglablesOption:
			return (
				<TogglablesOption
					{...{ id }}
					option={option as SerializedOptionNode<BSTTogglablesOption>}
				/>
			);
		default:
			return <InfoIcon stroke="red" />;
	}
}

function TogglablesOption({
	id,
	option,
}: {
	id: string;
	option: SerializedOptionNode<BSTTogglablesOption>;
}) {
	const [toggledList, setOptionValue] = [
		useExerciseStore((s) => s.optionValues[id] as BSTTogglablesOption["defaultValue"]),
		useExerciseStore((s) => s.setOptionValue),
	];
	return (
		<div className="flex gap-3">
			{option.togglables.map((t) => {
				const toggled = toggledList.includes(t);
				return (
					<div
						key={t}
						{...(toggled ? { "data-toggled": true } : {})}
						onClick={() => {
							setOptionValue(
								id,
								toggled ? toggledList.filter((tg) => tg !== t) : [...toggledList, t],
							);
						}}
						className={`flex justify-center items-center
            rounded-md bg-white/5 ring-white/10 ring-1
            data-toggled:bg-white data-toggled:text-black
            select-none cursor-pointer hover:opacity-90 hover:scale-95
            px-2 py-1
            duration-75`}
					>
						{t}
					</div>
				);
			})}
		</div>
	);
}

function IntervalOption({
	id,
	option,
}: {
	id: string;
	option: SerializedOptionNode<BSTIntervalOption>;
}) {
	const [optionValue, setOptionValue] = [
		useExerciseStore((s) => s.optionValues[id] as BSTIntervalOption["defaultValue"]),
		useExerciseStore((s) => s.setOptionValue),
	];

	return (
		<div className="flex gap-1 items-center">
			<span>[</span>
			<NumberInput
				defaultValue={option.defaultValue[0]}
				onNewValue={(newValue) => setOptionValue(id, [Number(newValue), optionValue[1]])}
			/>
			<span>;</span>
			<NumberInput
				defaultValue={option.defaultValue[1]}
				onNewValue={(newValue) => setOptionValue(id, [optionValue[0], Number(newValue)])}
			/>
			<span>]</span>
		</div>
	);
}
