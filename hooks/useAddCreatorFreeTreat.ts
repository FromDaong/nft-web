import { getCreatorMartContract, addCreatorFreeTreat } from "../treat/utils";
import { useCallback } from "react";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";

const useAddCreatorFreeTreat = (ids: Array<number>) => {
  const { account } = useMoralis();
  const treat = useTreat();
  const creatorMartContract = getCreatorMartContract(treat);

  const handleAddCreatorFreeTreat = useCallback(async () => {
    const txHash = await addCreatorFreeTreat(creatorMartContract, account, ids);

    return txHash;
  }, [account, ids, creatorMartContract]);

  return { onAddCreatorFreeTreat: handleAddCreatorFreeTreat };
};

export default useAddCreatorFreeTreat;
