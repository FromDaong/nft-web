import { addPerformerToMinter, getTreatNFTMinterContract } from "../treat/utils";
import { useCallback } from "react";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";

const useAddPerformerToMinter = (modelAddress: string) => {
  const { account } = useWallet();
  const treat = useTreat();
  const treatNftMinterContract = getTreatNFTMinterContract(treat);

  const handleAddPerformerToMinter = useCallback(async () => {
    const txHash = await addPerformerToMinter(
      treatNftMinterContract,
      account,
      modelAddress
    );
    console.log(txHash);
    return txHash;
  }, [account, modelAddress, treatNftMinterContract]);

  return { onAddPerformerToMinter: handleAddPerformerToMinter };
};

export default useAddPerformerToMinter;
