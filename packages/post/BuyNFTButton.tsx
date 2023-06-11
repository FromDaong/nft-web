import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import Spinner from "@packages/shared/icons/Spinner";
import {useConnectModal} from "@rainbow-me/rainbowkit";
import {useCallback, useEffect, useState} from "react";
import {useAccount, useWaitForTransaction} from "wagmi";
import {BuyButtonProps} from "./hooks/helpers";
import useGetIsSubscribed from "@packages/chain/hooks/useGetIsSubscribed";
import {Text} from "@packages/shared/components/Typography/Text";
import {SparklesIcon} from "@heroicons/react/solid";
import CoinsIcon from "@packages/shared/icons/CoinsIcon";
import Link from "next/link";
import {ArrowRight} from "lucide-react";
import {toast} from "sonner";
import {ExclamationCircleIcon, GiftIcon} from "@heroicons/react/outline";
import useMintNft from "@packages/chain/hooks/useMintNft";
import useMintCreatorNft from "@packages/chain/hooks/useMintCreatorNft";
import useMintSubscriberNft from "@packages/chain/hooks/useMintSubscriberNft";
import useGetFreeTreat from "@packages/chain/hooks/useGetFreeTreat";
import useGetFreeCreatorTreat from "@packages/chain/hooks/useGetFreeCreatorTreat";
import useGetFreeSubscriberTreat from "@packages/chain/hooks/useGetFreeSubscriberTreat";
import useGetTreatNFTCost from "@packages/chain/hooks/useGetTreatNftCost";
import {useContracts} from "./hooks";
import useGetCreatorNftCost from "@packages/chain/hooks/useGetCreatorNftCost";
import useGetSubscriberNftCost from "@packages/chain/hooks/useGetSubscriberNftCost";

const ConnectWalletButton = () => {
	const {openConnectModal} = useConnectModal();
	return (
		<Button
			fullWidth
			onClick={openConnectModal}
		>
			Connect wallet
		</Button>
	);
};

const LoadingButton = () => {
	return (
		<Button
			fullWidth
			key={"loadingBtn"}
			appearance={"disabled"}
			disabled
		>
			<Spinner /> Please wait ...
		</Button>
	);
};

const RedeemFreeNFT = ({mint}) => {
	return (
		<Button
			fullWidth
			onClick={mint}
		>
			<CoinsIcon className="w-5 h-5" />
			Collect for free
		</Button>
	);
};

const PayAndRedeemButton = ({nft, mint}) => {
	return (
		<Button
			fullWidth
			key={"buyBtn"}
			onClick={mint}
			appearance={nft.totm_nft ? "accent" : "default"}
		>
			<CoinsIcon className="w-5 h-5" /> Collect for {nft.price} BNB
		</Button>
	);
};

