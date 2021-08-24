import {
  removePerformerFromMinter,
  getTreatNFTMinterContract,
} from "../treat/utils";
import { useCallback } from "react";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";

const useRemovePerformerFromMinter = (modelAddress: string) => {
  const { account } = useWallet();
  const treat = useTreat();
  const treatNftMinterContract = getTreatNFTMinterContract(treat);

  const handleRemovePerformerFromMinter = useCallback(async () => {
    const txHash = await removePerformerFromMinter(
      treatNftMinterContract,
      account,
      modelAddress
    );
    console.log(txHash);
    return txHash;
  }, [account, modelAddress, treatNftMinterContract]);

  return { onRemovePerformerFromMinter: handleRemovePerformerFromMinter };
};

export default useRemovePerformerFromMinter;
