import {
  getMasterMelonFarmerContract,
  harvestFarm,
} from "../packages/treat/utils";

import { useCallback } from "react";
import { useMoralis } from "react-moralis";
import useTreat from "./useTreat";

const useHarvestFarm = (farmPid: number) => {
  const { account } = useMoralis();
  const treat = useTreat();
  const masterMelonFarmerContract = getMasterMelonFarmerContract(treat);

  const handleHarvest = useCallback(async () => {
    await harvestFarm(masterMelonFarmerContract, farmPid, account);
  }, [account, farmPid, masterMelonFarmerContract]);

  return { onReward: handleHarvest };
};

export default useHarvestFarm;
