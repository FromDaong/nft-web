import {
  getSubscriberMartContract,
  createAndAddSubscriberNFTs,
} from "../treat/utils";
import { useCallback } from "react";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";

const useCreateAndAddSubscriberNFTs = (
  maxSupplys: Array<number>,
  amounts: Array<number>,
  hexData: string
) => {
  const { account } = useWallet();
  const treat = useTreat();
  const subscriberMartContract = getSubscriberMartContract(treat);

  const handleCreateAndAddSubscriberNFTs = useCallback(async () => {
    console.log({ maxSupplys, amounts });
    const res = await createAndAddSubscriberNFTs(
      subscriberMartContract,
      account,
      maxSupplys,
      amounts,
      amounts.map(() => false),
      hexData
    );

    return res;
  }, [account, maxSupplys, amounts, hexData, subscriberMartContract]);

  return { onCreateAndAddSubscriberNFTs: handleCreateAndAddSubscriberNFTs };
};

export default useCreateAndAddSubscriberNFTs;
