import {
	addSubscriberFreeTreat,
	getSubscriberMartContract,
} from "@packages/chain/utils";

import {useCallback} from "react";
import {useAccount} from "wagmi";
import useTreat from "./useTreat";

const useAddSubscriberFreeTreat = (ids: Array<number>) => {
	const {address: account} = useAccount();
	const treat = useTreat();
	const subscriberMartContract = getSubscriberMartContract(treat);

	const handleAddSubscriberFreeTreat = useCallback(async () => {
		const txHash = await addSubscriberFreeTreat(
			subscriberMartContract,
			account,
			ids
		);
		return txHash;
	}, [account, ids, subscriberMartContract]);

	return {onAddSubscriberFreeTreat: handleAddSubscriberFreeTreat};
};

export default useAddSubscriberFreeTreat;
