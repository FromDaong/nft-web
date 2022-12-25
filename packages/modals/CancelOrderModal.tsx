import {
	useCancelOrder,
	useGetRemainingOrderBalance,
	useGetResaleOrders,
	useTritNFTUtils,
} from "@packages/post/hooks";
import {TritPostProps} from "@packages/post/types";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {useState} from "react";
import {Modal} from ".";
import GenericChainModal from "./GenericChainModal";

export default function CancelOrderModal(props: {
	onClose: any;
	isOpen: any;
	nft: TritPostProps;
}) {
	const [loading, setLoading] = useState(false);
	const {removeListingFromResale} = useCancelOrder(props.nft.id);

	const cancelOrderAction = async () => {
		removeListingFromResale().then((x) => {
			setLoading(false);
			props.onClose();
		});

		setLoading(false);
		props.onClose();
	};

	return (
		<>
			<GenericChainModal
				title={"Remove NFT Listing ❌"}
				onClose={props.onClose}
				isOpen={props.isOpen}
				subtitle={
					"Transfer your NFT to another wallet. Please make sure both walletsare on the Binance Smart Chain."
				}
				buttonLabel={"Remove listing"}
				hideClose
				action={cancelOrderAction}
				loading={loading}
			>
				<Container className="flex flex-col gap-4">
					<Text>
						Your <b>"{props.nft.name}"</b> NFT will no longer be available on
						the resale marketplace.
					</Text>
				</Container>
			</GenericChainModal>
		</>
	);
}
