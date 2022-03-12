import { cancelOrder, getTreatMarketplaceContract } from "../treat/utils";

import { useCallback } from "react";
import { useMoralis } from "react-moralis";
import useTreat from "./useTreat";

const useCancelOrder = (nftId: number) => {
  const { account } = useMoralis();
  const treat = useTreat();

  const treatMarketplaceContract = getTreatMarketplaceContract(treat);

  const handleCancelOrder = useCallback(async () => {
    const txHash = await cancelOrder(treatMarketplaceContract, nftId, account);

    return txHash;
  }, [account, nftId]);

  return { onCancelOrder: handleCancelOrder };
};

export default useCancelOrder;
