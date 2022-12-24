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
} from "@packages/chain/hooks";
import useGetIsSubscribed from "@packages/chain/hooks/useGetIsSubscribed";
import Error404 from "@packages/error/404";
import {useDisclosure} from "@packages/hooks";
import {Modal} from "@packages/modals";
import FullScreenImagePreview from "@packages/modals/FullScreenImagePreview";
import BuyNFTButton from "@packages/post/BuyNFTButton";
import {
	useContracts,
	useGetIsNFTOwned,
	useTritNFTUtils,
} from "@packages/post/hooks";
import {TritPost} from "@packages/post/TritPost";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import CreatorBadge from "@packages/shared/components/CreatorBadget";
import {Divider} from "@packages/shared/components/Divider";
import OptimizedImage from "@packages/shared/components/OptimizedImage";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	MutedText,
	SmallText,
} from "@packages/shared/components/Typography/Text";
import {useFullScreen} from "@packages/shared/hooks";
import RectangleStack from "@packages/shared/icons/RectangleStack";
import DynamicSkeleton from "@packages/skeleton";
import {TritPostSkeleton} from "@packages/skeleton/config";
import {
	EnterFullScreenIcon,
	HeartFilledIcon,
	HeartIcon,
} from "@radix-ui/react-icons";
import {apiEndpoint, legacy_nft_to_new} from "@utils/index";
import axios from "axios";
import UserAvatar from "core/auth/components/Avatar";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import TreatCore from "core/TreatCore";
import {BigNumber, ethers} from "ethers";
import {unstable_getServerSession} from "next-auth";
import Link from "next/link";
import {useEffect, useState} from "react";
import {MongoModelNFT, MongoModelTransaction} from "server/helpers/models";
import {useAccount} from "wagmi";

const getYouMightAlsoLike = async () => {
	const res = await axios.get(`${apiEndpoint}/marketplace/trending`);
	return res.data.data;
};

export default function NFT(props: {notFound?: boolean; data: any}) {
	// T-26 implement view counter + analytics

	const data = JSON.parse(props.data);
	const {nft} = data;
	const postUtils = useTritNFTUtils(nft);

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
		isLoading: youMightAlsoLikeLoading,
		error: youMightAlsoLikeError,
		data: youMightAlsoLikeData,
	} = TreatCore.useQuery({
		queryKey: ["youMightAlsoLikeNFTs"],
		queryFn: getYouMightAlsoLike,
	});

	const {isOwned, balance} = useGetIsNFTOwned(nft);

	if (props.notFound) {
		return <Error404 />;
	}

	useEffect(() => {
		TreatCore.triggerEvent("post_impression", {
			_id: nft._id,
			nftId: nft.id,
		});
	}, []);

	const trendingNFTs =
		youMightAlsoLikeError || youMightAlsoLikeLoading
			? []
			: youMightAlsoLikeData?.map((post) => legacy_nft_to_new(post));

	// T-39 Get cross-selling nft data from obviously API and show them under you might like.

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
							src={`${nft.image.ipfs}?blur=${
								nft.protected && !isOwned ? 30 : 0
							}&`}
							className="cursor-zoom-in"
							sizes="100vw"
							fill
							objectFit="contain"
							alt={nft.name}
						/>
						<Container className="absolute flex gap-4 bottom-4 right-4">
							<Button
								appearance={"surface"}
								onClick={() => setShowFullScreen(!showFullScreen)}
							>
								<EnterFullScreenIcon
									style={{strokeWidth: "2px"}}
									height={16}
									width={16}
								/>
							</Button>
							<Button
								appearance={"surface"}
								onClick={postUtils.likeNFT}
							>
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
						{isOwned && balance > 0 && (
							<Container className="flex mt-8">
								<Container
									className="flex items-center gap-4 px-8 py-4"
									css={{
										backgroundColor: "$accentBg",
										borderRadius: "16px",
									}}
								>
									<Container>
										<Text css={{color: "$accentText"}}>
											<RectangleStack
												width={32}
												height={32}
											/>
										</Text>
									</Container>
									<Container>
										<Heading
											css={{color: "$accentText"}}
											size="xs"
										>
											You own this NFT
										</Heading>
										<Text css={{color: "$accentText"}}>
											You already own {balance} units of this NFT
										</Text>
									</Container>
								</Container>
							</Container>
						)}
						<NFTPresentationComponent
							nft={nft}
							isOwned={isOwned}
							balance={balance}
						/>
						<Divider dir={"horizontal"} />
						<Container className="flex flex-col gap-12 px-8 lg:p-0">
							<Container className="flex flex-col gap-4">
								<Heading size="sm">People also bought</Heading>
							</Container>
							<Container className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
								{!youMightAlsoLikeError && !youMightAlsoLikeLoading
									? trendingNFTs.slice(0, 4).map((item) => (
											<TritPost
												key={item}
												inGrid
												{...item}
											/>
									  ))
									: [0, 1, 2, 3].map((i) => (
											<DynamicSkeleton
												key={"skeleton" + i}
												config={TritPostSkeleton}
											/>
									  ))}
							</Container>
						</Container>
						<Divider dir={"horizontal"} />

						<Container className="flex flex-col gap-12 px-8 lg:0">
							<Container className="flex flex-col gap-4">
								<Heading size="sm">More from this creator</Heading>
							</Container>
							<Container className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
											<DynamicSkeleton
												key={"skeleton2:" + i}
												config={TritPostSkeleton}
											/>
									  ))}
							</Container>
						</Container>
					</Container>
				</ApplicationFrame>
			</ApplicationLayout>
		</>
	);
}

