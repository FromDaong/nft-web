import {
  addCreatorNft,
  getCreatorMartContract,
} from "../../../packages/treat/utils";

import { useCallback } from "react";
import { useMoralis } from "react-moralis";
import useTreat from "./useTreat";

const useAddCreatorNFTs = (ids: Array<number>, amounts: Array<number>) => {
  const { account } = useMoralis();
  const treat = useTreat();
  const creatorMartContract = getCreatorMartContract(treat);

  const handleAddCreatorNFTs = useCallback(async () => {
    const txHash = await addCreatorNft(
      creatorMartContract,
      account,
      ids,
      amounts
    );

    return txHash;
  }, [account, ids, amounts, creatorMartContract]);

  return { onAddCreatorNFTs: handleAddCreatorNFTs };
};

export default useAddCreatorNFTs;
