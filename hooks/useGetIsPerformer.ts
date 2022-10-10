import {
  getTreatNFTMinterContract,
  isPerformerForMinter,
} from "../packages/treat/utils";

import { useCallback } from "react";
import useTreat from "./useTreat";

const useGetIsPerformer = (modelAddress: string) => {
  const treat = useTreat();
  const treatNftMinterContract = getTreatNFTMinterContract(treat);

  const handleGetIsPerformerForMinter = useCallback(async () => {
    const txHash = await isPerformerForMinter(
      treatNftMinterContract,
      modelAddress
    );

    return txHash;
  }, [modelAddress, treatNftMinterContract]);

  return { onGetIsPerformerForMinter: handleGetIsPerformerForMinter };
};

export default useGetIsPerformer;
