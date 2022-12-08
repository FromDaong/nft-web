import {
	getTreatSubscriptionContract,
	isSubscribed,
} from "@packages/chain/utils";
import {useCallback, useEffect, useState} from "react";

import {useAccount} from "wagmi";
import useTreat from "./useTreat";

const useGetIsSubscribed = (creatorAddress: string) => {
	const {address: account} = useAccount();
	const treat = useTreat();
	const treatSubscriptionContract = getTreatSubscriptionContract(treat);
	const [isSubscribedState, setIsSubscribed] = useState(false);

	const handleGetIsSubscribed = useCallback(async () => {
		const s = await isSubscribed(
			treatSubscriptionContract,
			account,
			creatorAddress
		);

		setIsSubscribed(s);
	}, [account, treatSubscriptionContract]);

	useEffect(() => {
		if (treat) {
			handleGetIsSubscribed();
		}
	}, [creatorAddress, treat]);
	return isSubscribedState;
};

export default useGetIsSubscribed;
