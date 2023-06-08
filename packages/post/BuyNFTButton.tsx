import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import Spinner from "@packages/shared/icons/Spinner";
import {useConnectModal} from "@rainbow-me/rainbowkit";
import {apiEndpoint} from "@utils/index";
import logsnag from "@utils/logsnag";
import axios from "axios";
import {useEffect, useState} from "react";
import {useAccount, useWaitForTransaction} from "wagmi";
import {BuyButtonProps, useDefaultMinterProvider} from "./hooks/helpers";
import GenericChainModal from "@packages/modals/GenericChainModal";
import {useUser} from "core/auth/useUser";
import {useRouter} from "next/router";
import {useDisclosure} from "@packages/hooks";
import useGetIsSubscribed from "@packages/chain/hooks/useGetIsSubscribed";
import {Text} from "@packages/shared/components/Typography/Text";
import {SparklesIcon} from "@heroicons/react/solid";
import CoinsIcon from "@packages/shared/icons/CoinsIcon";
import Link from "next/link";
import {ArrowRight} from "lucide-react";

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
			fullWidth
			appearance={"disabled"}
			disabled
		>
			Insufficient balance
		</Button>
	);
};

const ErrorButton = ({error}) => {
	return (
		<Button
			fullWidth
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
			fullWidth
			key={"loadingBtn"}
			appearance={"disabled"}
			disabled
		>
			<Spinner /> Please wait ...
		</Button>
	);
};

const RedeemFreeNFT = ({mint}) => {
	return (
		<Button
			fullWidth
			onClick={mint}
		>
			<CoinsIcon className="w-5 h-5" />
			Collect for free
		</Button>
	);
};

const BuyCreatorMartNFTButton = ({nft, address, remaining, setHash, hash}) => {
	const nftPrice = Number(nft.price ?? 0);

	const {useMinter} = useDefaultMinterProvider(nftPrice);
	const {mintNFT} = useMinter(nft.id, nftPrice);

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
		console.log("Minting");
		setLoading(true);
		mintNFT()
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
				console.log({err});
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
				fullWidth
				key={"buyBtn"}
				onClick={buyNFT}
			>
				<CoinsIcon className="w-5 h-5" /> Collect for {nft.price} BNB
			</Button>
		</>
	);
};

const ConnectWalletButton = () => {
	const {openConnectModal} = useConnectModal();
	return (
		<Button
			fullWidth
			onClick={openConnectModal}
		>
			Connect wallet
		</Button>
	);
};

const ContextAwarePurchaseButton = ({nft, address, postUtils}) => {
	const [txHash, setTxHash] = useState("");

	if (postUtils.remainingNfts === 0) {
		return;
	}

	return (
		<BuyCreatorMartNFTButton
			nft={nft}
			address={address}
			remaining={Number(postUtils.remainingNfts) - 1}
			hash={txHash}
			setHash={setTxHash}
		/>
	);
};

const PurchaseButtonWrapper = (nft: BuyButtonProps) => {
	const {status, address} = useAccount();

	if (status === "disconnected") {
		return <ConnectWalletButton />;
	}

	if (!address) return null;

	return (
		<ContextAwarePurchaseButton
			address={address}
			nft={nft}
			postUtils={nft.postUtils}
		/>
	);
};

const BuyNFTButton = ({nftData, postUtils}) => {
	const {address} = useAccount();
	const isSubscribed = useGetIsSubscribed(address);
	if (nftData.melon_nft) {
		return (
			<Container className="flex flex-col gap-2">
				<Link href={"/studio/farm"}>
					<a>
						<Button
							fullWidth
							css={{
								backgroundColor: "$mint11",
								color: "$mint2",
							}}
						>
							View more on Melon <ArrowRight className="w-5 h-5" />
						</Button>
					</a>
				</Link>
			</Container>
		);
	}

	if (nftData.subscription_nft && !isSubscribed) {
		return (
			<Container className="flex flex-col gap-2">
				<Button
					fullWidth
					appearance={"disabled"}
					disabled
				>
					Collect
				</Button>
				<Text>Buying subscription sets is not supported</Text>
			</Container>
		);
	}

	if (nftData.totm_nft) {
		return (
			<Container className="flex flex-col gap-2">
				<Button
					fullWidth
					css={{
						backgroundColor: "$purple11",
						color: "$purple2",
					}}
				>
					<SparklesIcon className="w-5 h-5" />
					Collect for {nftData.price} BNB
				</Button>
			</Container>
		);
	}

	return (
		<Container className="flex flex-col w-full">
			<PurchaseButtonWrapper
				{...nftData}
				postUtils={postUtils}
				creator={nftData.creator}
			/>
		</Container>
	);
};

export default BuyNFTButton;
