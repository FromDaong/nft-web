/* eslint-disable no-mixed-spaces-and-tabs */
import {pagePropsConnectMongoDB} from "@db/engine/pagePropsDB";
import Error404 from "@packages/error/404";
import NFTPresentationComponent, {
	useGetResaleListings,
} from "@packages/post/BuyNFTPageViewNFT";
import {useGetIsNFTOwned, useTritNFTUtils} from "@packages/post/hooks";
import {TritPost} from "@packages/post/TritPost";
import {Container} from "@packages/shared/components/Container";
import {Divider} from "@packages/shared/components/Divider";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	SmallText,
} from "@packages/shared/components/Typography/Text";
import {useFullScreen} from "@packages/shared/hooks";
import DynamicSkeleton from "@packages/skeleton";
import {TritPostSkeleton} from "@packages/skeleton/config";
import {ImageIcon} from "@radix-ui/react-icons";
import {apiEndpoint, legacy_nft_to_new, timeFromNow} from "@utils/index";
import axios from "axios";
import UserAvatar from "core/auth/components/Avatar";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import TreatCore from "core/TreatCore";
import Link from "next/link";
import {useMemo, useState} from "react";
import {MongoModelNFT, MongoModelProfile} from "server/helpers/models";
import {useAccount} from "wagmi";
import {ArticleJsonLd} from "next-seo";
import {SEOHead} from "@packages/seo/page";
import Guard from "@lib/guard";
import {Button} from "@packages/shared/components/Button";
import {
	useWagmiGetNFTMaxSupply,
	useWagmiGetNFTTotalSupply,
} from "@packages/chain/hooks";
import BuyNFTButton from "@packages/post/BuyNFTButton";
import {useDisclosure} from "@packages/hooks";
import {SparklesIcon} from "@heroicons/react/solid";
import {WishlistNFTCard} from "pages/studio/wishlist";
import FullscreenImagePreviewModal from "@packages/modals/ImagePreview";
import AvatarGroup from "@packages/avatars/AvatarGroup";
import SweetshopNFT from "@components/NFTCard/cards/Sweetshop";
import {ExternalLink, ExternalLinkIcon, FilterIcon} from "lucide-react";
import Spinner from "@packages/shared/icons/Spinner";
import {Provider, gql, useQuery} from "urql";
import {treatOldGraphClient} from "@lib/graphClients";

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

	nft.description = data.description;
	const remainingNfts = maxNftSupply - mintedNfts;

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
					<Container className="relative flex flex-col gap-8 px-0 p-4 xl:pb-12 xl:flex-row">
						<ImagePreviewSection
							isOwned={isOwned}
							remainingNfts={remainingNfts}
							mintedNfts={mintedNfts}
							maxNftSupply={maxNftSupply}
							nft={nft}
							postUtils={postUtils}
						/>
						<Container className="flex-1 w-full relative flex flex-col h-full rounded-xl gap-8">
							<Container className="flex gap-4">
								{isOwned && balance && (
									<Container
										className="flex items-center gap-2 p-2 pr-3 border rounded-lg shadow-sm w-fit"
										css={{
											backgroundColor: "$surfaceOnSurface",
											borderColor: "$border",
										}}
									>
										<Button
											css={{padding: 0, color: "$text"}}
											appearance={"unstyled"}
										>
											<SparklesIcon className="w-5 h-5" />
										</Button>
										<Container className="flex gap-2">
											<SmallText css={{color: "$text"}}>
												<ImportantText>
													You own {balance} version{balance > 1 ? "s" : ""}
												</ImportantText>
											</SmallText>
										</Container>
									</Container>
								)}
								{address &&
									nft.creator.profile.address.toLowerCase() ===
										address?.toLowerCase() && (
										<Container className="flex">
											<Container
												className="flex items-center gap-2 p-2 pr-4 border rounded-lg shadow-sm"
												css={{
													backgroundColor: "$pink2",
													borderColor: "$pink7",
												}}
											>
												<Container>
													<Text css={{color: "$pink10"}}>
														<ImageIcon className="w-5 h-5" />
													</Text>
												</Container>
												<Container>
													<SmallText css={{color: "$pink10"}}>
														<ImportantText>
															This is a masterpiece from yours truly
														</ImportantText>
													</SmallText>
												</Container>
											</Container>
										</Container>
									)}
							</Container>
							<Container>
								<NFTPresentationComponent
									nft={nft}
									isOwned={isOwned}
									balance={balance}
									openFullScreen={() => setShowFullScreen(true)}
									loadHD={() => setLoadHD(true)}
									address={address}
									isResale={isResale}
									maxSupply={maxNftSupply}
								/>
							</Container>
							<ResaleListings nft={nft} />
							<Activity nft={nft} />
						</Container>
					</Container>
					<Container className="flex flex-col mt-32">
						<Container className="flex flex-col gap-12">
							<Container className="flex flex-col gap-4">
								<Heading size="sm">More from the creator</Heading>
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
										</Container>
									</a>
								</Link>
								{!moreNFTSError && !moreNFTSLoading
									? moreNFTs
											.map((post) => legacy_nft_to_new(post))
											.slice(0, 3)
											.map((item) => (
												<SweetshopNFT
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
	let description = nft.description;
	try {
		description = JSON.parse(nft.description ?? "{}");
	} catch (e) {
		// Create tiptap object with nft.description as one paragraph
		description = {
			type: "doc",
			content: [
				{
					type: "paragraph",
					content: [
						{
							type: "text",
							text: nft.description,
						},
					],
				},
			],
		};
	}

	const returnObj = {
		id: nft.id,
		nft,
		description,
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
		<Container className="w-full xl:w-1/2 flex-shrink-0 lg:h-[90vh] h-[calc(80vh-64px)] flex items-center justify-center xl:sticky top-4">
			{isLightboxOpen && (isOwned || !nft.protected) && (
				<FullscreenImagePreviewModal
					isOpen={isLightboxOpen}
					onClose={onLightboxClose}
					url={`/api/v3/image/nft/${nft._id}/hd`}
					title={nft.name}
				/>
			)}
			<Container className="container flex flex-col justify-center flex-1 h-full gap-4 py-4 lg:py-0">
				<Container className="relative flex items-center justify-center w-full h-full overflow-hidden rounded-xl drop-shadow-xl">
					<img
						onClick={onLightboxOpen}
						src={`/api/v3/image/nft/${nft._id}/${
							(nft.isProtected && !isOwned) || nft.protected ? "blur" : "sd"
						}`}
						className="absolute top-0 left-0 object-contain w-full h-full overflow-hidden hover:cursor-zoom-in rounded-xl"
						sizes="100vw"
						alt={nft.name}
					/>
				</Container>

				<Container className="flex flex-col gap-2 mt-8">
					<Container className="flex justify-between">
						<Text>
							<ImportantText>
								{remainingNfts !== 0 &&
									`Minting ${mintedNfts + +1} of ${maxNftSupply}`}
							</ImportantText>
						</Text>
						<Text>
							<ImportantText>
								{remainingNfts !== 0 &&
									Math.ceil((mintedNfts / maxNftSupply) * 100) + "%"}
								{remainingNfts === 0 && "100%"}
							</ImportantText>
						</Text>
					</Container>

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
								width: `${
									remainingNfts > 0
										? Math.ceil((mintedNfts / maxNftSupply) * 100)
										: 100
								}%`,
								backgroundColor: "$textContrast",
							}}
						/>
					</Container>
				</Container>

				<Container className="flex flex-col justify-between gap-4 md:flex-row">
					<Container>
						{mintedNfts !== maxNftSupply && (
							// &&!(nft.creator.address.toLowerCase() === address?.toLowerCase())
							<BuyNFTButton
								postUtils={postUtils}
								nftData={nft}
							/>
						)}
						{mintedNfts === maxNftSupply && (
							<Button
								appearance={"disabled"}
								disabled
								css={{color: "$red10"}}
							>
								Sold out
							</Button>
						)}
					</Container>
				</Container>
			</Container>
		</Container>
	);
}

