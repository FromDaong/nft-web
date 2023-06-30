import Image from "next/future/image";

export function EmptyStateImage() {
	return (
		<Image
			src={"/assets/graphics/empty-robot.png"}
			alt={"Empty state"}
			width={256}
			height={256}
			className="mb-8"
		/>
	);
}
