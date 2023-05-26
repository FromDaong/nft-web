import AddToWishlist from "@components/MarketPlace/Details/Modals/AddToWishlist";
import ShowAllCollectors from "@components/MarketPlace/Details/Modals/Collectors";
import {TiptapPreview} from "@components/ui/tiptap";
import {HeartIcon} from "@heroicons/react/outline";
import AvatarGroup from "@packages/avatars/AvatarGroup";
import {useWagmiGetCreatorNftCost} from "@packages/chain/hooks";
import {useDisclosure} from "@packages/hooks";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	SmallText,
} from "@packages/shared/components/Typography/Text";
import {CopyIcon} from "lucide-react";
import Link from "next/link";
import {useMemo} from "react";

const NFTPresentationComponent = (props: {
	nft: any;
	isOwned: boolean;
	balance: number;
	loadHD: () => void;
	openFullScreen: () => void;
	address: string;
	isResale: boolean;
	maxSupply: number;
}) => {
	const {nft} = props;
	const {cost: creatorCost} = useWagmiGetCreatorNftCost(nft.id);

	const description = useMemo(() => {
		if (typeof nft.description === "string") {
			return JSON.parse(nft.description);
		}
		return nft.description;
	}, [nft]);

	const {
		isOpen: isWishlistModalOpen,
		onOpen: onOpenWishlistModal,
		onClose: onCloseWishlistModal,
	} = useDisclosure();

	const {
		isOpen: isCollectorsModalOpen,
		onOpen: onOpenCollectorsModal,
		onClose: onCloseCollectorsModal,
	} = useDisclosure();

	console.log({description});

	return (
		<>
			<AddToWishlist
				isOpen={isWishlistModalOpen}
				onClose={onCloseWishlistModal}
			/>
			<ShowAllCollectors
				isOpen={isCollectorsModalOpen}
				onClose={onCloseCollectorsModal}
			/>
			<Container className="flex flex-col gap-12 py-8 lg:gap-16 lg:flex">
				<Container className="flex flex-col gap-8">
					<Container
						className={"flex md:flex-col flex-col-reverse gap-2 md:gap-1"}
					>
						<Heading
							size={"sm"}
							className="tracking-tighter"
						>
							{nft.name}
						</Heading>
						<Container className="flex flex-col md:flex-row gap-2 justify-between md:items-center">
							<Link href={`/${nft.creator.username}`}>
								<a>
									<Container className="flex gap-2">
										<Text>Created by</Text>
										<Text
											css={{color: "$textContrast"}}
											className="underline"
										>
											<ImportantText>
												{nft.creator.profile.display_name?.trim() === ""
													? `@${nft.creator.username}`
													: nft.creator.profile.display_name}
											</ImportantText>
										</Text>
									</Container>
								</a>
							</Link>
							<Container className="flex gap-4">
								<Button
									appearance={"surface"}
									className="underline"
									onClick={onOpenWishlistModal}
								>
									<HeartIcon className="w-5 h-5" />
									Save
								</Button>
								<Button
									appearance={"surface"}
									className="underline"
								>
									<CopyIcon className="w-5 h-5" />
									Copy link
								</Button>
							</Container>
						</Container>
					</Container>
					<Container className="flex flex-wrap gap-4">
						<Container className="flex flex-col gap-2">
							<Heading
								appearance={"mute"}
								size={"xss"}
							>
								Owned by
							</Heading>
							<Container className="flex items-center w-fit">
								<AvatarGroup
									users={[
										{
											name: "Tatenda",
											imageUrl: nft.creator.profile.profile_pic,
											href: nft.creator.username,
										},
										{
											name: "Tatenda",
											imageUrl: nft.creator.profile.profile_pic,
											href: nft.creator.username,
										},
										{
											name: "Tatenda",
											imageUrl: nft.creator.profile.profile_pic,
											href: nft.creator.username,
										},
										{
											name: "Tatenda",
											imageUrl: nft.creator.profile.profile_pic,
											href: nft.creator.username,
										},
									]}
								/>
								<Container className="flex gap-2">
									<Button
										appearance={"link"}
										size={"sm"}
										onClick={onOpenCollectorsModal}
									>
										+3 more
									</Button>
								</Container>
							</Container>
						</Container>
					</Container>
				</Container>

				<Container className="flex flex-col col-span-2 gap-4 md:col-span-1">
					{nft.description && (
						<Container className="flex flex-col gap-2">
							<Heading
								className="tracking-tighter"
								size="xss"
							>
								Description
							</Heading>
							<TiptapPreview value={description} />
						</Container>
					)}
				</Container>

				<Container className="flex flex-col col-span-2 gap-2 md:col-span-1">
					<Heading
						className="tracking-tighter"
						size="xss"
					>
						Tags
					</Heading>
					<Container className="flex flex-wrap gap-4 py-2">
						{nft.tags?.map((tag) => (
							<Link
								href={`/sweetshop/tag/${tag}`}
								key={tag}
							>
								<a>
									<Container
										className="px-3 py-1 rounded-full"
										css={{
											backgroundColor: "$surfaceOnSurface",
										}}
									>
										<Text>
											<ImportantText>{tag}</ImportantText>
										</Text>
									</Container>
								</a>
							</Link>
						))}
						<Tag>NFT</Tag>
					</Container>
				</Container>
			</Container>
		</>
	);
};

