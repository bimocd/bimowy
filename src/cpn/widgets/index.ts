import type { BSTNode } from "@/lib/resources";
import { default as Plane } from "./plane";

export const WidgetsRegistry = { Plane } as const;
export type WidgetId = keyof typeof WidgetsRegistry;
export type RawWidgetProps<Id extends WidgetId> = Parameters<
  (typeof WidgetsRegistry)[Id]
>[0];

type RecursivelyUseAlso<T, T2> =
  | T
  | T2
  | (T extends (infer E)[]
      ? RecursivelyUseAlso<E, T2>[]
      : T extends object
        ? {
            [K in keyof T]: RecursivelyUseAlso<T[K], T2>;
          }
        : T2);

export type WidgetProps<Id extends WidgetId> = RecursivelyUseAlso<
  RawWidgetProps<Id>,
  BSTNode
>;
