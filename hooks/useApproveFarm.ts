import { useCallback } from 'react'
import { ethers, Contract } from 'ethers'
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";
import { approveTreatStaking, approveTreatPancakeLPStaking, getMasterMelonFarmerContract } from "../treat/utils";

const useApproveFarm = (lpContract: Contract, pid: Number) => {
  const { account } = useWallet();
  const treat = useTreat();
  const masterMelonFarmerContract = getMasterMelonFarmerContract(treat)

  const handleApproveFarm = useCallback(async () => {
    try {
      if (pid == 0) {
        const tx = await approveTreatStaking(masterMelonFarmerContract, account);
        
        return tx;
      } else {
        const tx = await approveTreatPancakeLPStaking(masterMelonFarmerContract, account);
        
        return tx;
      }
    } catch (e) {
      console.error("errhandleApprove2 ", e);
      return false;
    }
  }, [account, masterMelonFarmerContract]);

  return { onApproveFarm: handleApproveFarm };
};

export default useApproveFarm
