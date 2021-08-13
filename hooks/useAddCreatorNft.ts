import { getCreatorMartContract, addCreatorNFTs } from "../treat/utils";
import { useCallback } from "react";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";

const useAddCreatorNFTs = (ids: Array<number>, amounts: Array<number>, hexData: string) => {
  const { account } = useWallet();
  const treat = useTreat();
  const creatorMartContract = getCreatorMartContract(treat);

  const handleAddCreatorNFTs = useCallback(async () => {
    const txHash = await addCreatorNFTs(
      creatorMartContract,
      account,
      maxSupplys,
      amounts,
      isGiveAwayFlags,
      hexData
    );
    console.log(txHash);
    return txHash;
  }, [account, maxSupplys, amounts, isGiveAwayFlags, hexData, creatorMartContract]);

  return { onAddCreatorNFTs: handleAddCreatorNFTs };
};

export default useAddCreatorNFTs;
