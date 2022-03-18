import {
  approveMarketplace,
  getTreatMarketplaceAddress,
  getTreatNFTMinterContract,
} from "../treat/utils";

import { useCallback } from "react";
import { useMoralis } from "react-moralis";
import useTreat from "./useTreat";

const useApproveMarketplace = () => {
  const { account } = useMoralis();
  const treat = useTreat();
  const treatNftMinterContract = getTreatNFTMinterContract(treat);
  const treatMarketplaceAddress = getTreatMarketplaceAddress(treat);

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approveMarketplace(
        treatNftMinterContract,
        treatMarketplaceAddress,
        account
      );

      return tx;
    } catch (e) {
      console.error("errhandleApprove2 ", e);
      return false;
    }
  }, [account, treatNftMinterContract, treatMarketplaceAddress]);

  return { onApprove: handleApprove };
};

export default useApproveMarketplace;
