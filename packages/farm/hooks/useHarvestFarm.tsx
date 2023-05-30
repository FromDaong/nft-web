import {harvestFarm} from "@packages/chain/utils";
import {useCallback} from "react";
import {useAccount} from "wagmi";

export const useHarvestFarm = (farmPID: number, masterMelonFarmerContract) => {
	const {address} = useAccount();

	const handleHarvest = useCallback(async () => {
		await harvestFarm(masterMelonFarmerContract, farmPID, address);
	}, [address, farmPID, masterMelonFarmerContract]);

	return {
		handleHarvest,
	};
};
