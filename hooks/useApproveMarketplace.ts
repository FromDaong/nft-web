import { useCallback } from "react";
import { useWallet } from "use-wallet";
import { provider } from "web3-core";
import { Contract } from "web3-eth-contract";
import {
  approveMarketplace,
  getTreatMarketplaceAddress,
  getTreatNFTMinterContract,
} from "../treat/utils";
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
