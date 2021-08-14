import { getCreatorMinterHelperContract, createNFTs } from "../treat/utils";
import { useCallback } from "react";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";

const useCreateNFTs = (maxSupplys: Array<number>) => {
  const { account } = useWallet();
  const treat = useTreat();
  const creatorMinterHelperContract = getCreatorMinterHelperContract(treat);

  const handleCreateAndAddNFTs = useCallback(async () => {
    const txHash = await createNFTs(
      creatorMinterHelperContract,
      account,
      maxSupplys
    );
    console.log(txHash);
    return txHash;
  }, [account, maxSupplys, creatorMinterHelperContract]);

  return { onCreateNFTs: handleCreateNFTs };
};

export default useCreateNFTs;
