import { getTreatMartContract, redeemSet } from "../packages/treat/utils";

import { useCallback } from "react";
import { useMoralis } from "react-moralis";
import useTreat from "./useTreat";

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
