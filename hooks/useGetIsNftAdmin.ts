import { isAdminForMinter, getTreatNFTMinterContract } from "../treat/utils";
import { useCallback } from "react";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";

const useGetIsNftAdmin = () => {
  const { account } = useMoralis();
  const treat = useTreat();
  const treatNftMinterContract = getTreatNFTMinterContract(treat);

  const handleGetIsNftAdmin = useCallback(async () => {
    const txHash = await isAdminForMinter(treatNftMinterContract, account);

    return txHash;
  }, [account, treatNftMinterContract]);

  return { onGetIsNftAdmin: handleGetIsNftAdmin };
};

export default useGetIsNftAdmin;
