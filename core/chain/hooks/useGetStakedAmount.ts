import {
  getMasterMelonFarmerContract,
  getStaked,
  getV1MasterMelonFarmerContract,
} from "../../../packages/treat/utils";
import { useCallback, useEffect, useState } from "react";

import { useMoralis } from "react-moralis";
import useTreat from "./useTreat";

const useGetStakedAmount = (pid: number, v1?: boolean) => {
  const { account } = useMoralis();
  const treat = useTreat();
  const [stakedAmount, setStakedAmount] = useState(null);
  const masterMelonFarmerContract = getMasterMelonFarmerContract(treat);
  const v1MasterMelonFarmerContract = getV1MasterMelonFarmerContract(treat);

  const fetchStakedAmount = useCallback(async () => {
    const amount = await getStaked(
      v1 ? v1MasterMelonFarmerContract : masterMelonFarmerContract,
      pid,
      account
    );

    setStakedAmount(amount);
  }, [account, masterMelonFarmerContract, pid]);

  useEffect(() => {
    if (treat) {
      fetchStakedAmount();
    }
  }, [pid, treat]);

  return stakedAmount;
};

export default useGetStakedAmount;
