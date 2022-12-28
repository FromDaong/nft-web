import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {useToggle} from "@packages/shared/hooks";
import Spinner from "@packages/shared/icons/Spinner";
import {useConnectModal} from "@rainbow-me/rainbowkit";
import {apiEndpoint} from "@utils/index";
import logsnag from "@utils/logsnag";
import axios from "axios";
import TreatCore from "core/TreatCore";
import {useState} from "react";
import {useAccount, useBalance, useWaitForTransaction} from "wagmi";
import {BuyButtonProps, get_nft_type, useNFTFactory} from "./hooks/helpers";

/**
 *
 * states:
 * 1. not connected
 * 2. Connected but loading
 * 3. Connected but not enough balance
 * 4. CreatorMart NFT and can be bought
 * 5. Subscription NFT and can be bought
 * 6. TOTM NFT and can be bought
 * 7. NFT Sold out
 * 8. NFT already bought
 * 9. Subscription NFT but not subscribed to creator
 * 11. NFT Sold on secondary market
 * 12. Free NFT
 */

const purchaseNFTTransporter = async (data: {
	tx_hash: string;
	seller: string;
	nftId: number;
	price: number;
	timestamp: number;
	nft_type: string;
	remaining: number;
	metadata: {
		did_subscribe_in_session?: boolean;
		subscription_price?: number;
		browser: string;
		os: string;
		wallet: {
			address: string;
			name: string;
		};
	};
}) => {
	await logsnag.publish({
		channel: "nft",
		event: "NFT Purchase",
		description: `Purchase of NFT by ${data.metadata.wallet.address}}`,
		icon: "🎉",
		tags: {
			address: data.metadata.wallet.address,
			seller: data.seller,
			nftId: data.nftId,
		},
		notify: true,
	});

	return axios.post(`${apiEndpoint}/marketplace/methods/purchase-nft`, data);
};

const InsufficientBalanceButton = () => {
	return <Button appearance={"subtle"}>Insufficient balance</Button>;
};

const RedeemFreeNFT = ({mint}) => {
	return <Button onClick={mint}>Redeem free NFT</Button>;
};

const LoadingButton = () => {
	return (
		<Button appearance={"surface"}>
			<Spinner />
		</Button>
	);
};

const SubscribeButton = ({subscribe, price, cb, toggleLoading}) => {
	const doSubscription = () => {
		toggleLoading();

		subscribe()
			.then(() => {
				toggleLoading();

				cb();
			})
			.catch((err) => {
				console.log({err});
				toggleLoading();
			});
	};
	return (
		<Button
			onClick={doSubscription}
			appearance={"surface"}
		>
			Subscribe for {price} BNB
		</Button>
	);
};

const BuySubscriptionNFTButton = ({
	subscription,
	address,
	mint,
	toggleLoading,
	nft,
	remaining,
}: {
	nft: BuyButtonProps;
	address: string;
	mint: () => Promise<any>;
	toggleLoading: () => void;
	remaining: number;
	subscription: {
		subscriptionPrice: string | number;
		isError: boolean;
		isLoading: boolean;
		isSubscribed: boolean;
		subscribe: () => Promise<any>;
		loadingIsSubscribed: boolean;
	};
}) => {
	const [subscribedInSession, setSubscribedInSession] = useState(false);
	if (!subscription.isSubscribed) {
		return (
			<SubscribeButton
				subscribe={subscription.subscribe}
				price={subscription.subscriptionPrice}
				cb={() => setSubscribedInSession(true)}
				toggleLoading={toggleLoading()}
			/>
		);
	}

	const buyNFT = () => {
		toggleLoading();
		mint()
			.then((res) => {
				return purchaseNFTTransporter({
					tx_hash: res.txHash,
					seller: nft.seller.address,
					nftId: nft.id,
					price: nft.price,
					timestamp: Date.now(),
					nft_type: "subscription",
					remaining,
					metadata: {
						did_subscribe_in_session: subscribedInSession,
						subscription_price: Number(subscription.subscriptionPrice),
						browser: navigator.userAgent,
						os: navigator.platform,
						wallet: {
							address,
							name: "metamask",
						},
					},
				});
				// Check res object, should contain txHash
				// 1. Emit event
				// 2. Log in analytics
				// 3. Send to server
				// 4. Send transaction to server
				// 5. Show success modal
			})
			.catch(async (err) => {
				const event = {
					message: "Error occurred in buying Subscription NFT",
					metadata: err,
				};

				await TreatCore.logThis("error", event.message, event.metadata);
				toggleLoading();
			});
	};

	if (nft.price === 0) {
		return <RedeemFreeNFT mint={buyNFT} />;
	}

	return <Button onClick={buyNFT}>Buy</Button>;
};

