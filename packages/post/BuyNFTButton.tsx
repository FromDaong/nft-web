import {CheckCircleIcon} from "@heroicons/react/outline";
import {useSubscriptionData} from "@packages/chain/hooks";
import {useDisclosure} from "@packages/hooks";
import {Modal} from "@packages/modals";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading} from "@packages/shared/components/Typography/Headings";
import {ImportantText, Text} from "@packages/shared/components/Typography/Text";
import Spinner from "@packages/shared/icons/Spinner";
import {apiEndpoint} from "@utils/index";
import axios from "axios";
import {ethers} from "ethers";
import {useSession} from "next-auth/react";
import Link from "next/link";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {useAccount, useBalance, useWaitForTransaction} from "wagmi";

const BuyNFTButton = ({mintNFT, remainingNfts, nftData}) => {
	const {address} = useAccount();
	const {data: accountBalance, isLoading: balanceIsLoading} = useBalance({
		addressOrName: address,
	});
	const session = useSession();
	// @ts-ignore
	const {profile} = session.data ?? {};
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
			{isSubscriptionNFT && !subscription.isSubscribed ? (
				<Container className="flex flex-col gap-4">
					{!balanceIsLoading && (
						<>
							<Container className="flex flex-col gap-1">
								<Heading size="xs">Subscription Content</Heading>
								<Text>
									You need to be subscribed to this creator to redeem this NFT
								</Text>
							</Container>

							<SubscribeToCreatorButton
								balance={Number(accountBalance?.formatted ?? 0)}
								subscription={subscription}
								creator_address={nftData.creator.address}
							/>
						</>
					)}
					{balanceIsLoading && (
						<>
							<Container
								className="w-1/2 py-3 animate-pulse rounded"
								css={{backgroundColor: "$elementOnSurface"}}
							/>
							<Container
								className="w-full py-3 animate-pulse rounded"
								css={{backgroundColor: "$elementOnSurface"}}
							/>
							<Container
								className="w-full py-6 animate-pulse rounded"
								css={{backgroundColor: "$elementOnSurface"}}
							/>
						</>
					)}
				</Container>
			) : (
				<>
					<Modal
						isOpen={isOpen}
						onClose={onClose}
						compact={true}
					>
						<Container className="min-w-[360px]">
							{showConfirmWallet && (
								<Container className="flex flex-col gap-2 p-8 items-center">
									<Heading
										size="xs"
										className="mb-4"
									>
										Wallet authorization
									</Heading>
									<Text className="mb-4">
										Please confirm the transaction in your wallet
									</Text>
									<Button
										appearance={"surface"}
										className="mt-4 w-full"
										onClick={() => setShowConfirmWallet(false)}
									>
										Cancel
									</Button>
								</Container>
							)}
							{!showConfirmWallet && !savedTx && (
								<Container className="flex flex-col gap-4 p-8 items-center">
									<Container className={"flex justify-center w-2/3"}>
										<Spinner className="w-12 h-12" />
									</Container>
									<Container className="flex flex-col gap-2 p-8 items-center  text-center">
										<Heading
											size="xs"
											className="mb-4"
										>
											Transaction pending
										</Heading>
										<Text className="mb-4">
											You will be taken to the next step automagically when your
											purchase has been confirmed on the blockchain.
										</Text>
									</Container>
								</Container>
							)}

							{savedTx && (
								<Container className="flex flex-col gap-4 p-8">
									<Container className={"flex justify-center w-full"}>
										<CheckCircleIcon className="w-12 h-12" />
									</Container>
									<Container className="flex flex-col gap-2 p-8 items-center text-center">
										<Heading
											size="xs"
											className="mb-4"
										>
											Purchase Complete
										</Heading>
										<Text className="mb-4">
											Congratulations on your purchase! You can view your NFT in
											your portfolio or even sell it.
										</Text>
									</Container>
									<Container className="flex flex-col gap-4 w-full">
										<Link href={`/${profile.username}`}>
											<a>
												<Button fullWidth>Go to my portfolio</Button>
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
							appearance={
								isRedeemDisabled ||
								Number(accountBalance?.formatted) < Number(nftData.price)
									? "disabled"
									: "primary"
							}
							disabled={
								isRedeemDisabled ||
								Number(accountBalance?.formatted) < Number(nftData.price)
							}
							onClick={redeemNFT}
						>
							{Number(accountBalance?.formatted) > Number(nftData.price) ? (
								<>
									{loading && <Spinner />}
									{loading ? (
										showConfirmWallet ? (
											"Please confirm in your wallet and wait"
										) : (
											"Please wait..."
										)
									) : (
										<ImportantText>
											<>
												{isRegularNFTBuyEnabled && `Purchase NFT`}
												{isSubscriptionNFT && "Purchase NFT"}
												{isTOTMNFT && `Buy TOTM NFT`}
											</>
										</ImportantText>
									)}
								</>
							) : (
								<>Insufficient balance. Cost is {nftData.price}</>
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
	balance: number;
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const subscribeToCreator = async () => {
		setIsLoading(true);
		props.subscription
			.subscribe()
			.then(() => router.reload())
			.catch((err) => {
				console.log(err);
				setIsLoading(false);
			});
	};

	const insufficientBalance =
		props.balance < Number(props.subscription.subscriptionPrice);

	const disabled = insufficientBalance || isLoading;

	return (
		<Button
			fullWidth
			onClick={subscribeToCreator}
			appearance={disabled ? "disabled" : "primary"}
			disabled={!!disabled}
			css={{padding: "16px"}}
		>
			{!insufficientBalance ? (
				<>
					{(props.subscription.isLoading || isLoading) && <Spinner />}
					{props.subscription.isLoading || isLoading
						? "Please wait..."
						: `Subscribe to creator for ${props.subscription.subscriptionPrice} BNB`}
				</>
			) : (
				<>
					Insufficient balance, cost is {props.subscription.subscriptionPrice}{" "}
					BNB
				</>
			)}
		</Button>
	);
};

export default BuyNFTButton;
