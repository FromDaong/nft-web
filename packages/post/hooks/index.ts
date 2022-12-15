import {ABI} from "@packages/treat/lib/abi";
import {contractAddresses} from "@packages/treat/lib/constants";
import {apiEndpoint} from "@utils/index";
import axios from "axios";
import useUser from "core/auth/useUser";
import {BigNumber, ethers} from "ethers";
import {useRouter} from "next/router";
import {useCallback, useEffect, useState} from "react";
import {useAccount, useContract, useSigner} from "wagmi";

export const useTritNFTUtils = (nft: any) => {
	const {user} = useUser();
	const [liked, setLikedNFT] = useState<undefined | boolean>(false);

	useEffect(() => {
		if (user?.profile && liked !== undefined) {
			if (nft.likedBy?.includes(user.profile._id)) {
				setLikedNFT(true);
			} else {
				setLikedNFT(false);
			}
		}
	}, [nft.likedBy, user]);

	const isApprovedForAll = useGetMinterIsApprovedForAll();
	const {onApprove} = useApproveMarketplace();

	const listNFTForResale = () => {};
	const removeNFTFromResale = () => {};
	const buyResaleNFT = () => {};
	const isListedOnResale = () => {};

	const likeNFT = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setLikedNFT(!liked);
		return axios
			.post(`${apiEndpoint}/marketplace/nft/${nft.id}/like`)
			.catch(() => setLikedNFT(!liked));
	};

	return {
		liked,
		likeNFT,
		isListedOnResale,
		listNFTForResale,
	};
};

export const useTransferNFTs = () => {
	const {data: signer} = useSigner();
	const {address} = useAccount();

	const treatMarketplaceContract = useContract({
		addressOrName: contractAddresses.treatSubscriptions[56],
		contractInterface: ABI.treatSubscribtions,
		signerOrProvider: signer,
	});

	const transferNFT = useCallback(
		async (to, id, amount) => {
			return treatMarketplaceContract.safeTransferFrom(
				address,
				to,
				id,
				amount,
				{
					from: address,
				}
			);
		},
		[address, treatMarketplaceContract]
	);

	return {transferNFT};
};

export const useListOrder = () => {
	const {data: signer} = useSigner();
	const {address} = useAccount();

	const treatMarketplaceContract = useContract({
		addressOrName: contractAddresses.treatSubscriptions[56],
		contractInterface: ABI.treatSubscribtions,
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
		return treatMinterContract.subscribe(
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
	const {address} = useAccount();
	const {data: signer} = useSigner();

	const treatMarketplaceContract = useContract({
		addressOrName: contractAddresses.treatSubscriptions[56],
		contractInterface: ABI.treatSubscribtions,
		signerOrProvider: signer,
	});
	const treatMarketplaceAddress = contractAddresses.treatMarketplace[56];

	const fetchAllowance = useCallback(async () => {
		const _allowance = await treatMarketplaceContract.isApprovedForAll(
			address,
			treatMarketplaceAddress
		);
		setAllowance(_allowance);
	}, [address, signer]);

	useEffect(() => {
		if (signer && treatMarketplaceAddress) {
			fetchAllowance();
		}
	}, [address, signer, treatMarketplaceAddress]);

	return allowance;
};

export const useGetResaleOrder = (id) => {
	const {data: signer} = useSigner();
	const [orders, setOrders] = useState([]);

	const treatMarketplaceContract = useContract({
		addressOrName: contractAddresses.treatSubscriptions[56],
		contractInterface: ABI.treatSubscribtions,
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
		addressOrName: contractAddresses.treatSubscriptions[56],
		contractInterface: ABI.treatSubscribtions,
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

export const useCancelOrder = () => {
	const {data: signer} = useSigner();
	const {address} = useAccount();

	const treatMarketplaceContract = useContract({
		addressOrName: contractAddresses.treatSubscriptions[56],
		contractInterface: ABI.treatSubscribtions,
		signerOrProvider: signer,
	});

	const removeListingFromResale = useCallback(
		async (id) => {
			return treatMarketplaceContract.subscribe(id, address);
		},
		[address, treatMarketplaceContract]
	);

	return {
		removeListingFromResale,
	};
};

export const useBuyFromResale = () => {
	const {data: signer} = useSigner();
	const {address} = useAccount();

	const treatMarketplaceContract = useContract({
		addressOrName: contractAddresses.treatSubscriptions[56],
		contractInterface: ABI.treatSubscribtions,
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
