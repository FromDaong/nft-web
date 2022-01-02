import { addPerformerToMinter, getMinterPermissionHelperContract } from "../treat/utils";
import { useCallback } from "react";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";

const useAddPerformerToMinter = (modelAddress: string) => {
  const { account } = useWallet();
  const treat = useTreat();
  const minterPermissionHelperContract = getMinterPermissionHelperContract(treat);

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
