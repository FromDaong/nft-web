import {DotsHorizontalIcon} from "@heroicons/react/outline";
import {
	useWagmiGetCreatorNftCost,
	useWagmiGetNFTMaxSupply,
	useWagmiGetSubscriberNftCost,
	useWagmiGetTreatOfTheMonthNftCost,
	useWagmiGetNFTTotalSupply,
} from "@packages/chain/hooks";
import BuyNFTButton from "@packages/post/BuyNFTButton";
import {useTritNFTUtils} from "@packages/post/hooks";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	MutedText,
	SmallText,
} from "@packages/shared/components/Typography/Text";
import {useCopyToClipboard} from "@packages/shared/hooks";
import {
	EnterFullScreenIcon,
	HeartFilledIcon,
	HeartIcon,
	ImageIcon,
	Share2Icon,
} from "@radix-ui/react-icons";
import UserAvatar from "core/auth/components/Avatar";
import Link from "next/link";
import {useEffect, useState} from "react";
import MoreActionsButton from "./MoreActionsButton";

const NFTPresentationComponent = (props: {
	nft: any;
	isOwned: boolean;
	balance: number;
	loadHD: () => void;
	openFullScreen: () => void;
	address: string;
	seller: any;
	isResale: boolean;
	event: {
		price: number;
		_id: number;
		seller: string;
	};
}) => {
	const {nft} = props;
	const postUtils = useTritNFTUtils(nft);
	const {cost: creatorCost} = useWagmiGetCreatorNftCost(nft.id);
	const {cost: treatCost} = useWagmiGetTreatOfTheMonthNftCost(nft.id);
	const {cost: subscriptionCost} = useWagmiGetSubscriberNftCost(nft.id);
	const [, copy] = useCopyToClipboard();
	const [hasOpenOrders, setHasOpenOrders] = useState(false);

	let nftCost: any = nft.subscription_nft ? subscriptionCost : creatorCost;
	nftCost = nft.totm_nft ? treatCost : nftCost;

	const maxNftSupply = useWagmiGetNFTMaxSupply(nft.id);
	const mintedNfts = useWagmiGetNFTTotalSupply(nft.id);

	const copyUrlToClipboard = () => {
		// Get base domain
		const baseDomain = window.location.origin;
		copy(`${baseDomain}/post/nft/${nft._id}`);
	};

	useEffect(() => {
		if (props.address) {
			postUtils
				.getOpenOrdersForSeller(props.address)
				.then((hasOpenOrders) => setHasOpenOrders(hasOpenOrders));
		}
	}, [props.address]);

	const remainingNfts = maxNftSupply - mintedNfts;
	const isOwned = props.isOwned;
	const numberOfNFTsOwned = props.balance;

	const displayedCost = props.seller ? props.event.price : nftCost;

	return (
		<>
			<Container className="grid grid-cols-1 gap-12 lg:grid-cols-3">
				<Container className="grid flex-col grid-cols-2 gap-12 py-8 lg:col-span-2 lg:flex">
					<Container className="flex flex-wrap col-span-2 gap-4 bottom-4 right-4">
						{props.address && (
							<Button
								appearance={"surface"}
								onClick={postUtils.likeNFT}
							>
								{postUtils.liked ? (
									<>
										<HeartFilledIcon
											width={16}
											height={16}
										/>
									</>
								) : (
									<HeartIcon
										width={16}
										height={16}
									/>
								)}
								<span>{postUtils.likedBy.length}</span>
							</Button>
						)}
						<Button
							onClick={copyUrlToClipboard}
							appearance={"surface"}
						>
							<Share2Icon
								width={16}
								height={16}
							/>
							Copy link
						</Button>
						{false && (
							<Button
								appearance={"surface"}
								onClick={props.openFullScreen}
							>
								<EnterFullScreenIcon
									style={{strokeWidth: "2px"}}
									height={16}
									width={16}
								/>
							</Button>
						)}
						{isOwned && (
							<MoreActionsButton
								nft={props.nft}
								seller={props.seller}
								address={props.address}
								hasOpenOrders={hasOpenOrders}
								numberOfNFTsOwned={numberOfNFTsOwned}
							/>
						)}
					</Container>
					<Container className="flex justify-between col-span-2 gap-4">
						<Container className="flex flex-col gap-2">
							<Heading size="sm">{nft.name}</Heading>
							<Container className="flex">
								<Text>
									Listed by{" "}
									<Link
										href={`/${
											props.seller
												? props.seller.username
												: nft.creator.username
										}`}
									>
										<a>
											<ImportantText>
												@
												{props.seller
													? props.seller.username
													: nft.creator.username}
											</ImportantText>
										</a>
									</Link>
								</Text>
							</Container>
						</Container>
						<Container>
							<UserAvatar
								username={
									props.seller ? props.seller.username : nft.creator.username
								}
								profile_pic={
									props.seller
										? props.seller.profile_pic
										: nft.creator.profile.profile_pic
								}
								size={48}
							/>
						</Container>
					</Container>
					<Container className="flex flex-col col-span-2 md:col-span-1 gap-4">
						<Heading size="xs">Description</Heading>
						<Text>{nft.description}</Text>
					</Container>
					<Container className="flex flex-col col-span-2 md:col-span-1 gap-4">
						<Heading size="xs">Tags</Heading>
						<Container className="flex flex-wrap gap-4 py-2">
							{nft.tags?.map((tag) => (
								<Link
									href={`/sweetshop/tag/${tag}`}
									key={tag}
								>
									<a>
										<Container
											className="px-3 py-1 border rounded-full shadow-sm"
											css={{
												backgroundColor: "$elementSurface",
												borderColor: "$subtleBorder",
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
								className="px-3 py-1 border rounded-full shadow-sm"
								css={{
									backgroundColor: "$elementSurface",
									borderColor: "$subtleBorder",
								}}
							>
								<Text>
									<ImportantText>NFT</ImportantText>
								</Text>
							</Container>
						</Container>
					</Container>
				</Container>
				<Container className="flex flex-col gap-4 py-8">
					<Container
						className="flex flex-col w-full overflow-hidden border divide-y shadow rounded-xl"
						css={{
							backgroundColor: "$elementSurface",
							borderColor: "$subtleBorder",
							borderRadius: "16px",
						}}
					>
						<Container className="flex flex-col gap-8 p-4">
							<Container className="flex flex-col">
								<Text>
									<ImportantText>Reserve price</ImportantText>
								</Text>
								<SmallText>This is the buying price</SmallText>
							</Container>
							<Container className="flex flex-col items-center gap-4">
								<Container className="flex items-baseline justify-between w-full">
									<Heading size="sm">{displayedCost} BNB</Heading>

									{!props.seller && (
										<MutedText className="flex-shrink-0">
											{remainingNfts === 0
												? "Sold out"
												: `${remainingNfts} left`}
										</MutedText>
									)}
								</Container>
								{hasOpenOrders && (
									<Text
										className="w-full"
										css={{color: "$accentText"}}
									>
										You have listed your NFT for resale
									</Text>
								)}
								{!hasOpenOrders &&
									!(props.address === props.seller) &&
									!(
										props.nft.creator.profile.address.toLowerCase() ===
										props.address?.toLowerCase()
									) && (
										<BuyNFTButton
											seller={props.seller?.address ?? null}
											nftData={nft}
											event={props.event}
											isResale={props.isResale}
										/>
									)}
							</Container>
						</Container>

						<Container
							className="p-4"
							css={{backgroundColor: "$surfaceOnSurface"}}
						>
							<Link href={`/sweetshop/nft/${props.nft.id}`}>
								<a>
									<Button
										fullWidth
										appearance={"surface"}
									>
										View other options
									</Button>
								</a>
							</Link>
						</Container>
					</Container>
				</Container>
			</Container>
		</>
	);
};

export default NFTPresentationComponent;
