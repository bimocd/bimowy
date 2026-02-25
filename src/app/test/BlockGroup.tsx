import { Block, type BlockProps } from "./Block";

export function BlockGroup({ blocks }: { blocks: BlockProps[] }) {
	return (
		<div className="flex flex-col">
			{blocks.map((block) => (
				<Block key={block.id} {...block} />
			))}
		</div>
	);
}
