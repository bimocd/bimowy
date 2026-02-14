import { defaultStrokeProps, getXCoor, getYCoor, type Ranges, strokeWidth } from "../util";

export default function Arrow({
	ranges,
	x1,
	x2,
	y1,
	y2,
	color = "white",
	glow,
	fixOffset,
	shadow
}: {
	ranges: Ranges;
	color?: string;
	fixOffset?: boolean;
	glow?: { width: number };
	shadow?: boolean;
} & Record<"x1" | "x2" | "y1" | "y2", number>) {
	const diffAngle = Math.PI / 2 + Math.PI / 4 + Math.PI / 12;

	const offset = fixOffset ? 0.1 : 0;

	const [offsetx1, offsety1, offsetx2, offsety2] = [
		x1 === x2 ? 0 : x1 < x2 ? offset : -offset,
		y1 === y2 ? 0 : y1 < y2 ? -offset : offset,
		x1 === x2 ? 0 : x1 < x2 ? -offset : offset,
		y1 === y2 ? 0 : y1 < y2 ? offset : -offset
	];

	const [x1Coor, x2Coor, y1Coor, y2Coor] = [
		getXCoor(ranges, x1 + offsetx1),
		getXCoor(ranges, x2 + offsetx2),
		getYCoor(ranges, y1 - offsety1),
		getYCoor(ranges, y2 - offsety2)
	];

	const angleScreen = Math.atan2(y2Coor - y1Coor, x2Coor - x1Coor);

	const leftAngleScreen = angleScreen + diffAngle;
	const rightAngleScreen = angleScreen - diffAngle;

	const headLength = 0.3;

	const leftCoorX = x2Coor + headLength * Math.cos(leftAngleScreen);
	const leftCoorY = y2Coor + headLength * Math.sin(leftAngleScreen);
	const rightCoorX = x2Coor + headLength * Math.cos(rightAngleScreen);
	const rightCoorY = y2Coor + headLength * Math.sin(rightAngleScreen);

	const middleCoorX = (leftCoorX + rightCoorX) / 2;
	const middleCoorY = (leftCoorY + rightCoorY) / 2;
	const points = [
		[x1Coor, y1Coor],
		[middleCoorX, middleCoorY],
		[leftCoorX, leftCoorY],
		[x2Coor, y2Coor],
		[rightCoorX, rightCoorY],
		[middleCoorX, middleCoorY],
		[x1Coor, y1Coor]
	]
		.map((grps) => grps.join(","))
		.join(" ");

	return (
		<g {...(shadow ? { filter: "url(#shadow)" } : {})}>
			{glow && (
				<polygon
					{...defaultStrokeProps}
					{...{ points }}
					stroke={"white"}
					strokeWidth={strokeWidth.min + 0.2}
				/>
			)}
			<polygon
				{...defaultStrokeProps}
				{...{ points }}
				fill={color}
				stroke={color}
				strokeWidth={strokeWidth.min}
			/>
		</g>
	);
}
