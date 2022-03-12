import {
  removePerformerFromMinter,
  getTreatNFTMinterContract,
} from "../treat/utils";
import { useCallback } from "react";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";

const useRemovePerformerFromMinter = (modelAddress: string) => {
  const { account } = useMoralis();
  const treat = useTreat();
  const treatNftMinterContract = getTreatNFTMinterContract(treat);

  const handleRemovePerformerFromMinter = useCallback(async () => {
    const txHash = await removePerformerFromMinter(
      treatNftMinterContract,
      account,
      modelAddress
    );
    return txHash;
  }, [account, modelAddress, treatNftMinterContract]);

  return { onRemovePerformerFromMinter: handleRemovePerformerFromMinter };
};

export default useRemovePerformerFromMinter;
