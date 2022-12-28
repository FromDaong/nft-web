/* eslint-disable no-mixed-spaces-and-tabs */
import {pagePropsConnectMongoDB} from "@db/engine/pagePropsDB";
import {DotsHorizontalIcon} from "@heroicons/react/outline";
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
import Error404 from "@packages/error/404";
import BuyNFTButton from "@packages/post/BuyNFTButton";
import {useGetIsNFTOwned, useTritNFTUtils} from "@packages/post/hooks";
import {TritPost} from "@packages/post/TritPost";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
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
	ImageIcon,
	Share2Icon,
} from "@radix-ui/react-icons";
import {apiEndpoint, legacy_nft_to_new} from "@utils/index";
import axios from "axios";
import UserAvatar from "core/auth/components/Avatar";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import TreatCore from "core/TreatCore";
import Link from "next/link";
import {useEffect, useState} from "react";
import {MongoModelNFT, MongoModelTransaction} from "server/helpers/models";

const getYouMightAlsoLike = async () => {
	const res = await axios.get(`${apiEndpoint}/marketplace/trending`);
	return res.data.data;
};

export default function NFT(props: {notFound?: boolean; data: any}) {
	// T-26 implement view counter + analytics
	// T-45 user wants to purchase creator NFT
	// T-46 user wants to purchase subscription NFT
	// T-47 user wants to purchase TOTM NFT
	// T-48 user wants to purchase resale NFT
	// T-49 user wants to like NFT
	// T-50 user wants to see a list of users who liked this NFT
	// T-51 user wants to see a list of users who purchased this NFT
	// T-52 user wants to easily navigate to the search page with other listings of the NFT
	// T-53 user wants to navigate to search page by clicking on a tag
	// T-54 user wants to see a modal that shows if they own the NFT and the details of their ownership
	// T-55 admin wants to restrict user from opening fullscreen if they don't own the NFT
	// T-56 admin wants to disable certain functionality if user is not logged in
	// T-57 admin wants to change layout if user is not logged in

	const data = JSON.parse(props.data);
	const {nft} = data;

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
					</Container>
				</Container>
			</Container>
			<ApplicationLayout>
				<ApplicationFrame>
					<Container className="flex flex-col gap-12 max-w-7xl mx-auto">
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

const NFTPresentationComponent = (props: {
	nft: any;
	isOwned: boolean;
	balance: number;
}) => {
	const {nft} = props;
	const postUtils = useTritNFTUtils(nft);

	const {cost: creatorCost} = useWagmiGetCreatorNftCost(nft.id);
	const {cost: treatCost} = useWagmiGetTreatOfTheMonthNftCost(nft.id);
	const {cost: subscriptionCost} = useWagmiGetSubscriberNftCost(nft.id);

	let nftCost: any = nft.subscription_nft ? subscriptionCost : creatorCost;
	nftCost = nft.totm_nft ? treatCost : nftCost;

	const {mintNFT: onMintTOTMNft} = useWagmiMintTOTMNFT(nft.id, nftCost);
	const {mintNFT: onMintCreatorNft} = useWagmiMintCreatorNFT(nft.id, nftCost);
	const {mintNFT: onMintSubscriberNft} = useWagmiMintSubscriberNFT(
		nft.id,
		nftCost
	);

	const {mintNFT: onMintFreeTOTM} = useWagmiMintFreeTOTMNFT(nft.id);
	const {mintNFT: onMintFreeCreatorTreat} = useWagmiMintFreeNFT(nft.id);
	const {mintNFT: onMintFreeSubscriberTreat} = useWagmiMintFreeSubscriberNFT(
		nft.id
	);

	const maxNftSupply = useWagmiGetNFTMaxSupply(nft.id);
	const mintedNfts = useWagmiGetNFTTotalSupply(nft.id);

	const remainingNfts = maxNftSupply - mintedNfts;

	const {resaleListings: openOrders} = useWagmiGetResaleNFTsForNFT(nft.id);

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
			<Container className="grid grid-cols-1 gap-12 lg:grid-cols-3">
				<Container className="grid flex-col grid-cols-2 lg:col-span-2 gap-12 py-8 lg:flex">
					<Container className=" flex gap-4 bottom-4 right-4">
						<Button
							appearance={"surface"}
							onClick={
								() => {}
								//postUtils.setShowFullScreen(true)
							}
						>
							<EnterFullScreenIcon
								style={{strokeWidth: "2px"}}
								height={16}
								width={16}
							/>
						</Button>
						<Button appearance={"surface"}>
							<ImageIcon
								width={16}
								height={16}
							/>
							Load HD
						</Button>
						<Button
							appearance={"surface"}
							onClick={
								() => {}
								//postUtils.setShowFullScreen(true)
							}
						>
							<Share2Icon
								width={16}
								height={16}
							/>
							Share
						</Button>
						<Button
							appearance={"surface"}
							onClick={postUtils.likeNFT}
						>
							{postUtils.liked ? (
								<>
									<HeartFilledIcon
										width={16}
										height={16}
									/>
								</>
							) : (
								<HeartIcon
									width={16}
									height={16}
								/>
							)}
							<span>10k</span>
						</Button>
						<Button>
							<DotsHorizontalIcon
								width={16}
								height={16}
							/>
							More
						</Button>
					</Container>
					<Container className="flex justify-between col-span-2 gap-4">
						<Container className="flex flex-col gap-2">
							<Heading size="sm">{nft.name}</Heading>
							<Container className="flex">
								<Text>
									Listed by{" "}
									<Link href={`/${nft.creator.username}`}>
										<a>
											<ImportantText>@{nft.creator.username}</ImportantText>
										</a>
									</Link>
								</Text>
							</Container>
						</Container>
						<Container>
							<UserAvatar
								value={nft.creator.username}
								size={48}
							/>
						</Container>
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
				<Container className="flex flex-col gap-4 py-8">
					<Container
						className="flex flex-col w-full border shadow rounded-xl divide-y overflow-hidden"
						css={{
							backgroundColor: "$elementSurface",
							borderColor: "$subtleBorder",
							borderRadius: "16px",
						}}
					>
						<Container className="flex flex-col gap-12 p-4">
							<Container className="flex flex-col gap-1">
								<Text>
									<ImportantText>Reserve price</ImportantText>
								</Text>
								<SmallText>This is the buying price</SmallText>
							</Container>
							<Container className="flex flex-col gap-2 items-center">
								<Container className="flex justify-between w-full items-baseline">
									<Heading size="sm">{nftCost} BNB</Heading>

									<MutedText className="flex-shrink-0">
										{remainingNfts === 0 ? "Sold out" : `${remainingNfts} left`}
									</MutedText>
								</Container>
								<BuyNFTButton nftData={nft} />
							</Container>
						</Container>

						<Container
							className="p-4"
							css={{backgroundColor: "$surfaceOnSurface"}}
						>
							<Button
								fullWidth
								appearance={"surface"}
							>
								View other options
							</Button>
						</Container>
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
