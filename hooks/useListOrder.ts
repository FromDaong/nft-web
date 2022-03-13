import { getTreatMarketplaceContract, listOrder } from "../treat/utils";

import { useCallback } from "react";
import { useMoralis } from "react-moralis";
import useTreat from "./useTreat";

const useListOrder = () => {
  const { account } = useMoralis();
  const treat = useTreat();

  const treatMarketplaceContract = getTreatMarketplaceContract(treat);

  const handleListOrder = useCallback(
    async (
      nftId: number,
      quantity: number,
      price: number,
      expiresDate: number
    ) => {
      const txHash = await listOrder(
        treatMarketplaceContract,
        account,
        nftId,
        quantity,
        price,
        expiresDate
      );
      return txHash;
    },
    [account]
  );

  return { onListOrder: handleListOrder };
};

export default useListOrder;
