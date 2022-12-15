/* eslint-disable no-mixed-spaces-and-tabs */
import {pagePropsConnectMongoDB} from "@db/engine/pagePropsDB";
import LegacyNFTModel from "@db/legacy/nft/NFT";
import {BadgeCheckIcon} from "@heroicons/react/outline";
import {EvmNftMetadata} from "@moralisweb3/common-evm-utils";
import {
	useWagmiGetCreatorNftCost,
	useWagmiGetNFTMaxSupply,
	useWagmiGetSubscriberNftCost,
	useWagmiGetTreatOfTheMonthNftCost,
	useWagmiGetNFTTotalSupply,
	useWagmiGetResaleNFTsForNFT,
	useWagmiMintFreeNFT,
	useWagmiMintFreeTOTMNFT,
	useWagmiMintFreeSubscriberNFT,
	useWagmiMintTOTMNFT,
	useWagmiMintCreatorNFT,
	useWagmiMintSubscriberNFT,
} from "@packages/chain/hooks/alpha";
import useGetIsSubscribed from "@packages/chain/hooks/useGetIsSubscribed";
import Error404 from "@packages/error/404";
import {useDisclosure} from "@packages/hooks";
import {Modal} from "@packages/modals";
import FullScreenImagePreview from "@packages/modals/FullScreenImagePreview";
import BuyNFTButton from "@packages/post/BuyNFTButton";
import {useTritNFTUtils} from "@packages/post/hooks";
import {
	DislikeIcon,
	LikeIcon,
	SkeletonTritCollectiblePost,
	TritPost,
} from "@packages/post/TritPost";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import CreatorBadge from "@packages/shared/components/CreatorBadget";
import {Divider} from "@packages/shared/components/Divider";
import OptimizedImage from "@packages/shared/components/OptimizedImage";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	MutedText,
} from "@packages/shared/components/Typography/Text";
import {
	EnterFullScreenIcon,
	HeartFilledIcon,
	HeartIcon,
} from "@radix-ui/react-icons";
import {apiEndpoint, legacy_nft_to_new, timeFromNow} from "@utils/index";
import axios from "axios";
import UserAvatar from "core/auth/components/Avatar";
import useUser from "core/auth/useUser";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import TreatCore from "core/TreatCore";
import {BigNumber, ethers} from "ethers";
import Link from "next/link";
import {useEffect, useMemo, useState} from "react";
import {MongoModelNFT, MongoModelTransaction} from "server/helpers/models";
import {useAccount, useContractRead, useWaitForTransaction} from "wagmi";

const exitFullScreen = () => {
	if (document.exitFullscreen) {
		document.exitFullscreen();
	} else if (document["mozCancelFullScreen"]) {
		document["mozCancelFullScreen"]();
	} else if (document["webkitExitFullscreen"]) {
		document["webkitExitFullscreen"]();
	} else if (document["msExitFullscreen"]) {
		document["msExitFullscreen"]();
	}
};

export const useFullScreen = (
	elementOrElementId: HTMLElement | string,
	showFullScreen: boolean
) =>
	useEffect(() => {
		const fullScreenElement =
			document["fullscreenElement"] ||
			document["webkitFullscreenElement"] ||
			document["mozFullScreenElement"] ||
			document["msFullscreenElement"];

		// exit full screen
		if (!showFullScreen) {
			if (fullScreenElement) {
				exitFullScreen();
			}
			return;
		}

		// get the element to make full screen
		const element =
			typeof elementOrElementId === "string"
				? document.getElementById(elementOrElementId)
				: elementOrElementId;

		// if the current element is not already full screen, make it full screen
		if (!fullScreenElement) {
			if (element.requestFullscreen) {
				element.requestFullscreen();
			} else if (element["mozRequestFullScreen"]) {
				element["mozRequestFullScreen"]();
			} else if (element["webkitRequestFullscreen"]) {
				// @ts-ignore
				element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
			} else if (element["msRequestFullscreen"]) {
				element["msRequestFullscreen"]();
			}
		}
	}, [showFullScreen, elementOrElementId]);

const getYouMightAlsoLike = async () => {
	const res = await axios.get(`${apiEndpoint}/marketplace/trending`);
	return res.data.data;
};

