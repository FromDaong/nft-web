import {getMasterMelonFarmerContract, harvestFarm} from "@packages/chain/utils";

import {useCallback} from "react";
import {useAccount} from "wagmi";
import useTreat from "./useTreat";

const useHarvestFarm = (farmPid: number) => {
	const {address: account} = useAccount();
	const treat = useTreat();
	const masterMelonFarmerContract = getMasterMelonFarmerContract(treat);

	const handleHarvest = useCallback(async () => {
		await harvestFarm(masterMelonFarmerContract, farmPid, account);
	}, [account, farmPid, masterMelonFarmerContract]);

	return {onReward: handleHarvest};
};

export default useHarvestFarm;
