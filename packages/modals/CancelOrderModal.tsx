import {useTritNFTUtils} from "@packages/post/hooks";
import {TritPostProps} from "@packages/post/types";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {Modal} from ".";
import GenericChainModal from "./GenericChainModal";

export default function CancelOrderModal(props: {
	onClose: any;
	isOpen: any;
	nft: TritPostProps;
}) {
	const {liked, likeNFT, isListedOnResale} = useTritNFTUtils(props);

	return (
		<GenericChainModal
			title={"Transfer NFT"}
			onClose={props.onClose}
			isOpen={props.isOpen}
			subtitle={
				"Transfer your NFT to another wallet. Please make sure both walletsare on the Binance Smart Chain."
			}
			buttonLabel={"Remove NFT listing"}
			hideClose
			action={() => {}}
		>
			<Container></Container>
		</GenericChainModal>
	);
}