function ResaleListings({nft}) {
	const {isLoading: loadingResaleListings, resaleListings} =
		useGetResaleListings(nft.id);
	return (
		<Container className="flex flex-col gap-2">
			<Container className="flex justify-between gap-4">
				<Heading size="xss">Other listings</Heading>
				{resaleListings.length !== 0 && (
					<Button appearance={"subtle"}>View all</Button>
				)}
			</Container>
			{loadingResaleListings && (
				<>
					<Container className="py-4 flex justify-center">
						<Text>
							<Spinner />
						</Text>
					</Container>
				</>
			)}
			{!loadingResaleListings && (
				<>
					{resaleListings.length > 0 && (
						<Container className="flex flex-col mt-4">
							{resaleListings.map((listing) => (
								<Container
									key={listing.seller.address}
									className="rounded-xl p-2 flex justify-between"
									css={{
										"&:hover": {
											backgroundColor: "$elementOnSurface",
										},
									}}
								>
									<Container className="flex gap-4"></Container>
									<Button
										appearance={"action"}
										className="h-fit self-start"
									>
										Buy for ${listing.price.toNumber()}
									</Button>
								</Container>
							))}
						</Container>
					)}

					{resaleListings.length === 0 && (
						<Container className="flex">
							<Text>No resale listings available for this NFT</Text>
						</Container>
					)}
				</>
			)}
		</Container>
	);
}

