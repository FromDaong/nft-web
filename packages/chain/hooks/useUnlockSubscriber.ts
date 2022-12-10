import {getTreatSubscriptionContract, unlockSub} from "@packages/chain/utils";

import {useCallback} from "react";
import {useAccount} from "wagmi";
import useTreat from "./useTreat";

const useUnlockSubscriber = (subAddress: string) => {
	const {address: account} = useAccount();
	const treat = useTreat();
	const treatSubscriptionContract = getTreatSubscriptionContract(treat);

	const handleUnlockSub = useCallback(async () => {
		const txHash = await unlockSub(
			treatSubscriptionContract,
			account,
			subAddress
		);
		return txHash;
	}, [account, subAddress, treatSubscriptionContract]);

	return {onUnlockSub: handleUnlockSub};
};

export default useUnlockSubscriber;
