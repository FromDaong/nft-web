import BigNumber from "bignumber.js";
import React, { useCallback, useEffect, useState } from "react";
import { useWallet } from "use-wallet";
import bsc from "@binance-chain/bsc-use-wallet";
import { getTreatNFTMinterV1Contract, getNftV1Balance } from "../treat/utils";
import useBlock from "./useBlock";
import useTreat from "./useTreat";

const useGetNftV1Balance = (nftArray) => {
  const [totalNftBalances, setBalance] = useState([]);
  const { account }: { account: string } = useWallet();
  const treat = useTreat();
  const treatNFTMinterV1Contract = getTreatNFTMinterV1Contract(treat);
  const block = useBlock();

  const fetchBalance = useCallback(
    async (id) => {
      const balance = await getNftV1Balance(treatNFTMinterV1Contract, account, id);
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
            const balance = await getNftV1Balance(
              treatNFTMinterV1Contract,
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

export default useGetNftV1Balance;