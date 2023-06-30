import {
	useSubscriptionData,
	useWagmiGetCreatorNftCost,
	useWagmiGetNFTMaxSupply,
	useWagmiGetNFTTotalSupply,
	useWagmiGetResaleNFTsForNFT,
	useWagmiGetSubscriberNftCost,
	useWagmiGetTreatOfTheMonthNftCost,
	useWagmiMintCreatorNFT,
	useWagmiMintFreeNFT,
	useWagmiMintFreeSubscriberNFT,
	useWagmiMintFreeTOTMNFT,
	useWagmiMintSubscriberNFT,
	useWagmiMintTOTMNFT,
} from "@packages/chain/hooks";
import {useCallback, useMemo} from "react";
import {useAccount} from "wagmi";
import {useContracts, useGetRemainingOrderBalanceForSeller} from ".";

export type BuyButtonProps = {
	seller: any;
	creator: any;
	[key: string]: any;
	postUtils: any;
	callback: () => void;
};

export const get_nft_type = (nft) => {
	if (nft.subscription_nft) {
		return "subscription";
	}

	if (nft.totm_nft) {
		return "totm";
	}

	return "creatorMart";
};

const useFreeMinters = ({type}) => {
	const useMinter = useMemo(() => {
		switch (type) {
			case "creatorMart":
				return useWagmiMintFreeNFT;
			case "subscription":
				return useWagmiMintFreeSubscriberNFT;
			case "totm":
				return useWagmiMintFreeTOTMNFT;
			default:
				return useWagmiMintFreeNFT;
		}
	}, [type]);

	return {useMinter};
};

const usePayingMinters = (type) => {
	const useMinter = useMemo(() => {
		switch (type) {
			case "creatorMart":
				return useWagmiMintCreatorNFT;
			case "subscription":
				return useWagmiMintSubscriberNFT;
			case "totm":
				return useWagmiMintTOTMNFT;
			default:
				return useWagmiMintCreatorNFT;
		}
	}, [type]);

	return {useMinter};
};

export const useDefaultMinterProvider = (cost: number) => {
	const useMinter = useMemo(() => {
		if (cost === 0) return useWagmiMintFreeNFT;
		return useWagmiMintCreatorNFT;
	}, [cost]);
	return {useMinter};
};

const useMinterTypeSelector = (type) => {
	const useSelectedMinter = useMemo(() => {
		if (type === "free") return useFreeMinters;
		return usePayingMinters;
	}, [type]);

	return {useSelectedMinter};
};

export const useMinterFactory = (nft_type, cost) => {
	const {useSelectedMinter} = useMinterTypeSelector(cost === 0 && "free");
	const {useMinter} = useSelectedMinter(nft_type);
	return {useMinter};
};

export const usePrimaryNFT = (nft) => {
	// Primary hooks
	const subscription = useSubscriptionData(nft.creator.address);
	const maxNftSupply = useWagmiGetNFTMaxSupply(nft.id);
	const mintedNfts = useWagmiGetNFTTotalSupply(nft.id);
	const {resaleListings: listedOnResale} = useWagmiGetResaleNFTsForNFT(nft.id);

	// Private constants
	const isTOTMNFT = nft.totm_nft;
	const isSubscriptionNFT = !!nft.subscription_nft;
	const isCreatorMartNFT = !isTOTMNFT && !isSubscriptionNFT;

	// Exported constants
	const remainingNfts = maxNftSupply - mintedNfts;
	const nftSoldOut = remainingNfts === 0 || remainingNfts < 0;
	const isRedeemDisabled = !!(nftSoldOut || nftSoldOut);
	const nftType = useMemo(() => {
		if (isCreatorMartNFT) {
			return "creatorMart";
		} else if (isSubscriptionNFT) {
			return "subscription";
		} else if (isTOTMNFT) {
			return "totm";
		}

		return "creatorMart";
	}, [isCreatorMartNFT, isSubscriptionNFT, isTOTMNFT]);

	// Helper functions
	const {useNFTCost} = useNFTCostFunctionFactory(nftType);
	const {cost} = useNFTCost(nft.id);
	const {useMinter} = useMinterFactory(nftType, Number(cost ?? nft.price));
	const {mintNFT: mint} = useMinter(nft.id, Number(cost ?? nft.price));

	// Return interface
	return {
		remainingNfts,
		nftSoldOut,
		nftType,
		isRedeemDisabled,
		listedOnResale: listedOnResale.length > 0,
		subscription,
		cost,
		mint,
	};
};

export const useSecondaryNFT = (nft, seller_address) => {
	// Primary hooks
	const {address} = useAccount();
	const {resaleListings} = useWagmiGetResaleNFTsForNFT(nft.id);
	const {treatMarketplaceContract} = useContracts();

	// Exported constants
	const isValidResaleOrder = useMemo(() => {
		return !!resaleListings.find((order) => order.seller === seller_address);
	}, [seller_address, resaleListings.length > 0]);
	const numberOfRemainingResaleNFTsBySeller =
		useGetRemainingOrderBalanceForSeller(nft.id, seller_address);

	// Helper functions
	const mint = useCallback(
		async (cost, seller_address) => {
			return treatMarketplaceContract.purchase(nft.id, 1, seller_address, {
				from: address,
				value: cost,
			});
		},
		[address, treatMarketplaceContract]
	);

	// Return interface
	return {
		remainingNfts: Number(numberOfRemainingResaleNFTsBySeller),
		nftSoldOut: Number(numberOfRemainingResaleNFTsBySeller) === 0,
		nftType: "resaleMart",
		isRedeemDisabled: !!isValidResaleOrder,
		listedOnResale: true,
		subscription: undefined,
		cost: 0,
		mint,
	};
};

export const useNFTFactory = () => {
	return {
		useNFT: usePrimaryNFT,
	};
};

export const useNFTCostFunctionFactory = (
	nftType: "creatorMart" | "subscription" | "totm"
) => {
	const useNFTCost = useMemo(() => {
		switch (nftType) {
			case "creatorMart":
				return useWagmiGetCreatorNftCost;
			case "subscription":
				return useWagmiGetSubscriberNftCost;
			case "totm":
				return useWagmiGetTreatOfTheMonthNftCost;
			default:
				return useWagmiGetCreatorNftCost;
		}
	}, [nftType]);

	return {useNFTCost};
};
