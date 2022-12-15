import {useBuyFromResale} from "@packages/post/hooks";
import {TritPostProps} from "@packages/post/types";
import {Container} from "@packages/shared/components/Container";
import {Text} from "@packages/shared/components/Typography/Headings";
import {BigNumber, ethers} from "ethers";
import {useState} from "react";
import GenericChainModal from "./GenericChainModal";

export default function CancelOrderModal(props: {
	onClose: any;
	isOpen: any;
	nft: TritPostProps;
}) {
	const [loading, setLoading] = useState(false);
	const {buyFromResale} = useBuyFromResale();

	const cost = ethers.utils.formatEther(BigNumber.from(props.nft.price.value));

	const purchaseNFT = async () => {
		setLoading(true);
		buyFromResale(
			props.nft.id,
			1,
			props.nft.seller,
			Number(props.nft.price.value)
		)
			.then(() => {
				setLoading(false);
				props.onClose();
			})
			.catch((err) => console.error(err));

		setLoading(false);
		props.onClose();
	};

	return (
		<>
			<GenericChainModal
				title={"Purchase NFT 🛒"}
				onClose={props.onClose}
				isOpen={props.isOpen}
				subtitle={`You are buying the NFT ${props.nft.name} for ${cost}BNB from the Resale Market`}
				buttonLabel={"Purchase NFT"}
				action={purchaseNFT}
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
