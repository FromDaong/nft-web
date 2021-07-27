import { useCallback } from "react";
import { useWallet } from "use-wallet";
import { getTreatMarketplaceContract, listOrder } from "../treat/utils";
import useTreat from "./useTreat";

const useListOrder = () => {
  const { account } = useWallet();
  const treat = useTreat();

  const treatMarketplaceContract = getTreatMarketplaceContract(treat);

  const handleListOrder = useCallback(
    async (
      nftId: number,
      quantity: number,
      price: number,
      expiresDate: number
    ) => {
      console.log({ nftId, quantity, price });
      const txHash = await listOrder(
        treatMarketplaceContract,
        account,
        nftId,
        quantity,
        price,
        expiresDate
      );
      console.log(txHash);

      const mint = {
        transactionHash: txHash.transactionHash,
        nftId: nftId,
        seller: account,
        price: price,
        expiresDate,
        listedAt: new Date(),
      };
      localStorage.setItem("resale", JSON.stringify(mint));

      return txHash;
    },
    [account]
  );

  return { onListOrder: handleListOrder };
};

export default useListOrder;
