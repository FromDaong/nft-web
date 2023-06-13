// takes nftId, price, quantity, seller as default and allows switching between orders

import {useWagmiGetNFTMaxSupply} from "@packages/chain/hooks";
import {useRouter} from "next/router";
import {createContext, useEffect, useMemo, useState} from "react";
import {gql, useQuery} from "urql";
import Web3 from "web3";

type Order = {
	nftId: number;
	price: number;
	currentSupply: number;
	seller: string;
	isResale: boolean;
	maxSupply: number;
};

type SelectedOrderContextType = {
	selectedOrder: Order | null;
	setSelectedOrder: (order: any) => void;
	isLoading: boolean;
	isError: boolean;
	baseOrder: Order | null;
};

export const SelectedOrderContext = createContext<SelectedOrderContextType>({
	selectedOrder: null,
	setSelectedOrder: (order: Order) => true,
	isLoading: true,
	isError: false,
	baseOrder: null,
});

const resaleOrderQuery = gql`
	query resaleTokens($id: BigInt!, $address: Bytes!) {
		marketItems(where: {nft: $id, isActive: true, seller_contains: $address}) {
			cost
			id
			currentSupply
			maxSupply
			nft
			seller
			timestamp
		}
	}
`;

const tokenQuery = gql`
	query token($id: BigInt!) {
		tokens(where: {identifier: $id}) {
			identifier
			totalSales
			totalSupply
			totalSaleValue
			creator {
				id
				totalSales
			}
			transfers(first: 10) {
				timestamp
				value
				from {
					id
				}
				to {
					id
				}
				operator {
					id
				}
			}
		}
	}
`;

const useOrder = (id: number, creator_address: string) => {
	const router = useRouter();
	const seller = useMemo(() => `${router.query.seller}`, [router.query]);
	const isResale = (seller as string)?.toLowerCase() !== creator_address;
	const [{data}, refetch] = useQuery({
		query: resaleOrderQuery,
		variables: {
			id: `${id}`,
			address: `${seller}`,
		},
		pause: !id || !seller || !isResale,
	});

	const {marketItems = [], fetching, error} = data ?? {};

	useEffect(() => {
		refetch({requestPolicy: "network-only"});
	}, [seller]);

	return {
		isResale,
		order: marketItems[0],
		fetching,
		error,
		seller: `${seller}`,
	};
};

const useToken = (id: number) => {
	const [{data, fetching: fetchingToken, error: fetchingError}] = useQuery({
		query: tokenQuery,
		variables: {
			id: `${id}`,
		},
		pause: !id,
	});

	const {tokens: [token] = []} = data ?? {};

	return {
		token,
		fetchingToken,
		fetchingError,
	};
};

export const SelectedOrderProvider = ({children, id, creator_address}) => {
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
	const [baseOrder, setBaseOrder] = useState<Order | null>(null);

	const baseTokenMaxNftSupply = useWagmiGetNFTMaxSupply(id);

	const {
		isResale,
		fetching: isFetchingResaleOrder,
		order,
		error: isResaleOrderError,
		seller: orderSeller,
	} = useOrder(id, creator_address);
	const {token, fetchingError, fetchingToken} = useToken(id);

	const isLoading = useMemo(
		() => isFetchingResaleOrder || fetchingToken || !baseOrder,
		[fetchingToken, isFetchingResaleOrder, baseOrder]
	);
	const isError = useMemo(
		() => !!isResaleOrderError || !!fetchingError,
		[fetchingError, isResaleOrderError]
	);

	useEffect(() => {
		if (token) {
			setBaseOrder({
				currentSupply: token.totalSupply,
				maxSupply: baseTokenMaxNftSupply,
				isResale: false,
				nftId: id,
				price: -1,
				seller: creator_address,
			});
		}

		if (!isResale && token)
			setSelectedOrder({
				currentSupply: token.totalSupply,
				maxSupply: baseTokenMaxNftSupply,
				isResale: false,
				nftId: id,
				price: -1,
				seller: creator_address,
			});

		if (isResale && order)
			setSelectedOrder({
				currentSupply: order.currentSupply,
				isResale: true,
				maxSupply: order.maxSupply,
				nftId: id,
				price: parseFloat(Web3.utils.fromWei(order.cost)),
				seller: orderSeller,
			});
	}, [isResale, token, order, baseTokenMaxNftSupply]);

	const selectOrder = (order: Order) => setSelectedOrder(order);

	return (
		<SelectedOrderContext.Provider
			value={{
				selectedOrder,
				baseOrder,
				setSelectedOrder: selectOrder,
				isError,
				isLoading,
			}}
		>
			{children}
		</SelectedOrderContext.Provider>
	);
};