export default function NFT(props: {notFound?: boolean; data: any}) {
	const data = JSON.parse(props.data);
	const {nft, mints} = data;
	const postUtils = useTritNFTUtils(nft);

	const {address} = useAccount();
	const [showFullScreen, setShowFullScreen] = useState(false);
	useFullScreen("nft_image", showFullScreen);

	const getMoreNFTsFromCreator = async () => {
		const res = await axios.get(
			`${apiEndpoint}/creator/${nft.creator.username}/sample`
		);
		return res.data.data;
	};

	const {
		isLoading: moreNFTSLoading,
		error: moreNFTSError,
		data: moreNFTs,
	} = TreatCore.useQuery({
		queryKey: [`moreNFTS:${nft.creator._id}`],
		queryFn: getMoreNFTsFromCreator,
	});

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

	const trendingNFTs =
		youMightAlsoLikeError || youMightAlsoLikeLoading
			? []
			: youMightAlsoLikeData?.map((post) => legacy_nft_to_new(post));

	return (
		<>
			<Container
				className="w-full 2xl:h-[80vh] lg:h-[90vh] h-[calc(100vh-64px)] flex items-center justify-center"
				css={{backgroundColor: "$surfaceOnSurface"}}
			>
				<Container className="container flex-1 h-full py-12">
					<Container
						className="relative w-full h-full"
						onClick={() => setShowFullScreen(!showFullScreen)}
						id={"nft_image"}
					>
						<OptimizedImage
							src={`${nft.image.cdn}&blur=${nft.protected ? 30 : 0}&`}
							className="cursor-zoom-in"
							sizes="100vw"
							fill
							objectFit="contain"
							alt={nft.name}
						/>
						<Container className="flex gap-4 absolute bottom-4 right-4">
							<Button onClick={() => setShowFullScreen(!showFullScreen)}>
								<EnterFullScreenIcon
									height={16}
									width={16}
								/>
							</Button>
							<Button onClick={postUtils.likeNFT}>
								{postUtils.liked ? (
									<>
										<HeartFilledIcon
											width={20}
											height={20}
										/>
									</>
								) : (
									<HeartIcon
										width={20}
										height={20}
									/>
								)}
								<span>Like</span>
							</Button>
						</Container>
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
								<Link href={`/${nft.creator.username}`}>
									<a>
										<Container className="flex flex-col gap-8">
											<UserAvatar
												value={nft.creator.username}
												size={80}
											/>

											<Container className="flex flex-col gap-2">
												<Heading size="sm">{nft.name} </Heading>
												<Text>@{nft.creator.username}</Text>
											</Container>
											<Text>{nft.description}</Text>
										</Container>
									</a>
								</Link>
								{!moreNFTSError && !moreNFTSLoading
									? moreNFTs
											.map((post) => legacy_nft_to_new(post))
											.map((item) => (
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
					</Container>
				</ApplicationFrame>
			</ApplicationLayout>
		</>
	);
}

const ViewNFT = ({nft}: {nft: any; account: string; mints: Array<any>}) => {
	const {creatorCost} = useWagmiGetCreatorNftCost(nft.id);
	const {treatCost} = useWagmiGetTreatOfTheMonthNftCost(nft.id);
	const {subscriptionCost} = useWagmiGetSubscriberNftCost(nft.id);

	let nftCost: any = nft.subscription_nft ? subscriptionCost : creatorCost;
	nftCost = nft.totm_nft ? treatCost : nftCost;

	const {mintNFT: onMintTOTMNft} = useWagmiMintTOTMNFT(nft.id, nftCost);
	const {mintNFT: onMintCreatorNft} = useWagmiMintCreatorNFT(nft.id, nftCost);
	const {mintNFT: onMintSubscriberNft} = useWagmiMintSubscriberNFT(
		nft.id,
		nftCost
	);

	const {mintFreeNFT: onMintFreeTOTM} = useWagmiMintFreeTOTMNFT(nft.id);
	const {mintFreeNFT: onMintFreeCreatorTreat} = useWagmiMintFreeNFT(nft.id);
	const {mintFreeNFT: onMintFreeSubscriberTreat} =
		useWagmiMintFreeSubscriberNFT(nft.id);

	const maxNftSupply = useWagmiGetNFTMaxSupply(nft.id);
	const mintedNfts = useWagmiGetNFTTotalSupply(nft.id);

	const remainingNfts = maxNftSupply - mintedNfts;

	const {openOrders} = useWagmiGetResaleNFTsForNFT(nft.id);

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

	const mintNFT = async () => {
		if (nft.subscription_nft) return onMintSubscriberNft();
		if (nft.totm_nft) {
			return await onMintTOTMNft();
		} else {
			return await onMintCreatorNft();
		}
	};

	const mintFreeNFT = async () => {
		if (nft.subscription_nft) return onMintFreeSubscriberTreat();
		if (nft.totm_nft) {
			return await onMintFreeTOTM();
		} else {
			return await onMintFreeCreatorTreat();
		}
	};

	return (
		<>
			<Container className="grid grid-cols-1 gap-12 px-4 lg:grid-cols-2">
				<Container className="flex flex-col gap-12 py-8">
					<Container className="flex flex-col gap-4">
						<Heading size="sm">{nft.name}</Heading>
						<Link href={`/${nft.creator.username}`}>
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
											value={nft.creator.username}
											size={24}
										/>
										<Text className="flex items-center gap-2">
											<ImportantText>@{nft.creator.username}</ImportantText>
											<CreatorBadge />
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
						<Container className="flex flex-wrap gap-4 py-2">
							{nft.tags?.map((tag) => (
								<Container
									key={tag}
									className="px-3 py-1 border rounded-full shadow-xl"
									css={{
										backgroundColor: "$elementSurface",
										borderColor: "$subtleBorder",
									}}
								>
									<Text>
										<ImportantText>{tag}</ImportantText>
									</Text>
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
				<Container className="flex flex-col gap-8 px-4 py-8">
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
						{remainingNfts !== 0 && (
							<>
								<Divider dir={"horizontal"} />
								<Container className="p-8">
									<BuyNFTButton
										mintNFT={nft.price === 0 ? mintFreeNFT : mintNFT}
										remainingNfts={remainingNfts}
										nftData={nft}
									/>
								</Container>
							</>
						)}
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
											likedBy={nft.likedBy}
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

export const getServerSideProps = async (context) => {
	const {id} = context.params;

	await pagePropsConnectMongoDB();

	const nft = await MongoModelNFT.findOne({id}).populate("creator").exec();

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
