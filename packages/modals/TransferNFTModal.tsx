import {useTransferNFTs} from "@packages/post/hooks";
import {TritPostProps} from "@packages/post/types";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Input} from "@packages/shared/components/Input";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	MutedText,
} from "@packages/shared/components/Typography/Text";
import {useUser} from "core/auth/useUser";
import {useRouter} from "next/router";
import {useState} from "react";
import {useSigner, useWaitForTransaction} from "wagmi";
import GenericChainModal from "./GenericChainModal";
import {Modal} from ".";
import {toast} from "sonner";

export default function TransferNFTModal(props: {
	onClose: any;
	isOpen: any;
	nft: TritPostProps;
	balance: number;
}) {
	const router = useRouter();
	const {data: signer} = useSigner();
	const [transferNFTPending, setTransferNFTPending] = useState(false);
	const [transferNFTSuccess, setTransferNFTSuccess] = useState(false);
	const [transferNFTError, setTransferNFTError] = useState(false);
	const [txHash, setTxHash] = useState("");
	const {isSuccess: isTransferNFTSuccess, isError: isTransferNFTError} =
		useWaitForTransaction({
			hash: txHash,
		});

	const [sendTo, setSendTo] = useState("");
	const [amount, setAmount] = useState(1);

	const {transferNFT} = useTransferNFTs(signer);

	const transferNFTAction = async () => {
		setTransferNFTPending(true);

		transferNFT(sendTo, Number(props.nft.id), amount)
			.then((tx) => setTxHash(tx.hash))
			.then(() => {
				setTransferNFTPending(false);
				setTransferNFTSuccess(true);
			})
			.catch((err) => {
				setTransferNFTPending(false);
				setTransferNFTError(err);
				toast.error(err.message);
			});
	};

	return (
		<>
			<GenericChainModal
				isOpen={
					transferNFTPending || (!isTransferNFTSuccess && !isTransferNFTError)
				}
				title={"Sending NFT to another wallet"}
				subtitle={"Please wait, we are transferring your NFT."}
				hideClose
				noButton
				loading
				onClose={() => {
					props.onClose();
				}}
			/>

			<GenericChainModal
				isOpen={!transferNFTPending && isTransferNFTSuccess}
				title="NFT transferred"
				subtitle={"Successfully transferred your NFT to another wallet."}
				buttonLabel="Close"
				onClose={router.reload}
				action={router.reload}
				hideClose
			/>

			<GenericChainModal
				isOpen={!!transferNFTError || isTransferNFTError}
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

			<Modal
				isOpen={
					props.isOpen &&
					!transferNFTPending &&
					!transferNFTSuccess &&
					!transferNFTError
				}
				onClose={() => {
					props.onClose();
				}}
			>
				<Container className="flex flex-col gap-8 p-8">
					<Container>
						<Heading size={"xs"}>Send NFT to wallet</Heading>
						<MutedText>
							Send your NFT to another BSC wallet. Please make sure wallet
							address is on the Binance Smart Chain
						</MutedText>
					</Container>
					<Container className="flex flex-col gap-4">
						<Container className="flex flex-col gap-2">
							<Text>
								<ImportantText>Wallet address</ImportantText>
							</Text>
							<Input
								name="wallet"
								appearance={"solid"}
								type="text"
								onChange={(e) => setSendTo(e.target.value)}
								value={sendTo}
							/>
						</Container>
						<Container className="flex flex-col gap-2">
							<Text>
								<ImportantText>Amount</ImportantText>
							</Text>
							<Input
								name="nfts"
								appearance={"solid"}
								max={props.balance}
								min={0}
								step={1}
								type="number"
								onChange={(e) => setAmount(Number(e.target.value))}
								value={amount}
							/>
							<MutedText>
								You have {props.balance} NFTs in your wallet
							</MutedText>
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
			</Modal>
		</>
	);
}
