import {
  approveTreatPancakeLPStaking,
  approveTreatStaking,
  getMasterMelonFarmerContract,
  getTreat2Contract,
  getTreatPancakeLPContract,
} from "../../../packages/treat/utils";

import { useCallback } from "react";
import { useMoralis } from "react-moralis";
import useTreat from "./useTreat";

const useApproveContract = (pid) => {
  const { account } = useMoralis();
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

      return tx;
    } catch (e) {
      console.error("errhandleApprove ", e);
      return false;
    }
  }, [account, treatContract]);

  return { onApprove: handleApprove };
};

export default useApproveContract;
