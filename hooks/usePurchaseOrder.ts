import BigNumber from "bignumber.js";
import { useCallback } from "react";
import { useWallet } from "use-wallet";
import {
  getTreatMarketplaceContract,
  listOrder,
  purchaseOrder,
} from "../treat/utils";
import useTreat from "./useTreat";

const usePurchaseOrder = (
  nftId: number,
  quantity: number,
  price: number,
  seller: string
) => {
  const { account } = useWallet();
  const treat = useTreat();

  const treatMarketplaceContract = getTreatMarketplaceContract(treat);

  const totalPrice = new BigNumber(quantity).multipliedBy(new BigNumber(price));

  const handlePurchaseOrder = useCallback(async () => {
    const txHash = await purchaseOrder(
      treatMarketplaceContract,
      nftId,
      quantity,
      seller,
      account,
      Number(price)
    );
    console.log(txHash);

    return txHash;
  }, [account, nftId, quantity, price, seller]);

  return { onPurchaseOrder: handlePurchaseOrder };
};

export default usePurchaseOrder;
