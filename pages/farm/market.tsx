/* eslint-disable no-mixed-spaces-and-tabs */
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import {
	useAccount,
	useBalance,
	useContract,
	useWaitForTransaction,
} from "wagmi";
import {contractAddresses} from "@packages/treat/lib/treat-contracts-constants";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {ABI} from "@packages/treat/lib/abi";
import Spinner from "@packages/shared/icons/Spinner";
import Staking from "@packages/farm/Staking";
import TreatCore from "core/TreatCore";
import axios from "axios";
import {apiEndpoint, legacy_nft_to_new} from "@utils/index";
import FarmNFT from "@components/NFTCard/cards/FarmNFT";
import {Button} from "@packages/shared/components/Button";
import {ArrowRight, Sparkles} from "lucide-react";
import useBuyMelonNft from "@packages/chain/hooks/useBuyMelonNft";
import {useDisclosure} from "@packages/hooks";
import GenericChainModal from "@packages/modals/GenericChainModal";
import {useEffect, useState} from "react";
import {Divider} from "@packages/shared/components/Divider";
import {toast} from "sonner";
import Link from "next/link";

// T-78 Use inters
export default function Market() {
	const [txHash, setTxHash] = useState<string>("");
	const {data, isError: isErrorTreatNFTCost} = useWaitForTransaction({
		hash: txHash,
	});
	const {onBuyMelonNft} = useBuyMelonNft();

	const {isOpen, onOpen, onClose} = useDisclosure();
	const {
		isOpen: isMintSuccess,
		onOpen: onMintSuccess,
		onClose: onCloseMintSuccess,
	} = useDisclosure();
	const {
		isOpen: isMintError,
		onOpen: onMintError,
		onClose: onCloseMintError,
	} = useDisclosure();

	const onMintMelonNFT = async () => {
		onOpen();
		try {
			const tx = await onBuyMelonNft();
			setTxHash(tx.hash);
		} catch (err) {
			toast.error(`Mint failed with reason: ${err.reason}`);
			onClose();
		}
	};

	useEffect(() => {
		if (data) {
			onClose();
			onMintSuccess();
		} else if (isErrorTreatNFTCost) {
			onClose();
			onMintError();
		}
	}, [data]);
	return (
		<ApplicationLayout>
			{isOpen && (
				<GenericChainModal
					isOpen={isOpen}
					onClose={() => null}
					title="Waiting for Transaction Confirmation ⌛"
					subtitle="Please confirm this transaction in your wallet and wait here for up to a few minutes for the transaction to confirm..."
					loading
					hideClose
					noButton
				/>
			)}
			{isMintSuccess && (
				<GenericChainModal
					isOpen={isMintSuccess}
					onClose={onCloseMintSuccess}
					title="Transaction Confirmed ✅"
					subtitle="Your NFT has been minted and is now available in your wallet!"
					noButton
				>
					<Text>
						You can view your NFT in your wallet by clicking the button below.
					</Text>
				</GenericChainModal>
			)}
			{isMintError && (
				<GenericChainModal
					isOpen={isMintError}
					onClose={onCloseMintError}
					title="An error occurred 😢"
					subtitle="We were unable to mint your NFT. Please try again later."
					noButton
				>
					<Text>
						If this error persists, please contact the team on Telegram.
					</Text>
				</GenericChainModal>
			)}
			<ApplicationFrame>
				<Container className="h-auto">
					<Container className="py-8 flex flex-col gap-2 mt-4 items-start">
						<Heading size={"sm"}>Farmers' 🍈 Market</Heading>
						<Text css={{fontSize: "1.2rem"}}>
							Redeem a random NFT from the pool of exclusive NFTs listed below
							for 10 $Melon. nge $Melon at the Farmers' Market to get exclusive
							NFTs.
						</Text>
						<Container className="w-full mt-4 flex flex-col md:flex-row gap-4 md:gap-2 justify-between items-end">
							<Link href={"/farm/market"}>
								<a className="mt-4">
									<Button>
										Go to Farming Dashboard <ArrowRight className="w-5 h-5" />
									</Button>
								</a>
							</Link>
							<Button
								onClick={onMintMelonNFT}
								appearance={"success"}
							>
								<Sparkles className="w-4 h-4" />
								Mint exclusive NFT
							</Button>
						</Container>
						<Divider />
					</Container>
					<FarmersMarket />
				</Container>
			</ApplicationFrame>
		</ApplicationLayout>
	);
}

const FarmersMarket = () => {
	const {data, isLoading, isError} = TreatCore.useQuery(
		["melon_nfts"],
		async () => {
			try {
				const res = await axios.get(`${apiEndpoint}/marketplace/melon`);
				return res.data.data.map((nft) =>
					legacy_nft_to_new({
						...nft,
						price: 0,
					})
				);
			} catch (err) {
				console.error(err);
				return [];
			}
		}
	);

	if (isLoading) return <Spinner />;
	return (
		<Container className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-8">
			{data.map((nft) => (
				<FarmNFT
					{...nft}
					key={nft._id}
				/>
			))}
		</Container>
	);
};
