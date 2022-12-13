/* eslint-disable no-mixed-spaces-and-tabs */
import {pagePropsConnectMongoDB} from "@db/engine/pagePropsDB";
import LegacyNFTModel from "@db/legacy/nft/NFT";
import {EvmNftMetadata} from "@moralisweb3/common-evm-utils";
import {
	useWagmiGetCreatorNftCost,
	useWagmiGetNFTMaxSupply,
	useWagmiGetSubscriberNftCost,
	useWagmiGetTreatOfTheMonthNftCost,
	useWagmiGetNFTTotalSupply,
	useWagmiGetResaleNFTsForNFT,
} from "@packages/chain/hooks";
import useGetCreatorNftCost from "@packages/chain/hooks/useGetCreatorNftCost";
import useGetFreeCreatorTreat from "@packages/chain/hooks/useGetFreeCreatorTreat";
import useGetFreeSubscriberTreat from "@packages/chain/hooks/useGetFreeSubscriberTreat";
import useGetFreeTreat from "@packages/chain/hooks/useGetFreeTreat";
import useGetIsSubscribed from "@packages/chain/hooks/useGetIsSubscribed";
import useGetNftCreator from "@packages/chain/hooks/useGetNftCreator";
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
import {Divider} from "@packages/shared/components/Divider";
import OptimizedImage from "@packages/shared/components/OptimizedImage";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	MutedText,
} from "@packages/shared/components/Typography/Text";
import {ABI} from "@packages/treat/lib/abi";
import {contractAddresses} from "@packages/treat/lib/constants";
import {getBalanceNumber} from "@utils/formatBalance";
import {apiEndpoint, legacy_nft_to_new, timeFromNow} from "@utils/index";
import axios from "axios";
import UserAvatar from "core/auth/components/Avatar";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import TreatCore from "core/TreatCore";
import {BigNumber, ethers} from "ethers";
import Link from "next/link";
import {useMemo, useState} from "react";
import {MongoModelNFT, MongoModelTransaction} from "server/helpers/models";
import {useAccount, useContractRead} from "wagmi";

const getYouMightAlsoLike = async () => {
	const res = await axios.get(`${apiEndpoint}/marketplace/trending`);
	return res.data.data;
};

