import type { RecursivelyNestNode } from "@/lib/resources/builders/bst/nodes/functions";
import { default as Plane } from "./plane";

export const WidgetsRegistry = { Plane } as const;
export type WidgetId = keyof typeof WidgetsRegistry;
export type RawWidgetProps<Id extends WidgetId> = Parameters<(typeof WidgetsRegistry)[Id]>[0];

export type WidgetProps<Id extends WidgetId> = RecursivelyNestNode<RawWidgetProps<Id>>;
