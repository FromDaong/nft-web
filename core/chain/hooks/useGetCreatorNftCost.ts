import {
  getCreatorMartContract,
  getCreatorNftCost,
} from "../../../packages/treat/utils";
import { useCallback, useEffect, useState } from "react";

import BigNumber from "bignumber.js";
import useTreat from "./useTreat";

const useGetCreatorNftCost = (id: number, useCreatorMart = false) => {
  const [theNftCost, setTheNftCost] = useState(BigNumber.from(0));
  const treat = useTreat();
  const creatorMartContract = useCreatorMart
    ? getCreatorMartContract(treat)
    : getCreatorMartContract(treat);

  const fetchNftCost = useCallback(async () => {
    const theNftCost = await getCreatorNftCost(creatorMartContract, id);
    setTheNftCost(BigNumber.from(theNftCost));
  }, [id, treat]);

  useEffect(() => {
    if (treat) {
      fetchNftCost();
    }
  }, [id]);

  return theNftCost;
};

export default useGetCreatorNftCost;
