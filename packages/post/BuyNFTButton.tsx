import {useSubscriptionData} from "@packages/chain/hooks/alpha";
import {useDisclosure} from "@packages/hooks";
import {Modal} from "@packages/modals";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading} from "@packages/shared/components/Typography/Headings";
import {ImportantText, Text} from "@packages/shared/components/Typography/Text";
import Spinner from "@packages/shared/icons/Spinner";
import {apiEndpoint} from "@utils/index";
import axios from "axios";
import useUser from "core/auth/useUser";
import Link from "next/link";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {useAccount, useWaitForTransaction} from "wagmi";

const BuyNFTButton = ({mintNFT, remainingNfts, nftData}) => {
	const {address} = useAccount();
	const session = useUser();
	const router = useRouter();
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

	const subscription = useSubscriptionData(nftData.creator.address);

	const nftsRemaining = remainingNfts;
	const nftSoldOut = remainingNfts === 0 || remainingNfts < 0;
	const isTOTMNFT = nftData.totm_nft;
	const isSubscriptionNFT = !!nftData.subscription_nft;
	const isRegularNFTBuyEnabled =
		!nftSoldOut && !isTOTMNFT && !isSubscriptionNFT;

	const isRedeemDisabled = !!(loading || nftSoldOut || nftSoldOut);

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
		return axios
			.post(`${apiEndpoint}/tx/create`, {
				txHash: data.transactionHash,
				metadata: {
					nftId: nftData.id,
					balanceSender: address,
					balanceReceiver: nftData.creator?.address,
				},
				type: "mint",
				amount: nftData.price,
				timestamp: new Date(),
			})
			.then(() => router.reload());
	};

	if (nftData.melon_nft) return null;

	return (
		<>
			{isSubscriptionNFT && !subscription.isSubscribed ? (
				<Container className="flex flex-col gap-4">
					<Container className="flex flex-col gap-1">
						<Heading size="xs">Subscription Content</Heading>
						<Text>
							You need to be subscribed to this creator to redeem this NFT
						</Text>
					</Container>

					<SubscribeToCreatorButton
						subscription={subscription}
						creator_address={nftData.creator.address}
					/>
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
							{loading && <Spinner />}
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
											{isRegularNFTBuyEnabled ||
												(isSubscriptionNFT && `Purchase NFT`)}
											{isTOTMNFT && `Buy TOTM NFT`}
										</>
									)}
								</ImportantText>
							)}
						</Button>
					) : (
						<>Sold Out</>
					)}
				</>
			)}
		</>
	);
};

export const SubscribeToCreatorButton = (props: {
	creator_address: string;
	subscription: any;
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const subscribeToCreator = async () => {
		setIsLoading(true);
		props.subscription.subscribe().then(() => router.reload());
	};

	return (
		<Button
			fullWidth
			onClick={subscribeToCreator}
			appearance={
				props.subscription.isLoading || isLoading ? "disabled" : "primary"
			}
			disabled={props.subscription.isLoading || isLoading}
			css={{padding: "16px"}}
		>
			{(props.subscription.isLoading || isLoading) && <Spinner />}
			{props.subscription.isLoading || isLoading
				? "Please wait..."
				: `Subscribe to creator for ${props.subscription.subscriptionPrice} BNB`}
		</Button>
	);
};

export default BuyNFTButton;
