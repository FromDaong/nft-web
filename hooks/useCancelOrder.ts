import { useCallback } from "react";
import { useWallet } from "use-wallet";
import { getTreatMarketplaceContract, cancelOrder } from "../treat/utils";
import useTreat from "./useTreat";

const useCancelOrder = (nftId: number) => {
  const { account } = useWallet();
  const treat = useTreat();

  const treatMarketplaceContract = getTreatMarketplaceContract(treat);

  const handleCancelOrder = useCallback(async () => {
    console.log({listCancel: {nftId, account, treatMarketplaceContract}})
    const txHash = await cancelOrder(treatMarketplaceContract, nftId, account);
    console.log(txHash);

    return txHash;
  }, [account, nftId])

  return { onCancelOrder : handleCancelOrder };
};

export default useCancelOrder;
