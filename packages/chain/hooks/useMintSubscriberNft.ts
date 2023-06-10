import {useCallback} from "react";
import {useAccount} from "wagmi";
import {useContracts} from "@packages/post/hooks";

const useMintSubscriberNft = (id: number, treatCost: number) => {
	const {address: account} = useAccount();
	const {subscriptionsMart} = useContracts();

	const handleMintSubscriberNft = useCallback(async () => {
		const txHash = await subscriptionsMart.redeem(id, {
			from: account,
			value: treatCost,
		});
		return txHash;
	}, [account, id, treatCost, subscriptionsMart]);

	return {onMintSubscriberNft: handleMintSubscriberNft};
};

export default useMintSubscriberNft;
