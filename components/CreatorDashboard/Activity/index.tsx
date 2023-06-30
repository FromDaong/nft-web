import {HeartIcon, ShoppingCartIcon} from "@heroicons/react/outline";
import {Text} from "@packages/shared/components/Typography/Text";

export const LikeIconBadge = () => (
	<Text
		css={{
			padding: "4px",
			borderRadius: "999px",
			color: "$white",
			background: "$red10",
			position: "relative",
			zIndex: 1,
		}}
	>
		<HeartIcon className="w-4 h-4" />
	</Text>
);

export const BuyIconBadge = () => (
	<Text
		css={{
			padding: "4px",
			borderRadius: "999px",
			color: "$white",
			background: "$purple10",
			position: "relative",
			zIndex: 1,
		}}
	>
		<ShoppingCartIcon className="w-4 h-4" />
	</Text>
);
