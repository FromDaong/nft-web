import BigNumber from 'bignumber.js'
import { getTreatMartContract, getSetPrice } from "../treat/utils";

import { useCallback, useEffect, useState } from "react";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";

const useGetTreatSetCost = (id: number) => {
  const [nftSetCost, setNftSetCost] = useState(new BigNumber(0))
  const treat = useTreat();
  const treatMartContract = getTreatMartContract(treat)

  const fetchNftCost = useCallback(async () => {
    const nftSetCost = await getSetPrice(treatMartContract, id)
    setNftSetCost(new BigNumber(nftSetCost))
  }, [id, treat])

  useEffect(() => {
    if (treat) {
      fetchNftCost()
    }
  }, [id, treat])

  return nftSetCost;
}


export default useGetTreatSetCost;
