import {
  addPerformerToMinter,
  getMinterPermissionHelperContract,
} from "../packages/treat/utils";

import { useCallback } from "react";
import { useMoralis } from "react-moralis";
import useTreat from "./useTreat";

const useAddPerformerToMinter = (modelAddress: string) => {
  const { account } = useMoralis();
  const treat = useTreat();
  const minterPermissionHelperContract =
    getMinterPermissionHelperContract(treat);

  const handleAddPerformerToMinter = useCallback(async () => {
    const txHash = await addPerformerToMinter(
      minterPermissionHelperContract,
      account,
      modelAddress
    );
    return txHash;
  }, [account, modelAddress, minterPermissionHelperContract]);

  return { onAddPerformerToMinter: handleAddPerformerToMinter };
};

export default useAddPerformerToMinter;
