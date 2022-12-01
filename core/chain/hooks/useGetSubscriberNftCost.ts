import {
  getSubscriberMartContract,
  getSubscriberNftCost,
} from "../../../packages/treat/utils";
import { useCallback, useEffect, useState } from "react";

import BigNumber from "bignumber.js";
import useTreat from "./useTreat";

const useGetSubscriberNftCost = (id: number, useSubscriberMart = false) => {
  const [theNftCost, setTheNftCost] = useState(BigNumber.from(0));
  const treat = useTreat();
  const subscriberMartContract = useSubscriberMart
    ? getSubscriberMartContract(treat)
    : getSubscriberMartContract(treat);

  const fetchNftCost = useCallback(async () => {
    const theNftCost = await getSubscriberNftCost(subscriberMartContract, id);
    setTheNftCost(BigNumber.from(theNftCost));
  }, [id, treat]);

  useEffect(() => {
    if (treat) {
      fetchNftCost();
    }
  }, [id]);

  return theNftCost;
};

export default useGetSubscriberNftCost;
