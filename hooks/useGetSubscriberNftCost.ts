import BigNumber from "bignumber.js";
import {
  getSubscriberMartContract,
  getSubscriberNftCost,
} from "../treat/utils";

import { Contract } from "web3-eth-contract";
import { useCallback, useEffect, useState } from "react";
import useBlock from "./useBlock";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";
import bsc from "@binance-chain/bsc-use-wallet";

const useGetSubscriberNftCost = (id: number, useSubscriberMart = false) => {
  const [theNftCost, setTheNftCost] = useState(new BigNumber(0));
  const { account } = useMoralis();
  const treat = useTreat();
  const subscriberMartContract = useSubscriberMart
    ? getSubscriberMartContract(treat)
    : getSubscriberMartContract(treat);
  const block = useBlock();

  const fetchNftCost = useCallback(async () => {
    const theNftCost = await getSubscriberNftCost(subscriberMartContract, id);
    setTheNftCost(new BigNumber(theNftCost));
  }, [id, treat]);

  useEffect(() => {
    if (treat) {
      fetchNftCost();
    }
  }, [id]);

  return theNftCost;
};

export default useGetSubscriberNftCost;
