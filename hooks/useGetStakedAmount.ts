import { useCallback, useEffect, useState } from "react";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";
import { getMasterMelonFarmerContract, getStaked } from "../treat/utils";

const useGetStakedAmount = (pid: number) => {
  const { account } = useWallet();
  const treat = useTreat();
  const [stakedAmount, setStakedAmount] = useState(null);
  const masterMelonFarmerContract = getMasterMelonFarmerContract(treat);

  const fetchStakedAmount = useCallback(async () => {
    const amount = await getStaked(masterMelonFarmerContract, pid, account);

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
