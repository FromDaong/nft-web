import BigNumber from "bignumber.js";
import { getCreatorMartContract, getCreatorSetPrice } from "../treat/utils";

import { Contract } from "web3-eth-contract";
import { useCallback, useEffect, useState } from "react";
import useBlock from "./useBlock";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";
import bsc from "@binance-chain/bsc-use-wallet";

const useGetCreatorSetCost = (id: number) => {
  const [nftSetCost, setNftSetCost] = useState(new BigNumber(0));
  const { account } = useWallet();
  const treat = useTreat();
  const creatorMartContract = getCreatorMartContract(treat);

  const fetchNftCost = useCallback(async () => {
    const nftSetCost = await getCreatorSetPrice(creatorMartContract, id);
    setNftSetCost(new BigNumber(nftSetCost));
  }, [id, treat]);

  useEffect(() => {
    if (treat) {
      fetchNftCost();
    }
  }, [id, treat]);

  return nftSetCost;
};

export default useGetCreatorSetCost;
