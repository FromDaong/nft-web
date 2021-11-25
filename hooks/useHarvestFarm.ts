import { useCallback } from "react";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";
import { getMasterMelonFarmerContract, harvestFarm } from "../treat/utils";

const useHarvestFarm = (farmPid: number) => {
  const { account } = useWallet();
  const treat = useTreat();
  const masterMelonFarmerContract = getMasterMelonFarmerContract(treat);

  const handleHarvest = useCallback(async () => {
    await harvestFarm(masterMelonFarmerContract, farmPid, account);
  }, [account, farmPid, masterMelonFarmerContract]);

  return { onReward: handleHarvest };
};

export default useHarvestFarm;
