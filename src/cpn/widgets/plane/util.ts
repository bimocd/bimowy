export type Ranges = { x: Range; y: Range };
export type Range = [number, number];
export type AxisOption = "x" | "y";

export type Excludables = "bg" | "x-axis" | "x-labels" | "y-axis" | "y-labels";

export type DefaultPlaneElementProps = {
	color?: (typeof presetColors)[number];
};
export enum PlaneElementEnum {
	Point = "point",
	Vector = "vector",
	ScalarFunction = "scalar-function",
	VectorFunction = "vector-function",
	Circle = "circle",
}

type PositionExtra = { x: number; y: number };
type IntervalExtra = { interval: Range };

export type CustomPlaneElementConfigByType = {
	[PlaneElementEnum.Point]: PositionExtra;
	[PlaneElementEnum.Circle]: PositionExtra & { r: number };
	[PlaneElementEnum.Vector]: { x1: number; y1: number; x2: number; y2: number };
	[PlaneElementEnum.ScalarFunction]: IntervalExtra & {
		f: (x: number) => number;
	};
	[PlaneElementEnum.VectorFunction]: IntervalExtra & {
		f: (t: number) => [number, number];
	};
};
export type PlaneElementData<T extends PlaneElementEnum> = {
	type: T;
} & DefaultPlaneElementProps &
	CustomPlaneElementConfigByType[T];
export type PlaneElementProps<T extends PlaneElementEnum> = Omit<PlaneElementData<T>, "type"> &
	Omit<PlaneProps, "excluded">;

export type AnyPlaneElementData = {
	[K in PlaneElementEnum]: PlaneElementData<K>;
}[PlaneElementEnum];

export type PartialPlaneProps = {
	ranges: Ranges;
	elems?: Record<string, AnyPlaneElementData>;
	excluded?: Excludables[];
};
export type PlaneProps = Required<PartialPlaneProps>;
export function roundBetween(min: number, n: number, max: number) {
	return Math.max(min, Math.min(n, max));
}

export function generateIntegers(start: number, end: number, step: number = 1) {
	const result = [];

	for (let i = Math.ceil(start); i <= Math.floor(end); i += step) {
		result.push(i);
	}
	return result;
}

