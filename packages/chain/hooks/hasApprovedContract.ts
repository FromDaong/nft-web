import {
	getMasterMelonFarmerContract,
	getTreat2Contract,
	getTreatPancakeLPContract,
	hasApprovedTreatPancakeLPStaking,
	hasApprovedTreatStaking,
} from "@packages/chain/utils";
import {useCallback, useEffect, useState} from "react";

import {useAccount} from "wagmi";
import useTreat from "./useTreat";

const hasWalletApprovedContract = (pid) => {
	const {address: account} = useAccount();
	const treat = useTreat();
	const treatContract = getTreat2Contract(treat);
	const treatLpContract = getTreatPancakeLPContract(treat);
	const masterMelonFarmerContract = getMasterMelonFarmerContract(treat);

	const [hasApprovedState, setHasApprovedState] = useState(false);
	// const treatV1ForV2Contract = getTreatV1ForV2Contract(treat);

	const useHasApprovedContract = useCallback(async () => {
		let hasApproved;
		if (pid === 0)
			hasApproved = await hasApprovedTreatStaking(
				treatContract,
				masterMelonFarmerContract,
				account
			);
		else
			hasApproved = await hasApprovedTreatPancakeLPStaking(
				treatLpContract,
				masterMelonFarmerContract,
				account
			);

		setHasApprovedState(hasApproved);
	}, [account, treatContract]);

	useEffect(() => {
		if (treat) {
			useHasApprovedContract();
		}
	}, [account, treatContract]);

	return hasApprovedState;
};

export default hasWalletApprovedContract;
