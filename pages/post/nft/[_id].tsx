/* eslint-disable no-mixed-spaces-and-tabs */
import {pagePropsConnectMongoDB} from "@db/engine/pagePropsDB";
import Error404 from "@packages/error/404";
import NFTPresentationComponent, {Tag} from "@packages/post/BuyNFTPageViewNFT";
import {useGetIsNFTOwned, useTritNFTUtils} from "@packages/post/hooks";
import {Container} from "@packages/shared/components/Container";
import {Text} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	SmallText,
} from "@packages/shared/components/Typography/Text";
import {ImageIcon} from "@radix-ui/react-icons";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import {useContext} from "react";
import {MongoModelNFT, MongoModelProfile} from "server/helpers/models";
import {useAccount} from "wagmi";
import {ArticleJsonLd} from "next-seo";
import {SEOHead} from "@packages/seo/page";
import Guard from "@lib/guard";
import {Button} from "@packages/shared/components/Button";
import BuyNFTButton from "@packages/post/BuyNFTButton";
import {useDisclosure} from "@packages/hooks";
import {SparklesIcon} from "@heroicons/react/solid";
import FullscreenImagePreviewModal from "@packages/modals/ImagePreview";
import {Coins, InfoIcon, SendIcon, ShoppingBag} from "lucide-react";
import NFTPageTabs from "@components/NFTPage/Tabs";
import {
	SelectedOrderContext,
	SelectedOrderProvider,
} from "@components/NFTPage/SelectedOrderContext";
import DynamicSkeleton from "@packages/skeleton";
import Spinner from "@packages/shared/icons/Spinner";

export default function NFT(props: {
	notFound?: boolean;
	data: any;
	isResale: boolean;
}) {
	const data = JSON.parse(props.data);
	const {nft} = data;
	nft.description = data.description;

	console.log({nft});

	const {address} = useAccount();
	const {isOwned, balance} = useGetIsNFTOwned(nft);
	const postUtils = useTritNFTUtils(nft);

	if (props.notFound) {
		return <Error404 />;
	}

	return (
		<SelectedOrderProvider
			creator_address={nft.creator.address}
			id={nft.id}
		>
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
						<NFTPreview
							nft={nft}
							postUtils={postUtils}
						/>
						<Container className="flex-1 w-full relative flex flex-col h-full rounded-xl gap-12 container mx-auto pb-32">
							<Container>
								<NFTPresentationComponent
									nft={nft}
									address={address}
								/>
							</Container>
							{isOwned && (
								<OwnersSection
									balance={balance}
									nft={nft}
								/>
							)}

							<NFTPageTabs nft={nft} />
						</Container>
					</Container>
				</ApplicationFrame>
			</ApplicationLayout>
		</SelectedOrderProvider>
	);
}

function NFTPreview({nft, postUtils}) {
	const {
		isOpen: isLightboxOpen,
		onOpen: onLightboxOpen,
		onClose: onLightboxClose,
	} = useDisclosure();

	const {isOwned} = useGetIsNFTOwned(nft);
	const {selectedOrder, isLoading, isError} = useContext(SelectedOrderContext);
	const {maxSupply, currentSupply, isResale, nftId, price, seller} =
		selectedOrder ?? {};

	const mintedNfts = maxSupply - currentSupply;

	return (
		<Container className="w-full xl:w-1/2 flex-shrink-0 lg:h-[90vh] h-[calc(80vh-64px)] flex justify-center xl:sticky top-2">
			{isLightboxOpen && (isOwned || !nft.protected) && (
				<FullscreenImagePreviewModal
					isOpen={isLightboxOpen}
					onClose={onLightboxClose}
					url={`/api/v3/image/nft/${nft._id}/hd`}
					title={nft.name}
				/>
			)}
			<Container className="container flex flex-col justify-center flex-1 h-full gap-4 py-4 lg:py-0">
				<Container className="relative flex justify-center w-full h-full overflow-hidden rounded-xl drop-shadow-xl">
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
						<Container className="flex justify-between gap-8">
							{!isLoading && (
								<>
									<Text>
										<ImportantText>
											{currentSupply !== 0 &&
												`Minting ${currentSupply} of ${maxSupply}`}
										</ImportantText>
									</Text>
									<Text>
										<ImportantText>
											{currentSupply !== 0 &&
												Math.ceil((mintedNfts / maxSupply) * 100) + "%"}
											{currentSupply === 0 && "100%"}
										</ImportantText>
									</Text>
								</>
							)}
							{isLoading && (
								<>
									<BlockSkeleton />
									<BlockSkeleton />
								</>
							)}
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
										currentSupply > 0
											? Math.ceil((mintedNfts / maxSupply) * 100)
											: 100
									}%`,
									backgroundColor: "$textContrast",
								}}
							/>
						</Container>
					</Container>
				)}

				<Container className="flex flex-col justify-between gap-4 md:flex-row">
					{!isLoading && (
						<>
							{!isResale && (
								<Container>
									{mintedNfts !== maxSupply && (
										<BuyNFTButton
											postUtils={postUtils}
											nftData={nft}
										/>
									)}

									{mintedNfts === maxSupply && nft.melon_nft && (
										<BuyNFTButton
											postUtils={postUtils}
											nftData={nft}
										/>
									)}
									{mintedNfts === maxSupply && !nft.melon_nft && (
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
							)}
							{isResale && (
								<ResaleListingBuyButton
									currentSupply={currentSupply}
									seller={seller}
									id={nftId}
									price={price}
								/>
							)}
						</>
					)}
					{isLoading && <BlockSkeleton />}
				</Container>
			</Container>
		</Container>
	);
}

const OwnersSection = ({nft, balance}) => {
	return (
		<Container
			css={{backgroundColor: "$elementOnSurface", borderColor: "$subtleBorder"}}
			className="p-4 rounded-xl flex flex-col w-full gap-8"
		>
			<Container className="w-full flex gap-2 items-center">
				<Text>
					<ImportantText>Owner's section</ImportantText>
				</Text>
				<Tag>{balance} owned</Tag>
			</Container>
			<Container className="flex flex-col gap-4 justify-between">
				<Button
					css={{padding: "1rem"}}
					appearance={"surface"}
					outlined
				>
					<SendIcon className="w-5 h-5" />
					Send to address
				</Button>
				<Button
					css={{padding: "1rem"}}
					appearance={"action"}
				>
					<ShoppingBag className="w-5 h-5" />
					List for sale
				</Button>
			</Container>
		</Container>
	);
};

const ResaleListingBuyButton = (order: {
	price: number;
	seller: string;
	id: number;
	currentSupply: number;
}) => {
	const {isLoading} = useContext(SelectedOrderContext);
	return (
		<>
			<Button appearance={"resale"}>
				{!isLoading && (
					<>
						<Coins className="w-4 h-4" />
						Buy for {order.price} BNB
					</>
				)}
				{isLoading && (
					<>
						<Spinner />
						Loading...
					</>
				)}
			</Button>
		</>
	);
};

const BlockSkeleton = () => (
	<Container className="max-w-32 w-full">
		<DynamicSkeleton
			config={[
				{
					columns: [
						{
							length: 1,
							start: 1,
							radius: 8,
						},
					],
					type: "row",
					repeat: 1,
					height: 2,
				},
			]}
		/>
	</Container>
);

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