export const angles: {
	deg: number;
	type: 0 | 1 | 2;
	inTable: boolean;
	percentage: { value: string; abs?: number };
	rad: { value: string; abs?: number };
	sin: { value: string | [string, string]; abs: number };
	cos: { value: string | [string, string]; abs: number };
}[] = [
	{
		cos: { abs: 1, value: ["\\sqrt{4}", "2"] },
		deg: 0,
		inTable: true,
		percentage: { abs: 0, value: "0" },
		rad: { value: "0π" },
		sin: { abs: 0, value: ["\\sqrt{0}", "2"] },
		type: 0,
	},
	{
		cos: { abs: Math.sqrt(3) / 2, value: ["\\sqrt{3}", "2"] },
		deg: 30,
		inTable: true,
		percentage: { abs: 1 / 12, value: "1/12" },
		rad: { abs: Math.PI / 6, value: "π/6" },
		sin: { abs: 0.5, value: ["\\sqrt{1}", "2"] },
		type: 2,
	},
	{
		cos: { abs: Math.sqrt(2) / 2, value: ["\\sqrt{2}", "2"] },
		deg: 45,
		inTable: true,
		percentage: { abs: 1 / 8, value: "1/8" },
		rad: { abs: Math.PI / 4, value: "π/4" },
		sin: { abs: Math.sqrt(2) / 2, value: ["\\sqrt{2}", "2"] },
		type: 1,
	},
	{
		cos: { abs: 0.5, value: ["\\sqrt{1}", "2"] },
		deg: 60,
		inTable: true,
		percentage: { abs: 1 / 6, value: "1/6" },
		rad: { abs: Math.PI / 3, value: "π/3" },
		sin: { abs: Math.sqrt(3) / 2, value: ["\\sqrt{3}", "2"] },
		type: 2,
	},
	{
		cos: { abs: 0, value: ["\\sqrt{0}", "2"] },
		deg: 90,
		inTable: true,
		percentage: { abs: 1 / 4, value: "1/4" },
		rad: { abs: Math.PI / 2, value: "π/2" },
		sin: { abs: 1, value: ["\\sqrt{4}", "2"] },
		type: 1,
	},
	{
		cos: { abs: -0.5, value: ["-\\sqrt{1}", "2"] },
		deg: 120,
		inTable: true,
		percentage: { abs: 1 / 3, value: "1/3" },
		rad: { abs: (2 / 3) * Math.PI, value: "2π/3" },
		sin: { abs: Math.sqrt(3) / 2, value: ["\\sqrt{3}", "2"] },
		type: 2,
	},
	{
		cos: { abs: -Math.sqrt(2) / 2, value: ["-\\sqrt{2}", "2"] },
		deg: 135,
		inTable: false,
		percentage: { abs: 3 / 8, value: "3/8" },
		rad: { abs: (3 / 4) * Math.PI, value: "3π/4" },
		sin: { abs: Math.sqrt(2) / 2, value: ["\\sqrt{2}", "2"] },
		type: 1,
	},
	{
		cos: { abs: -1, value: ["-\\sqrt{4}", "2"] },
		deg: 180,
		inTable: true,
		percentage: { abs: 1 / 2, value: "1/2" },
		rad: { abs: Math.PI, value: "π" },
		sin: { abs: 0, value: ["\\sqrt{0}", "2"] },
		type: 1,
	},
	{
		cos: { abs: -0.5, value: ["-\\sqrt{1}", "2"] },
		deg: 240,
		inTable: false,
		percentage: { abs: 2 / 3, value: "2/3" },
		rad: { abs: (4 / 3) * Math.PI, value: "4π/3" },
		sin: { abs: -Math.sqrt(3) / 2, value: ["-\\sqrt{3}", "2"] },
		type: 2,
	},
	{
		cos: { abs: 1, value: ["\\sqrt{4}", "2"] },
		deg: 360,
		inTable: true,
		percentage: { abs: 1, value: "1" },
		rad: { abs: 2 * Math.PI, value: "2π" },
		sin: { abs: 0, value: ["\\sqrt{0}", "2"] },
		type: 0,
	},
];

import type { SVGAttributes } from "react";
// SVG
export const defaultStrokeProps: SVGAttributes<SVGElement> = {
	strokeLinecap: "round",
	strokeLinejoin: "round",
};
export const defaultTextProps: SVGAttributes<SVGTextElement> = {
	fill: "white",
};
export const strokeWidth = {
	min: 0.1,
	normal: 0.2,
};
export const marginOffset = 0.8;
export const opacity = {
	bg: 1 / 10,
	main: 9 / 10,
	mainHidden: 6 / 10,
	side: 5 / 10,
};

// Simplicity
export const stepBreakpoints = {
	11: 5,
	30: 10,
	45: 15,
	60: 20,
} as const;

// Random
export const presetColors = ["#a855f7", "#ef4444", "#0ea5e9", "#22c55e", "#f59e0b", "#6366f1"];

export const defaultRange: Ranges = { x: [-5, 5], y: [-5, 5] };

export function getXDiff(ranges: Ranges) {
	return ranges.x[1] - ranges.x[0];
}
export function getYDiff(ranges: Ranges) {
	return ranges.y[1] - ranges.y[0];
}
export function getViewBox(ranges: Ranges) {
	return [0, 0, getXDiff(ranges) + marginOffset * 2, getYDiff(ranges) + marginOffset * 2];
}
export function getXCoor(ranges: Ranges, x: number) {
	return marginOffset - ranges.x[0] + x;
}
export function getYCoor(ranges: Ranges, y: number) {
	return marginOffset + ranges.y[1] - y;
}

export function getBreakPoint(ranges: Ranges) {
	const diff = Math.max(getXDiff(ranges), getYDiff(ranges));
	let step = 1;
	for (const bp in stepBreakpoints) {
		const numBp = Number(bp);
		if (diff > numBp) {
			step = stepBreakpoints[numBp as keyof typeof stepBreakpoints];
		}
	}
	return step;
}
