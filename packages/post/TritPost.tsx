import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import Link from "next/link";
import {Container} from "@packages/shared/components/Container";
import {TritPostProps} from "./types";
import {
	ImportantText,
	SmallText,
} from "@packages/shared/components/Typography/Text";
import {
	DotsHorizontalIcon,
	EyeOffIcon,
	HeartIcon,
} from "@heroicons/react/outline";
import {PostMediaContent} from "./PostMediaContent";
import UserAvatar from "core/auth/components/Avatar";
import {styled} from "@styles/theme";
import ContentLoader from "react-content-loader";
import {Button} from "@packages/shared/components/Button";
import {HeartFilledIcon} from "@radix-ui/react-icons";
import {useTritNFTUtils} from "./hooks";
import TransferNFTModal from "@packages/modals/TransferNFTModal";
import CancelOrderModal from "@packages/modals/CancelOrderModal";
import ListOrderModal from "@packages/modals/ListOrderModal";
import PurchaseResaleNFTModal from "@packages/modals/PurchaseResaleNFTModal";
import RectangleStack from "@packages/shared/icons/RectangleStack";
import {
	DropdownContainer,
	DropdownContent,
} from "@packages/navigation/components/DropdownContainer";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {DropdownMenuItem} from "@packages/Dropdowns";
import {useCopyToClipboard} from "@packages/shared/hooks";
import {useRouter} from "next/router";

export const StyledLoader = styled(ContentLoader, {
	backgroundColor: "$surface",
	foreGroundColor: "$elementOnSurface",
});

export const FrostyBackgroundContainer = styled(Container, {
	backgroundColor: "#ffffff33",
	backdropFilter: "blur(10px)",

	variants: {
		appearance: {
			danger: {
				backgroundColor: "Red",
			},
			invert: {
				backgroundColor: "$surface",
			},
		},
	},
});

export const UserBadge = (props: {username: string; avatar: string}) => {
	return (
		<Link href={`/${props.username}`}>
			<a>
				<Container className="flex gap-2 pr-4 rounded-full ">
					<UserAvatar
						size={24}
						value={props.username}
					/>
					<Text>
						<ImportantText>@{props.username}</ImportantText>
					</Text>
				</Container>
			</a>
		</Link>
	);
};

export const DislikeIcon = styled(HeartFilledIcon, {
	height: "20px",
	width: "20px",
});

export const LikeIcon = styled(HeartIcon, {
	height: "20px",
	width: "20px",
});

