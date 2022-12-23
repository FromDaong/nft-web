import {Text} from "@packages/shared/components/Typography/Headings";
import Link from "next/link";
import {Container} from "@packages/shared/components/Container";
import {TritPostProps} from "./types";
import {ImportantText} from "@packages/shared/components/Typography/Text";
import {EyeOffIcon, HeartIcon} from "@heroicons/react/outline";
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
import {ActionSection, UserBadge} from "./UtilityComponents";

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