const PurchaseButtonWrapper = (nft: BuyButtonProps) => {
	const {address} = useAccount();
	const [txHash, setTxHash] = useState("");
	const [loading, setLoading] = useState(false);

	const {isError, isLoading, data, error} = useWaitForTransaction({
		hash: txHash,
	});

	const {creatorMartContract, totmMartContract, subscriptionsMart} =
		useContracts();
	const totwNftCost = useGetTreatNFTCost(totmMartContract, nft.id);
	const creatorNftCost = useGetCreatorNftCost(creatorMartContract, nft.id);
	const subscriberNftCost = useGetSubscriberNftCost(subscriptionsMart, nft.id);

	let nftCost = nft.totm_nft ? totwNftCost : creatorNftCost;
	nftCost = nft.subscription_nft ? subscriberNftCost : nftCost;
	nftCost = nft.totm_nft ? totwNftCost : nftCost;
	const cost = nftCost.toNumber();
	const isMinting = isLoading || loading;

	const {onMintNft: onMintTotwNft} = useMintNft(nft.id, cost);
	const {onMintCreatorNft} = useMintCreatorNft(nft.id, cost);
	const {onMintSubscriberNft} = useMintSubscriberNft(nft.id, cost);

	const {onGetFreeTreat} = useGetFreeTreat(nft.id, cost);
	const {onGetFreeCreatorTreat} = useGetFreeCreatorTreat(nft.id, cost);
	const {onGetFreeSubscriberTreat} = useGetFreeSubscriberTreat(nft.id, cost);

	const onMintNft = useCallback(async () => {
		try {
			if (nft.subscription_nft) return onMintSubscriberNft();
			if (nft.totm_nft) {
				return await onMintTotwNft();
			} else {
				return await onMintCreatorNft();
			}
		} catch (err) {
			toast.error(`An error occurred: ${err.reason}.`);
		}
	}, [nft]);

	const onMintFreeNft = useCallback(async () => {
		try {
			if (nft.subscription_nft) return onGetFreeSubscriberTreat();
			if (nft.totm_nft) {
				return await onGetFreeTreat();
			} else {
				return await onGetFreeCreatorTreat();
			}
		} catch (err) {
			toast.error(`An error occurred: ${err.reason}.`);
		}
	}, [nft]);

	const payAndMintNFT = () => {
		setLoading(true);
		onMintNft()
			.then((res) => setTxHash(res.hash))
			.catch(async (err) => {
				setLoading(false);
				const error =
					err.code === -32603
						? "Insufficient funds"
						: err.code === "UNPREDICTABLE_GAS_LIMIT"
						? "Unpredictable gas limit. Check your balance"
						: "Blockchain error";
			});
	};

	const mintFreeNFT = () => {
		setLoading(true);
		onMintFreeNft()
			.then((res) => setTxHash(res.hash))
			.catch(async (err) => {
				setLoading(false);
				const error =
					err.code === -32603
						? "Insufficient funds"
						: err.code === "UNPREDICTABLE_GAS_LIMIT"
						? "Unpredictable gas limit. Check your balance"
						: "Blockchain error";
				toast.error(`An error occurred: ${error}.`);
			});
	};

	useEffect(() => {
		if (data || isError) {
			if (data) {
				console.log({data});
			}

			if (isError) {
				console.log({error});
				//trigger error
			}

			setLoading(false);
		}
	}, [data, isError]);

	if (!address) return null;

	if (isMinting) return <LoadingButton />;

	if (cost === 0) <RedeemFreeNFT mint={mintFreeNFT} />;

	return (
		<PayAndRedeemButton
			nft={nft}
			mint={payAndMintNFT}
		/>
	);
};

const BuyNFTButton = ({nftData, postUtils}) => {
	const {address, status} = useAccount();
	const isSubscribed = useGetIsSubscribed(address);

	if (status === "disconnected") return <ConnectWalletButton />;

	if (nftData.id < process.env.NEXT_PUBLIC_V2_NFT_START)
		return (
			<Button
				appearance={"disabled"}
				disabled
				css={{color: "$red11"}}
			>
				<ExclamationCircleIcon className="w-5 h-5" />
				Buying v1 NFT is not supported
			</Button>
		);
	if (nftData.melon_nft) {
		return (
			<Container className="flex flex-col gap-2">
				<Link href={"/studio/farm"}>
					<a>
						<Button
							fullWidth
							css={{
								backgroundColor: "$mint11",
								color: "$mint2",
							}}
						>
							<GiftIcon className="w-5 h-5" />
							Check out on Farm <ArrowRight className="w-5 h-5" />
						</Button>
					</a>
				</Link>
			</Container>
		);
	}

	if (nftData.subscription_nft && !isSubscribed) {
		return (
			<Container className="flex flex-col gap-2">
				<Button
					fullWidth
					appearance={"disabled"}
					disabled
				>
					Collect
				</Button>
				<Text>Buying subscription sets is not supported</Text>
			</Container>
		);
	}

	return (
		<Container className="flex flex-col w-full">
			<PurchaseButtonWrapper
				{...nftData}
				postUtils={postUtils}
				creator={nftData.creator}
			/>
		</Container>
	);
};

export default BuyNFTButton;
