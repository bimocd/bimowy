"use client";
import { useState } from "react";
import type { JSX } from "react/jsx-dev-runtime";
import { twMerge } from "tailwind-merge";
import { Input } from "@/shadcn/ui/input";

const isValidNumber = (str: string) => str && !Number.isNaN(Number(str));

type Base = React.ComponentProps<"input"> & {
	className?: string;
	placeholder?: string;
};

type PropsEmptyAllowed = Base & {
	allowEmpty: true;
	defaultValue?: number;
	onNewValue: (newValue: number | undefined) => void;
};

type PropsEmptyUnAllowed = Base & {
	allowEmpty?: false;
	defaultValue: number;
	onNewValue: (newValue: number) => void;
};

export function NumberInput(props: PropsEmptyAllowed): JSX.Element;
export function NumberInput(props: PropsEmptyUnAllowed): JSX.Element;
export function NumberInput({
	allowEmpty,
	className,
	onNewValue,
	defaultValue,
	placeholder,
	...props
}: PropsEmptyAllowed | PropsEmptyUnAllowed) {
	const [isValid, setIsValid] = useState(true);

	const defaultValueStr = typeof defaultValue === "undefined" ? "" : `${defaultValue}`;
	const [insideStateValue, setInsideStateValue] = useState<string>(defaultValueStr);

	return (
		<Input
			{...{ defaultValue, placeholder }}
			{...props}
			className={twMerge(
				className,
				`data-[invalid=true]:ring-orange-500/50
        data-[invalid=true]:ring-2
        border-none! ring-1 ring-accent
        w-20
        disabled:opacity-50
        disabled:hover:cursor-not-allowed
        text-2xl!
        placeholder:opacity-10`
			)}
			data-invalid={!isValid}
			onBlur={(ev) => {
				ev.target.value = insideStateValue;
				setIsValid(true);
			}}
			autoComplete="off"
			onChange={(ev) => {
				const newValue = ev.target.value;
				const isEmptyAndAllowed = newValue === "" && allowEmpty;
				if (isEmptyAndAllowed || isValidNumber(newValue)) {
					setInsideStateValue(newValue);
					setIsValid(true);
					if (onNewValue) {
						if (allowEmpty && newValue === "") onNewValue(undefined);
						else return onNewValue(+newValue);
					}
				} else {
					setIsValid(false);
				}
			}}
		/>
	);
}
