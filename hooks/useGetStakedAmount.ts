import { useCallback, useEffect, useState } from "react";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";
import {
  getMasterMelonFarmerContract,
  getV1MasterMelonFarmerContract,
  getStaked,
} from "../treat/utils";

const useGetStakedAmount = (pid: number, v1: boolean) => {
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
