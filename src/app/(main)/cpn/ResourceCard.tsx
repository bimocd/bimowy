"use client";
import { type HTMLAttributes, useState } from "react";
import { twMerge } from "tailwind-merge";
import type { BaseResourceData } from "@/lib/resources/builders/base";
import { ALL_TAGS, type TagId } from "@/lib/resources/tags";
import { type ResourceType, resourceTypeData } from "@/lib/resources/types";
import { getPseudoRandomClassName } from "@/utils/random";
import type { Hook } from "@/utils/types";

export function ResourceCard({ data }: { data: BaseResourceData }) {
	const [isHover, setIsHover] = useState(false);
	const type = resourceTypeData[data.type];
	const color = type.color;
	return (
		<ResourceCardContainer
			{...{ setIsHover }}
			disabled={data.beta}
			href={`/r/${data.id}`}
			style={{
				...(isHover
					? {
							boxShadow: `0px 1px 5px ${color}`,
							outlineColor: color,
							outlineWidth: "3px",
						}
					: {}),
				outlineStyle: "solid",
			}}
		>
			<ResourceCardAbsoluteNote {...{ isHover, type }} />
			<span className="font-semibold text-xl">{data.name}</span>
			{data.description && <span>{data.description}</span>}
			{data.tags && (
				<div className="flex gap-2 justify-center text-sm">
					{data.tags.map((tagId) => (
						<ResourceCardTag key={tagId} {...{ tagId }} />
					))}
				</div>
			)}
		</ResourceCardContainer>
	);
}
function ResourceCardAbsoluteNote({ type }: { type: ResourceType }) {
	return (
		<div
			className={`absolute -top-3 -left-4.5
      p-1 group-hover/card:pr-1.5
      rounded-full shadow-md
      origin-top-left -rotate-2
      text-base group-hover/card:text-xs
      flex items-center justify-center
      text-background font-semibold duration-75
      group-hover/card:-translate-y-2 group-hover/card:scale-110
      grayscale-25 group-hover/card:grayscale-0`}
			style={{ backgroundColor: type.color }}
		>
			<type.icon className="h-lh p-[0.1rem] " stroke={"black"} strokeWidth={"3px"} />
			<span className="duration-150 text-[0px] group-hover/card:text-xs">{type.name}</span>
		</div>
	);
}

function ResourceCardTag({ tagId }: { tagId: TagId }) {
	const tag = ALL_TAGS.find((t) => t.id === tagId);
	if (!tag) return <span>?</span>;
	const Icon = tag.icon;
	return (
		<div
			className={`
        inline-flex items-center
        px-1 pr-2 py-0.5
        ${
					"special" in tag && tag.special
						? `bg-linear-90 from-purple-800/20 to-violet-800/20
          scale-105 group-hover/card:scale-110
          duration-75 rounded-xl`
						: "bg-accent opacity-70 rounded-lg"
				}
        `}
			key={tag.id}
		>
			<Icon className="h-[0.7lh]" />
			<span>{"nick" in tag ? tag.nick : tag.name}</span>
		</div>
	);
}

// ♻️ BETA
// export function ResourceCardCreator() {
//   const [isHover, setIsHover] = useState(false)
//   return (
//     <ResourceCardContainer
//       disabled
//       {...{ setIsHover }}
//       href="/create"
//       className={`bg-transparent outline-dashed outline-white`}
//     >
//       <PlusIcon /> Create a resource
//     </ResourceCardContainer>
//   );
// }

export function ResourceCardContainer({
	setIsHover,
	className,
	disabled,
	...props
}: HTMLAttributes<HTMLAnchorElement> & {
	href: string;
	disabled?: boolean;
	setIsHover: Hook<boolean>;
	className?: string;
}) {
	const randomClassNames = getPseudoRandomClassName(props.href);

	return (
		<a
			{...props}
			className={twMerge(
				`bg-card p-3 px-5 rounded-xl
      flex flex-col gap-2
      justify-center items-center
      duration-150 relative
      outline-1 group/card`,
				disabled && "opacity-25 grayscale-50 scale-90 blur-[1.2px]",
				randomClassNames,
				className,
			)}
			onMouseEnter={() => setIsHover(true)}
			onMouseLeave={() => setIsHover(false)}
		>
			{props.children}
		</a>
	);
}
