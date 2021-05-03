import { getTreatMartBundleContract, redeemSet } from "../treat/utils";
import { useCallback } from "react";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";

const useRedeemSet = (id: number, treatCost: number) => {
  const { account } = useWallet();
  const treat = useTreat();
  const treatMartBundleContract = getTreatMartBundleContract(treat)

  const handleRedeemSet = useCallback(async () => {
    const txHash = await redeemSet(treatMartBundleContract, account, id, treatCost);
    console.log(txHash);
    return txHash;
  }, [account, id, treatCost, treatMartBundleContract]);

  return { onRedeemSet: handleRedeemSet };
};

export default useRedeemSet;
