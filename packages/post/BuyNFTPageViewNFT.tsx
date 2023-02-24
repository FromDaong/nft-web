import {
	useWagmiGetCreatorNftCost,
	useWagmiGetSubscriberNftCost,
	useWagmiGetTreatOfTheMonthNftCost,
} from "@packages/chain/hooks";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	MutedText,
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
			<Container className="grid grid-cols-1 gap-12 lg:grid-cols-3">
				<Container className="grid flex-col grid-cols-2 gap-12 py-8 lg:col-span-2 lg:flex">
					<Container className="flex flex-col gap-4">
						<Heading
							size="md"
							className="tracking-tighter"
						>
							{nft.name}
						</Heading>
						<Link href={`/${nft.creator.username}`}>
							<a>
								<Container className="flex gap-4 items-center">
									<UserAvatar
										username={nft.creator.username}
										profile_pic={nft.creator.profile.profile_pic}
										size={48}
									/>
									<Container className="flex flex-col gap-2 justify-between">
										<SmallText>
											<MutedText>
												<ImportantText>Creator</ImportantText>
											</MutedText>
										</SmallText>
										<Text>
											<ImportantText>
												{nft.creator.profile.display_name?.trim() === ""
													? `@${nft.creator.username}`
													: nft.creator.profile.display_name}
											</ImportantText>
										</Text>
									</Container>
								</Container>
							</a>
						</Link>
					</Container>
					{nft.description?.trim() && (
						<Container className="flex flex-col col-span-2 gap-4 md:col-span-1">
							<Heading
								className="tracking-tighter"
								size="xs"
							>
								Description
							</Heading>
							<Text>{nft.description}</Text>
						</Container>
					)}

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
												backgroundColor: "$elementOnSurface",
											}}
										>
											<Text>
												<ImportantText>{tag}</ImportantText>
											</Text>
										</Container>
									</a>
								</Link>
							))}
							<Container
								className="px-3 py-1 rounded-full"
								css={{
									backgroundColor: "$elementOnSurface",
								}}
							>
								<Text>
									<ImportantText>NFT</ImportantText>
								</Text>
							</Container>
						</Container>
					</Container>
					<Container className="flex flex-col items-center gap-4">
						<Container className="flex flex-col gap-4 items-baseline justify-between w-full">
							<Text className="tracking-tighter">
								<ImportantText>List price</ImportantText>
							</Text>
							<Heading
								className="tracking-tighter"
								size="sm"
							>
								{displayedCost} BNB
							</Heading>
						</Container>
					</Container>
				</Container>
			</Container>
		</>
	);
};

export default NFTPresentationComponent;
