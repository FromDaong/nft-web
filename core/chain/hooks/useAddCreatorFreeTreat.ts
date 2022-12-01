import {
  addCreatorFreeTreat,
  getCreatorMartContract,
} from "../../../packages/treat/utils";

import { useCallback } from "react";
import { useMoralis } from "react-moralis";
import useTreat from "./useTreat";

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
