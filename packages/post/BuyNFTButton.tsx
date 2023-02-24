import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import Spinner from "@packages/shared/icons/Spinner";
import {useConnectModal} from "@rainbow-me/rainbowkit";
import {apiEndpoint} from "@utils/index";
import logsnag from "@utils/logsnag";
import axios from "axios";
import TreatCore from "core/TreatCore";
import {useEffect, useState} from "react";
import {useAccount, useBalance, useWaitForTransaction} from "wagmi";
import {BuyButtonProps, get_nft_type, useNFTFactory} from "./hooks/helpers";
import GenericChainModal from "@packages/modals/GenericChainModal";
import {useUser} from "core/auth/useUser";
import {useRouter} from "next/router";
import {useDisclosure} from "@packages/hooks";

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
	creator: string;
	nftId: number;
	price: number;
	eid?: string;
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
			creator: data.creator,
			id: data.nftId,
		},
		notify: true,
	});

	return axios.post(`${apiEndpoint}/marketplace/methods/purchase-nft`, data);
};

const InsufficientBalanceButton = () => {
	return (
		<Button
			appearance={"disabled"}
			disabled
		>
			Insufficient balance
		</Button>
	);
};

const SoldOutButton = () => {
	return (
		<Button
			appearance={"disabled"}
			disabled
		>
			Sold out
		</Button>
	);
};

const ErrorButton = ({error}) => {
	return (
		<Button
			appearance={"danger"}
			disabled
		>
			{error ?? <>An error occurred</>}
		</Button>
	);
};

const LoadingButton = () => {
	return (
		<Button
			key={"loadingBtn"}
			appearance={"disabled"}
			disabled
		>
			<Spinner />
		</Button>
	);
};

const RedeemFreeNFT = ({mint}) => {
	return <Button onClick={mint}>Redeem free NFT</Button>;
};

const BuyCreatorMartNFTButton = ({
	nft,
	mint,
	creator,
	price,
	address,
	remaining,
	setHash,
	hash,
}) => {
	const router = useRouter();
	const {profile} = useUser();
	const {isOpen, onOpen} = useDisclosure();
	const gotoPortfolio = () => router.push(`/${profile.username}/portfolio`);
	const {isError, isLoading, data} = useWaitForTransaction({
		hash,
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const buyNFT = () => {
		// if creator address exists, we will use resale open orders automatically
		setLoading(true);
		mint(price, creator.address)
			.then((res) => {
				setHash(res.hash);
				setLoading(false);
				return purchaseNFTTransporter({
					tx_hash: res.hash,
					creator: nft.creator.address,
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
			})
			.catch(async (err) => {
				const event = {
					message: "Error occurred in buying NFT",
					metadata: err,
				};
				setLoading(false);
				setError(err);
				await TreatCore.logThis("error", event.message, event.metadata);
			});
	};

	useEffect(() => {
		if (data || isError) {
			if (data) {
				onOpen();
			}

			if (isError) {
				//trigger error
			}
		}
	}, [data, isError]);

	const SuccessModal = () => (
		<GenericChainModal
			isOpen={isOpen}
			onClose={() => {
				gotoPortfolio();
			}}
			title="Congratulations. NFT Purchase was successful"
			subtitle="You have successfully purchased the NFT. It will now show in your wallet and on your portfolio page."
			action={gotoPortfolio}
			buttonLabel="Go to portfolio"
			hideClose
		/>
	);

	if ((isLoading && !data) || loading) {
		return <LoadingButton />;
	}

	if (isError) {
		return <ErrorButton error={error} />;
	}

	if (nft.price === 0) {
		return <RedeemFreeNFT mint={buyNFT} />;
	}

	return (
		<>
			<SuccessModal />
			<Button
				key={"buyBtn"}
				onClick={buyNFT}
			>
				Buy NFT
			</Button>
		</>
	);
};

const ConnectWalletButton = () => {
	const {openConnectModal} = useConnectModal();
	return <Button onClick={openConnectModal}>Connect wallet</Button>;
};

const ContextAwarePurchaseButton = ({nft, address}) => {
	const nft_type = get_nft_type(nft);
	const {useNFT} = useNFTFactory(nft_type, nft.creator?.address);
	const nftUtils = useNFT(nft, nft.creator?.address);
	const [txHash, setTxHash] = useState("");

	if (nftUtils.remainingNfts === 0) {
		return <SoldOutButton />;
	}

	return (
		<BuyCreatorMartNFTButton
			nft={nft}
			address={address}
			mint={nftUtils.mint as any}
			creator={nft.creator}
			price={nftUtils.cost}
			remaining={Number(nftUtils.remainingNfts) - 1}
			hash={txHash}
			setHash={setTxHash}
		/>
	);
};

const PurchaseButtonWrapper = (nft: BuyButtonProps) => {
	const {status, address} = useAccount();
	const {
		data,
		isLoading: isBalanceFetching,
		error: balanceFetchError,
		isError: didBalanceFetchError,
	} = useBalance({
		addressOrName: address,
	});

	if (status === "connecting" || isBalanceFetching) {
		return <LoadingButton />;
	}

	if (status === "disconnected") {
		return <ConnectWalletButton />;
	}

	if (!address) return null;

	if (didBalanceFetchError) {
		return <ErrorButton error={balanceFetchError} />;
	}

	const balance = Number(data?.formatted);

	if (balance < Number(nft.price)) {
		return <InsufficientBalanceButton />;
	}

	return (
		<ContextAwarePurchaseButton
			address={address}
			nft={nft}
		/>
	);
};

const BuyNFTButton = ({nftData}) => {
	console.log({nftData});
	if (nftData.melon_nft || nftData.totm_nft) {
		return null;
	}

	return (
		<Container className="flex flex-col w-full">
			<PurchaseButtonWrapper
				{...nftData}
				creator={nftData.creator}
			/>
		</Container>
	);
};

export default BuyNFTButton;
