import {useTransferNFTs} from "@packages/post/hooks";
import {TritPostProps} from "@packages/post/types";
import {Container} from "@packages/shared/components/Container";
import {Input} from "@packages/shared/components/Input";
import {
	ImportantText,
	MutedText,
	SmallText,
	Text,
} from "@packages/shared/components/Typography/Text";
import Link from "next/link";
import {useState} from "react";
import {useSigner} from "wagmi";
import GenericChainModal from "./GenericChainModal";

export default function TransferNFTModal(props: {
	onClose: any;
	isOpen: any;
	nft: TritPostProps;
}) {
	const {data: signer} = useSigner();
	const {transferNFT} = useTransferNFTs(signer);
	const [transferLoading, setTransferLoading] = useState(false);
	const [transferSuccess, setTransferSuccess] = useState(false);
	const [transferError, setTransferError] = useState("");

	const [toAddress, setToAddress] = useState("");
	const [transferAmount, setTransferAmount] = useState(0);

	const transferNFTAction = () => {
		setTransferLoading(false);
		transferNFT(toAddress, props.nft.id, transferAmount)
			.then(() => {
				setTransferLoading(false);
				setTransferSuccess(true);
			})
			.catch((err) => {
				console.log({err});
				setTransferError(
					"An error occurred while transferring NFT. Please try again"
				);
			});
	};

	return (
		<>
			<GenericChainModal
				title={"Successfully sent NFT"}
				onClose={props.onClose}
				isOpen={transferSuccess}
				buttonLabel={"Close"}
				hideClose
				action={() => {
					setTransferSuccess(false);
					props.onClose();
				}}
			>
				<Text>
					You have successfully sent NFT to ${toAddress}. Check out the
					transaction at{" "}
					<Link href={"#"}>
						<a>Bscscan</a>
					</Link>
				</Text>
			</GenericChainModal>
			<GenericChainModal
				title={"An error occured"}
				onClose={props.onClose}
				isOpen={!!transferError}
				buttonLabel={"Close"}
				hideClose
				action={() => {
					setTransferError("");
					props.onClose();
				}}
			>
				<Text>
					An error occurred while trying to send your NFT. Please try again.
				</Text>
			</GenericChainModal>
			<GenericChainModal
				title={"Transfer NFT"}
				onClose={props.onClose}
				isOpen={props.isOpen}
				subtitle={
					"Transfer your NFT to another wallet. Please make sure both walletsare on the Binance Smart Chain."
				}
				buttonLabel={"Transfer NFT"}
				action={() => {
					transferNFTAction();
				}}
				loading={transferLoading || !signer}
			>
				<Container className="flex flex-col gap-4">
					<Container>
						<Text>
							<ImportantText>Recipient Address</ImportantText>
						</Text>
						<Input
							type="email"
							onChange={(e) => setToAddress(e.currentTarget.value)}
							placeholder="0x123"
						/>
						<Text>
							<SmallText>Ensure this is a BEP-20 Address.</SmallText>
						</Text>
					</Container>

					<Container>
						<Text>
							<ImportantText>Amount</ImportantText>
						</Text>
						<Input
							type="number"
							defaultValue={0}
							onChange={(e) => setTransferAmount(Number(e.currentTarget.value))}
						/>
						<Text>
							<SmallText>
								How many of these NFTs do you want to transfer?
							</SmallText>
						</Text>
					</Container>
				</Container>
			</GenericChainModal>
		</>
	);
}
