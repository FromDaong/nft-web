import {
	useWagmiGetNFTMaxSupply,
	useWagmiGetNFTTotalSupply,
} from "@packages/chain/hooks";
import {useDisclosure} from "@packages/hooks";
import {ABI} from "@packages/treat/lib/abi";
import {contractAddresses} from "@packages/treat/lib/treat-contracts-constants";
import {apiEndpoint} from "@utils/index";
import axios from "axios";
import {BigNumber, ethers} from "ethers";
import {useSession} from "next-auth/react";
import {useCallback, useEffect, useRef, useState} from "react";
import {useAccount, useContract, useSigner} from "wagmi";

export const useTritNFTUtils = (nft: any) => {
	const {data: session} = useSession();
	const {data: signer} = useSigner();
	const [loadingSigner, setLoadingSigner] = useState(false);
	const [liked, setLikedNFT] = useState<undefined | boolean>(false);
	const [isProtected, setIsProtected] = useState(nft.protected);
	const listNFTModalProps = useDisclosure();
	const cancelOrderModalProps = useDisclosure();
	const transferNFTModalProps = useDisclosure();
	const buyResaleNFTModalProps = useDisclosure();
	const [likedBy, setLikedBy] = useState(nft.likedBy ?? []);
	const maxNftSupply = useWagmiGetNFTMaxSupply(nft.id);
	const mintedNfts = useWagmiGetNFTTotalSupply(nft.id);
	const remainingNfts = maxNftSupply - mintedNfts;

	const ref = useRef(null);

	useEffect(() => {
		if (signer) {
			setLoadingSigner(false);
		}
	}, [signer]);

	useEffect(() => {
		// @ts-ignore
		if (!ref && session?.profile && liked !== undefined) {
			ref.current = "loaded";
			// @ts-ignore
			if (nft.likedBy?.includes(session.profile._id)) {
				setLikedNFT(true);
			} else {
				setLikedNFT(false);
			}
		}
	}, [nft.likedBy, session]);

	const likeNFT = (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (!liked) {
			setLikedBy([...likedBy, (session as any).profile._id]);
		} else {
			setLikedBy(likedBy.filter((id) => id !== (session as any).profile._id));
		}

		setLikedNFT(!liked);

		return axios
			.post(`${apiEndpoint}/marketplace/nft/${nft.id}/like`)
			.catch(() => setLikedNFT(!liked));
	};

	const toggleImageProtection = () => {
		setIsProtected(!isProtected);
	};

	const getOpenOrdersForSeller = async (address) => {
		const data = await axios.get(
			`${apiEndpoint}/marketplace/methods/open-orders-for-seller?address=${address}`
		);
		const orders = data.data.data;

		return !!orders.find((order) => order.nftId === nft.id);
	};

	const {isOwned, balance} = useGetIsNFTOwned(nft);

	return {
		liked,
		likeNFT,
		listNFTModalProps,
		cancelOrderModalProps,
		transferNFTModalProps,
		buyResaleNFTModalProps,
		isMine: isOwned,
		balance,
		toggleImageProtection,
		getOpenOrdersForSeller,
		isProtected,
		likedBy,
		remainingNfts,
		loadingSigner,
	};
};

export const useTransferNFTs = (signer) => {
	const {address} = useAccount();

	const treatMinterContract = useContract({
		addressOrName: contractAddresses.treatNFTMinter[56],
		contractInterface: ABI.treatMinter,
		signerOrProvider: signer,
	});

	const transferNFT = useCallback(
		async (to: string, id: number, amount: number) => {
			console.log({
				address,
				to,
				id,
				amount,
			});
			return treatMinterContract.safeTransferFrom(
				address,
				to,
				id,
				amount,
				"0x00",
				{
					from: address,
				}
			);
		},
		[address, treatMinterContract]
	);

	return {transferNFT};
};

export const usePurchaseResaleOrder = (signer) => {
	const {address} = useAccount();

	const treatMarketplaceContract = useContract({
		addressOrName: contractAddresses.treatResaleMarketplaceMinter[56],
		contractInterface: ABI.treatMarketplace,
		signerOrProvider: signer,
	});

	const purchaseResaleOrder = useCallback(
		async (id: number, amount: number, totalPrice, seller: string) => {
			return treatMarketplaceContract.purchase(id, amount, seller, {
				from: address,
				value: Number(totalPrice),
			});
		},
		[address, treatMarketplaceContract]
	);

	return {purchaseResaleOrder};
};

