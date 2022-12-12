import {pagePropsConnectMongoDB} from "@db/engine/pagePropsDB";
import LegacyNFTModel from "@db/legacy/nft/NFT";
import useGetCreatorNftCost from "@packages/chain/hooks/useGetCreatorNftCost";
import useGetFreeCreatorTreat from "@packages/chain/hooks/useGetFreeCreatorTreat";
import useGetFreeSubscriberTreat from "@packages/chain/hooks/useGetFreeSubscriberTreat";
import useGetFreeTreat from "@packages/chain/hooks/useGetFreeTreat";
import useGetIsSubscribed from "@packages/chain/hooks/useGetIsSubscribed";
import useGetNftMaxSupply from "@packages/chain/hooks/useGetNftMaxSupply";
import useGetNftTotalSupply from "@packages/chain/hooks/useGetNftTotalSupply";
import useGetOpenOrdersForNft from "@packages/chain/hooks/useGetOpenOrdersForNft";
import useGetSubscriberNftCost from "@packages/chain/hooks/useGetSubscriberNftCost";
import useGetTreatNFTCost from "@packages/chain/hooks/useGetTreatNftCost";
import useMintCreatorNft from "@packages/chain/hooks/useMintCreatorNft";
import useMintNft from "@packages/chain/hooks/useMintNft";
import useMintSubscriberNft from "@packages/chain/hooks/useMintSubscriberNft";
import {getCreatorNftCost, getSubscriberNftCost} from "@packages/chain/utils";
import Error404 from "@packages/error/404";
import {useDisclosure} from "@packages/hooks";
import FullScreenImagePreview from "@packages/modals/FullScreenImagePreview";
import {TPost} from "@packages/post/types";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import OptimizedImage from "@packages/shared/components/OptimizedImage";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	MutedText,
} from "@packages/shared/components/Typography/Text";
import {timeFromNow} from "@utils/index";
import BigNumber from "bignumber.js";
import UserAvatar from "core/auth/components/Avatar";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import Link from "next/link";
import {useState} from "react";
import {MongoModelTransaction} from "server/helpers/models";
import {useAccount} from "wagmi";

