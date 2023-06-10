import StudioNavigation from "@components/CreatorDashboard/StudioNavigation";
import CollectionNFTPreview from "@components/NFTCard/cards/CollectionNFTPreview";
import {FrostyBackgroundContainer} from "@components/NFTCard/misc/FrostyBackground";
import {
	ExternalLinkIcon,
	PlusIcon,
	UserAddIcon,
} from "@heroicons/react/outline";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Divider} from "@packages/shared/components/Divider";
import {Heading} from "@packages/shared/components/Typography/Headings";
import axios from "axios";
import TreatCore from "core/TreatCore";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import {ShareIcon} from "lucide-react";
import {Upload} from "lucide-react";
import Link from "next/link";
import {useRouter} from "next/router";
import {useAccount} from "wagmi";

export default function CollectionPage() {
	return (
		<ApplicationLayout>
			<ApplicationFrame>
				<Container className="flex flex-col gap-4 px-4 py-4 md:pt-0 lg:px-0">
					<Container className="flex items-baseline justify-between"></Container>
				</Container>
				<CollectionRenderer />
			</ApplicationFrame>
		</ApplicationLayout>
	);
}

export const CollectionRenderer = () => {
	const {address} = useAccount();
	const router = useRouter();
	const {collectionId} = router.query;

	// Fetch collection data from the API
	const {
		data: collection,
		isLoading,
		isError,
	} = TreatCore.useQuery(["collection", collectionId], async () => {
		const data = await axios.get(
			`${process.env.NEXT_PUBLIC_HOSTNAME}/api/v3/marketplace/collection/${collectionId}`
		);
		return data.data.data;
	});

	// Fetch NFTs in this collection
	const {
		data: nfts,
		isLoading: isLoadingNFTs,
		isError: isErrorNFTs,
	} = TreatCore.useQuery(["collection", collectionId, "nfts"], async () => {
		const data = await axios.get(
			`${process.env.NEXT_PUBLIC_HOSTNAME}/api/v3/marketplace/collection/${collectionId}/nfts`
		);
		return data.data.data;
	});

	const isOwner = address?.toLowerCase() === collection?.creator.address;
	return (
		<>
			<Container className="flex justify-end pt-8 ">
				{false && isOwner && (
					<Container className={"flex gap-4"}>
						<Button>
							<ExternalLinkIcon className="w-5 h-5" /> Open in sweetshop
						</Button>
						{collection && (
							<Container className="flex">
								<Button appearance={"surface"}>
									<UserAddIcon className="w-5 h-5" /> Invite collaborators
								</Button>
							</Container>
						)}
					</Container>
				)}
			</Container>
			{!isLoading && !isError && (
				<Container
					css={{
						backgroundColor: "$textContrast",
						background: `url(${
							collection.cover_image ?? "/assets/bg.jpg"
						}) no-repeat center center / cover`,
					}}
					className="flex flex-col items-center justify-center gap-24 mt-8 rounded-xl h-96"
				>
					<Container
						className="flex flex-col items-center justify-end w-full h-full gap-8 py-8 rounded-xl"
						css={{backgroundColor: "$overlay"}}
					>
						<Container className="max-w-2xl text-center">
							<Heading
								css={{color: "$white"}}
								size={"md"}
							>
								{collection.name}
							</Heading>
						</Container>
						<Container
							className={
								"w-full flex gap-8 justify-end max-w-screen-xl container mx-auto p-4"
							}
						>
							<FrostyBackgroundContainer
								css={{
									padding: "1rem",
									borderRadius: "9999px",
								}}
							>
								<Button
									css={{color: "$white"}}
									appearance={"unstyled"}
								>
									<Upload className="w-5 h-5" />
								</Button>
							</FrostyBackgroundContainer>
							<FrostyBackgroundContainer
								css={{
									padding: "1rem",
									borderRadius: "9999px",
								}}
							>
								<Button
									css={{color: "$white"}}
									appearance={"unstyled"}
								>
									<ShareIcon className="w-5 h-5" />
								</Button>
							</FrostyBackgroundContainer>
						</Container>
					</Container>
				</Container>
			)}
			<Container className="flex items-end justify-between gap-4 pt-8 mt-8">
				<Heading size={"xs"}>
					{isLoadingNFTs && !nfts && (
						<Container
							className="h-full w-96"
							css={{backgroundColor: "$surfaceOnSurface"}}
						/>
					)}
					{!!nfts && <>NFTs ({Intl.NumberFormat().format(nfts.docs.length)})</>}
				</Heading>
				<Link href={`/create/${collectionId}`}>
					<a>
						<Button appearance={"surface"}>
							<PlusIcon className="w-5 h-5" /> Add NFTs to collection
						</Button>
					</a>
				</Link>
			</Container>
			<Divider dir={"horizontal"} />
			{!isLoadingNFTs && !isErrorNFTs && (
				<Container
					className={
						"grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 py-8 gap-8"
					}
				>
					{nfts.docs.map((nft) => (
						<CollectionNFTPreview
							_id={nft._id}
							creator={{
								...nft.creator,
								profile: {
									_id: nft.creator.profile,
								},
							}}
							name={nft.name}
							isMine={true}
							isProtected={nft.isProtected}
							key={nft.id}
						/>
					))}
				</Container>
			)}
		</>
	);
};
