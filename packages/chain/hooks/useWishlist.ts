import {apiEndpoint} from "@utils/index";
import axios from "axios";
import TreatCore from "core/TreatCore";
import {useMemo} from "react";
import {toast} from "sonner";
import {useAccount} from "wagmi";

export const useMyWishlist = (address: string) => {
	const {data: wishlist = [], isLoading} = TreatCore.useQuery(
		[`wishlist-${address}`],
		async () => {
			const res = await axios.get(
				`${apiEndpoint}/utils/wishlist?address=${address}`
			);
			return res.data.data ?? {};
		},
		{
			enabled: !!address,
		}
	);

	return {
		wishlist: wishlist.nfts ?? [],
		isLoading,
	};
};

export const useWishlist = (_id: string) => {
	const {address} = useAccount();
	const {wishlist, isLoading} = useMyWishlist(address);

	const wishlistedNFTs = useMemo(() => wishlist ?? [], [wishlist]);

	const useAddToWishlist = () => {
		const mutate = TreatCore.useMutation({
			mutationFn: async (id: string) => {
				await axios.post(`${apiEndpoint}/utils/wishlist?address=${address}`, {
					id,
				});
			},
			onSuccess: () => {
				TreatCore.queryClient.invalidateQueries([`wishlist-${address}`]);
				toast.success("NFT added to wishlist");
			},
		});
		return mutate;
	};

	const useRemoveFromWishlist = () => {
		const mutate = TreatCore.useMutation({
			mutationFn: async (id: string) => {
				await axios.patch(`${apiEndpoint}/utils/wishlist?address=${address}`, {
					id,
				});
			},
			onSuccess: () => {
				TreatCore.queryClient.invalidateQueries([`wishlist-${address}`]);
				toast.success("NFT removed from wishlist");
			},
		});
		return mutate;
	};

	const removeFromWishlist = useRemoveFromWishlist();
	const addToWishlist = useAddToWishlist();
	const isWishlisted = useMemo(
		() => !!wishlistedNFTs.find((item) => item._id === _id),
		[_id, address, isLoading, wishlist]
	);

	return {
		wishlist: wishlistedNFTs,
		addToWishlist: () => addToWishlist.mutate(_id),
		removeFromWishlist: () => removeFromWishlist.mutate(_id),
		isWishlisted,
		isLoading,
	};
};
