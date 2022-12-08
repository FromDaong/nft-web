import {
	getSubscriberMartContract,
	redeemSubscriberSet,
} from "@packages/chain/utils";

import {useCallback} from "react";
import {useAccount} from "wagmi";
import useTreat from "./useTreat";

const useRedeemSubscriberSet = (id: number, treatCost: number) => {
	const {address: account} = useAccount();
	const treat = useTreat();
	const subscriberMartContract = getSubscriberMartContract(treat);

	const handleRedeemSubscriberSet = useCallback(async () => {
		const txHash = await redeemSubscriberSet(
			subscriberMartContract,
			account,
			id,
			treatCost
		);
		return txHash;
	}, [account, id, treatCost, subscriberMartContract]);

	return {onRedeemSubscriberSet: handleRedeemSubscriberSet};
};

export default useRedeemSubscriberSet;