const NFTPresentationComponent = ({
	nft,
}: {
	nft: any;
	isOwned: boolean;
	balance: number;
}) => {
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
			<Container className="grid grid-cols-1 gap-12 px-4 xl:grid-cols-2">
				<Container className="grid flex-col grid-cols-2 gap-12 py-8 lg:flex">
					<Container className="flex flex-col col-span-2 gap-4">
						<Heading size="sm">{nft.name}</Heading>
						<Link href={`/${nft.creator.username}`}>
							<a>
								<Container className="flex">
									<Container
										className="flex items-center gap-2 px-4 py-2 border rounded-full shadow-sm"
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
					<Container className="flex flex-col col-span-1 gap-4">
						<Heading size="xs">Description</Heading>
						<Text>{nft.description}</Text>
					</Container>
					<Container className="flex flex-col col-span-1 gap-4">
						<Heading size="xs">Tags</Heading>
						<Container className="flex flex-wrap gap-4 py-2">
							{nft.tags?.map((tag) => (
								<Container
									key={tag}
									className="px-3 py-1 border rounded-full shadow-sm"
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
								className="px-3 py-1 border rounded-full shadow-sm"
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
				<Container className="flex flex-col gap-4 px-4 py-8">
					<Container
						className="flex flex-col w-full py-4 border drop-shadow-sm rounded-xl"
						css={{
							backgroundColor: "$elementSurface",
							borderColor: "$subtleBorder",
							borderRadius: "32px",
						}}
					>
						<Container className="grid grid-cols-3 gap-4 px-8 py-4">
							<Container className="flex flex-col gap-2">
								<MutedText>
									<ImportantText>Reserve price</ImportantText>
								</MutedText>
								<Heading size="sm">{nftCost} BNB</Heading>
								<MutedText>
									<SmallText>Listing buying price</SmallText>
								</MutedText>
							</Container>
							<Container className="flex flex-col gap-2">
								<MutedText>
									<ImportantText>Floor price</ImportantText>
								</MutedText>
								<Heading size="sm">{floorResalePrice} BNB</Heading>
								<MutedText>
									<SmallText>From other listings</SmallText>
								</MutedText>
							</Container>
							<Container className="flex flex-col gap-2">
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
								<Container className="px-8 py-4">
									<BuyNFTButton
										mintNFT={nft.price === 0 ? mintFreeNFT : mintNFT}
										remainingNfts={remainingNfts}
										nftData={nft}
									/>
								</Container>
							</>
						)}
					</Container>
				</Container>
			</Container>
		</>
	);
};

export const getServerSideProps = async (context) => {
	const {_id} = context.params;

	await pagePropsConnectMongoDB();

	const nft = await MongoModelNFT.findById(_id).populate("creator").exec();

	if (!nft) {
		return {
			notFound: true,
		};
	}

	await MongoModelNFT.findByIdAndUpdate(_id, {
		$push: {
			views: "temporary",
		},
	});

	const transactions = await MongoModelTransaction.find({
		"metadata.nftId": nft.id,
	});

	const returnObj = {
		id: nft.id,
		mints: transactions,
		nft: nft,
	};

	return {
		props: {
			data: JSON.stringify(returnObj),
		},
	};
};
