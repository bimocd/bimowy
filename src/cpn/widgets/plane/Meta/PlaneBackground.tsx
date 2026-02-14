import {
	defaultStrokeProps,
	type Excludables,
	generateIntegers,
	getXCoor,
	getYCoor,
	marginOffset,
	opacity,
	type Ranges,
	strokeWidth
} from "../util";

export default function PlaneBackground({
	ranges,
	excluded
}: {
	ranges: Ranges;
	excluded: Excludables[];
}) {
	if (excluded?.includes("bg")) return;
	return (
		<g opacity={opacity.bg}>
			<g>
				{generateIntegers(...ranges.y).map((i) => {
					const yCoor = getYCoor(ranges, i);
					return (
						<line
							{...defaultStrokeProps}
							key={`horizental-${i}`}
							stroke="white"
							strokeWidth={strokeWidth.min}
							x1={getXCoor(ranges, ranges.x[0]) - marginOffset / 2}
							x2={getXCoor(ranges, ranges.x[1]) + marginOffset / 2}
							y1={yCoor}
							y2={yCoor}
						/>
					);
				})}
			</g>
			<g>
				{generateIntegers(...ranges.x).map((i) => {
					const xCoor = getXCoor(ranges, i);
					return (
						<line
							{...defaultStrokeProps}
							key={`vertical-${i}`}
							stroke="white"
							strokeWidth={strokeWidth.min}
							x1={xCoor}
							x2={xCoor}
							y1={getYCoor(ranges, ranges.y[1]) - marginOffset / 2}
							y2={getYCoor(ranges, ranges.y[0]) + marginOffset / 2}
						/>
					);
				})}
			</g>
		</g>
	);
}
