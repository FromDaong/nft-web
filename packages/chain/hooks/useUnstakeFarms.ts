import {useAccount} from "wagmi";
import {
	getMasterMelonFarmerContract,
	getV1MasterMelonFarmerContract,
	unstakeFarm,
} from "@packages/chain/utils";

import {useCallback} from "react";
import useTreat from "./useTreat";

const useUnstakeFarms = (pid: number, v1: boolean) => {
	const treat = useTreat();
	const {address: account} = useAccount();
	const masterMelonFarmerContract = getMasterMelonFarmerContract(treat);
	const v1MasterMelonFarmerContract = getV1MasterMelonFarmerContract(treat);

	const handleUnstake = useCallback(
		async (amount: string) => {
			await unstakeFarm(
				v1 ? v1MasterMelonFarmerContract : masterMelonFarmerContract,
				pid,
				amount,
				account
			);
		},
		[masterMelonFarmerContract, pid]
	);

	return {onUnstake: handleUnstake};
};

export default useUnstakeFarms;
