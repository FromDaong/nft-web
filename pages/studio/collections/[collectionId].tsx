import StudioNavigation from "@components/CreatorDashboard/StudioNavigation";
import CollectionNFTPreview from "@components/NFTCard/cards/CollectionNFTPreview";
import {
	ExternalLinkIcon,
	PlusIcon,
	UserAddIcon,
} from "@heroicons/react/outline";
import {TritPost} from "@packages/post/TritPost";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Divider} from "@packages/shared/components/Divider";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {ImportantText} from "@packages/shared/components/Typography/Text";
import axios from "axios";
import TreatCore from "core/TreatCore";
import UserAvatar from "core/auth/components/Avatar";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import {Upload} from "lucide-react";
import Link from "next/link";
import {useRouter} from "next/router";
import {useAccount} from "wagmi";

export default function CollectionPage() {
	return (
		<ApplicationLayout>
			<ApplicationFrame>
				<Container className="flex flex-col gap-4 px-4 py-4 md:pt-0 lg:px-0">
					<Container className="flex items-baseline justify-between">
						<StudioNavigation />
					</Container>
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
					className="flex flex-col items-center justify-center gap-24 mt-8 rounded-xl"
				>
					<Container
						className="flex flex-col items-center justify-center gap-8 py-16 rounded-xl w-full h-full"
						css={{backgroundColor: "$overlay"}}
					>
						<Container
							className={
								"rounded-2xl h-24 w-24 flex items-center justify-center"
							}
							css={{
								background: `url(${collection.cover_image}) no-repeat center center / cover`,
							}}
						>
							{isOwner && (
								<Button
									css={{
										padding: "12px",
										borderRadius: "9999px",
										backgroundColor: "$surfaceOnSurface",
										color: "$textContrast",
									}}
								>
									<Upload className="w-4 h-4" />
								</Button>
							)}
						</Container>
						<Container className="max-w-2xl text-center">
							<Heading
								css={{color: "$white"}}
								size={"sm"}
							>
								{collection.name}
							</Heading>
						</Container>
						<Container
							className="flex items-center gap-4 p-2 rounded-full w-fit shadow pr-8"
							css={{backgroundColor: "$surface"}}
						>
							<UserAvatar
								size={32}
								username={collection.creator.username}
								profile_pic={collection.creator.avatar}
							/>
							<Link href={`/${collection.creator.username}`}>
								<a>
									<Text>
										Created by{" "}
										<ImportantText>
											@{collection.creator.username}
										</ImportantText>
									</Text>
								</a>
							</Link>
						</Container>
					</Container>
				</Container>
			)}
			<Container className="flex justify-between gap-4 pt-8 mt-8 items-end">
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
