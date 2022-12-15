/* eslint-disable no-mixed-spaces-and-tabs */
import {pagePropsConnectMongoDB} from "@db/engine/pagePropsDB";
import LegacyNFTModel from "@db/legacy/nft/NFT";
import {BadgeCheckIcon} from "@heroicons/react/outline";
import {EvmNftMetadata} from "@moralisweb3/common-evm-utils";
import {
	useWagmiGetCreatorNftCost,
	useWagmiGetNFTMaxSupply,
	useWagmiGetSubscriberNftCost,
	useWagmiGetTreatOfTheMonthNftCost,
	useWagmiGetNFTTotalSupply,
	useWagmiGetResaleNFTsForNFT,
	useWagmiMintFreeNFT,
	useWagmiMintFreeTOTMNFT,
	useWagmiMintFreeSubscriberNFT,
	useWagmiMintTOTMNFT,
	useWagmiMintCreatorNFT,
	useWagmiMintSubscriberNFT,
} from "@packages/chain/hooks/alpha";
import useGetIsSubscribed from "@packages/chain/hooks/useGetIsSubscribed";
import Error404 from "@packages/error/404";
import {useDisclosure} from "@packages/hooks";
import {Modal} from "@packages/modals";
import FullScreenImagePreview from "@packages/modals/FullScreenImagePreview";
import {SkeletonTritCollectiblePost, TritPost} from "@packages/post/TritPost";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import CreatorBadge from "@packages/shared/components/CreatorBadget";
import {Divider} from "@packages/shared/components/Divider";
import OptimizedImage from "@packages/shared/components/OptimizedImage";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	MutedText,
} from "@packages/shared/components/Typography/Text";
import {apiEndpoint, legacy_nft_to_new, timeFromNow} from "@utils/index";
import axios from "axios";
import UserAvatar from "core/auth/components/Avatar";
import useUser from "core/auth/useUser";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import TreatCore from "core/TreatCore";
import {BigNumber, ethers} from "ethers";
import Link from "next/link";
import {useEffect, useMemo, useState} from "react";
import {MongoModelNFT, MongoModelTransaction} from "server/helpers/models";
import {useAccount, useContractRead, useWaitForTransaction} from "wagmi";

const exitFullScreen = () => {
	if (document.exitFullscreen) {
		document.exitFullscreen();
	} else if (document["mozCancelFullScreen"]) {
		document["mozCancelFullScreen"]();
	} else if (document["webkitExitFullscreen"]) {
		document["webkitExitFullscreen"]();
	} else if (document["msExitFullscreen"]) {
		document["msExitFullscreen"]();
	}
};

export const useFullScreen = (
	elementOrElementId: HTMLElement | string,
	showFullScreen: boolean
) =>
	useEffect(() => {
		const fullScreenElement =
			document["fullscreenElement"] ||
			document["webkitFullscreenElement"] ||
			document["mozFullScreenElement"] ||
			document["msFullscreenElement"];

		// exit full screen
		if (!showFullScreen) {
			if (fullScreenElement) {
				exitFullScreen();
			}
			return;
		}

		// get the element to make full screen
		const element =
			typeof elementOrElementId === "string"
				? document.getElementById(elementOrElementId)
				: elementOrElementId;

		// if the current element is not already full screen, make it full screen
		if (!fullScreenElement) {
			if (element.requestFullscreen) {
				element.requestFullscreen();
			} else if (element["mozRequestFullScreen"]) {
				element["mozRequestFullScreen"]();
			} else if (element["webkitRequestFullscreen"]) {
				// @ts-ignore
				element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
			} else if (element["msRequestFullscreen"]) {
				element["msRequestFullscreen"]();
			}
		}
	}, [showFullScreen, elementOrElementId]);

const getYouMightAlsoLike = async () => {
	const res = await axios.get(`${apiEndpoint}/marketplace/trending`);
	return res.data.data;
};