export const useListOrder = () => {
	const {data: signer} = useSigner();
	const {address} = useAccount();

	const treatMarketplaceContract = useContract({
		addressOrName: contractAddresses.treatResaleMarketplaceMinter[56],
		contractInterface: ABI.treatMarketplace,
		signerOrProvider: signer,
	});

	const listOrder = useCallback(
		async (id, price, quantity) => {
			const priceBn = BigNumber.isBigNumber(price)
				? price
				: BigNumber.from(price);

			return treatMarketplaceContract.listOrder(
				id,
				quantity,
				`${priceBn.toHexString()}`,
				2147483647,
				{
					from: address,
				}
			);
		},
		[address, treatMarketplaceContract]
	);

	return {listOrder};
};

export const useRemoveOrder = () => {
	const {data: signer} = useSigner();
	const {address} = useAccount();

	const treatMarketplaceContract = useContract({
		addressOrName: contractAddresses.treatResaleMarketplaceMinter[56],
		contractInterface: ABI.treatMarketplace,
		signerOrProvider: signer,
	});

	const removeOrder = useCallback(
		async (id) => {
			return treatMarketplaceContract.cancelOrder(id, address, {
				from: address,
			});
		},
		[address, treatMarketplaceContract]
	);

	return {removeOrder};
};

export const useApproveMarketplace = () => {
	const {data: signer} = useSigner();
	const {address} = useAccount();

	const treatMinterContract = useContract({
		addressOrName: contractAddresses.treatNFTMinter[56],
		contractInterface: ABI.treatMinter,
		signerOrProvider: signer,
	});

	const approveMarketplace = useCallback(async () => {
		return treatMinterContract.setApprovalForAll(
			contractAddresses.treatResaleMarketplaceMinter[56],
			true,
			{
				from: address,
			}
		);
	}, [address, treatMinterContract]);

	return {
		approveMarketplace,
	};
};

export const useGetMinterIsApprovedForAll = () => {
	const [allowance, setAllowance] = useState(false);
	const [loading, setLoading] = useState(true);
	const {address} = useAccount();
	const {data: signer} = useSigner();

	const treatMinterContract = useContract({
		addressOrName: contractAddresses.treatNFTMinter[56],
		contractInterface: ABI.treatMinter,
		signerOrProvider: signer,
	});

	const treatMarketplaceAddress =
		contractAddresses.treatResaleMarketplaceMinter[56];

	const fetchAllowance = useCallback(async () => {
		const _allowance = await treatMinterContract.isApprovedForAll(
			address,
			treatMarketplaceAddress
		);
		setAllowance(_allowance);
		setLoading(false);
	}, [address, signer]);

	useEffect(() => {
		if (signer && treatMarketplaceAddress) {
			fetchAllowance();
		}
	}, [address, signer, treatMarketplaceAddress]);

	return [allowance, loading];
};

export const useGetResaleOrders = (id) => {
	const {data: signer} = useSigner();
	const [orders, setOrders] = useState([]);

	const treatMarketplaceContract = useContract({
		addressOrName: contractAddresses.treatResaleMarketplaceMinter[56],
		contractInterface: ABI.treatMarketplace,
		signerOrProvider: signer,
	});

	useEffect(() => {
		async function fetchOrders() {
			const sellers = await treatMarketplaceContract.getOpenOrdersForNft(id);

			const openOrdersForSeller = await Promise.all(
				sellers.map((seller) => treatMarketplaceContract.orderBook(id, seller))
			);

			setOrders(openOrdersForSeller);
		}

		if (signer) {
			fetchOrders();
		}
	}, [signer, treatMarketplaceContract]);

	return orders;
};

export const useGetRemainingOrderBalance = (id) => {
	const [balance, setBalance] = useState(0);
	const {address} = useAccount();
	const {data: signer} = useSigner();

	const treatMarketplaceContract = useContract({
		addressOrName: contractAddresses.treatResaleMarketplaceMinter[56],
		contractInterface: ABI.treatMarketplace,
		signerOrProvider: signer,
	});

	const getRemainingBalanceForOrder = useCallback(async () => {
		const bal = await treatMarketplaceContract.orderBalances(address, id);
		setBalance(bal);
	}, [address, treatMarketplaceContract]);

	useEffect(() => {
		if (signer) {
			getRemainingBalanceForOrder();
		}
	}, [signer, getRemainingBalanceForOrder]);

	return ethers.utils.formatEther(BigNumber.from(balance));
};

