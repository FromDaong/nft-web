import { getTreatMartContract, mintFreeTreat } from "../treat/utils";

import { useCallback } from "react";
import { useMoralis } from "react-moralis";
import useTreat from "./useTreat";

const useGetFreeTreat = (
  id: number,
  treatCost: number,
  useFreeTreats = false
) => {
  const { account } = useMoralis();
  const treat = useTreat();
  const treatMartContract = useFreeTreats
    ? getTreatMartContract(treat)
    : getTreatMartContract(treat);

  const handleGetFreeTreat = useCallback(async () => {
    const txHash = await mintFreeTreat(treatMartContract, account, id);

    return txHash;
  }, [account, id, treatCost, treatMartContract]);

  return { onGetFreeTreat: handleGetFreeTreat };
};

export default useGetFreeTreat;
