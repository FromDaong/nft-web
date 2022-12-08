import {editSub, getTreatSubscriptionContract} from "@packages/chain/utils";

import {useCallback} from "react";
import {useAccount} from "wagmi";
import useTreat from "./useTreat";

const useEditSubscription = (amount: number) => {
	const {address: account} = useAccount();
	const treat = useTreat();
	const treatSubscriptionContract = getTreatSubscriptionContract(treat);

	const handleEditSubscription = useCallback(async () => {
		const txHash = await editSub(treatSubscriptionContract, account, amount);

		return txHash;
	}, [account, amount, treatSubscriptionContract]);

	return {onEditSubscription: handleEditSubscription};
};

export default useEditSubscription;