export default function NFT(props: {notFound?: boolean; data: any}) {
	const {address} = useAccount();
	const [showFullScreen, setShowFullScreen] = useState(false);
	useFullScreen("nft_image", showFullScreen);

	const {
		isOpen: isFullscreenPreviewOpen,
		onOpen: onOpenFullscreenPreview,
		onClose: onCloseFullscreenPreview,
	} = useDisclosure();

	const {
		isLoading: youMightAlsoLikeLoading,
		error: youMightAlsoLikeError,
		data: youMightAlsoLikeData,
	} = TreatCore.useQuery({
		queryKey: ["youMightAlsoLikeNFTs"],
		queryFn: getYouMightAlsoLike,
	});

	if (props.notFound) {
		return <Error404 />;
	}

	const data = JSON.parse(props.data);
	const {nft, mints} = data;

	const trendingNFTs =
		youMightAlsoLikeError || youMightAlsoLikeLoading
			? []
			: youMightAlsoLikeData?.map((post) => legacy_nft_to_new(post));

	return (
		<>
			<Container
				className="w-full 2xl:h-[80vh] lg:h-[90vh] h-[calc(100vh-64px)] flex items-center justify-center"
				css={{backgroundColor: "$surfaceOnSurface"}}
			>
				<Container className="container flex-1 h-full py-12">
					<Container
						className="relative w-full h-full"
						onClick={() => setShowFullScreen(!showFullScreen)}
						id={"nft_image"}
					>
						<OptimizedImage
							src={`${nft.image.cdn}&blur=${nft.protected ? 30 : 0}&`}
							className="cursor-zoom-in"
							sizes="100vw"
							fill
							objectFit="contain"
							alt={nft.name}
						/>
					</Container>
				</Container>
			</Container>
			<ApplicationLayout>
				<ApplicationFrame>
					<Container className="flex flex-col gap-12">
						<ViewNFT
							nft={nft}
							mints={mints}
							account={address}
						/>
						<Divider dir={"horizontal"} />
						<Container className="flex flex-col gap-12">
							<Container className="flex flex-col gap-4">
								<Heading size="sm">People also bought</Heading>
							</Container>
							<Container className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
								{!youMightAlsoLikeError && !youMightAlsoLikeLoading
									? trendingNFTs.slice(0, 4).map((item) => (
											<TritPost
												key={item}
												inGrid
												{...item}
											/>
									  ))
									: [0, 1, 2, 3].map((i) => (
											<Container
												key={i}
												className="col-span-1 border"
												css={{
													borderColor: "$subtleBorder",
													padding: "8px",
													borderRadius: "16px",
												}}
											>
												<SkeletonTritCollectiblePost />
											</Container>
									  ))}
							</Container>
						</Container>
						<Divider dir={"horizontal"} />

						<Container className="flex flex-col gap-12">
							<Container className="flex flex-col gap-4">
								<Heading size="sm">More from this creator</Heading>
							</Container>
							<Container className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
								<Link href={`/${nft.creator.username}`}>
									<a>
										<Container className="flex flex-col gap-8">
											<UserAvatar
												value={nft.creator.username}
												size={80}
											/>

											<Container className="flex flex-col gap-2">
												<Heading size="sm">{nft.name} </Heading>
												<Text>@{nft.creator.username}</Text>
											</Container>
											<Text>{nft.description}</Text>
										</Container>
									</a>
								</Link>
								{!youMightAlsoLikeError && !youMightAlsoLikeLoading
									? trendingNFTs.slice(0, 3).map((item) => (
											<TritPost
												key={item}
												inGrid
												{...item}
											/>
									  ))
									: [0, 1, 2].map((i) => (
											<Container
												key={i}
												className="col-span-1 border"
												css={{
													borderColor: "$subtleBorder",
													padding: "8px",
													borderRadius: "16px",
												}}
											>
												<SkeletonTritCollectiblePost />
											</Container>
									  ))}
							</Container>
						</Container>
					</Container>
				</ApplicationFrame>
			</ApplicationLayout>
		</>
	);
}

