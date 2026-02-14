import FunctionPlot from "../Meta/FunctionPlot";
import type { PlaneElementEnum, PlaneElementProps } from "../util";

export default function VectorFunction({
	ranges,
	f,
	interval,
	color
}: PlaneElementProps<PlaneElementEnum.VectorFunction>) {
	return <FunctionPlot {...{ color, f, interval, ranges }} />;
}
