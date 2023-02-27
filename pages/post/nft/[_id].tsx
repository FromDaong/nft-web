/* eslint-disable no-mixed-spaces-and-tabs */
import {pagePropsConnectMongoDB} from "@db/engine/pagePropsDB";
import Error404 from "@packages/error/404";
import NFTPresentationComponent from "@packages/post/BuyNFTPageViewNFT";
import {useGetIsNFTOwned, useTritNFTUtils} from "@packages/post/hooks";
import {TritPost} from "@packages/post/TritPost";
import {Container} from "@packages/shared/components/Container";
import {Divider} from "@packages/shared/components/Divider";
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
import {HeartFilledIcon, ImageIcon} from "@radix-ui/react-icons";
import {apiEndpoint, legacy_nft_to_new} from "@utils/index";
import axios from "axios";
import UserAvatar from "core/auth/components/Avatar";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import TreatCore from "core/TreatCore";
import Link from "next/link";
import {useEffect, useState} from "react";
import {MongoModelNFT, MongoModelProfile} from "server/helpers/models";
import {useAccount} from "wagmi";
import {ArticleJsonLd} from "next-seo";
import {SEOHead} from "@packages/seo/page";
import Guard from "@lib/guard";
import {Button} from "@packages/shared/components/Button";
import {HeartIcon} from "@heroicons/react/outline";
import {
	useWagmiGetNFTMaxSupply,
	useWagmiGetNFTTotalSupply,
} from "@packages/chain/hooks";
import BuyNFTButton from "@packages/post/BuyNFTButton";
import Lightbox from "react-image-lightbox";
import {useDisclosure} from "@packages/hooks";

export default function NFT(props: {
	notFound?: boolean;
	data: any;
	isResale: boolean;
}) {
	const {isResale} = props;
	const data = JSON.parse(props.data);
	const {nft} = data;
	const {address} = useAccount();
	const {isOwned, balance} = useGetIsNFTOwned(nft);
	const maxNftSupply = useWagmiGetNFTMaxSupply(nft.id);
	const mintedNfts = useWagmiGetNFTTotalSupply(nft.id);
	const postUtils = useTritNFTUtils(nft);

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

	if (props.notFound) {
		return <Error404 />;
	}

	const ipfs_parts = nft.image?.ipfs.split("/");
	const ipfs_id = ipfs_parts[ipfs_parts.length - 1];

	const blurred_image = `/api/v3/media/${nft.image?.ipfs}?blurhash=true`;
	const hd_image = `${nft.image?.ipfs}`;

	useEffect(() => {
		if (nft.protected && !isOwned) {
			setImageURL(blurred_image);
			return;
		}

		if (loadHD) {
			setImageURL(hd_image);
			return;
		}
	}, [nft.protected, isOwned, loadHD]);

	const remainingNfts = maxNftSupply - mintedNfts;

	console.log({remainingNfts, mintedNfts, maxNftSupply});

	return (
		<>
			<SEOHead
				title={`${nft.name} - TreatDAO`}
				description={nft.description}
				data={{
					name: nft.name,
					description: nft.description,
					price: nft.price,
					seller: nft.creator.username,
					id: nft.id,
					protected: nft.protected,
				}}
				type="nft"
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
			<ApplicationLayout>
				<ApplicationFrame>
					<Container className="grid col-span-1 gap-8 p-4 py-12 xl:grid-cols-3 lg:gap-12">
						<ImagePreviewSection
							isOwned={isOwned}
							remainingNfts={remainingNfts}
							mintedNfts={mintedNfts}
							maxNftSupply={maxNftSupply}
							address={address}
							nft={nft}
							postUtils={postUtils}
						/>
						<Container className="col-span-1 lg:col-span-2">
							<Container
								className="h-full p-4 border rounded-xl md:p-8 lg:p-12 drop-shadow-xl"
								css={{backgroundColor: "$cardBg", borderColor: "$border"}}
							>
								<Text css={{color: "$accentText"}}>
									<ImportantText>
										Remaining Supply: {remainingNfts} / Max Supply:{" "}
										{maxNftSupply}
									</ImportantText>
								</Text>
								<Container>
									<NFTPresentationComponent
										nft={nft}
										isOwned={isOwned}
										balance={balance}
										openFullScreen={() => setShowFullScreen(true)}
										loadHD={() => setLoadHD(true)}
										address={address}
										isResale={isResale}
									/>
								</Container>
								<Container className="flex flex-wrap gap-4">
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
															<SmallText>
																You are the creator of this NFT
															</SmallText>
														</Text>
													</Container>
												</Container>
											</Container>
										)}
								</Container>
							</Container>
						</Container>
					</Container>
					<Container className="flex flex-col gap-12">
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
	await pagePropsConnectMongoDB();
	const {_id} = context.params;
	const guard = Guard.getInstance();

	const nft = await MongoModelNFT.findById(_id).populate("creator").exec();

	if (!guard.exists(nft)) {
		return {
			notFound: true,
		};
	}

	const creator = await MongoModelNFT.populate(nft.creator, {
		path: "profile",
		model: MongoModelProfile,
	});

	await MongoModelNFT.findByIdAndUpdate(_id, {
		$push: {
			views: "temporary",
		},
	});

	nft.creator = creator;

	const returnObj = {
		id: nft.id,
		nft: nft,
	};

	return {
		props: {
			data: JSON.stringify(returnObj),
			isResale: false,
		},
	};
};

