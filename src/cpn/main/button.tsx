import { twMerge } from "tailwind-merge";
import { Button as ShadcnButton } from "../ui/button";

export function Button({
	id,
	onClick,
	disabled,
	children,
	className,
	variant = "default",
}: Parameters<typeof ShadcnButton>[0]) {
	return (
		<ShadcnButton
			{...{ disabled, onClick, variant, id }}
			className={twMerge(
				`font-semibold cursor-pointer
    hover:scale-105 active:scale-95
    disabled:opacity-50 disabled:cursor-not-allowed`,
				className,
			)}
		>
			{children}
		</ShadcnButton>
	);
}
