import { getCreatorMartContract, createAndAddNFTs } from "../treat/utils";
import { useCallback } from "react";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";

const useCreateAndAddNFTs = (maxSupplys: Array<number>, amounts: Array<number>, isGiveAwayFlags: Array<number>, hexData: string) => {
  const { account } = useWallet();
  const treat = useTreat();
  const creatorMartContract = getCreatorMartContract(treat);

  const handleCreateAndAddNFTs = useCallback(async () => {
    const txHash = await createAndAddNFTs(
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

  return { onCreateAndAddNFTs: handleCreateAndAddNFTs };
};

export default useCreateAndAddNFTs;
