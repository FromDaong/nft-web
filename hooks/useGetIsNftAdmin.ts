import { getTreatNFTMinterContract, isAdminForMinter } from "../treat/utils";

import { useCallback } from "react";
import { useMoralis } from "react-moralis";
import useTreat from "./useTreat";

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
