import { useCallback, useEffect, useState } from "react";

import { useWallet } from "use-wallet";
import { provider } from "web3-core";

import useBlock from "./useBlock";

import { getIsApprovedForAll } from "../utils/erc1155";
import useTreat from "./useTreat";
import {
  getTreatMarketplaceAddress,
  getTreatNFTMinterContract,
} from "../treat/utils";

const useGetMinterIsApprovedForAll = (tokenAddress: string) => {
  const [allowance, setAllowance] = useState(false);
  const { account, ethereum } = useWallet();
  const block = useBlock();

  const treat = useTreat();

  const treatNftMinterContract = getTreatNFTMinterContract(treat);
  const treatMarketplaceAddress = getTreatMarketplaceAddress(treat);

  const fetchAllowance = useCallback(async () => {
    if (treat) {
      const _allowance = await getIsApprovedForAll(
        treatNftMinterContract,
        treatMarketplaceAddress,
        account
      );
      setAllowance(_allowance);
    }
  }, [account, ethereum, tokenAddress]);

  useEffect(() => {
    if (account && ethereum) {
      fetchAllowance();
    }
  }, [account, ethereum, setAllowance, block, tokenAddress]);

  return allowance;
};

export default useGetMinterIsApprovedForAll;
