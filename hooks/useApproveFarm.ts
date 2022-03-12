import { useCallback } from "react";
import { Contract } from "ethers";
import useTreat from "./useTreat";
import { useMoralis } from "react-moralis";
import {
  approveTreatStaking,
  approveTreatPancakeLPStaking,
  getMasterMelonFarmerContract,
} from "../treat/utils";

const useApproveFarm = (lpContract: Contract, pid: number) => {
  const { account } = useMoralis();
  const treat = useTreat();
  const masterMelonFarmerContract = getMasterMelonFarmerContract(treat);

  const handleApproveFarm = useCallback(async () => {
    try {
      if (pid == 0) {
        const tx = await approveTreatStaking(
          masterMelonFarmerContract,
          account
        );

        return tx;
      } else {
        const tx = await approveTreatPancakeLPStaking(
          masterMelonFarmerContract,
          account
        );

        return tx;
      }
    } catch (e) {
      console.error("errhandleApprove2 ", e);
      return false;
    }
  }, [account, masterMelonFarmerContract]);

  return { onApproveFarm: handleApproveFarm };
};

export default useApproveFarm;
