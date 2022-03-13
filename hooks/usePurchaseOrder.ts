import { getTreatMarketplaceContract, purchaseOrder } from "../treat/utils";

import { useCallback } from "react";
import { useMoralis } from "react-moralis";
import useTreat from "./useTreat";

const usePurchaseOrder = (
  nftId: number,
  quantity: number,
  price: number,
  seller: string
) => {
  const { account } = useMoralis();
  const treat = useTreat();

  const treatMarketplaceContract = getTreatMarketplaceContract(treat);

  const handlePurchaseOrder = useCallback(async () => {
    const txHash = await purchaseOrder(
      treatMarketplaceContract,
      nftId,
      1,
      seller,
      account,
      Number(price)
    );

    return txHash;
  }, [account, nftId, quantity, price, seller]);

  return { onPurchaseOrder: handlePurchaseOrder };
};

export default usePurchaseOrder;
