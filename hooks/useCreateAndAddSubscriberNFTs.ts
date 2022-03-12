import {
  createAndAddSubscriberNFTs,
  getSubscriberMartContract,
} from "../treat/utils";

import { useCallback } from "react";
import { useMoralis } from "react-moralis";
import useTreat from "./useTreat";

const useCreateAndAddSubscriberNFTs = (
  maxSupplys: Array<number>,
  amounts: Array<number>,
  hexData: string
) => {
  const { account } = useMoralis();
  const treat = useTreat();
  const subscriberMartContract = getSubscriberMartContract(treat);

  const handleCreateAndAddSubscriberNFTs = useCallback(async () => {
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
