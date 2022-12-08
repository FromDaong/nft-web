import {getMasterMelonFarmerContract, stakeFarm} from "@packages/chain/utils";

import {useCallback} from "react";
import {useAccount} from "wagmi";
import useTreat from "./useTreat";

const useStakeFarms = (pid: number) => {
	const {address: account} = useAccount();
	const treat = useTreat();
	const masterMelonFarmerContract = getMasterMelonFarmerContract(treat);

	const handleStake = useCallback(
		async (amount: string) => {
			const txHash = await stakeFarm(
				masterMelonFarmerContract,
				pid,
				amount,
				account
			);
			console.info(txHash);
		},
		[account, masterMelonFarmerContract, pid]
	);

	return {onStake: handleStake};
};

export default useStakeFarms;