export default NFTPresentationComponent;

export function Tag({children}) {
	return (
		<Container
			className="px-3 py-1 border rounded-full shadow-sm"
			css={{
				backgroundColor: "$surfaceOnSurface",
				borderColor: "$border",
			}}
		>
			<SmallText>
				<ImportantText>{children ?? name}</ImportantText>
			</SmallText>
		</Container>
	);
}

function Stat({title, value}) {
	return (
		<Container
			className="flex flex-col items-baseline overflow-hidden border rounded-lg shadow-sm"
			css={{
				borderColor: "$border",
			}}
		>
			<SmallText
				className="tracking-tighter"
				css={{
					backgroundColor: "$surface",
					padding: "0.5rem",
				}}
			>
				<ImportantText>{title}</ImportantText>
			</SmallText>
			<Heading
				className="w-full tracking-tighter text-center"
				css={{
					backgroundColor: "$surfaceOnSurface",
					padding: "0.5rem",
				}}
				size="xs"
			>
				{value}
			</Heading>
		</Container>
	);
}

function Collector({nft}) {
	return (
		<Container className="flex flex-col col-span-2 gap-2">
			<Heading
				appearance={"mute"}
				size={"xss"}
			>
				Collection
			</Heading>
			<Container
				css={{backgroundColor: "$surfaceOnSurface"}}
				className="flex flex-wrap justify-between gap-4 shadow rounded-xl w-fit"
			>
				<Container className="flex items-center gap-4 p-2 pr-4">
					<img
						src={nft.creator.profile.profile_pic}
						alt={"Collection name"}
						className="object-cover w-20 rounded-xl aspect-square"
					/>
					<Container className="flex flex-col gap-2">
						<Heading size={"xss"}>The Killer Collection</Heading>
						<Container className={"flex gap-2"}>
							<AvatarGroup
								users={[
									{
										name: "Tatenda",
										imageUrl: nft.creator.profile.profile_pic,
										href: nft.creator.username,
									},
									{
										name: "Tatenda",
										imageUrl: nft.creator.profile.profile_pic,
										href: nft.creator.username,
									},
									{
										name: "Tatenda",
										imageUrl: nft.creator.profile.profile_pic,
										href: nft.creator.username,
									},
									{
										name: "Tatenda",
										imageUrl: nft.creator.profile.profile_pic,
										href: nft.creator.username,
									},
								]}
							/>
						</Container>
					</Container>
				</Container>
			</Container>
		</Container>
	);
}
