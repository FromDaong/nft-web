/* eslint-disable no-mixed-spaces-and-tabs */
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
import {SkeletonTritCollectiblePost, TritPost} from "@packages/post/TritPost";
import {TPost} from "@packages/post/types";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import OptimizedImage from "@packages/shared/components/OptimizedImage";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	MutedText,
} from "@packages/shared/components/Typography/Text";
import {apiEndpoint, legacy_nft_to_new, timeFromNow} from "@utils/index";
import axios from "axios";
import BigNumber from "bignumber.js";
import UserAvatar from "core/auth/components/Avatar";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import TreatCore from "core/TreatCore";
import Link from "next/link";
import {useState} from "react";
import {MongoModelTransaction} from "server/helpers/models";
import {useAccount} from "wagmi";

const getYouMightAlsoLike = async () => {
	const res = await axios.get(`${apiEndpoint}/marketplace/trending`);
	return res.data.data;
};

export default function NFT(props: {notFound?: boolean; data: any}) {
	const {
		isOpen: isFullscreenPreviewOpen,
		onOpen: onOpenFullscreenPreview,
		onClose: onCloseFullscreenPreview,
	} = useDisclosure();

	const {
		isLoading: youMightAlsoLikeLoading,
		error: youMightAlsoLikeError,
		data: youMightAlsoLikeData,
	} = TreatCore.useQuery({
		queryKey: ["youMightAlsoLikeNFTs"],
		queryFn: getYouMightAlsoLike,
	});

	if (props.notFound) {
		return <Error404 />;
	}

	const data = JSON.parse(props.data);
	const {nft, mints} = data;

	const trendingNFTs =
		youMightAlsoLikeError || youMightAlsoLikeLoading
			? []
			: youMightAlsoLikeData?.map((post) => legacy_nft_to_new(post));

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
				<Container className="container flex-1 h-full py-32">
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
					<Container className="flex flex-col gap-24">
						<Container className="grid grid-cols-1 gap-8 px-4 lg:grid-cols-2 xl:px-0">
							<Container className="flex flex-col gap-12 py-8">
								<Container className="flex flex-col gap-4">
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
								<Container className="flex flex-col gap-4">
									<Heading size="xs">Tags</Heading>
									<Text>{nft.description}</Text>
								</Container>
								<Container className="flex flex-col gap-4">
									<Heading size="xs">NFT Details</Heading>
									<Text>{nft.description}</Text>
								</Container>
							</Container>
							<Container className="flex flex-col gap-12 py-8">
								<Container className="flex flex-col w-full max-w-lg gap-2">
									<MutedText>
										<ImportantText>
											Remaining: {nft.max_supply - (nft.mints?.length ?? 0)} /{" "}
											{nft.max_supply}
										</ImportantText>
									</MutedText>
									<Button>Buy now for {nft.list_price} BNB</Button>
								</Container>

								<Container className="flex flex-col gap-4">
									<Heading size="xs">Listed for resale</Heading>
									<Container className="grid grid-cols-1 gap-6">
										{mints.slice(0, 4).map((tx) => (
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
						<Container className="flex flex-col gap-12">
							<Container className="flex flex-col gap-4">
								<Heading size="sm">People also bought</Heading>
							</Container>
							<Container className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
								{!youMightAlsoLikeError && !youMightAlsoLikeLoading
									? trendingNFTs.slice(0, 4).map((item) => (
											<TritPost
												key={item}
												inGrid
												{...item}
											/>
									  ))
									: [0, 1, 2, 3].map((i) => (
											<Container
												key={i}
												className="col-span-1 border"
												css={{
													borderColor: "$subtleBorder",
													padding: "8px",
													borderRadius: "16px",
												}}
											>
												<SkeletonTritCollectiblePost />
											</Container>
									  ))}
							</Container>
						</Container>
						<Container className="flex flex-col gap-12">
							<Container className="flex flex-col gap-4">
								<Heading size="sm">More from this creator</Heading>
							</Container>
							<Container className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
								<Link href={`/${nft.model_handle}`}>
									<a>
										<Container className="flex flex-col gap-8">
											<UserAvatar
												value={nft.model_handle}
												size={80}
											/>

											<Container className="flex flex-col gap-2">
												<Heading size="sm">{nft.name} </Heading>
												<Text>@{nft.model_handle}</Text>
											</Container>
											<Text>{nft.description}</Text>
										</Container>
									</a>
								</Link>
								{!youMightAlsoLikeError && !youMightAlsoLikeLoading
									? trendingNFTs.slice(0, 3).map((item) => (
											<TritPost
												key={item}
												inGrid
												{...item}
											/>
									  ))
									: [0, 1, 2].map((i) => (
											<Container
												key={i}
												className="col-span-1 border"
												css={{
													borderColor: "$subtleBorder",
													padding: "8px",
													borderRadius: "16px",
												}}
											>
												<SkeletonTritCollectiblePost />
											</Container>
									  ))}
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
			className="font-bold text-white bg-primary"
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
