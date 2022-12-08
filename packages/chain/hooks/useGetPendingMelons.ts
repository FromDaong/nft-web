import {
	getMasterMelonFarmerContract,
	getPendingMelons,
} from "@packages/chain/utils";
import {useCallback, useEffect, useState} from "react";

import {useAccount} from "wagmi";
import useTreat from "./useTreat";

const useGetPendingMelons = (pid: number) => {
	const {address: account} = useAccount();
	const treat = useTreat();
	const [pendingMelons, setPendingMelons] = useState(null);
	const masterMelonFarmerContract = getMasterMelonFarmerContract(treat);

	const fetchPendingMelons = useCallback(async () => {
		const amount = await getPendingMelons(
			masterMelonFarmerContract,
			pid,
			account
		);

		setPendingMelons(amount);
	}, [account, masterMelonFarmerContract, pid]);

	useEffect(() => {
		if (treat) {
			fetchPendingMelons();
		}
	}, [pid, treat]);

	return pendingMelons;
};

export default useGetPendingMelons;
