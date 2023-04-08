import {useAccount} from "wagmi";
import {
	getMasterMelonFarmerContract,
	getV1MasterMelonFarmerContract,
	unstakeFarm,
} from "@packages/chain/utils";

import {useCallback} from "react";

const useUnstakeFarms = (
	pid: number,
	v1: boolean,
	masterMelonFarmerContract,
	v1MasterMelonFarmerContract
) => {
	const {address: account} = useAccount();

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