const ViewNFT = ({nft}: {nft: any; account: string; mints: Array<any>}) => {
	const {creatorCost} = useWagmiGetCreatorNftCost(nft.id);
	const {treatCost} = useWagmiGetTreatOfTheMonthNftCost(nft.id);
	const {subscriptionCost} = useWagmiGetSubscriberNftCost(nft.id);

	let nftCost: any = nft.subscription_nft ? subscriptionCost : creatorCost;
	nftCost = nft.totm_nft ? treatCost : nftCost;

	const {mintNFT: onMintTOTMNft} = useWagmiMintTOTMNFT(nft.id, nftCost);
	const {mintNFT: onMintCreatorNft} = useWagmiMintCreatorNFT(nft.id, nftCost);
	const {mintNFT: onMintSubscriberNft} = useWagmiMintSubscriberNFT(
		nft.id,
		nftCost
	);

	const {mintFreeNFT: onMintFreeTOTM} = useWagmiMintFreeTOTMNFT(nft.id);
	const {mintFreeNFT: onMintFreeCreatorTreat} = useWagmiMintFreeNFT(nft.id);
	const {mintFreeNFT: onMintFreeSubscriberTreat} =
		useWagmiMintFreeSubscriberNFT(nft.id);

	const maxNftSupply = useWagmiGetNFTMaxSupply(nft.id);
	const mintedNfts = useWagmiGetNFTTotalSupply(nft.id);

	const remainingNfts = maxNftSupply - mintedNfts;

	const {openOrders} = useWagmiGetResaleNFTsForNFT(nft.id);

	const floorOrder = openOrders.reduce(
		(lowest, order, index) => {
			const price = BigNumber.from(order.price);
			const lowestPrice = BigNumber.from(lowest.price);
			if (index === 0) return order;
			return price.lt(lowestPrice) ? order : lowest;
		},
		{price: 0}
	);

	const floorResalePrice = ethers.utils.formatEther(
		BigNumber.from(floorOrder.price)
	);

	const mintNFT = async () => {
		if (nft.subscription_nft) return onMintSubscriberNft();
		if (nft.totm_nft) {
			return await onMintTOTMNft();
		} else {
			return await onMintCreatorNft();
		}
	};

	const mintFreeNFT = async () => {
		if (nft.subscription_nft) return onMintFreeSubscriberTreat();
		if (nft.totm_nft) {
			return await onMintFreeTOTM();
		} else {
			return await onMintFreeCreatorTreat();
		}
	};

	return (
		<>
			<Container className="grid grid-cols-1 gap-12 px-4 lg:grid-cols-2">
				<Container className="flex flex-col gap-12 py-8">
					<Container className="flex flex-col gap-4">
						<Heading size="sm">{nft.name}</Heading>
						<Link href={`/${nft.creator.username}`}>
							<a>
								<Container className="flex">
									<Container
										className="flex items-center gap-2 px-4 py-2 border rounded-full shadow"
										css={{
											borderColor: "$subtleBorder",
											backgroundColor: "$elementSurface",
										}}
									>
										<UserAvatar
											value={nft.creator.username}
											size={24}
										/>
										<Text className="flex items-center gap-2">
											<ImportantText>@{nft.creator.username}</ImportantText>
											<CreatorBadge />
										</Text>
									</Container>
								</Container>
							</a>
						</Link>
					</Container>
					<Container className="flex flex-col gap-4">
						<Heading size="xs">Description</Heading>
						<Text>{nft.description}</Text>
					</Container>
					<Container className="flex flex-col gap-4">
						<Heading size="xs">Tags</Heading>
						<Container className="flex flex-wrap gap-4 p-2">
							{nft.tags?.map((tag) => (
								<Container
									key={tag}
									className="px-3 py-1 border rounded-full"
									css={{
										backgroundColor: "$elementSurface",
										borderColor: "$subtleBorder",
									}}
								>
									<Text>{tag}</Text>
								</Container>
							))}
							<Container
								className="px-3 py-1 border rounded-full shadow-xl"
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
				<Container className="flex flex-col gap-8 px-4 py-8">
					<Container
						className="flex flex-col w-full border drop-shadow-lg rounded-xl"
						css={{
							backgroundColor: "$elementSurface",
							borderColor: "$subtleBorder",
						}}
					>
						<Container className="grid grid-cols-2 gap-4 p-8">
							<Container>
								<MutedText>
									<ImportantText>Reserve price</ImportantText>
								</MutedText>
								<Heading size="sm">{nftCost} BNB</Heading>
							</Container>
							<Container>
								<MutedText>
									<ImportantText>Remaining</ImportantText>
								</MutedText>
								<Heading size="sm">
									{remainingNfts === 0
										? "Sold out"
										: `${remainingNfts}/${maxNftSupply}`}
								</Heading>
							</Container>
						</Container>
						<Divider dir={"horizontal"} />
						<Container className="p-8">
							<RedeemButton
								mintNFT={nft.price === 0 ? mintFreeNFT : mintNFT}
								remainingNfts={remainingNfts}
								nftData={nft}
							/>
						</Container>
						{openOrders?.length > 0 && (
							<>
								<Divider dir={"horizontal"} />
								<Container className="grid grid-cols-1 gap-1 p-8">
									<Heading size="xs">
										Available on the Resale Marketplace
									</Heading>
									<Text>
										Please scroll down to purchase this NFT from resale
										marketplace listings
									</Text>
								</Container>
							</>
						)}
					</Container>
				</Container>
				{openOrders?.length > 0 && (
					<>
						<Container className="col-span-2">
							<Divider dir={"horizontal"} />
						</Container>
						<Container className="flex flex-col col-span-2 gap-8">
							<Heading size="sm">Available on resale market</Heading>
							<Container className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
								{openOrders.map((order, i) => {
									return (
										<TritPost
											key={i}
											inGrid
											isResale
											{...nft}
											price={{
												value: ethers.utils.formatEther(order.price),
												currency: "BNB",
											}}
											collection={{
												minted: 0,
												totalSupply: 1,
											}}
											protected={nft.protected}
											author={{
												address: order.seller,
												username:
													order.seller.slice(0, 3) +
													"..." +
													order.seller.slice(-3),
											}}
										/>
									);
								})}
							</Container>
						</Container>
					</>
				)}
			</Container>
		</>
	);
};

