import {
  getMasterMelonFarmerContract,
  getPendingMelons,
} from "../../../packages/treat/utils";
import { useCallback, useEffect, useState } from "react";

import { useMoralis } from "react-moralis";
import useTreat from "./useTreat";

const useGetPendingMelons = (pid: number) => {
  const { account } = useMoralis();
  const treat = useTreat();
  const [pendingMelons, setPendingMelons] = useState(null);
  const masterMelonFarmerContract = getMasterMelonFarmerContract(treat);

  const fetchPendingMelons = useCallback(async () => {
    const amount = await getPendingMelons(
      masterMelonFarmerContract,
      pid,
      account
    );

    setPendingMelons(amount);
  }, [account, masterMelonFarmerContract, pid]);

  useEffect(() => {
    if (treat) {
      fetchPendingMelons();
    }
  }, [pid, treat]);

  return pendingMelons;
};

export default useGetPendingMelons;