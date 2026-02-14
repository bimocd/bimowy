import { PlaneElements } from "./Elements/PlaneElements";
import Axis from "./Meta/Axis";
import PlaneBackground from "./Meta/PlaneBackground";
import { defaultRange, getViewBox, type PartialPlaneProps } from "./util";

export default function Plane({
	ranges = defaultRange,
	elems = {},
	excluded = []
}: PartialPlaneProps) {
	const [xDiff, yDiff] = getViewBox(ranges).slice(2);
	return (
		<svg
			className={`relative *:absolute
		h-full w-full
		*:w-full *:h-full`}
			style={{ aspectRatio: xDiff / yDiff }}
			viewBox={getViewBox(ranges)
				.map((n) => n)
				.join(" ")}
		>
			<title>Plane</title>
			{/* <Defs /> */}
			<PlaneBackground {...{ excluded, ranges }} />
			{(["x", "y"] as const).map((type) => (
				<Axis key={type} {...{ excluded, ranges, type }} />
			))}
			<PlaneElements {...{ elems, excluded, ranges }} />
		</svg>
	);
}
