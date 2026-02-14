import FunctionPlot from "../Meta/FunctionPlot";
import type { PlaneElementEnum, PlaneElementProps } from "../util";

export default function ScalarFunction({
	ranges,
	f,
	color,
}: PlaneElementProps<PlaneElementEnum.ScalarFunction>) {
	return <FunctionPlot {...{ color, ranges }} f={(t) => [t, f(t)]} />;
}
