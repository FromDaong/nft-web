import { getTreatMartContract, redeemSet } from "../treat/utils";
import { useCallback } from "react";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";

const useRedeemSet = (id: number, treatCost: number) => {
  const { account } = useMoralis();
  const treat = useTreat();
  const treatMartContract = getTreatMartContract(treat);

  const handleRedeemSet = useCallback(async () => {
    const txHash = await redeemSet(treatMartContract, account, id, treatCost);
    return txHash;
  }, [account, id, treatCost, treatMartContract]);

  return { onRedeemSet: handleRedeemSet };
};

export default useRedeemSet;