function Activity({nft}) {
	return (
		<Provider value={treatOldGraphClient}>
			<Container className="flex flex-col gap-2">
				<Heading size="xss">Activity</Heading>
				<TransactionsPresentation nft={nft} />
			</Container>
		</Provider>
	);
}

const resaleHistory = (nft) => gql`
      query getSales($first: Int, $orderBy: String, $orderDirection: String) {
        sales(
          first: 200,
          orderBy: "cost",
          orderDirection: "asc",
          where: {
            treatsPurchased_contains: [${nft.id}],
            sourceContract: "0xA38978E839c08046FA80B0fee55736253Ab3B8a3"
          }
        ) {
          id
          cost
          sourceContract
          treatsPurchased
          seller
          buyer
          purchaseDate
        }
      }
    `;

const salesHistory = (nft) => gql`
      query getSales($first: Int) {
        sales(
          first: 200
          where: {
            treatsPurchased_contains: [${nft.id}],
            sourceContract_not_in: ["0xA38978E839c08046FA80B0fee55736253Ab3B8a3","0xe0f5df4915242e4c4c06d2964eda53c448fec442"]
          }
        ) {
          id
          cost
          sourceContract
          treatsPurchased
          seller
          buyer
          purchaseDate
        }
      }
    
`;

type SaleItem = {
	id: string;
	cost: string;
	sourceContract: string;
	treatsPurchased: string[];
	seller: string;
	buyer: string;
	purchaseDate: string;
};

const TransactionsPresentation = ({nft}) => {
	const [result, reexecuteQuery] = useQuery({
		query: salesHistory(nft),
	});

	const txHistory = useMemo(() => {
		if (!result.data) return [];
		return result.data.sales as SaleItem[];
	}, [result]);

	const {isLoading, data} = TreatCore.useQuery({
		queryKey: [`resaleHistory:${nft.id}`],
		queryFn: async () => {
			const addresses = txHistory.map((tx) => tx.seller.toLowerCase());
			const res = await axios.post(`${apiEndpoint}/people/get-by-address`, {
				addresses,
			});
			return res.data.data;
		},
		enabled: txHistory.length > 0,
	});

	const txHistoryWithProfile = useMemo(() => {
		if (!data) return [];
		return txHistory.map((tx) => {
			const buyer = data.find(
				(profile) => profile.address.toLowerCase() === tx.buyer.toLowerCase()
			);
			const seller = data.find(
				(profile) => profile.address.toLowerCase() === tx.seller.toLowerCase()
			);
			return {
				...tx,
				buyer: buyer || {address: tx.buyer},
				seller: seller || {address: tx.seller},
				buyerAddress: tx.buyer,
				sellerAddress: tx.seller,
			};
		});
	}, [data]);

	return (
		<Container className="flex flex-col gap-4">
			{isLoading && (
				<Container className="py-4 justify-center">
					<Spinner />
				</Container>
			)}
			{!isLoading && txHistoryWithProfile.length === 0 && (
				<Container className="py-4 justify-center">
					<Button appearance={"surface"}>NFT has no sales history</Button>
				</Container>
			)}
			{txHistoryWithProfile.map((tx) => (
				<Container
					key={tx.id}
					className="p-2 flex rounded-xl justify-between"
				>
					<Container className="flex gap-4">
						<UserAvatar
							size={32}
							username={tx.buyer.username}
							profile_pic={tx.buyer.profile_pic}
						/>
						<Container>
							<Heading size={"xss"}>Purchased for {tx.cost} BNB</Heading>
							<Container className="flex gap-2">
								<Text>
									{tx.buyer.username ??
										tx.buyer.address.slice(0, 5) +
											"..." +
											tx.buyer.address.slice(tx.buyer.address.length - 4)}
								</Text>
								<Text>&bull;</Text>
								<Text>{timeFromNow(parseInt(tx.purchaseDate) * 1000)}</Text>
							</Container>
						</Container>
					</Container>
					<Button appearance={"link"}>
						View on Bscscan <ExternalLinkIcon className="w-5 h-5" />
					</Button>
				</Container>
			))}
		</Container>
	);
};
