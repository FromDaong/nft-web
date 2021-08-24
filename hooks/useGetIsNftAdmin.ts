import { isAdminForMinter, getTreatNFTMinterContract } from "../treat/utils";
import { useCallback } from "react";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";

const useGetIsNftAdmin = () => {
  const { account } = useWallet();
  const treat = useTreat();
  const treatNftMinterContract = getTreatNFTMinterContract(treat);

  const handleGetIsNftAdmin = useCallback(async () => {
    const txHash = await isAdminForMinter(
      treatNftMinterContract,
      account
    );
    console.log(txHash);
    return txHash;
  }, [account, treatNftMinterContract]);

  return { onGetIsNftAdmin: handleGetIsNftAdmin };
};

export default useGetIsNftAdmin;
