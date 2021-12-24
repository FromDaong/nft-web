import { getCreatorMartContract, addCreatorNft } from "../treat/utils";
import { useCallback } from "react";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";

const useAddCreatorNFTs = (ids: Array<number>, amounts: Array<number>) => {
  const { account } = useWallet();
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