export default function NFT(props: {notFound?: boolean; data: any}) {
	const {address} = useAccount();

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
				<Container className="container flex-1 h-full py-12">
					<Container
						className="relative w-full h-full"
						onClick={onOpenFullscreenPreview}
					>
						<OptimizedImage
							src={nft.image.cdn}
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
					<Container className="flex flex-col gap-12">
						<ViewNFT
							nft={nft}
							mints={mints}
							account={address}
						/>
						<Divider dir={"horizontal"} />
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
						<Divider dir={"horizontal"} />

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
						<Divider dir={"horizontal"} />

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

const ViewNFT = ({
	nft,
	mints,
}: {
	nft: any;
	account: string;
	mints: Array<any>;
}) => {
	const {creatorCost} = useWagmiGetCreatorNftCost(nft.id);
	const {treatCost} = useWagmiGetTreatOfTheMonthNftCost(nft.id);
	const {subscriptionCost} = useWagmiGetSubscriberNftCost(nft.id);

	let nftCost: any = nft.subscription_nft ? subscriptionCost : creatorCost;
	nftCost = nft.totm_nft ? treatCost : nftCost;

	const {onMintNft: onMintTOTMNft} = useMintNft(nft.id, nftCost);
	const {onMintCreatorNft} = useMintCreatorNft(nft.id, nftCost);
	const {onMintSubscriberNft} = useMintSubscriberNft(nft.id, nftCost);

	const {onGetFreeTreat} = useGetFreeTreat(nft.id, nftCost);
	const {onGetFreeCreatorTreat} = useGetFreeCreatorTreat(nft.id, nftCost);
	const {onGetFreeSubscriberTreat} = useGetFreeSubscriberTreat(nft.id, nftCost);

	const maxNftSupply = useWagmiGetNFTMaxSupply(nft.id);
	const mintedNfts = useWagmiGetNFTTotalSupply(nft.id);
	const listedOnResale = useGetOpenOrdersForNft(nft.id) ?? [];

	const remainingNfts = maxNftSupply - mintedNfts;

	const {openOrders, isLoading} = useWagmiGetResaleNFTsForNFT(nft.id);

	const floorOrder = openOrders.reduce(
		(lowest, order, index) => {
			const price = BigNumber.from(order.price);
			const lowestPrice = BigNumber.from(lowest.price);
			if (index === 0) return order;
			return price.lt(lowestPrice) ? order : lowest;
		},
		{price: 0}
	);

	const floorResalePrice = ethers.utils.formatEther(
		BigNumber.from(floorOrder.price)
	);

	console.log({openOrders, nft});

	const onMintNft = async () => {
		if (nft.subscription_nft) return onMintSubscriberNft();
		if (nft.totm_nft) {
			return await onMintTOTMNft();
		} else {
			return await onMintCreatorNft();
		}
	};

	const onMintFreeNft = async () => {
		if (nft.subscription_nft) return onGetFreeSubscriberTreat();
		if (nft.totm_nft) {
			return await onGetFreeTreat();
		} else {
			return await onGetFreeCreatorTreat();
		}
	};

	return (
		<>
			<Container className="grid grid-cols-1 gap-12 px-4 lg:grid-cols-2">
				<Container className="flex flex-col gap-12 py-8">
					<Container className="flex flex-col gap-4">
						<Heading size="sm">{nft.name}</Heading>
						<Link href={`/${nft.model_handle}`}>
							<a>
								<Container className="flex">
									<Container
										className="flex items-center gap-2 px-4 py-2 border rounded-full shadow"
										css={{
											borderColor: "$subtleBorder",
											backgroundColor: "$elementSurface",
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
						<Container className="flex flex-wrap gap-4 p-2">
							{nft.tags?.map((tag) => (
								<Container
									key={tag}
									className="px-3 py-1 border rounded-full"
									css={{
										backgroundColor: "$elementSurface",
										borderColor: "$subtleBorder",
									}}
								>
									<Text>{tag}</Text>
								</Container>
							))}
							<Container
								className="px-3 py-1 border rounded-full shadow-xl"
								css={{
									backgroundColor: "$elementSurface",
									borderColor: "$subtleBorder",
								}}
							>
								<Text>
									<ImportantText>NFT</ImportantText>
								</Text>
							</Container>
						</Container>
					</Container>
				</Container>
				<Container className="flex flex-col gap-12 px-4 py-8">
					<Container
						className="flex flex-col w-full border drop-shadow-lg rounded-xl"
						css={{
							backgroundColor: "$elementSurface",
							borderColor: "$subtleBorder",
						}}
					>
						<Container className="grid grid-cols-2 gap-4 p-8">
							<Container>
								<MutedText>
									<ImportantText>Reserve price</ImportantText>
								</MutedText>
								<Heading size="sm">{nftCost} BNB</Heading>
							</Container>
							<Container>
								<MutedText>
									<ImportantText>Remaining</ImportantText>
								</MutedText>
								<Heading size="sm">
									{remainingNfts === 0
										? "Sold out"
										: `${remainingNfts}/${maxNftSupply}`}
								</Heading>
							</Container>
						</Container>
						<Container className="p-8">
							<RedeemButton
								onMintNft={nft.price === 0 ? onMintFreeNft : onMintNft}
								remainingNfts={remainingNfts}
								nftData={nft}
							/>
						</Container>
						{openOrders?.length > 0 && (
							<>
								<Divider dir={"horizontal"} />
								<Container className="grid grid-cols-1 gap-1 p-8">
									<Heading size="xs">
										Available on the Resale Marketplace
									</Heading>
									<Text>
										Please scroll down to purchase this NFT from resale
										marketplace listings
									</Text>
								</Container>
							</>
						)}
					</Container>
				</Container>
				{openOrders?.length > 0 && (
					<>
						<Container className="col-span-2">
							<Divider dir={"horizontal"} />
						</Container>
						<Container className="flex flex-col col-span-2 gap-8">
							<Heading size="sm">Available on resale market</Heading>
							<Container className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
								{openOrders.map((order, i) => {
									return (
										<TritPost
											key={i}
											inGrid
											isResale
											{...nft}
											price={{
												value: ethers.utils.formatEther(order.price),
												currency: "BNB",
											}}
											collection={{
												minted: 0,
												totalSupply: 1,
											}}
											protected={nft.protected}
											author={{
												address: order.seller,
												username:
													order.seller.slice(0, 3) +
													"..." +
													order.seller.slice(-3),
											}}
										/>
									);
								})}
							</Container>
						</Container>
					</>
				)}
			</Container>
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

	const nftsRemaining = remainingNfts;
	const nftSoldOut = remainingNfts === 0 || remainingNfts < 0;
	const isTOTMNFT = nftData.totm_nft;
	const isSubscriptionNFT = nftData.subscription_nft;
	const isRegularNFTBuyEnabled =
		!nftSoldOut && !isTOTMNFT && !isSubscriptionNFT;

	const redeemDisabled =
		loading ||
		nftSoldOut ||
		remainingNfts === 0 ||
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
			css={{borderRadius: "16px", padding: "16px 0"}}
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
							{isRegularNFTBuyEnabled && `Buy now`}
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

	const nft = await MongoModelNFT.findOne({id});

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
