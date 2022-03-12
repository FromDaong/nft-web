import BigNumber from "bignumber.js";
import {
  getSubscriberMartContract,
  getSubscriberSetPrice,
} from "../treat/utils";

import { Contract } from "web3-eth-contract";
import { useCallback, useEffect, useState } from "react";
import useBlock from "./useBlock";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";
import bsc from "@binance-chain/bsc-use-wallet";

const useGetSubscriberSetCost = (id: number) => {
  const [nftSetCost, setNftSetCost] = useState(new BigNumber(0));
  const { account } = useMoralis();
  const treat = useTreat();
  const subscriberMartContract = getSubscriberMartContract(treat);

  const fetchSetCost = useCallback(async () => {
    const nftSetCost = await getSubscriberSetPrice(subscriberMartContract, id);
    setNftSetCost(new BigNumber(nftSetCost));
  }, [id, treat]);

  useEffect(() => {
    if (treat) {
      fetchSetCost();
    }
  }, [id, treat]);

  return nftSetCost;
};

export default useGetSubscriberSetCost;