const BuyCreatorMartNFTButton = ({
	nft,
	mint,
	seller,
	price,
	address,
	toggleLoading,
	remaining,
}) => {
	const buyNFT = () => {
		// if seller address exists, we will use resale open orders automatically
		toggleLoading();
		mint(price, seller?.address)
			.then((res) => {
				return purchaseNFTTransporter({
					tx_hash: res.txHash,
					seller: nft.seller.address,
					nftId: nft.id,
					price: nft.price,
					timestamp: Date.now(),
					nft_type: "creatorMart",
					remaining,
					metadata: {
						browser: navigator.userAgent,
						os: navigator.platform,
						wallet: {
							address,
							name: "metamask",
						},
					},
				});
				// Check res object, should contain txHash
				// 1. Emit event
				// 2. Log in analytics
				// 3. Send to server
				// 4. Send transaction to server
				// 5. Show success modal
			})
			.catch(async (err) => {
				const event = {
					message: "Error occurred in buying Subscription NFT",
					metadata: err,
				};

				await TreatCore.logThis("error", event.message, event.metadata);
				toggleLoading();
			});
	};

	if (nft.price === 0) {
		return <RedeemFreeNFT mint={buyNFT} />;
	}

	return <Button onClick={buyNFT}>Buy</Button>;
};

const BuyTOTMNFTButton = ({nft, mint, address, toggleLoading, remaining}) => {
	const buyNFT = () => {
		toggleLoading();

		// if seller address exists, we will use resale open orders automatically
		mint()
			.then((res) => {
				return purchaseNFTTransporter({
					tx_hash: res.txHash,
					seller: nft.seller.address,
					nftId: nft.id,
					price: nft.price,
					timestamp: Date.now(),
					nft_type: "creatorMart",
					remaining,
					metadata: {
						browser: navigator.userAgent,
						os: navigator.platform,
						wallet: {
							address,
							name: "metamask",
						},
					},
				});
				// Check res object, should contain txHash
				// 1. Emit event
				// 2. Log in analytics
				// 3. Send to server
				// 4. Send transaction to server
				// 5. Show success modal
			})
			.catch(async (err) => {
				const event = {
					message: "Error occurred in buying Subscription NFT",
					metadata: err,
				};

				await TreatCore.logThis("error", event.message, event.metadata);
				toggleLoading();
			});
	};

	if (nft.price === 0) {
		return <RedeemFreeNFT mint={buyNFT} />;
	}

	return <Button onClick={buyNFT}>Buy</Button>;
};

const SoldOutButton = () => {
	return <Button appearance={"subtle"}>Sold out</Button>;
};

const ErrorButton = ({error}) => {
	return (
		<Button appearance={"subtle"}>{error ?? <>An error occurred</>}</Button>
	);
};

const ConnectWalletButton = () => {
	const {openConnectModal} = useConnectModal();
	return <Button onClick={openConnectModal}>Connect wallet</Button>;
};

const ContextAwarePurchaseButton = ({nft, address, toggleLoading}) => {
	const nft_type = get_nft_type(nft);
	const {useNFT} = useNFTFactory(nft_type, nft.seller?.address);
	const nftUtils = useNFT(nft, nft.seller?.address);

	console.log({nftUtils});

	if (nftUtils.remainingNfts === 0) {
		return <SoldOutButton />;
	}

	if (nft_type === "subscription") {
		if (nftUtils.subscription.isError) {
			return <ErrorButton error={"Error fetching subscription"} />;
		}

		if (nftUtils.subscription.isLoading) {
			return <LoadingButton />;
		}

		return (
			<BuySubscriptionNFTButton
				nft={nft}
				address={address}
				subscription={nftUtils.subscription}
				mint={nftUtils.mint as () => Promise<any>}
				toggleLoading={toggleLoading}
				remaining={Number(nftUtils.remainingNfts) - 1}
			/>
		);
	}

	if (nft_type === "totm") {
		return (
			<BuyTOTMNFTButton
				nft={nft}
				address={address}
				mint={nftUtils.mint as () => Promise<any>}
				toggleLoading={toggleLoading}
				remaining={Number(nftUtils.remainingNfts) - 1}
			/>
		);
	}

	return (
		<BuyCreatorMartNFTButton
			nft={nft}
			address={address}
			mint={nftUtils.mint as any}
			toggleLoading={toggleLoading}
			seller={nft.seller}
			price={nftUtils.cost}
			remaining={Number(nftUtils.remainingNfts) - 1}
		/>
	);
};

const PurchaseButtonWrapper = (nft: BuyButtonProps) => {
	const {status, address} = useAccount();
	const [isLoading, toggleLoading] = useToggle(false);
	const {
		data,
		isLoading: isBalanceFetching,
		error: balanceFetchError,
		isError: didBalanceFetchError,
	} = useBalance({
		addressOrName: address,
	});

	if (status === "connecting" || isBalanceFetching || isLoading) {
		return <LoadingButton />;
	}

	if (status === "disconnected") {
		return <ConnectWalletButton />;
	}

	if (!address) return null;

	if (didBalanceFetchError) {
		return <ErrorButton error={balanceFetchError} />;
	}

	const balance = Number(data.formatted);

	if (balance < Number(nft.price)) {
		return <InsufficientBalanceButton />;
	}

	return (
		<ContextAwarePurchaseButton
			address={address}
			nft={nft}
			toggleLoading={toggleLoading}
		/>
	);
};

const BuyNFTButton = ({nftData}) => {
	if (nftData.melon_nft) return null;

	return (
		<Container className="flex flex-col w-full">
			<PurchaseButtonWrapper
				{...nftData}
				seller={nftData.seller}
				creator={nftData.creator}
			/>
		</Container>
	);
};

export default BuyNFTButton;
