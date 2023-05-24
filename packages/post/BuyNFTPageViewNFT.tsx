import {
	DotsCircleHorizontalIcon,
	DotsHorizontalIcon,
} from "@heroicons/react/outline";
import AvatarGroup from "@packages/avatars/AvatarGroup";
import {
	useWagmiGetCreatorNftCost,
	useWagmiGetSubscriberNftCost,
	useWagmiGetTreatOfTheMonthNftCost,
} from "@packages/chain/hooks";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	SmallText,
} from "@packages/shared/components/Typography/Text";
import UserAvatar from "core/auth/components/Avatar";
import Image from "next/future/image";
import Link from "next/link";

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
	const {cost: treatCost} = useWagmiGetTreatOfTheMonthNftCost(nft.id);
	const {cost: subscriptionCost} = useWagmiGetSubscriberNftCost(nft.id);

	let nftCost: any = nft.subscription_nft ? subscriptionCost : creatorCost;
	nftCost = nft.totm_nft ? treatCost : nftCost;

	const displayedCost = nftCost;

	return (
		<>
			<Container className="flex-col gap-12 py-8 lg:gap-16 lg:flex">
				<Container className="flex flex-col gap-8">
					<Container className={"flex flex-col gap-2"}>
						<Link href={`/${nft.creator.username}`}>
							<a>
								<Container className="flex items-center gap-4 w-fit">
									<UserAvatar
										username={nft.creator.username}
										profile_pic={nft.creator.profile.profile_pic}
										size={24}
									/>
									<Container className="flex gap-2">
										<SmallText>Created by</SmallText>
										<SmallText css={{color: "$textContrast"}}>
											<ImportantText>
												{nft.creator.profile.display_name?.trim() === ""
													? `@${nft.creator.username}`
													: nft.creator.profile.display_name}
											</ImportantText>
										</SmallText>
									</Container>
								</Container>
							</a>
						</Link>
						<Container className="flex justify-between">
							<Heading className="tracking-tighter">{nft.name}</Heading>
							<Button appearance={"link"}>
								<DotsHorizontalIcon className="w-5 h-5" />
							</Button>
						</Container>
					</Container>
					<Container className="flex flex-wrap gap-4">
						<Container className="flex flex-col gap-2">
							<Heading
								appearance={"mute"}
								size={"xss"}
							>
								Collected by
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
									>
										+3 more
									</Button>
								</Container>
							</Container>
						</Container>
						<Container className="flex flex-col gap-2">
							<Heading
								appearance={"mute"}
								size={"xss"}
							>
								Previous owners
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
									>
										+3 more
									</Button>
								</Container>
							</Container>
						</Container>
					</Container>
				</Container>

				<Container className="col-span-2">
					<Link href={`/${nft.creator.username}`}>
						<a className={"flex flex-col gap-2"}>
							<Heading size={"xss"}>Collection</Heading>
							<Container
								className="flex items-center gap-4 p-2 border rounded-lg w-fit"
								css={{borderColor: "$subtleBorder"}}
							>
								<img
									src={nft.creator.profile.profile_pic}
									alt={"Collection name"}
									height={32}
									width={32}
									className="object-cover rounded aspect-square"
								/>
								<Container className="flex gap-2">
									<Text css={{color: "$textContrast"}}>
										<ImportantText>THE KILLER COLLECTION</ImportantText>
									</Text>
								</Container>
							</Container>
						</a>
					</Link>
				</Container>

				<Container className="flex flex-col col-span-2 gap-4 md:col-span-1">
					{nft.description?.trim() && (
						<Container className="flex flex-col gap-2">
							<Heading
								className="tracking-tighter"
								size="xss"
							>
								Description
							</Heading>
							<Text>{nft.description}</Text>
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
				<Container className="flex gap-4">
					<Container
						className="flex flex-col items-baseline overflow-hidden border rounded-lg shadow-sm"
						css={{borderColor: "$border"}}
					>
						<SmallText
							className="tracking-tighter"
							css={{backgroundColor: "$surface", padding: "0.5rem"}}
						>
							<ImportantText>Price</ImportantText>
						</SmallText>
						<Heading
							className="w-full tracking-tighter"
							css={{backgroundColor: "$surfaceOnSurface", padding: "0.5rem"}}
							size="xs"
						>
							{displayedCost} BNB
						</Heading>
					</Container>
					<Stat
						title={"Max Supply"}
						value={props.maxSupply}
					/>
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
