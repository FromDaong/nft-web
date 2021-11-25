import { useCallback } from "react";
import { useWallet } from "use-wallet";
import {
  approveTreatStaking,
  approveTreatPancakeLPStaking,
  getTreat2Contract,
  getTreatPancakeLPContract,
  getMasterMelonFarmerContract,
} from "../treat/utils";
import useTreat from "./useTreat";

const useApproveContract = (pid) => {
  const { account } = useWallet();
  const treat = useTreat();
  const treatContract = getTreat2Contract(treat);
  const treatLpContract = getTreatPancakeLPContract(treat);
  const masterMelonFarmerContract = getMasterMelonFarmerContract(treat);

  const handleApprove = useCallback(async () => {
    try {
      let tx;
      if (pid === 0)
        tx = await approveTreatStaking(
          treatContract,
          masterMelonFarmerContract,
          account
        );
      else
        tx = await approveTreatPancakeLPStaking(
          treatLpContract,
          masterMelonFarmerContract,
          account
        );

      console.log("tx ", tx);
      return tx;
    } catch (e) {
      console.log("errhandleApprove ", e);
      return false;
    }
  }, [account, treatContract]);

  return { onApprove: handleApprove };
};

export default useApproveContract;