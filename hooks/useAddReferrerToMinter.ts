import { addReferrerToMinter, getTreatNFTMinterContract } from "../treat/utils";
import { useCallback } from "react";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";

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
