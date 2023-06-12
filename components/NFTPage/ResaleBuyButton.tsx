import {useCallback, useContext, useEffect, useState} from "react";
import {SelectedOrderContext} from "./SelectedOrderContext";
import {Button} from "@packages/shared/components/Button";
import {Coins} from "lucide-react";
import Spinner from "@packages/shared/icons/Spinner";
import {useAccount, useWaitForTransaction} from "wagmi";
import {useContracts} from "@packages/post/hooks";
import {ethers} from "ethers";
import {toast} from "sonner";

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

const ResaleListingBuyButton = (order: {
	price: number;
	seller: string;
	id: number;
	currentSupply: number;
	callback: () => void;
}) => {
	const {isLoading} = useContext(SelectedOrderContext);
	const [amount] = useState(1);
	const [purchaseNFTPending, setPurchaseNFTPending] = useState(false);
	const [purchaseNFTError, setPurchaseNFTError] = useState<any>(false);
	const [tx, setTx] = useState("");

	const {isError, data, isSuccess} = useWaitForTransaction({
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
			order.callback;
		} else if (isError) {
			setPurchaseNFTPending(false);
			setPurchaseNFTError("Transaction failed");
		}
	}, [isError, data, isSuccess]);

	useEffect(() => {
		if (purchaseNFTError)
			toast.error(`An error occurred: ${purchaseNFTError}.`);
	}, [purchaseNFTError]);

	const isProcessing = purchaseNFTPending || isLoading;

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
						Loading...
					</>
				)}
			</Button>
		</>
	);
};

export default ResaleListingBuyButton;
