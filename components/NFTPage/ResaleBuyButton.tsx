import {useCallback, useContext, useEffect, useState} from "react";
import {SelectedOrderContext} from "./SelectedOrderContext";
import {Button} from "@packages/shared/components/Button";
import {Coins} from "lucide-react";
import Spinner from "@packages/shared/icons/Spinner";
import {useAccount, useWaitForTransaction} from "wagmi";
import {useContracts} from "@packages/post/hooks";
import {ethers} from "ethers";
import {toast} from "sonner";
import {ConnectWalletButton} from "@packages/post/BuyNFTButton";

export const usePurchaseResaleOrder = () => {
	const {address} = useAccount();

	const {treatMarketplaceContract} = useContracts();

	const purchaseResaleOrder = useCallback(
		async (id: number, amount: number, totalPrice, seller: string) => {
			return treatMarketplaceContract.purchase(id, 1, seller, {
				from: address,
				value: ethers.utils.parseEther(`${totalPrice}`),
			});
		},
		[address, treatMarketplaceContract]
	);

	return {purchaseResaleOrder};
};

export const formatBlockchainResponse = (text: string): string => {
	if (typeof text !== "string") return "Uknown error";
	// Shorten ETH addresses
	let shortened = text.replace(/0x[0-9a-fA-F]{40}/g, function (match) {
		return match.substring(0, 6) + "..." + match.substring(match.length - 4);
	});

	// Convert wei figures to BNB
	const weiRegex = /(?<=have|want|supplied gas)\s+(\d+)/g;
	let match;
	while ((match = weiRegex.exec(shortened)) !== null) {
		const wei = match[1];
		const bnb = parseFloat(wei) / 1000000000000000000;
		const bnbFormatted = parseFloat(bnb.toPrecision(2)).toString();
		shortened = shortened.replace(wei, bnbFormatted + " BNB");
	}

	return shortened;
};

const ResaleListingBuyButton = (order: {
	price: number;
	seller: string;
	id: number;
	currentSupply: number;
	callback: () => void;
}) => {
	const {address} = useAccount();
	const {isLoading} = useContext(SelectedOrderContext);
	const [amount] = useState(1);
	const [purchaseNFTPending, setPurchaseNFTPending] = useState(false);
	const [purchaseNFTError, setPurchaseNFTError] = useState<any>(false);
	const [tx, setTx] = useState("");

	const {
		isError,
		data,
		isSuccess,
		isLoading: isWaitingForTx,
	} = useWaitForTransaction({
		hash: tx,
	});

	const {purchaseResaleOrder} = usePurchaseResaleOrder();

	const onPurchaseNFT = async () => {
		setPurchaseNFTPending(true);

		purchaseResaleOrder(Number(order.id), amount, order.price, order.seller)
			.then((tx) => {
				setTx(tx.hash);
			})
			.catch((err) => {
				setPurchaseNFTError(err.reason ?? err.data?.message ?? err);
			})
			.finally(() => {
				setPurchaseNFTPending(false);
			});
	};

	useEffect(() => {
		if (data && isSuccess) {
			setPurchaseNFTPending(false);
			order.callback();
		} else if (isError) {
			setPurchaseNFTPending(false);
			setPurchaseNFTError("Transaction failed");
		}
	}, [isError, data, isSuccess]);

	useEffect(() => {
		if (purchaseNFTError) {
			toast.error(
				`An error occurred: ${formatBlockchainResponse(purchaseNFTError)}.`
			);
			setPurchaseNFTError(false);
		}
	}, [purchaseNFTError]);

	const isProcessing = purchaseNFTPending || isLoading || isWaitingForTx;

	console.log({isError, data, isSuccess, isWaitingForTx, tx});

	if (!address) return <ConnectWalletButton />;

	return (
		<>
			<Button
				appearance={isProcessing ? "disabled" : "resale"}
				onClick={onPurchaseNFT}
				disabled={isProcessing}
			>
				{!isProcessing && (
					<>
						<Coins className="w-4 h-4" />
						Buy for {order.price} BNB
					</>
				)}
				{isProcessing && (
					<>
						<Spinner />
						Confirming transaction...
					</>
				)}
			</Button>
		</>
	);
};

export default ResaleListingBuyButton;
