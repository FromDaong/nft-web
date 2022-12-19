import {Container} from "@packages/shared/components/Container";

type SkeletonItem = {
	layout: "flex" | "block" | "grid";
	width: number;
	height: number;
	background: "default" | string;
};

const generateSkeletonItem = () => {
	return "";
};

export default function Skeleton(config: {
	pulse?: boolean;
	speed?: number;
	items: Array<SkeletonItem>;
}) {
	return <Container className="flex flex-col w-full"></Container>;
}
