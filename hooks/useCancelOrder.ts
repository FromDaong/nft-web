import { useCallback } from "react";
import { useWallet } from "use-wallet";
import { getTreatMarketplaceContract, cancelOrder } from "../treat/utils";
import useTreat from "./useTreat";

const useCancelOrder = (nftId: number) => {
  const { account } = useWallet();
  const treat = useTreat();

  const treatMarketplaceContract = getTreatMarketplaceContract(treat);

  const handleCancelOrder = useCallback(async () => {
    
    const txHash = await cancelOrder(treatMarketplaceContract, nftId, account);

    return txHash; 
  }, [account, nftId])

  return { onCancelOrder : handleCancelOrder };
};

export default useCancelOrder;
