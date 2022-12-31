import {useDisclosure} from "@packages/hooks";
import {ABI} from "@packages/treat/lib/abi";
import {contractAddresses} from "@packages/treat/lib/constants";
import {apiEndpoint} from "@utils/index";
import axios from "axios";
import {BigNumber, ethers} from "ethers";
import {useSession} from "next-auth/react";
import {useCallback, useEffect, useState} from "react";
import {useAccount, useContract, useSigner} from "wagmi";

export const useTritNFTUtils = (nft: any) => {
	const {data: session} = useSession();
	const [liked, setLikedNFT] = useState<undefined | boolean>(false);
	const [isProtected, setIsProtected] = useState(nft.protected);
	const listNFTModalProps = useDisclosure();
	const cancelOrderModalProps = useDisclosure();
	const transferNFTModalProps = useDisclosure();
	const buyResaleNFTModalProps = useDisclosure();
	const [likedBy, setLikedBy] = useState(nft.likedBy ?? []);

	const isListedOnResale = useGetResaleOrders(nft.id);

	useEffect(() => {
		// @ts-ignore

		if (session?.profile && liked !== undefined) {
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

	const {isOwned, balance} = useGetIsNFTOwned(nft);

	return {
		liked,
		likeNFT,
		isListedOnResale,
		listNFTModalProps,
		cancelOrderModalProps,
		transferNFTModalProps,
		buyResaleNFTModalProps,
		isMine: isOwned,
		balance,
		toggleImageProtection,
		isProtected,
		likedBy,
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
		async (to, id, amount) => {
			return treatMinterContract.safeTransferFrom(
				address,
				to,
				id,
				amount,
				"0x0",
				{
					from: address,
				}
			);
		},
		[address, treatMinterContract]
	);

	return {transferNFT};
};

export const useListOrder = () => {
	const {data: signer} = useSigner();
	const {address} = useAccount();

	const treatMarketplaceContract = useContract({
		addressOrName: contractAddresses.treatMarketplace[56],
		contractInterface: ABI.treatMarketplace,
		signerOrProvider: signer,
	});

	const listOrder = useCallback(
		async (to, id, price, quantity) => {
			const priceBn = BigNumber.isBigNumber(price)
				? price
				: BigNumber.from(price);

			return treatMarketplaceContract.listOrder(
				id,
				quantity,
				`0x${priceBn.toString()}`,
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
			contractAddresses.treatMarketplace[56],
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

	const treatMarketplaceAddress = contractAddresses.treatMarketplace[56];

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
		addressOrName: contractAddresses.treatMarketplace[56],
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
		addressOrName: contractAddresses.treatMarketplace[56],
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
		addressOrName: contractAddresses.treatMarketplace[56],
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
		addressOrName: contractAddresses.treatMarketplace[56],
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
		addressOrName: contractAddresses.treatMarketplace[56],
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
		addressOrName: contractAddresses.treatMarketplace[56],
		contractInterface: ABI.treatMarketplace,
		signerOrProvider: signer,
	});

	const treatSubscriptionsContract = useContract({
		addressOrName: contractAddresses.treatSubscriptions[56],
		contractInterface: ABI.treatSubscriptions,
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

	return {
		treatMarketplaceContract,
		treatSubscriptionsContract,
		treatMinterContract,
		creatorMartContract,
		subscriptionsMart,
		signer,
	};
};
