import {
  getMasterMelonFarmerContract,
  stakeFarm,
} from "../packages/treat/utils";

import { useCallback } from "react";
import { useMoralis } from "react-moralis";
import useTreat from "./useTreat";

const useStakeFarms = (pid: number) => {
  const { account } = useMoralis();
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

  return { onStake: handleStake };
};

export default useStakeFarms;