export default function NFT(props: {notFound?: boolean; data: any}) {
	const {
		isOpen: isFullscreenPreviewOpen,
		onOpen: onOpenFullscreenPreview,
		onClose: onCloseFullscreenPreview,
	} = useDisclosure();

	if (props.notFound) {
		return <Error404 />;
	}

	const data = JSON.parse(props.data);
	const {nft, mints} = data;

	return (
		<>
			<FullScreenImagePreview
				isOpen={isFullscreenPreviewOpen}
				onClose={onCloseFullscreenPreview}
				imageUrl={nft.image}
				alt={nft.name}
			/>
			<Container
				className="w-full 2xl:h-[80vh] lg:h-[90vh] h-[calc(100vh-64px)] flex items-center justify-center"
				css={{backgroundColor: "$surfaceOnSurface"}}
			>
				<Container className="flex-1 h-full py-32 max-w-7xl">
					<Container
						className="relative w-full h-full"
						onClick={onOpenFullscreenPreview}
					>
						<OptimizedImage
							src={nft.image}
							className="cursor-zoom-in"
							sizes="100vw"
							fill
							objectFit="contain"
							alt={nft.name}
						/>
					</Container>
				</Container>
			</Container>
			<ApplicationLayout>
				<ApplicationFrame>
					<Container className="grid grid-cols-1 gap-8 px-4 lg:grid-cols-2 xl:px-0">
						<Container className="flex flex-col gap-12 py-8">
							<Container className="flex flex-col gap-4">
								<MutedText>
									<ImportantText>
										Remaining: {nft.max_supply - (nft.mints?.length ?? 0)} /{" "}
										{nft.max_supply}
									</ImportantText>
								</MutedText>
								<Heading size="sm">{nft.name}</Heading>
								<Link href={`/${nft.model_handle}`}>
									<a>
										<Container className="flex">
											<Container
												className="flex items-center gap-2 px-4 py-2 border rounded-full"
												css={{
													borderColor: "$subtleBorder",
													backgroundColor: "$surfaceOnSurface",
												}}
											>
												<UserAvatar
													value={nft.model_handle}
													size={24}
												/>
												<Text>
													<ImportantText>@{nft.model_handle}</ImportantText>
												</Text>
											</Container>
										</Container>
									</a>
								</Link>
							</Container>
							<Container className="flex flex-col gap-4">
								<Heading size="xs">Description</Heading>
								<Text>{nft.description}</Text>
							</Container>
						</Container>
						<Container className="flex flex-col gap-12 py-8">
							<Container
								className="p-4 border"
								css={{borderColor: "$subtleBorder", borderRadius: "16px"}}
							>
								<Container className="flex flex-col gap-8">
									<Container className="flex flex-col gap-1">
										<Text>
											<MutedText>List price</MutedText>
										</Text>
										<Heading size="md">{nft.list_price} BNB</Heading>
									</Container>
									<Container>
										{nft.mints?.length === Number(nft.max_supply) ? (
											<Button
												fullWidth
												appearance={"subtle"}
												disabled
											>
												Sold out
											</Button>
										) : (
											<Button fullWidth>Buy now</Button>
										)}
									</Container>
								</Container>
							</Container>
							<Container className="flex flex-col gap-4">
								<Heading size="xs">Purchase history</Heading>
								<Container className="grid grid-cols-1 gap-6">
									{mints.map((tx) => (
										<Link
											key={tx.txHash}
											href={`https://bscscan.com/tx/${tx.txHash}`}
										>
											<a>
												<Container className="flex gap-2">
													<UserAvatar
														value={tx.metadata.balanceSender}
														size={24}
													/>
													<Container className="flex flex-col gap-1">
														<Text>
															<ImportantText>
																{tx.metadata.balanceSender} purchased for{" "}
																{tx.amount} BNB
															</ImportantText>
														</Text>
														<MutedText>{timeFromNow(tx.timestamp)}</MutedText>
													</Container>
												</Container>
											</a>
										</Link>
									))}
								</Container>
							</Container>
						</Container>
					</Container>
				</ApplicationFrame>
			</ApplicationLayout>
		</>
	);
}

const ViewNFT = ({nftData}: {nftData: any; account: string}) => {
	const totwNftCost = useGetTreatNFTCost(nftData.id);
	const creatorNftCost = useGetCreatorNftCost(nftData.id);
	const subscriberNftCost = useGetSubscriberNftCost(nftData.id);

	let nftCost: any = nftData.subscription_nft
		? subscriberNftCost
		: creatorNftCost;
	nftCost = nftData.totm_nft ? totwNftCost : nftCost;

	const {onMintNft: onMintTOTMNft} = useMintNft(nftData.id, nftCost);
	const {onMintCreatorNft} = useMintCreatorNft(nftData.id, nftCost);
	const {onMintSubscriberNft} = useMintSubscriberNft(nftData.id, nftCost);

	const {onGetFreeTreat} = useGetFreeTreat(nftData.id, nftCost);
	const {onGetFreeCreatorTreat} = useGetFreeCreatorTreat(nftData.id, nftCost);
	const {onGetFreeSubscriberTreat} = useGetFreeSubscriberTreat(
		nftData.id,
		nftCost
	);

	const maxNftSupply = useGetNftMaxSupply(nftData.id);
	const mintedNfts = useGetNftTotalSupply(nftData.id);
	const listedOnResale = useGetOpenOrdersForNft(nftData.id) ?? [];

	const remainingNfts = maxNftSupply.minus(mintedNfts);

	const cheapestListedOnResale = new BigNumber(
		listedOnResale.reduce(
			(lowest, order, index) => {
				const price = new BigNumber(order.price);
				const lowestPrice = new BigNumber(lowest.price);
				if (index === 0) return order;
				return price.lt(lowestPrice) ? order : lowest;
			},
			{price: 0}
		).price
	);

	const onMintNft = async () => {
		if (nftData.subscription_nft) return onMintSubscriberNft();
		if (nftData.totm_nft) {
			return await onMintTOTMNft();
		} else {
			return await onMintCreatorNft();
		}
	};

	const onMintFreeNft = async () => {
		if (nftData.subscription_nft) return onGetFreeSubscriberTreat();
		if (nftData.totm_nft) {
			return await onGetFreeTreat();
		} else {
			return await onGetFreeCreatorTreat();
		}
	};

	return (
		<>
			<RedeemButton
				onMintNft={nftData.price === 0 ? onMintFreeNft : onMintNft}
				remainingNfts={remainingNfts}
				nftData={nftData}
			/>
		</>
	);
};

