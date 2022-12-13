import {useCallback, useEffect, useState} from "react";
import {ABI} from "@packages/treat/lib/abi";
import {contractAddresses} from "@packages/treat/lib/constants";
import {getBalanceNumber} from "@utils/formatBalance";
import {BigNumber} from "ethers";
import {useContract, useContractRead, useSigner} from "wagmi";

export function useWagmiGetCreatorAddress(id: number) {
	const {data, isError, isLoading} = useContractRead({
		addressOrName: contractAddresses.treatMart[56],
		contractInterface: ABI.treatOfTheMonthMart,
		functionName: "getCreatorAddress",
		args: [id],
	});

	return {
		creatorAddress: data as unknown as string,
		isError,
		isLoading,
	};
}

export const useWagmiGetTreatOfTheMonthNftCost = (id: number) => {
	const {data, isError, isLoading} = useContractRead({
		addressOrName: contractAddresses.treatMart[56],
		contractInterface: ABI.treatOfTheMonthMart,
		functionName: "nftCosts",
		args: [id],
	});

	return {
		treatCost: getBalanceNumber(
			(data as unknown as BigNumber) ?? BigNumber.from(0)
		),
		isError,
		isLoading,
	};
};

export const useWagmiGetCreatorNftCost = (id: number) => {
	const {data, isError, isLoading} = useContractRead({
		addressOrName: contractAddresses.creatorMart[56],
		contractInterface: ABI.regularTreatNFTMinter,
		functionName: "nftCosts",
		args: [id],
	});

	return {
		creatorCost: getBalanceNumber(
			(data as unknown as BigNumber) ?? BigNumber.from(0)
		),
		isError,
		isLoading,
	};
};

export const useWagmiGetSubscriberNftCost = (id: number) => {
	const {data, isError, isLoading} = useContractRead({
		addressOrName: contractAddresses.subscriberMart[56],
		contractInterface: ABI.subscriberNFTMart,
		functionName: "nftCosts",
		args: [id],
	});

	return {
		subscriptionCost: getBalanceNumber(
			(data as unknown as BigNumber) ?? BigNumber.from(0)
		),
		isError,
		isLoading,
	};
};

export const useWagmiGetNFTMaxSupply = (id: number) => {
	const {data, isError, isLoading} = useContractRead({
		addressOrName: contractAddresses.treatNFTMinter[56],
		contractInterface: ABI.treatMinter,
		functionName: "tokenMaxSupply",
		args: [id],
	});

	return Number(isLoading ? 0 : data.toString());
};

export const useWagmiGetNFTTotalSupply = (id: number) => {
	const {data, isError, isLoading} = useContractRead({
		addressOrName: contractAddresses.treatNFTMinter[56],
		contractInterface: ABI.treatMinter,
		functionName: "tokenSupply",
		args: [id],
	});

	return Number(isLoading ? 0 : data.toString());
};

export const useWagmiGetResaleNFTsForNFT = (id: number) => {
	const [openOrders, setOpenOrders] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const {data: sellers} = useContractRead({
		addressOrName: contractAddresses.treatMarketplace[56],
		contractInterface: ABI.treatNFTMarketplace,
		functionName: "getOpenOrdersForNft",
		args: [id],
	});

	const {data: signer} = useSigner();

	const treatMarketplaceContract = useContract({
		addressOrName: contractAddresses.treatMarketplace[56],
		contractInterface: ABI.treatNFTMarketplace,
		signerOrProvider: signer,
	});

	useEffect(() => {
		if (signer && treatMarketplaceContract && sellers?.length > 0) {
			Promise.all(
				sellers.map((seller) => treatMarketplaceContract?.orderBook(id, seller))
			)
				.then(setOpenOrders)
				.then(() => setIsLoading(false));
		}
	}, [sellers, treatMarketplaceContract, signer]);

	return {
		openOrders: openOrders.map((order) => ({...order})),
		isLoading,
	};
};
