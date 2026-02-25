"use client";
import { BlockGroup } from "./BlockGroup";

export default function TestPage() {
	return (
		<div className="select-none">
			<BlockGroup
				blocks={[
					{ title: "Walk", id: "walk", color: "blue" },
					{ title: "Attack", id: "attack", color: "red" },
					{ title: "Turn around", id: "turn", color: "yellow" }
				]}
			/>
		</div>
	);
}
