/* eslint-disable no-mixed-spaces-and-tabs */
import {pagePropsConnectMongoDB} from "@db/engine/pagePropsDB";
import Error404 from "@packages/error/404";
import NFTPresentationComponent from "@packages/post/BuyNFTPageViewNFT";
import {useGetIsNFTOwned, useTritNFTUtils} from "@packages/post/hooks";
import {Container} from "@packages/shared/components/Container";
import {Text} from "@packages/shared/components/Typography/Headings";
import {ImportantText} from "@packages/shared/components/Typography/Text";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import {useContext} from "react";
import {MongoModelNFT, MongoModelProfile} from "server/helpers/models";
import {useAccount} from "wagmi";
import {ArticleJsonLd} from "next-seo";
import {SEOHead} from "@packages/seo/page";
import Guard from "@lib/guard";
import {useDisclosure} from "@packages/hooks";
import FullscreenImagePreviewModal from "@packages/modals/ImagePreview";
import {InfoIcon} from "lucide-react";
import NFTPageTabs from "@components/NFTPage/Tabs";
import {
	SelectedOrderContext,
	SelectedOrderProvider,
} from "@components/NFTPage/SelectedOrderContext";
import DynamicSkeleton from "@packages/skeleton";
import OwnersSection from "@components/MarketPlace/Details/OwnersSection";
import PurchasedNFTPreview from "@components/MarketPlace/Details/Modals/PurchasedNFTPreview";
import ResaleListingBuyButton from "@components/NFTPage/ResaleBuyButton";
import BuyButton from "@components/NFTPage/BuyButton";

export default function NFT(props: {
	notFound?: boolean;
	data: any;
	isResale: boolean;
}) {
	const data = JSON.parse(props.data);
	const {nft} = data;
	nft.description = data.description;

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
					<Container className="relative flex flex-col gap-8 p-4 px-0 xl:pb-12 xl:flex-row">
						<NFTPreview
							nft={nft}
							postUtils={postUtils}
						/>
						<Container className="container relative flex flex-col flex-1 w-full h-full gap-12 pb-32 mx-auto rounded-xl">
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
	const {isOpen, onOpen, onClose} = useDisclosure();

	const {isOwned} = useGetIsNFTOwned(nft);
	const {selectedOrder, isLoading, isError} = useContext(SelectedOrderContext);
	const {maxSupply, currentSupply, isResale, nftId, price, seller} =
		selectedOrder ?? {};

	const mintedNfts = maxSupply - currentSupply;
	console.log({
		maxSupply,
		currentSupply,
	});
	return (
		<>
			<PurchasedNFTPreview
				isOpen={isOpen}
				nft={nft}
			/>
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

					{!nft.melon_nft && currentSupply !== 0 && !isNaN(mintedNfts) && (
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
													Math.ceil((currentSupply / maxSupply) * 100) + "%"}
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
												? Math.ceil((currentSupply / maxSupply) * 100)
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
										{(currentSupply !== maxSupply || nft.melon_nft) && (
											<BuyButton
												postUtils={postUtils}
												nftData={nft}
												callback={onOpen}
											/>
										)}

										{currentSupply === maxSupply && !nft.melon_nft && (
											<Container className="flex items-center gap-4">
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
								{isResale && !isLoading && (
									<ResaleListingBuyButton
										currentSupply={currentSupply}
										seller={seller}
										id={nftId}
										price={price}
										callback={onOpen}
									/>
								)}
							</>
						)}
						{isLoading && <BlockSkeleton />}
					</Container>
				</Container>
			</Container>
		</>
	);
}

const BlockSkeleton = () => (
	<Container className="w-full max-w-32">
		<DynamicSkeleton
			config={[
				{
					columns: [
						{
							length: 1,
							start: 2,
							radius: 8,
							bg: true,
						},
					],
					type: "row",
					repeat: 3,
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