const RedeemButton = ({onMintNft, remainingNfts, nftData}) => {
	const {address: account} = useAccount();
	const {isOpen, onOpen, onClose} = useDisclosure();

	const [loading, setLoading] = useState(false);
	const [confirmWallet, setConfirmWallet] = useState(false);
	// TODO: Change @param this to creator address
	const isSubscribed = useGetIsSubscribed(nftData.model_bnb_address || "");

	const nftsRemaining = remainingNfts.toNumber();
	const nftSoldOut =
		remainingNfts.toNumber() === 0 || remainingNfts.toNumber() < 0;
	const isTOTMNFT = nftData.totm_nft;
	const isSubscriptionNFT = nftData.subscription_nft;
	const isRegularNFTBuyEnabled =
		!nftSoldOut && !isTOTMNFT && !isSubscriptionNFT;

	const redeemDisabled =
		loading ||
		nftSoldOut ||
		isNaN(nftsRemaining) ||
		isTOTMNFT ||
		(isSubscriptionNFT && !isSubscribed);

	const redeemNFT = async () => {
		setLoading(true);
		setConfirmWallet(true);

		const txHash = await onMintNft();

		if (!txHash) {
			setLoading(false);
			return;
		}

		setConfirmWallet(false);
		onOpen();

		const mint = {
			transactionHash: txHash.transactionHash,
			nftId: nftData.id,
			buyer: account,
			price: nftData.list_price,
			timestamp: new Date(),
		};
		localStorage.setItem("tx", JSON.stringify(mint));
		setLoading(false);
	};

	if (nftData.melon_nft) return null;

	return (
		<Button
			className="bg-primary text-white font-bold"
			fullWidth
			css={{borderRadius: "16px"}}
			appearance={redeemDisabled ? "disabled" : "primary"}
			disabled={redeemDisabled}
			onClick={redeemNFT}
		>
			{loading ? (
				confirmWallet ? (
					"Please confirm in your wallet and wait"
				) : (
					"Please wait..."
				)
			) : (
				<ImportantText>
					{nftSoldOut || isNaN(nftsRemaining) ? (
						<>Sold Out</>
					) : (
						<>
							{isRegularNFTBuyEnabled && `Buy Now`}
							{isTOTMNFT && `Buy TOTM NFT`}
							{isSubscriptionNFT && !nftSoldOut && `Buy Subscription NFT`}
						</>
					)}
				</ImportantText>
			)}
		</Button>
	);
};

export const getServerSideProps = async (context) => {
	const {id} = context.params;

	await pagePropsConnectMongoDB();

	const nft = await LegacyNFTModel.findOne({id});

	if (!nft) {
		return {
			notFound: true,
		};
	}

	const transactions = await MongoModelTransaction.find({
		"metadata.nftId": id,
	});

	const returnObj = {
		id,
		mints: transactions,
		nft: nft,
	};

	return {
		props: {
			data: JSON.stringify(returnObj),
		},
	};
};
