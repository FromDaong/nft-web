import {
	getTreatContract,
	getTreatV1ForV2Contract,
	hasApprovedTreatOneForTwoContract,
} from "@packages/chain/utils";
import {useCallback, useEffect, useState} from "react";

import {useAccount} from "wagmi";
import useTreat from "./useTreat";

const hasApprovedV1ForV2 = () => {
	const {address: account} = useAccount();
	const treat = useTreat();
	const treatContract = getTreatContract(treat);
	const [hasApprovedState, setHasApprovedState] = useState(false);
	const treatV1ForV2Contract = getTreatV1ForV2Contract(treat);

	const handleGetFreeTreat = useCallback(async () => {
		const hasApproved = await hasApprovedTreatOneForTwoContract(
			treatContract,
			treatV1ForV2Contract,
			account
		);

		setHasApprovedState(hasApproved);
	}, [account, treatContract]);

	useEffect(() => {
		if (treat) {
			handleGetFreeTreat();
		}
	}, [account, treatContract]);

	return hasApprovedState;
};

export default hasApprovedV1ForV2;