import { createNFTs, getCreatorMinterHelperContract } from "../treat/utils";

import { useCallback } from "react";
import { useMoralis } from "react-moralis";
import useTreat from "./useTreat";

const useCreateNFTs = (maxSupplys: Array<number>) => {
  const { account } = useMoralis();
  const treat = useTreat();
  const creatorMinterHelperContract = getCreatorMinterHelperContract(treat);

  const handleCreateAndAddNFTs = useCallback(async () => {
    const txHash = await createNFTs(
      creatorMinterHelperContract,
      account,
      maxSupplys
    );

    return txHash;
  }, [account, maxSupplys, creatorMinterHelperContract]);

  return { onCreateNFTs: handleCreateAndAddNFTs };
};

export default useCreateNFTs;