export const TritPost = (props: TritPostProps) => {
	const {
		liked,
		likeNFT,
		isListedOnResale,
		listNFTModalProps,
		transferNFTModalProps,
		cancelOrderModalProps,
		buyResaleNFTModalProps,
		isMine,
		isProtected,
		toggleImageProtection,
	} = useTritNFTUtils(props);

	const imageUrl = props.image?.ipfs;
	const soldOut = props.collection?.minted === props.max_supply;

	// T-28 check if user owns this nft and get the units owned

	return (
		<Container
			className={`grid grid-cols-1 gap-4 py-4 border w-full ${
				props.totm ? "border-2" : ""
			}`}
			css={{
				borderColor: "$subtleBorder",
				borderRadius: "12px",
			}}
		>
			{isMine && (
				<>
					{!props.isResale && (
						<>
							<TransferNFTModal
								isOpen={transferNFTModalProps.isOpen}
								onClose={transferNFTModalProps.onClose}
								nft={props}
							/>
							<ListOrderModal
								isOpen={listNFTModalProps.isOpen}
								onClose={listNFTModalProps.onClose}
								nft={props}
							/>
						</>
					)}
					{(props.isResale || isListedOnResale) && (
						<CancelOrderModal
							isOpen={cancelOrderModalProps.isOpen}
							onClose={cancelOrderModalProps.onClose}
							nft={props}
						/>
					)}
				</>
			)}
			{props.isResale && (
				<PurchaseResaleNFTModal
					isOpen={buyResaleNFTModalProps.isOpen}
					onClose={buyResaleNFTModalProps.onClose}
					nft={props}
				/>
			)}
			<Container className="flex justify-between px-4">
				<UserBadge
					username={props.author.username}
					avatar={props.author.avatar}
				/>
			</Container>
			<Link href={!props.isResale ? `/post/nft/${props._id}` : "#"}>
				<a className="w-full flex flex-col">
					{
						// T-29 implement a hover options button if user owns this NFT
					}
					<Container
						className="relative flex overflow-hidden"
						css={{
							backgroundColor: "$textContrast",
							height: "440px",
						}}
					>
						<PostMediaContent
							imageUrl={imageUrl}
							blurhash={props.blurhash}
							isProtected={isProtected}
							caption={props.text}
							overrideText={
								"The creator wants you to collect this trit before you can preview the content"
							}
						/>
						<Container
							className="flex flex-col justify-between w-full h-full p-4"
							css={{zIndex: 10}}
						>
							<Container className="flex items-center justify-between">
								<Container className="flex gap-4">
									{false && (
										<FrostyBackgroundContainer
											css={{borderRadius: "calc(8px + 16px)", padding: "8px"}}
										>
											<Container
												css={{
													height: "80px",
													width: "80px",

													borderRadius: "calc(16px)",
												}}
											/>
										</FrostyBackgroundContainer>
									)}
									{(isProtected || soldOut || props.totm) && (
										<Container className="flex justify-between w-full">
											{isProtected && (
												<FrostyBackgroundContainer
													className="px-3 py-1 rounded-full"
													css={{}}
												>
													{isProtected && (
														<Container className="flex items-center justify-center gap-2">
															<Text css={{color: "#ffffff"}}>
																<EyeOffIcon
																	width={20}
																	height={20}
																/>
															</Text>
															<Text css={{color: "#ffffff"}}>
																<ImportantText>Protected</ImportantText>
															</Text>
														</Container>
													)}
												</FrostyBackgroundContainer>
											)}
											{soldOut && (
												<FrostyBackgroundContainer className="px-3 py-1 rounded-full">
													<Container className="flex items-center justify-center gap-2">
														<Text css={{color: "$red6"}}>
															<ImportantText>Sold out</ImportantText>
														</Text>
													</Container>
												</FrostyBackgroundContainer>
											)}
										</Container>
									)}
								</Container>
							</Container>
						</Container>
					</Container>
				</a>
			</Link>
			<ActionSection
				{...props}
				isMine={isMine}
				liked={liked}
				likeNFT={likeNFT}
				unlikeNFT={likeNFT}
				creator={props.author.username}
				toggleImageProtection={toggleImageProtection}
				isProtected={isProtected}
			/>
			{props.isResale && !props.isMine && (
				<Container className="py-2">
					<Button
						fullWidth
						appearance={"accent"}
						onClick={() => {
							console.log("buying from resale");
							buyResaleNFTModalProps.onOpen();
						}}
					>
						Purchase from {props.author.username || props.author.display_name}
					</Button>
				</Container>
			)}
			{isMine && props.isMine && (
				// T-30 show the number of NFTs owned by the user
				<Container className="grid w-full grid-cols-2 gap-4">
					{!props.isResale && !isListedOnResale && (
						<>
							<Container className="py-2">
								<Button
									fullWidth
									appearance={"surface"}
									onClick={listNFTModalProps.onOpen}
								>
									Resell
								</Button>
							</Container>
							<Container className="py-2">
								<Button
									fullWidth
									appearance={"surface"}
									onClick={transferNFTModalProps.onOpen}
								>
									Transfer
								</Button>
							</Container>
						</>
					)}

					{props.isResale && isListedOnResale && (
						<Container className="py-2">
							<Button
								fullWidth
								appearance={"surface"}
								onClick={cancelOrderModalProps.onOpen}
							>
								Remove your listing
							</Button>
						</Container>
					)}
				</Container>
			)}
		</Container>
	);
};

const ActionSection = (props) => {
	return (
		<Container className="flex flex-col gap-2 px-2">
			<ImportantText className="px-2">
				<SmallText>Liked by {props.likedBy.length} people</SmallText>
			</ImportantText>
			<Container className="px-2">
				<Text className="line-clamp-1 text-xl">{props.name}</Text>
				{!props.noPrice && (
					<Container className="rounded-full pb-2">
						<Heading size={"xss"}>
							Selling for {props.price.value} {props.price.currency}
						</Heading>
					</Container>
				)}
			</Container>
			<Container className="flex gap-2 px-2">
				<ActionBar
					liked={props.liked}
					likeNFT={props.likeNFT}
					_id={props._id}
					creator={props.creator}
					toggleImageProtection={props.toggleImageProtection}
					isMine={props.isMine}
					isProtected={props.isProtected}
				/>
			</Container>
		</Container>
	);
};

