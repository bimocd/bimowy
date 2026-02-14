import type { PlaneElementEnum, PlaneElementProps } from "../util";
import { defaultStrokeProps, getXCoor, getYCoor, opacity, strokeWidth } from "../util";

export default function Point({ x, y, ranges, color }: PlaneElementProps<PlaneElementEnum.Point>) {
	const cx = getXCoor(ranges, x);
	const cy = getYCoor(ranges, y);
	return (
		<g filter="url(#shadow)" opacity={opacity.main}>
			<circle
				className="hover:scale-[101%] duration-75"
				{...defaultStrokeProps}
				{...{ cx, cy }}
				fill={color}
				r={strokeWidth.normal}
				strokeWidth={0.1}
				stroke="white"
			/>
		</g>
	);
}