function ImagePreviewSection({
	remainingNfts,
	mintedNfts,
	maxNftSupply,
	address,
	nft,
	postUtils,
	isOwned,
}) {
	const {
		isOpen: isLightboxOpen,
		onOpen: onLightboxOpen,
		onClose: onLightboxClose,
	} = useDisclosure();

	return (
		<Container className="w-full 2xl:h-[80vh] lg:h-[90vh] h-[calc(100vh-64px)] flex items-center justify-center col-span-1 lg:col-span-2 xl:col-span-1">
			{isLightboxOpen && isOwned && (
				<Lightbox
					mainSrc={`/api/v3/image/nft/${nft._id}/hd`}
					onCloseRequest={onLightboxClose}
				/>
			)}
			<Container
				css={{
					backgroundColor: "$cardBg",
					borderColor: "$border",
				}}
				className="container flex flex-col flex-1 h-full gap-4 p-3 overflow-hidden border rounded-2xl drop-shadow-xl justify-center"
			>
				<Container className="relative w-full h-full rounded-xl">
					<img
						onClick={onLightboxClose}
						src={`/api/v3/image/nft/${nft._id}/${
							nft.isProtected && !isOwned ? "blur" : "sd"
						}`}
						className="object-contain hover:cursor-zoom-in absolute top-0 left-0 h-full w-full rounded-xl"
						sizes="100vw"
						alt={nft.name}
					/>
				</Container>

				<MutedText className="flex-shrink-0"></MutedText>
				{false && (
					<Container className="flex flex-col gap-2">
						{remainingNfts !== 0 && (
							<Container className="flex justify-between">
								<>
									<Text>
										<ImportantText>{mintedNfts}</ImportantText>
									</Text>
									<Text>
										<ImportantText>{maxNftSupply}</ImportantText>
									</Text>
								</>
							</Container>
						)}
						<Container
							className="relative flex rounded-full"
							css={{
								backgroundColor: "$overlay",
							}}
						>
							<Container
								className={`relative rounded-full p-1`}
								role={"progress"}
								css={{
									width: `${Math.ceil((mintedNfts / maxNftSupply) * 100)}%`,
									backgroundColor: mintedNfts === 0 && "$overlayContrast",
								}}
							/>
						</Container>
					</Container>
				)}
				<Container className="flex gap-4">
					<Button
						onClick={postUtils.likeNFT}
						appearance={"outline"}
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
						{postUtils.likedBy.length}
					</Button>
					<Container className="flex-1">
						{remainingNfts !== 0 &&
							!(
								nft.creator.address.toLowerCase() === address?.toLowerCase()
							) && <BuyNFTButton nftData={nft} />}
						{remainingNfts === 0 && (
							<Button
								fullWidth
								appearance={"disabled"}
								disabled
							>
								{remainingNfts === 0 ? "Sold out" : `Buy Now`}
							</Button>
						)}
					</Container>
				</Container>
			</Container>
		</Container>
	);
}
