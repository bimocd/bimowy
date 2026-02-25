import { useDraggable } from "@dnd-kit/react";
import { useLayoutEffect, useRef } from "react";

const RL = 0.3; // Left Radius
const RB = 0.1; // Bump & Hole radius
const O = 0.4; // Bump & Hole offset from corner
const RR = 0.6; // Right Radius
const BW = 0.3; // Bump/Hole width

const colors = {
	red: "bg-red-500",
	blue: "bg-blue-500",
	yellow: "bg-amber-500"
};

export type BlockProps = {
	id: string;
	title: string;
	color: keyof typeof colors;
};

export function Block({ title, color, id }: BlockProps) {
	const refClip = useRef<HTMLDivElement>(null);

	const { ref: refDrag } = useDraggable({ id });

	function remToPx(rem: number) {
		return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
	}

	useLayoutEffect(() => {
		const el = refClip.current;
		if (!el) return;
		function updateCut() {
			if (!el) return;
			const { width: w, height: h } = el.getBoundingClientRect();
			const [rl, rb, o, rr, bw] = [RL, RB, O, RR, BW].map(remToPx);

			const path = `
        M 0,${rl + rb * 2}

        q 0,${-rl} ${rl},${-rl}
        l ${o},0
        q ${rb},0 ${rb},${-rb}
				q 0,${-rb} ${rb},${-rb}
        l ${bw},0
				q ${rb},0 ${rb},${rb}
				q 0,${rb} ${rb},${rb}

        L ${w - rr},${rb * 2}
        
        q ${rr},0 ${rr},${rr}
        
        L ${w},${h - rr}
        q 0,${rr} ${-rr},${rr}

        L ${rb + rb + bw + rb + rb + o + rl},${h}
        q ${-rb},0 ${-rb},${-rb}
        q 0,${-rb} ${-rb},${-rb}
        l ${-bw},0
        q ${-rb},0 ${-rb},${rb}
        q 0,${rb} ${-rb},${rb}
        l ${-o},0
        q ${-rl},0 ${-rl},${-rl}

        Z
      `.replace(/\s+/g, " ");

			el.style.clipPath = `path("${path}")`;
		}
		updateCut();
	}, []);

	return (
		<div
			ref={(element) => {
				refClip.current = element;
				refDrag(element);
			}}
			className={`relative w-fit select-none cursor-pointer
        pl-1.5 p-2.5 leading-4
        text-white ${colors[color]}
				transition-transform duration-75 hover:scale-105`}
		>
			{title}
		</div>
	);
}