export const useGetRemainingOrderBalanceForSeller = (id, seller_address) => {
	const [balance, setBalance] = useState(0);
	const {data: signer} = useSigner();

	const treatMarketplaceContract = useContract({
		addressOrName: contractAddresses.treatResaleMarketplaceMinter[56],
		contractInterface: ABI.treatMarketplace,
		signerOrProvider: signer,
	});

	const getRemainingBalanceForOrder = useCallback(async () => {
		const bal = await treatMarketplaceContract.orderBalances(
			seller_address,
			id
		);
		setBalance(bal);
	}, [seller_address, treatMarketplaceContract]);

	useEffect(() => {
		if (signer) {
			getRemainingBalanceForOrder();
		}
	}, [signer, getRemainingBalanceForOrder]);

	return ethers.utils.formatEther(BigNumber.from(balance));
};

export const useCancelOrder = (id) => {
	const {data: signer} = useSigner();
	const {address} = useAccount();

	const treatMarketplaceContract = useContract({
		addressOrName: contractAddresses.treatResaleMarketplaceMinter[56],
		contractInterface: ABI.treatMarketplace,
		signerOrProvider: signer,
	});

	const removeListingFromResale = useCallback(async () => {
		return treatMarketplaceContract.cancelOrder(id, address);
	}, [address, treatMarketplaceContract]);

	return {
		removeListingFromResale,
	};
};

export const useBuyFromResale = () => {
	const {data: signer} = useSigner();
	const {address} = useAccount();

	const treatMarketplaceContract = useContract({
		addressOrName: contractAddresses.treatResaleMarketplaceMinter[56],
		contractInterface: ABI.treatMarketplace,
		signerOrProvider: signer,
	});

	const buyFromResale = useCallback(
		async (id, quantity, seller, totalPrice) => {
			return treatMarketplaceContract.purchase(id, quantity, seller, {
				from: address,
				value: totalPrice,
			});
		},
		[address, treatMarketplaceContract]
	);

	return {
		buyFromResale,
	};
};

export const useGetIsNFTOwned = (nft) => {
	const [isOwned, setIsOwned] = useState(false);
	const [balance, setBalance] = useState(0);
	const {data: signer} = useSigner();
	const {address} = useAccount();
	const {treatMinterContract} = useContracts();

	useEffect(() => {
		if (signer) {
			treatMinterContract.balanceOf(address, nft.id).then((bal) => {
				const balance = bal.toString();
				setBalance(parseInt(balance));
				if (parseInt(balance) > 0) {
					setIsOwned(true);
				}
			});
		}
	}, [treatMinterContract, signer]);

	return {
		isOwned,
		balance,
	};
};

export const useContracts = () => {
	const {data: signer} = useSigner();

	const treatMarketplaceContract = useContract({
		addressOrName: contractAddresses.treatResaleMarketplaceMinter[56],
		contractInterface: ABI.treatMarketplace,
		signerOrProvider: signer,
	});

	const treatSubscriptionsContract = useContract({
		addressOrName: contractAddresses.treatSubscriptions[56],
		contractInterface: ABI.treatSubscriptions,
		signerOrProvider: signer,
	});

	const permissionsHelperContract = useContract({
		addressOrName: contractAddresses.minterPermissionHelper[56],
		contractInterface: ABI.minterPermissionHelper,
		signerOrProvider: signer,
	});

	const treatMinterContract = useContract({
		addressOrName: contractAddresses.treatNFTMinter[56],
		contractInterface: ABI.treatMinter,
		signerOrProvider: signer,
	});

	const creatorMartContract = useContract({
		addressOrName: contractAddresses.creatorMart[56],
		contractInterface: ABI.creatorMart,
		signerOrProvider: signer,
	});

	const subscriptionsMart = useContract({
		addressOrName: contractAddresses.subscriberMart[56],
		contractInterface: ABI.subscriberNFTMart,
		signerOrProvider: signer,
	});

	const treatMarketplaceReaderContract = useContract({
		addressOrName: contractAddresses.treatMarketReader[56],
		contractInterface: ABI.treatMarketReader,
		signerOrProvider: signer,
	});

	return {
		treatMarketplaceContract,
		treatSubscriptionsContract,
		treatMinterContract,
		creatorMartContract,
		subscriptionsMart,
		permissionsHelperContract,
		treatMarketplaceReaderContract,
		signer,
	};
};
