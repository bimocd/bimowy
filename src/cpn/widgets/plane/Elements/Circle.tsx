import {
	defaultStrokeProps,
	getXCoor,
	getYCoor,
	opacity,
	type PlaneElementEnum,
	type PlaneElementProps,
	strokeWidth,
} from "../util";

export default function Circle({
	x,
	y,
	r,
	ranges,
	color,
}: PlaneElementProps<PlaneElementEnum.Circle>) {
	return (
		<g filter="url(#shadow)" opacity={opacity.main}>
			{color && (
				<circle
					{...defaultStrokeProps}
					cx={getXCoor(ranges, x)}
					cy={getYCoor(ranges, y)}
					fill="transparent"
					r={r}
					stroke={"white"}
					strokeWidth={strokeWidth.normal}
				/>
			)}
			<circle
				{...defaultStrokeProps}
				cx={getXCoor(ranges, x)}
				cy={getYCoor(ranges, y)}
				fill="transparent"
				r={r}
				stroke={color}
				strokeWidth={strokeWidth.min}
			/>
		</g>
	);
}
