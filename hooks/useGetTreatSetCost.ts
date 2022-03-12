import BigNumber from "bignumber.js";
import { getTreatMartContract, getSetPrice } from "../treat/utils";

import { Contract } from "web3-eth-contract";
import { useCallback, useEffect, useState } from "react";
import useBlock from "./useBlock";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";
import bsc from "@binance-chain/bsc-use-wallet";

const useGetTreatSetCost = (id: number) => {
  const [nftSetCost, setNftSetCost] = useState(new BigNumber(0));
  const { account } = useMoralis();
  const treat = useTreat();
  const treatMartContract = getTreatMartContract(treat);

  const fetchNftCost = useCallback(async () => {
    const nftSetCost = await getSetPrice(treatMartContract, id);
    setNftSetCost(new BigNumber(nftSetCost));
  }, [id, treat]);

  useEffect(() => {
    if (treat) {
      fetchNftCost();
    }
  }, [id, treat]);

  return nftSetCost;
};

export default useGetTreatSetCost;
