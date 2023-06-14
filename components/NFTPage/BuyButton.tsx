import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import Spinner from "@packages/shared/icons/Spinner";
import {useConnectModal} from "@rainbow-me/rainbowkit";
import {useCallback, useEffect, useState} from "react";
import {useAccount, useWaitForTransaction} from "wagmi";
import useGetIsSubscribed from "@packages/chain/hooks/useGetIsSubscribed";
import {Text} from "@packages/shared/components/Typography/Text";
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
import {BuyButtonProps} from "@packages/post/hooks/helpers";
import {BigNumber} from "ethers";
import Web3 from "web3";
import {formatBlockchainResponse} from "./ResaleBuyButton";

const BuyButton = ({nftData, postUtils, callback}) => {
	const {address, status} = useAccount();
	const isSubscribed = useGetIsSubscribed(address);

	if (status === "disconnected") return <ConnectWalletButton />;

	if (nftData.subscription_nft && !isSubscribed)
		return (
			<Container className="flex flex-col gap-2">
				<Button
					fullWidth
					appearance={"disabled"}
					disabled
					outlined
					css={{
						color: "$sand11",
						backgroundColor: "$sand2",
					}}
				>
					Collect
				</Button>
				<Text>Buying subscription sets is not yet supported</Text>
			</Container>
		);

	if (nftData.id < process.env.NEXT_PUBLIC_V2_NFT_START)
		return (
			<Button
				appearance={"disabled"}
				disabled
				css={{color: "$red11", backgroundColor: "$red2"}}
			>
				<ExclamationCircleIcon className="w-5 h-5" />
				Buying v1 NFT is not supported
			</Button>
		);

	if (nftData.melon_nft)
		return (
			<Container className="flex flex-col gap-2">
				<Link href={"/farm/market"}>
					<a>
						<Button
							fullWidth
							css={{
								backgroundColor: "$mint11",
								color: "$mint2",
							}}
						>
							<GiftIcon className="w-5 h-5" />
							Go to Farmer's 🍈 market <ArrowRight className="w-5 h-5" />
						</Button>
					</a>
				</Link>
			</Container>
		);

	if (!nftData.currentTOTM && nftData.totm_nft) {
		return (
			<Container>
				<Button appearance={"danger"}>
					<ExclamationCircleIcon className="w-5 h-5" />
					Minting is no longer available
				</Button>
			</Container>
		);
	}

	return (
		<Container className="flex flex-col w-full">
			<PurchaseButtonWrapper
				{...nftData}
				postUtils={postUtils}
				creator={nftData.creator}
				callback={callback}
			/>
		</Container>
	);
};

const PurchaseButtonWrapper = (nft: BuyButtonProps, callback) => {
	console.log(nft);
	const {address} = useAccount();
	const [txHash, setTxHash] = useState("");
	const [loading, setLoading] = useState(false);

	const {isError, isLoading, data, error} = useWaitForTransaction({
		hash: txHash,
	});

	const cost = BigNumber.from(Web3.utils.toWei(nft.price.toString(), "ether"));
	const isMinting = isLoading || loading;

	const {onMintNft: onMintTotwNft} = useMintNft(nft.id, nft.price.value);
	const {onMintCreatorNft} = useMintCreatorNft(
		nft.id,
		BigNumber.from(Web3.utils.toWei(nft.price.toString(), "ether"))
	);
	const {onMintSubscriberNft} = useMintSubscriberNft(nft.id, cost);

	const {onGetFreeTreat} = useGetFreeTreat(nft.id);
	const {onGetFreeCreatorTreat} = useGetFreeCreatorTreat(nft.id);
	const {onGetFreeSubscriberTreat} = useGetFreeSubscriberTreat(nft.id);

	const onMintNft = useCallback(async () => {
		try {
			if (nft.subscription_nft) return onMintSubscriberNft();
			if (nft.currentTOTM) {
				return await onMintTotwNft();
			} else {
				return await onMintCreatorNft();
			}
		} catch (err) {
			toast.error(
				formatBlockchainResponse(`${err.reason ?? err.data?.message}.`)
			);
		}
	}, [nft]);

	const onMintFreeNft = useCallback(async () => {
		console.log("minting free nft");
		try {
			if (nft.subscription_nft) return onGetFreeSubscriberTreat();
			if (nft.currentTOTM) {
				return await onGetFreeTreat();
			} else {
				return await onGetFreeCreatorTreat();
			}
		} catch (err) {
			if (err.reason === "execution reverted: treat not found") {
				toast.error("Smart contract error: Token not found.");
			} else {
				toast.error(
					formatBlockchainResponse(`${err.reason ?? err.data?.message}.`)
				);
			}
		}
	}, [nft]);

	const payAndMintNFT = () => {
		setLoading(true);
		onMintNft()
			.then((res) => setTxHash(res.hash))
			.catch(async () => {
				setLoading(false);
			});
	};

	const mintFreeNFT = () => {
		setLoading(true);
		onMintFreeNft()
			.then((res) => setTxHash(res.hash))
			.catch(async () => {
				setLoading(false);
			});
	};

	useEffect(() => {
		if (data || isError) {
			if (data) {
				callback();
			}

			if (isError) {
				toast.error(`An error occurred: ${error}.`);
			}

			setLoading(false);
		}
	}, [data, isError]);

	if (!address) return null;

	if (isMinting) return <LoadingButton />;

	if (nft.price === 0) return <RedeemFreeNFT mint={mintFreeNFT} />;

	return (
		<PayAndRedeemButton
			nft={nft}
			mint={payAndMintNFT}
		/>
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

export const ConnectWalletButton = () => {
	const {openConnectModal} = useConnectModal();
	return <Button onClick={openConnectModal}>Connect wallet</Button>;
};

export default BuyButton;
