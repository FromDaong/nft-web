import { useCallback } from "react";
import { useWallet } from "use-wallet";
import {
  approveTreatOneForTwo,
  getTreatContract,
  getTreatV1ForV2Contract,
} from "../treat/utils";
import useTreat from "./useTreat";

const approveV1ForV2 = () => {
  const { account } = useWallet();
  const treat = useTreat();
  const treatContract = getTreatContract(treat);
  const treatV1ForV2Contract = getTreatV1ForV2Contract(treat);

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approveTreatOneForTwo(
        treatContract,
        treatV1ForV2Contract,
        account
      );
      
      return tx;
    } catch (e) {
      console.error("errhandleApprove1for2 ", e);
      return false;
    }
  }, [account, treatContract]);

  return { onApprove: handleApprove };
};

export default approveV1ForV2;
