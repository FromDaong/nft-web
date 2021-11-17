import { useCallback } from "react";
import { useWallet } from "use-wallet";
import {
  approveContract,
  getTreatContract,
  getTreatV1ForV2Contract,
} from "../treat/utils";
import useTreat from "./useTreat";

const useApproveContract = (contractAddress) => {
  const { account } = useWallet();
  const treat = useTreat();
  const treatContract = getTreatContract(treat);

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approveContract(treatContract, contractAddress, account);
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
