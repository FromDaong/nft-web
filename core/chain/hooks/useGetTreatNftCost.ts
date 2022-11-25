import {
  getTreatMartContract,
  getTreatNftCost,
} from "../../../packages/treat/utils";
import { useCallback, useEffect, useState } from "react";

import BigNumber from "bignumber.js";
import useTreat from "./useTreat";

const useGetTreatNFTCost = (id: number, useTreatMart = false) => {
  const [theNftCost, setTheNftCost] = useState(BigNumber.from(0));
  const treat = useTreat();
  const treatMartContract = useTreatMart
    ? getTreatMartContract(treat)
    : getTreatMartContract(treat);

  const fetchNftCost = useCallback(async () => {
    const theNftCost = await getTreatNftCost(treatMartContract, id);
    setTheNftCost(BigNumber.from(theNftCost));
  }, [id, treat]);

  useEffect(() => {
    if (treat) {
      fetchNftCost();
    }
  }, [id]);

  return theNftCost;
};

export default useGetTreatNFTCost;
