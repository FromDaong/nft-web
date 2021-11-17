import {
  hasApprovedContract,
  getTreatContract,
  getTreatV1ForV2Contract,
} from "../treat/utils";
import { useCallback, useEffect, useState } from "react";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";

const hasWalletApprovedContract = (contractAddress) => {
  const { account } = useWallet();
  const treat = useTreat();
  const treatContract = getTreatContract(treat);
  const [hasApprovedState, setHasApprovedState] = useState(false);
  // const treatV1ForV2Contract = getTreatV1ForV2Contract(treat);

  const useHasApprovedContract = useCallback(async () => {
    const hasApproved = await hasApprovedContract(
      treatContract,
      contractAddress,
      account
    );

    setHasApprovedState(hasApproved);
  }, [account, treatContract]);

  useEffect(() => {
    if (treat) {
      useHasApprovedContract();
    }
  }, [account, treatContract]);

  return hasApprovedState;
};

export default hasWalletApprovedContract;
