import { Fragment } from "react";
import {
	type DefaultPlaneElementProps,
	defaultStrokeProps,
	getXCoor,
	getYCoor,
	marginOffset,
	opacity,
	type Range,
	type Ranges,
	strokeWidth,
} from "../util";

type VectorFunction = (t: number) => Range;

function getPaths(ranges: Ranges, f: VectorFunction, interval: Range) {
	const step = Math.PI / 2 / 3 / 4 / 5;
	const [minY, maxY] = [ranges.y[0] - marginOffset / 2, ranges.y[1] + marginOffset / 2];
	const [minX, maxX] = [ranges.x[0] - marginOffset / 2, ranges.x[1] + marginOffset / 2];
	const paths: string[][] = [[]];

	for (let t = interval[0]; t <= interval[1]; t += step) {
		const [x, y] = f(t);
		if (
			!Number.isFinite(x) ||
			!Number.isFinite(y) ||
			x < minX ||
			x > maxX ||
			y < minY ||
			y > maxY
		) {
			if (paths.length && paths[paths.length - 1].length !== 0) paths.push([]);
		} else {
			paths[paths.length - 1].push(`${getXCoor(ranges, x)},${getYCoor(ranges, y)}`);
		}
	}

	return paths;
}

export default function FunctionPlot({
	ranges,
	f,
	interval,
	color,
}: {
	ranges: Ranges;
	f: VectorFunction;
	interval?: Range;
	color: DefaultPlaneElementProps["color"];
}) {
	const paths = getPaths(ranges, f, interval ?? ranges.x);
	return (
		<g filter="url(#shadow)" opacity={opacity.main}>
			{paths.map((p, i) => (
				<Fragment key={i}>
					{/* Glow behind */}
					<polyline
						{...defaultStrokeProps}
						fill="none"
						points={p.join(" ")}
						stroke="white"
						strokeWidth={strokeWidth.normal}
					/>
					{/* Actual line */}
					<polyline
						{...defaultStrokeProps}
						fill="none"
						points={p.join(" ")}
						stroke={color}
						strokeWidth={strokeWidth.min}
					/>
				</Fragment>
			))}
		</g>
	);
}
