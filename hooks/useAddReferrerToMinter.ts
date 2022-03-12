import { addReferrerToMinter, getTreatNFTMinterContract } from "../treat/utils";

import { useCallback } from "react";
import { useMoralis } from "react-moralis";
import useTreat from "./useTreat";

const useAddReferrerToMinter = (modelAddress: string, refAddress: string) => {
  const { account } = useMoralis();
  const treat = useTreat();
  const treatNftMinterContract = getTreatNFTMinterContract(treat);

  const handleAddReferrerToMinter = useCallback(async () => {
    const txHash = await addReferrerToMinter(
      treatNftMinterContract,
      account,
      modelAddress,
      refAddress
    );

    return txHash;
  }, [account, modelAddress, refAddress, treatNftMinterContract]);

  return { onAddReferrerToMinter: handleAddReferrerToMinter };
};

export default useAddReferrerToMinter;
