import {useCallback, useEffect, useState} from "react";
import {ABI} from "@packages/treat/lib/abi";
import {contractAddresses} from "@packages/treat/lib/constants";
import {getBalanceNumber} from "@utils/formatBalance";
import {BigNumber, Contract, ethers} from "ethers";
import {
	useAccount,
	useContract,
	useContractRead,
	useContractWrite,
	usePrepareContractWrite,
	useSigner,
	useWaitForTransaction,
} from "wagmi";

export function useWagmiGetCreatorAddress(id: number) {
	const {data, isError, isLoading} = useContractRead({
		addressOrName: contractAddresses.totmMart[56],
		contractInterface: ABI.totmMart,
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
		addressOrName: contractAddresses.totmMart[56],
		contractInterface: ABI.totmMart,
		functionName: "nftCosts",
		args: [id],
	});

	return {
		treatCost: data ? ethers.utils.formatEther(BigNumber.from(data)) : 0,
		isError,
		isLoading,
	};
};

export const useWagmiGetCreatorNftCost = (id: number) => {
	const {data, isError, isLoading} = useContractRead({
		addressOrName: contractAddresses.creatorMart[56],
		contractInterface: ABI.creatorMart,
		functionName: "nftCosts",
		args: [id],
	});

	return {
		creatorCost: data ? ethers.utils.formatEther(BigNumber.from(data)) : 0,
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
		subscriptionCost: data ? ethers.utils.formatEther(BigNumber.from(data)) : 0,
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

	return Number(isLoading ? 0 : data?.toString());
};

export const useWagmiGetNFTTotalSupply = (id: number) => {
	const {data, isLoading, error} = useContractRead({
		addressOrName: contractAddresses.treatNFTMinter[56],
		contractInterface: ABI.treatMinter,
		functionName: "tokenSupply",
		args: [id],
	});

	console.log({data, error, id});

	return Number(isLoading ? 0 : data?.toNumber());
};

export const useWagmiGetResaleNFTsForNFT = (id: number) => {
	const [openOrders, setOpenOrders] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const {data: sellers} = useContractRead({
		addressOrName: contractAddresses.treatMarketplace[56],
		contractInterface: ABI.treatMarketplace,
		functionName: "getOpenOrdersForNft",
		args: [id],
	});

	const {data: signer} = useSigner();

	const treatMarketplaceContract = useContract({
		addressOrName: contractAddresses.treatMarketplace[56],
		contractInterface: ABI.treatMarketplace,
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

export const useWagmiMintFreeNFT = (id: number) => {
	const {data: signer} = useSigner();
	const {address} = useAccount();

	const treatMarketplaceContract = useContract({
		addressOrName: contractAddresses.creatorMart[56],
		contractInterface: ABI.creatorMart,
		signerOrProvider: signer,
	});

	const mintFreeNFT = useCallback(async () => {
		if (signer && treatMarketplaceContract) {
			const tx = await treatMarketplaceContract?.redeemFreeTreat(id, {
				from: address,
				value: 0,
			});
			return tx;
		}

		return null;
	}, [treatMarketplaceContract, id, signer]);

	return {
		mintFreeNFT,
	};
};

export const useWagmiMintFreeTOTMNFT = (id: number) => {
	const {data: signer} = useSigner();
	const {address} = useAccount();

	const totmMartContract = useContract({
		addressOrName: contractAddresses.totmMart[56],
		contractInterface: ABI.totmMart,
		signerOrProvider: signer,
	});

	const mintFreeNFT = useCallback(async () => {
		if (signer && totmMartContract) {
			const tx = await totmMartContract?.redeemFreeTreat(id, {
				from: address,
				value: 0,
			});
			return tx;
		}

		return null;
	}, [totmMartContract, id, signer]);

	return {
		mintFreeNFT,
	};
};

export const useHKWagmiMintFreeTOTMNFT = (id: number) => {
	const {config} = usePrepareContractWrite({
		addressOrName: contractAddresses.totmMart[56],
		contractInterface: ABI.totmMart,
		functionName: "redeemFreeTreat",
		args: [id],
	});

	const {
		write: mint,
		data,
		isLoading: isMintLoading,
		isSuccess: isMintStarted,
	} = useContractWrite(config);

	const {isSuccess: isTxConfirmed} = useWaitForTransaction({
		hash: data?.hash,
	});

	return {
		mintFreeNFT: mint,
		isTxConfirmed,
		isMintStarted,
		isMintLoading,
	};
};

export const useWagmiMintFreeSubscriberNFT = (id: number) => {
	const {data: signer} = useSigner();
	const {address} = useAccount();

	const subscriptionMartContract = useContract({
		addressOrName: contractAddresses.subscriberMart[56],
		contractInterface: ABI.subscriberNFTMart,
		signerOrProvider: signer,
	});

	const mintFreeNFT = useCallback(async () => {
		if (signer && subscriptionMartContract) {
			const tx = await subscriptionMartContract?.redeemFreeTreat(id, {
				from: address,
				value: 0,
			});
			return tx;
		}

		return null;
	}, [subscriptionMartContract, id, signer]);

	return {
		mintFreeNFT,
	};
};

// START MINT NFT

export const useWagmiMintCreatorNFT = (id: number, treatCost: number) => {
	const {data: signer} = useSigner();
	const {address} = useAccount();

	const creatorMartContract = useContract({
		addressOrName: contractAddresses.creatorMart[56],
		contractInterface: ABI.creatorMart,
		signerOrProvider: signer,
	});

	const mintNFT = useCallback(async () => {
		if (signer && creatorMartContract) {
			const tx = await creatorMartContract?.redeem(id, {
				from: address,
				value: ethers.utils.parseEther(treatCost.toString()),
			});
			return tx;
		}

		return null;
	}, [creatorMartContract, id, signer]);

	return {
		mintNFT,
	};
};

export const useWagmiMintTOTMNFT = (id: number, treatCost: number) => {
	const {data: signer} = useSigner();
	const {address} = useAccount();

	const totmMartContract: Contract = useContract({
		addressOrName: contractAddresses.totmMart[56],
		contractInterface: ABI.totmMart,
		signerOrProvider: signer,
	});

	const mintNFT = useCallback(async () => {
		if (signer && totmMartContract) {
			const tx = await totmMartContract?.redeem(id, {
				from: address,
				value: ethers.utils.parseEther(treatCost.toString()),
			});
			return tx;
		}

		return null;
	}, [totmMartContract, id, signer]);

	return {
		mintNFT,
	};
};

export const useWagmiMintSubscriberNFT = (id: number, treatCost: number) => {
	const {data: signer} = useSigner();
	const {address} = useAccount();

	const subscriptionMartContract = useContract({
		addressOrName: contractAddresses.subscriberMart[56],
		contractInterface: ABI.subscriberNFTMart,
		signerOrProvider: signer,
	});

	const mintNFT = useCallback(async () => {
		if (signer && subscriptionMartContract) {
			const tx = await subscriptionMartContract?.redeem(id, {
				from: address,
				value: ethers.utils.parseEther(treatCost.toString()),
			});
			return tx;
		}

		return null;
	}, [subscriptionMartContract, id, signer]);

	return {
		mintNFT,
	};
};

// END MINT NFT

export const useSubscriptionData = (creator_address: string) => {
	const [isSubscribed, setIsSubscribed] = useState(false);
	const [loadingIsSubscribed, setLoadingIsSubscribed] = useState(true);
	const {data: signer} = useSigner();
	const {address} = useAccount();

	const {data, isError, isLoading} = useContractRead({
		addressOrName: contractAddresses.treatSubscriptions[56],
		contractInterface: ABI.treatSubscriptions,
		functionName: "creatorSubscriptionCost",
		args: [creator_address],
	});

	const subscriptionContract = useContract({
		addressOrName: contractAddresses.treatSubscriptions[56],
		contractInterface: ABI.treatSubscriptions,
		signerOrProvider: signer,
	});

	useEffect(() => {
		setLoadingIsSubscribed(true);
		if (subscriptionContract && signer) {
			subscriptionContract
				.getIsSubscribedNow(address, creator_address)
				.then((result) => {
					setIsSubscribed(result);
				})
				.then(() => setLoadingIsSubscribed(false));
		} else {
			setIsSubscribed(false);
		}
	}, [address, subscriptionContract, signer]);

	const subscribe = useCallback(async () => {
		return subscriptionContract.subscribe(creator_address, BigNumber.from(1), {
			from: address,
			value: data,
		});
	}, [address, subscriptionContract, data]);

	console.log({creator_address, data});

	return {
		subscriptionPrice: data
			? ethers.utils.formatEther(BigNumber.from(data))
			: 0,
		isError,
		isLoading,
		isSubscribed,
		subscribe,
		loadingIsSubscribed,
	};
};
