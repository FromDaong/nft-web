import StudioNavigation from "@components/CreatorDashboard/StudioNavigation";
import CollectionNFTPreview from "@components/NFTCard/cards/CollectionNFTPreview";
import {
	ExternalLinkIcon,
	PencilIcon,
	PlusIcon,
	UserAddIcon,
} from "@heroicons/react/outline";
import {TritPost} from "@packages/post/TritPost";
import {TritPostProps} from "@packages/post/types";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Divider} from "@packages/shared/components/Divider";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {ImportantText} from "@packages/shared/components/Typography/Text";
import Avvvatars from "avvvatars-react";
import axios from "axios";
import TreatCore from "core/TreatCore";
import UserAvatar from "core/auth/components/Avatar";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import Link from "next/link";
import {useRouter} from "next/router";

const NFTs: Array<TritPostProps> = [
	{
		_id: "38893",
		creator: {
			avatar: "https://picsum.photos/seed/picsum/300/300",
			display_name: "Chris",
			username: "tatenda",
			address: "0x0898239832",
			bio: "My bio is private",
		},
		id: "19",
		max_supply: 10,
		image: {
			cdn: "https://picsum.photos/seed/picsum/720/720",
			ipfs: "https://picsum.photos/seed/picsum/720/720",
		},
		post_type: "colletible",
		isSoldOut: true,
		collection: {
			avatar: "https://picsum.photos/seed/picsum/720/720",
			minted: 10,
			name: "My collection name",
			totalSupply: 60,
		},
		blurhash: "",
		name: "Trust the process",
		price: {
			currency: "BNB",
			value: 0.001,
		},
	},
];

export default function CollectionPage() {
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

	console.log(nfts, {collection});

	return (
		<ApplicationLayout>
			<ApplicationFrame>
				<Container className="flex flex-col gap-4 px-4 py-4 md:pt-0 lg:px-0">
					<Container className="flex items-baseline justify-between">
						<StudioNavigation />
					</Container>
				</Container>
				<Container className="flex justify-end pt-8 ">
					<Container className={"flex gap-4"}>
						<Button appearance={"surface"}>
							<UserAddIcon className="w-5 h-5" /> Invite collaborators
						</Button>
						<Button>
							<ExternalLinkIcon className="w-5 h-5" /> Open in sweetshop
						</Button>
					</Container>
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
								className={"rounded-2xl h-24 w-24"}
								css={{
									background: `url(${collection.cover_image}) no-repeat center center / cover`,
								}}
							/>
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
				<Container className="flex justify-between gap-4 pt-8 mt-8">
					<Heading size={"xs"}>
						{isLoadingNFTs && !nfts && (
							<Container
								className="h-full w-96"
								css={{backgroundColor: "$surfaceOnSurface"}}
							/>
						)}
						{!!nfts && (
							<>NFTs ({Intl.NumberFormat().format(nfts.docs.length)})</>
						)}
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
			</ApplicationFrame>
		</ApplicationLayout>
	);
}

function ContentCollectionPreview({NFTs}) {
	return (
		<Container className="flex flex-col gap-12 my-12">
			<Container
				className={"flex flex-row-reverse lg:flex-row justify-between"}
			>
				<Container className={"w-full lg:w-1/3"}>
					<Container className={"flex flex-col gap-2"}>
						<Heading>TreatDAO Content Fanpack</Heading>
						<Text>
							Tech Dinner Series (TDS) connects founders, investors, operators &
							developers over selectively curated and intimate dinner & drinks
							happy hour experiences across New York City, San Francisco, &
							Seattle.
						</Text>
					</Container>

					<Button
						appearance={"surface"}
						className={"mt-8"}
					>
						Go to collection
					</Button>
				</Container>
				<Container
					className={
						"aspect-square w-full lg:w-48 lg:h-auto bg-gray-200 max-h-48 max-w-48 rounded-xl"
					}
				></Container>
			</Container>
			<Container
				className={"grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-8"}
			>
				{NFTs.map((nft) => (
					<TritPost
						{...nft}
						key={nft.id}
					/>
				))}
			</Container>
		</Container>
	);
}
