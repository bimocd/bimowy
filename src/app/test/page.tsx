"use client";
import { BlockGroup } from "./BlockGroup";

export default function TestPage() {
	return (
		<div className="select-none">
			<BlockGroup
				blocks={[
					{ id: "attack", color: "red", items: [{ type: "text", text: "Attack" }] },
					{
						id: "turn-r",
						color: "purple",
						items: [{ type: "text", text: "Turn right" }]
					},
					{
						id: "cheer",
						color: "yellow",
						items: [{ type: "text", text: "Cheer" }]
					},
					{
						id: "walk",
						color: "blue",
						items: [
							{ type: "text", text: "Walk" },
							{ type: "number-input" },
							{ type: "text", text: "pixels" }
						]
					},
					{
						id: "grass",
						color: "green",
						items: [{ type: "text", text: "Touch grass" }]
					}
				]}
			/>
		</div>
	);
}
