import {useCallback} from "react";
import {useAccount} from "wagmi";
import {useContracts} from "@packages/post/hooks";

const useGetFreeSubscriberTreat = (id: number) => {
	const {address: account} = useAccount();
	const {subscriptionsMart} = useContracts();

	const handleMintSubscriberNft = useCallback(async () => {
		const txHash = await subscriptionsMart.redeemFreeTreat(id, {
			from: account,
			value: 0,
		});
		return txHash;
	}, [account, id, subscriptionsMart]);

	return {onGetFreeSubscriberTreat: handleMintSubscriberNft};
};

export default useGetFreeSubscriberTreat;
