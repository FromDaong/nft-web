import {XIcon} from "@heroicons/react/outline";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import CoinsIcon from "@packages/shared/icons/CoinsIcon";
import React from "react";

export default function WishlistSection(props: {
	price: number;
	currency: string;
	removeFromWishlist: () => void;
}) {
	return (
		<Container className="flex justify-between gap-4 mt-4">
			<Button
				size={"sm"}
				appearance={"surface"}
				onClick={props.removeFromWishlist}
			>
				<XIcon className="w-5 h-5" />
			</Button>
			<Button
				size={"sm"}
				appearance={"action"}
			>
				<CoinsIcon className={"w-5 h-5"} />
				Buy for {props.price} {props.currency}
			</Button>
		</Container>
	);
}