const RedeemButton = ({mintNFT, remainingNfts, nftData}) => {
	const {address} = useAccount();
	const session = useUser();
	const {isOpen, onOpen, onClose} = useDisclosure();
	const [loading, setLoading] = useState(false);
	const [mintTx, setMintTx] = useState(null);
	const [showConfirmWallet, setShowConfirmWallet] = useState(false);
	const [savedTx, setSavedTx] = useState(false);

	const {isSuccess: isTxConfirmed, data} = useWaitForTransaction({
		hash: mintTx?.txHash,
	});

	useEffect(() => {
		if (isTxConfirmed && data) {
			submitTransaction().then(() => {
				setShowConfirmWallet(false);
				setLoading(false);
				setSavedTx(true);
			});
		}
	}, [isTxConfirmed, data]);

	// TODO: Change @param this to creator address

	const isSubscribed = useGetIsSubscribed(address);

	const nftsRemaining = remainingNfts;
	const nftSoldOut = remainingNfts === 0 || remainingNfts < 0;
	const isTOTMNFT = nftData.totm_nft;
	const isSubscriptionNFT = !!nftData.subscription_nft;
	const isRegularNFTBuyEnabled =
		!nftSoldOut && !isTOTMNFT && !isSubscriptionNFT;

	const isRedeemDisabled = !!(
		loading ||
		nftSoldOut ||
		nftSoldOut ||
		(isSubscriptionNFT && !isSubscribed)
	);

	const redeemNFT = async () => {
		try {
			setLoading(true);
			setShowConfirmWallet(true);
			setSavedTx(false);
			onOpen();

			const tx = await mintNFT();

			if (!tx) {
				setLoading(false);
				setShowConfirmWallet(false);
				onClose();
				return;
			}

			const transactionData = {
				txHash: tx.hash,
			};

			setMintTx(transactionData);
			setShowConfirmWallet(false);
		} catch (err) {
			console.log(err);
			setLoading(false);
			setShowConfirmWallet(false);
			onClose();
		}
	};

	const submitTransaction = async () => {
		return axios.post(`${apiEndpoint}/tx/create`, {
			txHash: data.transactionHash,
			metadata: {
				nftId: nftData.id,
				balanceSender: address,
				balanceReceiver: nftData.creator?.address,
			},
			type: "mint",
			amount: nftData.price,
			timestamp: new Date(),
		});
	};

	if (nftData.melon_nft) return null;

	return (
		<>
			{isSubscriptionNFT && !isSubscribed ? (
				<Container className="flex flex-col gap-4">
					<Container className="flex flex-col gap-1">
						<Heading size="xs">Subscription Content</Heading>
						<Text>
							You need to be subscribed to this creator to redeem this NFT
						</Text>
					</Container>
					<Button css={{borderRadius: "16px", padding: "16px 0"}}>
						Subscribe for 0.01 BNB
					</Button>
				</Container>
			) : (
				<>
					<Modal
						isOpen={isOpen}
						onClose={onClose}
					>
						<Container className="min-w-[360px]">
							{showConfirmWallet && (
								<Container className="flex flex-col gap-2 p-8">
									<Heading
										size="md"
										className="mb-4"
									>
										Wallet authorization
									</Heading>
									<Text className="mb-4">
										Please confirm the transaction in your wallet
									</Text>
								</Container>
							)}
							{!showConfirmWallet && !savedTx && (
								<Container className="flex flex-col gap-2 p-8">
									<Heading
										size="md"
										className="mb-4"
									>
										Confirming transaction
									</Heading>
									<Text className="mb-4">
										Please wait while we confirm your purchase.
									</Text>
								</Container>
							)}

							{savedTx && (
								<Container className="flex flex-col gap-8 p-8">
									<Container className="flex flex-col gap-2">
										<Heading
											size="md"
											className="mb-4"
										>
											Purchase Complete
										</Heading>
										<Text className="mb-4">
											Congratulations on your purchase! You can view your NFT in
											your portfolio or even sell it.
										</Text>
									</Container>
									<Container className="flex flex-row justify-end gap-4">
										<Link href={`${session.user.profile.username}`}>
											<a>
												<Button>Go to my portfolio</Button>
											</a>
										</Link>
									</Container>
								</Container>
							)}
						</Container>
					</Modal>
					{!nftSoldOut ? (
						<Button
							className="font-bold text-white"
							fullWidth
							css={{borderRadius: "16px", padding: "16px 0"}}
							appearance={isRedeemDisabled ? "disabled" : "primary"}
							disabled={isRedeemDisabled}
							onClick={redeemNFT}
						>
							{loading ? (
								showConfirmWallet ? (
									"Please confirm in your wallet and wait"
								) : (
									"Please wait..."
								)
							) : (
								<ImportantText>
									{nftSoldOut || isNaN(nftsRemaining) ? (
										<>Sold Out</>
									) : (
										<>
											{isRegularNFTBuyEnabled && `Buy now`}
											{isTOTMNFT && `Buy TOTM NFT`}
											{isSubscriptionNFT &&
												!nftSoldOut &&
												`Buy Subscription NFT`}
										</>
									)}
								</ImportantText>
							)}
						</Button>
					) : (
						<></>
					)}
				</>
			)}
		</>
	);
};

export const getServerSideProps = async (context) => {
	const {id} = context.params;

	await pagePropsConnectMongoDB();

	const nft = await MongoModelNFT.findOne({id}).populate("creator");

	if (!nft) {
		return {
			notFound: true,
		};
	}

	const transactions = await MongoModelTransaction.find({
		"metadata.nftId": id,
	});

	const returnObj = {
		id,
		mints: transactions,
		nft: nft,
	};

	return {
		props: {
			data: JSON.stringify(returnObj),
		},
	};
};
