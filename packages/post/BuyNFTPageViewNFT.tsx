import {
	useWagmiGetCreatorNftCost,
	useWagmiGetSubscriberNftCost,
	useWagmiGetTreatOfTheMonthNftCost,
} from "@packages/chain/hooks";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	SmallText,
} from "@packages/shared/components/Typography/Text";
import UserAvatar from "core/auth/components/Avatar";
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
			<Container className="grid grid-cols-1">
				<Container className="grid flex-col grid-cols-1 gap-12 py-8 lg:gap-16 md:grid-cols-2 lg:col-span-2 lg:flex">
					<Container className="flex flex-col gap-4">
						<Heading className="tracking-tighter">{nft.name}</Heading>
						<Container className="flex gap-4">
							<Link href={`/${nft.creator.username}`}>
								<a>
									<Container
										className="flex items-center gap-4 p-2 pr-3 rounded-lg shadow-sm w-fit"
										css={{
											backgroundColor: "$surfaceOnSurface",
										}}
									>
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
							<Link href={`/${nft.creator.username}`}>
								<a>
									<Container
										className="flex items-center gap-4 p-2 pr-3 rounded-lg shadow-sm w-fit"
										css={{backgroundColor: "$surfaceOnSurface"}}
									>
										<UserAvatar
											username={nft.creator.username}
											profile_pic={nft.creator.profile.profile_pic}
											size={24}
										/>
										<Container className="flex gap-2">
											<SmallText>FROM</SmallText>
											<SmallText css={{color: "$textContrast"}}>
												<ImportantText>THE KILLER COLLECTION</ImportantText>
											</SmallText>
										</Container>
									</Container>
								</a>
							</Link>
						</Container>
					</Container>

					<Container className="flex flex-col col-span-2 gap-4 md:col-span-1">
						{nft.description?.trim() && (
							<Container className="flex flex-col gap-2">
								<Heading
									className="tracking-tighter"
									size="xs"
								>
									Description
								</Heading>
								<Text>{nft.description}</Text>
							</Container>
						)}
						<Container className="flex gap-4">
							<Container
								className="flex items-center gap-2 p-2 pr-3 border rounded-lg shadow-sm w-fit"
								css={{
									backgroundColor: "$surfaceOnSurface",
									borderColor: "$subtleBorder",
								}}
							>
								<UserAvatar
									username={nft.creator.username}
									profile_pic={nft.creator.profile.profile_pic}
									size={16}
								/>
								<Container className="flex gap-2">
									<SmallText>
										Liked by{" "}
										<ImportantText css={{color: "$textContrast"}}>
											0x0093...0832{" "}
										</ImportantText>
										and 14k others
									</SmallText>
								</Container>
							</Container>
						</Container>
					</Container>

					<Container className="flex flex-col col-span-2 gap-2 md:col-span-1">
						<Heading
							className="tracking-tighter"
							size="xs"
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
