import Arrow from "../Meta/Arrow";
import { opacity, type PlaneElementEnum, type PlaneElementProps } from "../util";

export default function Vector(props: { id: string } & PlaneElementProps<PlaneElementEnum.Vector>) {
	return (
		<g opacity={opacity.main}>
			<Arrow {...props} color={props.color} fixOffset glow={{ width: 1 / 5 }} shadow />
		</g>
	);
}
