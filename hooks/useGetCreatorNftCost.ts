import BigNumber from "bignumber.js";
import { getCreatorMartContract, getCreatorNftCost } from "../treat/utils";

import { Contract } from "web3-eth-contract";
import { useCallback, useEffect, useState } from "react";
import useBlock from "./useBlock";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";
import bsc from "@binance-chain/bsc-use-wallet";

const useGetCreatorNftCost = (id: number, useCreatorMart = false) => {
  const [theNftCost, setTheNftCost] = useState(new BigNumber(0));
  const { account } = useMoralis();
  const treat = useTreat();
  const creatorMartContract = useCreatorMart
    ? getCreatorMartContract(treat)
    : getCreatorMartContract(treat);
  const block = useBlock();

  const fetchNftCost = useCallback(async () => {
    const theNftCost = await getCreatorNftCost(creatorMartContract, id);
    setTheNftCost(new BigNumber(theNftCost));
  }, [id, treat]);

  useEffect(() => {
    if (treat) {
      fetchNftCost();
    }
  }, [id]);

  return theNftCost;
};

export default useGetCreatorNftCost;
