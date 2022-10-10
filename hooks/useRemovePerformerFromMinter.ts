import {
  getTreatNFTMinterContract,
  removePerformerFromMinter,
} from "../packages/treat/utils";

import { useCallback } from "react";
import { useMoralis } from "react-moralis";
import useTreat from "./useTreat";

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
