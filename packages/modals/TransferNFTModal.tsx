import {useTransferNFTs} from "@packages/post/hooks";
import {TritPostProps} from "@packages/post/types";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Input} from "@packages/shared/components/Input";
import {Text} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	SmallText,
} from "@packages/shared/components/Typography/Text";
import Spinner from "@packages/shared/icons/Spinner";
import {useUser} from "core/auth/useUser";
import {useRouter} from "next/router";
import {useState} from "react";
import {useSigner} from "wagmi";
import GenericChainModal from "./GenericChainModal";

export default function TransferNFTModal(props: {
	onClose: any;
	isOpen: any;
	nft: TritPostProps;
	balance: number;
}) {
	const router = useRouter();
	const {data: signer} = useSigner();
	const {profile} = useUser();
	const [transferNFTPending, setTransferNFTPending] = useState(false);
	const [transferNFTSuccess, setTransferNFTSuccess] = useState(false);
	const [transferNFTError, setTransferNFTError] = useState(false);

	const [sendTo, setSendTo] = useState("");
	const [amount, setAmount] = useState(1);

	const {transferNFT} = useTransferNFTs(signer);
	const gotoProfile = () => router.push(`/${profile.username}`);

	const transferNFTAction = async () => {
		setTransferNFTPending(true);

		transferNFT(sendTo, Number(props.nft.id), amount)
			.then(() => {
				setTransferNFTPending(false);
				setTransferNFTSuccess(true);
			})
			.catch((err) => {
				setTransferNFTPending(false);
				setTransferNFTError(err);
				console.log({err});
			});
	};

	return (
		<>
			<GenericChainModal
				isOpen={transferNFTPending}
				noTitle
				subtitle={
					<Container className="flex flex-col items-center gap-4">
						<Spinner />
						<Text>
							<ImportantText>
								Please wait, we are transferring your NFT.
							</ImportantText>
						</Text>
					</Container>
				}
				hideClose
				noButton
				onClose={() => {
					props.onClose();
				}}
			/>

			<GenericChainModal
				isOpen={!transferNFTPending && transferNFTSuccess}
				subtitle={"Your NFT has been transferred."}
				hideClose
				buttonLabel="Close"
				noButton
				action={() => {
					gotoProfile();
				}}
				onClose={() => {
					gotoProfile();
				}}
			/>

			<GenericChainModal
				isOpen={!!transferNFTError}
				title={"An error occurred"}
				subtitle={
					"An error occurred while transferring your NFT. Please try again."
				}
				hideClose
				noButton
				buttonLabel="Close"
				action={() => {
					props.onClose();
				}}
				onClose={() => {
					props.onClose();
				}}
			/>

			<GenericChainModal
				isOpen={
					props.isOpen &&
					!transferNFTPending &&
					!transferNFTSuccess &&
					!transferNFTError
				}
				title={"Transfer NFT"}
				subtitle={
					"Send your NFT to another BSC wallet. Please ensure wallet address is on the Binance Smart Chain"
				}
				onClose={() => {
					props.onClose();
				}}
				hideClose
				noButton
			>
				<Container className="flex flex-col gap-8">
					<Container className="flex flex-col gap-4">
						<Container className="flex flex-col gap-2">
							<Text>Receiving address</Text>
							<Input
								name="wallet"
								type="text"
								onChange={(e) => setSendTo(e.target.value)}
								value={sendTo}
							/>
						</Container>
						<Container className="flex flex-col gap-2">
							<Text>NFTs to transfer</Text>
							<Input
								name="nfts"
								max={props.balance}
								min={0}
								step={1}
								type="number"
								onChange={(e) => setAmount(Number(e.target.value))}
								value={amount}
							/>
							<Text>
								<SmallText>
									You have {props.balance} NFT editions in your wallet
								</SmallText>
							</Text>
						</Container>
					</Container>
					<Container className="flex justify-end gap-4">
						<Button
							appearance={"surface"}
							onClick={props.onClose}
						>
							Cancel
						</Button>
						<Button
							disabled={!sendTo && !amount}
							appearance={!sendTo && !amount ? "disabled" : "action"}
							onClick={transferNFTAction}
						>
							Transfer
						</Button>
					</Container>
				</Container>
			</GenericChainModal>
		</>
	);
}
