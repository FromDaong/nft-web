import BigNumber from "bignumber.js";
import React, { useCallback, useEffect, useState } from "react";
import { useWallet } from "use-wallet";
import bsc from "@binance-chain/bsc-use-wallet";
import { getTreatNFTMinterContract, getNftBalance } from "../treat/utils";
import useBlock from "./useBlock";
import useTreat from "./useTreat";

const useGetNftBalance = (nftArray) => {
  const [totalNftBalances, setBalance] = useState([]);
  const { account }: { account: string } = useWallet();
  const treat = useTreat();
  const treatNFTMinterContract = getTreatNFTMinterContract(treat);
  const block = useBlock();

  const fetchBalance = useCallback(
    async (id) => {
      const balance = await getNftBalance(treatNFTMinterContract, account, id);
      // @ts-ignore
      setBalance(new BigNumber(balance));
    },
    [account, treat]
  );

  useEffect(() => {
    (async () => {
      let newNFTBalances = await Promise.all(
        nftArray.map(async (nft) => {
          if (account && treat) {
            const balance = await getNftBalance(
              treatNFTMinterContract,
              account,
              nft.id
            );

            const balanceNumber = await balance.toNumber();
            if (balanceNumber === 0) {
              return undefined;
            } else {
              return { ...nft, balance: balanceNumber };
            }
          }
        })
      );

      // @ts-ignore
      newNFTBalances = newNFTBalances.filter((e) => e);

      setBalance(newNFTBalances);
    })();
  }, [nftArray]);

  return totalNftBalances;
};

export default useGetNftBalance;
