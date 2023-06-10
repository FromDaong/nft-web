/* eslint-disable no-mixed-spaces-and-tabs */
import {pagePropsConnectMongoDB} from "@db/engine/pagePropsDB";
import Error404 from "@packages/error/404";
import NFTPresentationComponent, {
	useGetResaleListings,
} from "@packages/post/BuyNFTPageViewNFT";
import {useGetIsNFTOwned, useTritNFTUtils} from "@packages/post/hooks";
import {Container} from "@packages/shared/components/Container";
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
import FullscreenImagePreviewModal from "@packages/modals/ImagePreview";
import SweetshopNFT from "@components/NFTCard/cards/Sweetshop";
import {ExternalLinkIcon, InfoIcon} from "lucide-react";
import Spinner from "@packages/shared/icons/Spinner";
import {Provider, gql, useQuery} from "urql";
import {treatGraphClient} from "@lib/graphClients";
import Web3 from "web3";
import {useRouter} from "next/router";
import ResaleListings from "@components/NFTPage/ResaleListings";
import {ActionTab, Tab, TabsContainer} from "@packages/shared/components/Tabs";
import NFTPageTabs from "@components/NFTPage/Tabs";
import CreatorProfileNFT from "@components/NFTCard/cards/ProfileListingCard";

const useOrder = (creator_address: string) => {
	const router = useRouter();
	const {id, seller} = router.query;
	const isResale = (seller as string)?.toLowerCase() !== creator_address;

	return {
		isResale,
	};
};

const tokenQuery = gql`
	query token($id: BigInt!) {
		tokens(where: {identifier: $id}) {
			identifier
			totalSales
			totalSupply
			totalSaleValue
			creator {
				id
				totalSales
			}
			transfers(first: 10) {
				timestamp
				value
				from {
					id
				}
				to {
					id
				}
				operator {
					id
				}
			}
		}
	}
`;

export default function NFT(props: {
	notFound?: boolean;
	data: any;
	isResale: boolean;
}) {
	const data = JSON.parse(props.data);
	const {nft} = data;
	const {isResale} = useOrder(nft.creator.address);
	const {address} = useAccount();
	const {isOwned, balance} = useGetIsNFTOwned(nft);
	const maxNftSupply = useWagmiGetNFTMaxSupply(nft.id);
	const mintedNfts = useWagmiGetNFTTotalSupply(nft.id);
	const postUtils = useTritNFTUtils(nft);

	const [{data: {tokens: [token] = []} = {}, fetching, error}] = useQuery({
		query: tokenQuery,
		variables: {
			id: `${nft.id}`,
		},
		pause: !nft.id,
	});

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
		<Provider value={treatGraphClient}>
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
						<Container className="flex-1 w-full relative flex flex-col h-full rounded-xl gap-12 container mx-auto pb-32">
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
							<NFTPageTabs nft={nft} />
						</Container>
					</Container>
				</ApplicationFrame>
			</ApplicationLayout>
		</Provider>
	);
}

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
	console.log({nft});
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

				{!nft.melon_nft && (
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
				)}

				<Container className="flex flex-col justify-between gap-4 md:flex-row">
					<Container>
						{mintedNfts !== maxNftSupply && (
							<BuyNFTButton
								postUtils={postUtils}
								nftData={nft}
							/>
						)}

						{mintedNfts === maxNftSupply && nft.melon_nft && (
							<BuyNFTButton
								postUtils={postUtils}
								nftData={nft}
							/>
						)}
						{mintedNfts === maxNftSupply && !nft.melon_nft && (
							<Container className="flex gap-4 items-center">
								<Text
									css={{color: "$red9"}}
									className="flex gap-2"
								>
									<ImportantText>Sold out</ImportantText>
									<InfoIcon className="w-5 h-5" />
								</Text>
							</Container>
						)}
					</Container>
				</Container>
			</Container>
		</Container>
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
