import { getTreatMartContract, getTreatNftCost } from "../treat/utils";
import { useCallback, useEffect, useState } from "react";

import BigNumber from "bignumber.js";
import useTreat from "./useTreat";

const useGetTreatNFTCost = (id: number, useTreatMart = false) => {
  const [theNftCost, setTheNftCost] = useState(new BigNumber(0));
  const treat = useTreat();
  const treatMartContract = useTreatMart
    ? getTreatMartContract(treat)
    : getTreatMartContract(treat);

  const fetchNftCost = useCallback(async () => {
    const theNftCost = await getTreatNftCost(treatMartContract, id);
    setTheNftCost(new BigNumber(theNftCost));
  }, [id, treat]);

  useEffect(() => {
    if (treat) {
      fetchNftCost();
    }
  }, [id]);

  return theNftCost;
};

export default useGetTreatNFTCost;
