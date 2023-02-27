import {Text} from "@packages/shared/components/Typography/Headings";
import {Container} from "@packages/shared/components/Container";
import {TritResalePostProps} from "./types";
import {
	ImportantText,
	SmallText,
} from "@packages/shared/components/Typography/Text";
import {
	EyeOffIcon,
	ShoppingBagIcon,
	XCircleIcon,
} from "@heroicons/react/outline";
import {PostMediaContent} from "./PostMediaContent";
import {styled} from "@styles/theme";
import {useGetIsNFTOwned, useTritNFTUtils} from "./hooks";
import {ActionSection} from "./UtilityComponents";
import {useEffect, useState} from "react";
import {useInView} from "react-intersection-observer";
import {Button} from "@packages/shared/components/Button";
import {useDisclosure} from "@packages/hooks";
import {EnvelopeOpenIcon} from "@radix-ui/react-icons";
import {useAccount} from "wagmi";
import ListOrderModal from "@packages/modals/ListOrderModal";
import RemoveListingModal from "@packages/modals/RemoveListingModal";
import TransferNFTModal from "@packages/modals/TransferNFTModal";
import Lightbox from "react-image-lightbox";

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

export const TritPortfolioPost = (props: TritResalePostProps) => {
	const {ref} = useInView();
	const {liked, likeNFT, isMine, isProtected, getOpenOrdersForSeller} =
		useTritNFTUtils(props);

	const [imageURL, setImageURL] = useState("");
	const ipfs_parts = props.image?.ipfs.split("/");
	const ipfs_id = ipfs_parts[ipfs_parts.length - 1];
	const blurred_image = `${ipfs_id}?blurhash=true`;
	const sd_image = `${ipfs_id}?`;

	const {
		isOpen: isLightboxOpen,
		onOpen: onLightboxOpen,
		onClose: onLightboxClose,
	} = useDisclosure();

	useEffect(() => {
		if (props.protected && !isMine) {
			setImageURL(blurred_image);
			return;
		}

		setImageURL(sd_image);
	}, [props.protected, isMine]);

	return (
		<>
			{isLightboxOpen && isMine && (
				<Lightbox
					mainSrc={`https://treatdao.com/api/v2/utils/images/fetchWithFallback?default=${props.image.ipfs}`}
					onCloseRequest={onLightboxClose}
				/>
			)}
			<Container
				ref={ref}
				className={`flex flex-col gap-4 py-4 w-full`}
				css={{
					borderColor: "$subtleBorder",
					borderRadius: "12px",
				}}
			>
				<Container
					onClick={onLightboxOpen}
					className={`relative flex flex-col w-full overflow-hidden ${
						isMine && "hover:cursor-pointer"
					}`}
				>
					<Container className="relative flex w-full overflow-hidden rounded-xl aspect-square">
						<PostMediaContent
							isProtected={isProtected && !isMine}
							caption={props.text}
							_id={props._id}
						/>
						<Container
							className="flex flex-col justify-between w-full h-full p-4"
							css={{zIndex: 1}}
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
									{isProtected && (
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
										</Container>
									)}
								</Container>
							</Container>
						</Container>
					</Container>
				</Container>
				<Container className="flex flex-col w-full">
					<ActionSection
						{...props}
						isMine={isMine}
						liked={liked}
						likeNFT={likeNFT}
						unlikeNFT={likeNFT}
						creator={props.author.username}
						toggleImageProtection={() => null}
						isProtected={isProtected}
						hideSeller={true}
						count={null}
					/>
				</Container>
				{isMine && (
					<Container className="flex flex-col w-full">
						<ManageMyNFTButtons
							getOpenOrdersForSeller={getOpenOrdersForSeller}
							nft={props}
						/>
					</Container>
				)}
			</Container>
		</>
	);
};

const ManageMyNFTButtons = ({nft, getOpenOrdersForSeller}) => {
	const [hasOpenOrders, setHasOpenOrders] = useState(false);

	const {address} = useAccount();
	const {balance} = useGetIsNFTOwned(nft);

	useEffect(() => {
		if (address) {
			getOpenOrdersForSeller(address).then((hasOpenOrders) =>
				setHasOpenOrders(hasOpenOrders)
			);
		}
	}, [address]);

	const {
		onOpen: onOpenRemoveModal,
		onClose: onCloseRemoveModal,
		isOpen: isRemoveModalOpen,
	} = useDisclosure();

	const {
		onOpen: onOpenListOrderModal,
		onClose: onCloseListOrderModal,
		isOpen: isListOrderModalOpen,
	} = useDisclosure();

	const {
		onOpen: onOpenTransferModal,
		onClose: onCloseTransferModal,
		isOpen: isTransferModalOpen,
	} = useDisclosure();

	return (
		<Container className="flex flex-col gap-4">
			{isListOrderModalOpen && (
				<ListOrderModal
					isOpen={isListOrderModalOpen}
					onClose={onCloseListOrderModal}
					nft={nft}
				/>
			)}

			{isRemoveModalOpen && (
				<RemoveListingModal
					isOpen={isRemoveModalOpen}
					onClose={onCloseRemoveModal}
					nft={nft}
				/>
			)}

			{balance > 0 && isTransferModalOpen && (
				<TransferNFTModal
					isOpen={isTransferModalOpen}
					onClose={onCloseTransferModal}
					nft={nft}
					balance={balance}
				/>
			)}

			{
				<Container className="w-full">
					<SmallText
						css={{backgroundColor: "$accentBg", color: "$accentText"}}
						className="px-2 py-1 rounded-full"
					>
						{!balance && <>Fetching balance</>}
						{balance && <ImportantText>{balance}x available</ImportantText>}
					</SmallText>
				</Container>
			}
			<Container className="flex gap-2 py-2">
				{balance > 0 && (
					<Button
						appearance={"surface"}
						fullWidth
						css={{
							"&hover": {
								backgroundColor: "$textContrast",
								color: "$surface",
							},
						}}
						onClick={onOpenListOrderModal}
					>
						<ShoppingBagIcon className="w-5 h-5" />
						Re-sell
					</Button>
				)}
				{balance > 0 && (
					<Button
						appearance={"surface"}
						fullWidth
						css={{
							"&hover": {
								backgroundColor: "$textContrast",
								color: "$surface",
							},
						}}
						onClick={onOpenTransferModal}
					>
						<EnvelopeOpenIcon className="w-5 h-5" />
						Transfer
					</Button>
				)}
			</Container>
			{hasOpenOrders && (
				<Button
					appearance={"surface"}
					fullWidth
					css={{
						"&hover": {
							backgroundColor: "$textContrast",
							color: "$surface",
						},
					}}
					onClick={onOpenRemoveModal}
				>
					<XCircleIcon className="w-5 h-5" />
					Remove my listing
				</Button>
			)}
		</Container>
	);
};
