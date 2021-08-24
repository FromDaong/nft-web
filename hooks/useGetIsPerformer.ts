import { isPerformerForMinter, getTreatNFTMinterContract } from "../treat/utils";
import { useCallback } from "react";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";

const useGetIsPerformer = (modelAddress: string) => {
  const { account } = useWallet();
  const treat = useTreat();
  const treatNftMinterContract = getTreatNFTMinterContract(treat);

  const handleGetIsPerformerForMinter = useCallback(async () => {
    const txHash = await isPerformerForMinter(
      treatNftMinterContract,
      modelAddress
    );
    console.log(txHash);
    return txHash;
  }, [modelAddress, treatNftMinterContract]);

  return { onGetIsPerformerForMinter: handleGetIsPerformerForMinter };
};

export default useGetIsPerformer;
