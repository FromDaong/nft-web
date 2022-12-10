import {getTreatSubscriptionContract, lockSub} from "@packages/chain/utils";

import {useCallback} from "react";
import {useAccount} from "wagmi";
import useTreat from "./useTreat";

const useLockSubscriber = (subAddress: string) => {
	const {address: account} = useAccount();
	const treat = useTreat();
	const treatSubscriptionContract = getTreatSubscriptionContract(treat);

	const handleLockSub = useCallback(async () => {
		const txHash = await lockSub(
			treatSubscriptionContract,
			account,
			subAddress
		);
		return txHash;
	}, [account, subAddress, treatSubscriptionContract]);

	return {onLockSub: handleLockSub};
};

export default useLockSubscriber;
