import {useCallback} from "react";
import {useAccount} from "wagmi";
import {useContracts} from "@packages/post/hooks";

const useGetFreeSubscriberTreat = (id: number, treatCost: number) => {
	const {address: account} = useAccount();
	const {subscriptionsMart} = useContracts();

	const handleMintSubscriberNft = useCallback(async () => {
		const txHash = await subscriptionsMart.redeemFreeTreat(id, {
			from: account,
			value: treatCost,
		});
		return txHash;
	}, [account, id, treatCost, subscriptionsMart]);

	return {onGetFreeSubscriberTreat: handleMintSubscriberNft};
};

export default useGetFreeSubscriberTreat;
