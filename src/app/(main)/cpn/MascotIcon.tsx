import { type SVGProps, useState } from "react";

export function MascotIcon(props?: SVGProps<SVGSVGElement>) {
	const [isHover, setIsHover] = useState(false);
	return (
		<svg
			onMouseEnter={() => setIsHover(true)}
			onMouseLeave={() => setIsHover(false)}
			viewBox="0 0 500 500"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
			className="group/icon hover:scale-110 hover:rotate-3 duration-100 **:duration-100"
		>
			<defs>
				<linearGradient id="a">
					<title>{"Logo gradient"}</title>
					<stop
						offset={isHover ? 0.5 : 0}
						style={{
							stopColor: "#ff5685",
						}}
					/>
					<stop
						offset={0.867}
						style={{
							stopColor: "#ff9133",
						}}
					/>
				</linearGradient>
				<linearGradient
					gradientUnits="userSpaceOnUse"
					href="#a"
					id="b"
					x1={247.84}
					x2={247.84}
					y1={16.424}
					y2={486.116}
				/>
			</defs>
			<path
				d="M184.535 50.459q63.305-45.994 126.61 0l126.609 91.987q63.305 45.993 39.125 120.412l-48.361 148.839q-24.18 74.419-102.429 74.419H169.591q-78.249 0-102.429-74.419L18.801 262.858q-24.18-74.419 39.125-120.412Z"
				style={{
					fill: "url(#b)",
					strokeLinecap: "round",
					strokeLinejoin: "round",
					strokeWidth: 6,
					transformBox: "fill-box",
					transformOrigin: "50% 50%",
				}}
				transform="rotate(25.349 62.145 -17.659) skewX(-.102)"
			>
				<title>{"Body"}</title>
			</path>
			<circle
				cx={isHover ? 260 : 285.111}
				cy={226.322}
				r={151.69}
				style={{
					fill: "#d8d8d8",
				}}
			>
				<title>{"Eye"}</title>
			</circle>
			<g
				className="group-hover/icon:-translate-x-20 group-hover/icon:translate-y-8 group-hover/icon:-rotate-[9] duration-150"
				transform="translate(7.298 5.676)"
			>
				<path
					d="M328.329 102.035c43.113 0 78.062 39.507 78.062 88.241v42.333c0 48.733-34.949 88.24-78.062 88.24s-78.064-39.507-78.064-88.24v-42.333c0-48.734 34.951-88.241 78.064-88.241Z"
					style={{
						fill: "#292929",
						transformOrigin: "328.62px 212.581px",
					}}
					transform="rotate(3.648 0 0)"
				/>
				<rect
					height={121.374}
					rx={37.902}
					ry={37.902}
					style={{
						fill: "#292929",
						transformOrigin: "520.384px 187.297px",
					}}
					transform="rotate(3.066 -568.39 -3570.987)"
					width={155.784}
					x={441.999}
					y={175.73}
				/>
				<title>{"Eyeball"}</title>
			</g>
		</svg>
	);
}
