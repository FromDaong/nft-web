import { useCallback } from "react";
import { useWallet } from "use-wallet";
import { provider } from "web3-core";
import { Contract } from "web3-eth-contract";
import { approveTreatOneForTwo, getTreatContract } from "../treat/utils";
import useTreat from "./useTreat";

const approveV1ForV2 = () => {
  const { account } = useWallet();
  const treat = useTreat();
  const treatContract = getTreatContract(treat);

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approveTreatOneForTwo(treatContract, account);
      console.log("tx ", tx);
      return tx;
    } catch (e) {
      console.log("errhandleApprove1for2 ", e);
      return false;
    }
  }, [account, treatContract]);

  return { onApprove: handleApprove };
};

export default approveV1ForV2;