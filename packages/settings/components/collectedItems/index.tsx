import CollectibleCard from "../collectibleCard/collectibleCard";

export default function CollectedItems() {
	return (
		<div className="grid grid-cols-3 gap-8">
			{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item, i) => (
				<div key={i}>
					<CollectibleCard />
				</div>
			))}
		</div>
	);
}
