import { useCallback } from "react";
import { useWallet } from "use-wallet";
import { getTreatMarketplaceContract, listOrder } from "../treat/utils";
import useTreat from "./useTreat";

const useListOrder = () => {
  const { account } = useWallet();
  const treat = useTreat();

  const treatMarketplaceContract = getTreatMarketplaceContract(treat);

  const handleListOrder = useCallback(async (nftId: number, quantity: number, price: number, expiresDate: number) => {
    const txHash = await listOrder(treatMarketplaceContract, account, nftId, quantity, price, expiresDate);
    console.log(txHash);

    return txHash;
  }, [account])

  return { onListOrder : handleListOrder };
};

export default useListOrder;