"use client";
import { useState } from "react";
import {
  type BaseResourceData,
  type ResourceType,
  resourceTypeData,
  type TagId,
  tags,
} from "@/lib/resources";
import { getPseudoRandomClassName } from "@/utils/random";

export function ResourceCard({ data }: { data: BaseResourceData }) {
  const [isHover, setIsHover] = useState(false);
  const type = resourceTypeData[data.type];
  const color = type.color;
  const randomClassNames = getPseudoRandomClassName(data.id);
  return (
    <a
      className={`bg-card p-3 px-5 rounded-xl
      flex flex-col gap-2
      justify-center items-center
      duration-150 relative
      outline-1 group/card
      ${data.beta && "opacity-25 grayscale-75 scale-90 blur-[1.5px]"}
      ${randomClassNames}`}
      href={`/r/${data.id}`}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
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
    </a>
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
      <type.icon
        className="h-lh p-[0.1rem] "
        stroke={"black"}
        strokeWidth={"3px"}
      />
      <span className="duration-150 text-[0px] group-hover/card:text-xs">
        {type.name}
      </span>
    </div>
  );
}

function ResourceCardTag({ tagId }: { tagId: TagId }) {
  const tag = tags.find((t) => t.id === tagId);
  if (!tag) return <span>?</span>;
  const Icon = tag.icon;
  return (
    <div
      className={`
        inline-flex items-center
        px-1 pr-2 py-0.5
        ${"special" in tag && tag.special
          ? `bg-linear-90 from-purple-800/80 to-violet-800/80
          scale-105
          duration-75 group-hover/card:scale-110 rounded-xl`
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
