/* eslint-disable no-mixed-spaces-and-tabs */
import {pagePropsConnectMongoDB} from "@db/engine/pagePropsDB";
import Error404 from "@packages/error/404";
import NFTPresentationComponent from "@packages/post/BuyNFTPageViewNFT";
import {useGetIsNFTOwned} from "@packages/post/hooks";
import {TritPost} from "@packages/post/TritPost";
import {Container} from "@packages/shared/components/Container";
import {Divider} from "@packages/shared/components/Divider";
import OptimizedImage from "@packages/shared/components/OptimizedImage";
import OptimizedNFTImage from "@packages/shared/components/OptimizedImage/OptimizedNFTImage";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {SmallText} from "@packages/shared/components/Typography/Text";
import {useFullScreen} from "@packages/shared/hooks";
import RectangleStack from "@packages/shared/icons/RectangleStack";
import DynamicSkeleton from "@packages/skeleton";
import {TritPostSkeleton} from "@packages/skeleton/config";
import {ImageIcon} from "@radix-ui/react-icons";
import {apiEndpoint, legacy_nft_to_new} from "@utils/index";
import axios from "axios";
import UserAvatar from "core/auth/components/Avatar";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import TreatCore from "core/TreatCore";
import Link from "next/link";
import {useEffect, useState} from "react";
import {
	MongoModelEvent,
	MongoModelNFT,
	MongoModelProfile,
	MongoModelTransaction,
} from "server/helpers/models";
import {useAccount} from "wagmi";
import {ArticleJsonLd} from "next-seo";
import {SEOHead} from "@packages/seo/page";

const getYouMightAlsoLike = async () => {
	const res = await axios.get(`${apiEndpoint}/marketplace/trending`);
	return res.data.data;
};