const ActionBar = (props) => {
	return (
		<Container
			className="w-full grid grid-cols-3 "
			css={{backgroundColor: "$surfaceOnSurface", borderRadius: "8px"}}
		>
			<Button
				className="col-span-1 p-3 "
				appearance={"unstyled"}
				onClick={props.likeNFT}
				css={{
					borderRadius: "8px",
					padding: "8px",
					borderColor: "$subtleBorder",
					"&:hover": {backgroundColor: "$elementOnSurface"},
				}}
			>
				{props.liked ? (
					<Text css={{color: "$accentText"}}>
						<HeartFilledIcon
							width={20}
							height={20}
						/>
					</Text>
				) : (
					<HeartIcon
						width={20}
						height={20}
					/>
				)}
				<span>Like</span>
			</Button>
			<Button
				className="col-span-1 p-3 "
				appearance={"unstyled"}
				css={{
					borderRadius: "8px",
					padding: "8px",
					borderColor: "$subtleBorder",
					"&:hover": {backgroundColor: "$elementOnSurface"},
					color: props.isMine ? "$accentText" : "inherit",
				}}
			>
				<RectangleStack
					height={20}
					width={20}
				/>
				<span>{props.isMine ? "Owned" : "Buy"}</span>
			</Button>
			<MoreActionsDropdown
				creator={props.creator}
				id={props._id}
				toggleImageProtection={props.toggleImageProtection}
				isMine={props.isMine}
				isProtected={props.isProtected}
			/>
		</Container>
	);
};

const MoreActionsDropdown = (props) => {
	const [, copy] = useCopyToClipboard();
	const router = useRouter();

	const copyToClipboard = () => {
		copy(window.origin + "/post/nft/" + props.id);
	};

	const gotoCreator = () => {
		router.push(`/${props.creator}`);
	};

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger className="col-span-1 w-full grid">
				<Button
					className="col-span-1 p-3 "
					appearance={"unstyled"}
					css={{
						borderRadius: "8px",
						padding: "8px",
						borderColor: "$subtleBorder",
						"&:hover": {backgroundColor: "$elementOnSurface"},
					}}
				>
					<DotsHorizontalIcon
						width={20}
						height={20}
					/>
					<span>More</span>
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Portal>
				<DropdownMenu.Content className="z-30 p-3 shadow-xl gap-y-3 rounded-xl bg-white">
					<DropdownMenuItem
						onClick={copyToClipboard}
						className="px-4 py-2 flex gap-2"
					>
						<Text>🌍</Text>
						<Text>
							<ImportantText>Get NFT link</ImportantText>
						</Text>
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={gotoCreator}
						className="px-4 py-2 flex gap-2"
					>
						<Text>🎨</Text>
						<Text>
							<ImportantText>Go to creator</ImportantText>
						</Text>
					</DropdownMenuItem>
					{props.isMine && (
						<DropdownMenuItem
							onClick={props.toggleImageProtection}
							className="px-4 py-2 flex gap-2"
						>
							<Text>👀</Text>
							<Text>
								<ImportantText>
									{props.isProtected ? "Show HD version" : "Hide HD media"}
								</ImportantText>
							</Text>
						</DropdownMenuItem>
					)}
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
};

export const SkeletonTritCollectiblePost = (props) => (
	<StyledLoader
		speed={1}
		width={320}
		height={400}
		viewBox="0 0 320 400"
		{...props}
	>
		<rect
			x="39"
			y="26"
			rx="2"
			ry="2"
			width="58"
			height="57"
		/>
		<rect
			x="34"
			y="332"
			rx="9"
			ry="9"
			width="262"
			height="9"
		/>
		<rect
			x="33"
			y="356"
			rx="14"
			ry="14"
			width="93"
			height="30"
		/>
		<rect
			x="207"
			y="355"
			rx="14"
			ry="14"
			width="93"
			height="30"
		/>
		<rect
			x="37"
			y="313"
			rx="2"
			ry="2"
			width="92"
			height="8"
		/>
		<rect
			x="200"
			y="312"
			rx="2"
			ry="2"
			width="92"
			height="8"
		/>
		<rect
			x="41"
			y="105"
			rx="0"
			ry="0"
			width="255"
			height="186"
		/>
	</StyledLoader>
);
