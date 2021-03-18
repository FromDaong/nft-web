import BigNumber from 'bignumber.js'
import { getTreatMartContract, getTreatNftCost } from "../treat/utils";

import { Contract } from "web3-eth-contract";
import { useCallback, useEffect, useState } from "react";
import useBlock from './useBlock'
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";
import bsc from "@binance-chain/bsc-use-wallet";

const useGetTreatNFTCost = (id: number, useTreatMart: boolean = false) => {
  const [theNftCost, setTheNftCost] = useState(new BigNumber(0))
  const { account } = useWallet();
  const treat = useTreat();
  const treatMartContract = useTreatMart
    ? getTreatMartContract(treat)
    : getTreatMartContract(treat);
  const block = useBlock();

  const fetchNftCost = useCallback(async () => {
    const theNftCost = await getTreatNftCost(treatMartContract, id)
    setTheNftCost(new BigNumber(theNftCost))
  }, [id, treat])

  useEffect(() => {
    if (treat) {
      fetchNftCost()
    }
  }, [id])

  return theNftCost;
}


export default useGetTreatNFTCost;