export default function NFT(props: {
	notFound?: boolean;
	data: any;
	seller: {
		username: string;
		profile_pic: string;
		address: string;
		_id: string;
		display_name: string;
	};
	isResale: boolean;
}) {
	// T-48 user wants to purchase resale NFT
	// T-52 user wants to easily navigate to the search page with other listings of the NFT
	// T-53 user wants to navigate to search page by clicking on a tag

	const data = JSON.parse(props.data);
	const {nft} = data;
	const {seller} = data;
	const {event} = data;

	const {address} = useAccount();

	const [showFullScreen, setShowFullScreen] = useState(false);
	const [loadHD, setLoadHD] = useState(false);
	const [imageURL, setImageURL] = useState("");
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

	const ipfs_parts = nft.image?.ipfs.split("/");
	const ipfs_id = ipfs_parts[ipfs_parts.length - 1];

	const blurred_image = `${ipfs_id}?blurhash=true`;
	const sd_image = `${ipfs_id}?`;
	const hd_image = `${ipfs_id}?`;

	useEffect(() => {
		if (nft.protected && !isOwned) {
			setImageURL(blurred_image);
			return;
		}

		if (!loadHD) {
			setImageURL(sd_image);
			return;
		}

		if (loadHD) {
			setImageURL(hd_image);
			return;
		}
	}, [nft.protected, isOwned, loadHD]);

	const isResale =
		event && event.seller.toLowerCase() !== nft.creator.address.toLowerCase();

	return (
		<>
			<SEOHead
				title={`${nft.name} - TreatDAO`}
				description={nft.description}
				data={{
					name: nft.name,
					description: nft.description,
					price: nft.price,
					seller: isResale ? seller.username : nft.creator.username,
					id: nft.id,
				}}
			/>

			<ArticleJsonLd
				url={`https://treatnfts.com/post/nft/${nft._id}`}
				title={nft.name}
				images={[nft.image?.ipfs]}
				datePublished="2021-01-01"
				authorName={nft.creator.username}
				publisherName={"TreatDAO"}
				publisherLogo="https://www.treatnfts.com/logo.png"
				description={nft.description}
			/>
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
						{nft.protected && !isOwned && (
							<OptimizedImage
								src={imageURL}
								className="cursor-zoom-in"
								sizes="100vw"
								fill
								objectFit="contain"
								alt={nft.name}
							/>
						)}
						{nft.protected && isOwned && (
							<OptimizedNFTImage
								src={sd_image}
								className="cursor-zoom-in"
								sizes="100vw"
								fill
								objectFit="contain"
								alt={nft.name}
							/>
						)}
						{!nft.protected && (
							<OptimizedNFTImage
								src={hd_image}
								className="cursor-zoom-in"
								sizes="100vw"
								fill
								objectFit="contain"
								alt={nft.name}
								quality={100}
							/>
						)}
					</Container>
				</Container>
			</Container>
			<ApplicationLayout>
				<ApplicationFrame>
					<Container className="flex flex-col gap-12">
						<Container className="flex flex-wrap gap-4 px-8">
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
												size="xss"
											>
												You own this NFT
											</Heading>
											<Text css={{color: "$accentText"}}>
												<SmallText>
													You already own {balance} units of this NFT
												</SmallText>
											</Text>
										</Container>
									</Container>
								</Container>
							)}
							{isResale && (
								<Container className="flex mt-8">
									<Container
										className="flex items-center gap-4 px-8 py-4"
										css={{
											backgroundColor: "$amber3",
											borderRadius: "16px",
										}}
									>
										<Container>
											<Text css={{color: "$amber7"}}>
												<RectangleStack
													width={32}
													height={32}
												/>
											</Text>
										</Container>
										<Container>
											<Heading
												css={{color: "$amber12"}}
												size="xss"
											>
												Resale Market
											</Heading>
											<Text css={{color: "$amber11"}}>
												<SmallText>NFT listed on Resale Market</SmallText>
											</Text>
										</Container>
									</Container>
								</Container>
							)}
							{address &&
								nft.creator.profile.address.toLowerCase() ===
									address?.toLowerCase() && (
									<Container className="flex mt-8">
										<Container
											className="flex items-center gap-4 px-8 py-4"
											css={{
												backgroundColor: "$pink3",
												borderRadius: "16px",
											}}
										>
											<Container>
												<Text css={{color: "$pink7"}}>
													<ImageIcon
														width={32}
														height={32}
													/>
												</Text>
											</Container>
											<Container>
												<Heading
													css={{color: "$pink12"}}
													size="xss"
												>
													Your masterpiece
												</Heading>
												<Text css={{color: "$pink12"}}>
													<SmallText>You are the creator of this NFT</SmallText>
												</Text>
											</Container>
										</Container>
									</Container>
								)}
						</Container>
						<Container className="px-8">
							<NFTPresentationComponent
								nft={nft}
								isOwned={isOwned}
								balance={balance}
								openFullScreen={() => setShowFullScreen(true)}
								loadHD={() => setLoadHD(true)}
								address={address}
								seller={seller}
								isResale={isResale}
								event={event}
							/>
						</Container>
						<Divider dir={"horizontal"} />
						<Container className="flex flex-col gap-12 px-8">
							<Container className="flex flex-col gap-4">
								<Heading size="sm">You might also like</Heading>
							</Container>
							<Container className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
								{!youMightAlsoLikeError && !youMightAlsoLikeLoading
									? trendingNFTs.slice(0, 4).map((item) => (
											<TritPost
												key={item.id}
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

						<Container className="flex flex-col gap-12 px-8">
							<Container className="flex flex-col gap-4">
								<Heading size="sm">More from this creator</Heading>
							</Container>
							<Container className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
								<Link href={`/${nft.creator.username}`}>
									<a>
										<Container className="flex flex-col gap-8">
											<UserAvatar
												username={nft.creator.username}
												profile_pic={
													nft.creator.profile_pic ??
													nft.creator.profile?.profile_pic
												}
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
											.slice(0, 3)
											.map((item) => (
												<TritPost
													key={item._id}
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

export const getServerSideProps = async (context) => {
	const {_id} = context.params;
	const {seller, eid} = context.query;

	await pagePropsConnectMongoDB();

	const nft = await MongoModelNFT.findById(_id).populate("creator").exec();
	if (!nft) {
		return {
			notFound: true,
		};
	}

	const creator = await MongoModelNFT.populate(nft.creator, {
		path: "profile",
		model: MongoModelProfile,
	});

	const seller_profile = seller
		? await MongoModelProfile.findOne({
				address: seller?.toLowerCase(),
		  })
		: null;

	const event = eid ? await MongoModelEvent.findById(eid) : null;

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

	nft.creator = creator;

	const returnObj = {
		id: nft.id,
		mints: transactions,
		nft: nft,
		seller: seller_profile,
		isResale: !!seller,
		event: event,
	};

	return {
		props: {
			data: JSON.stringify(returnObj),
		},
	};
};
