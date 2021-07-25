import BigNumber from "bignumber.js";
import { useCallback, useEffect, useState } from "react";
import { useWallet } from "use-wallet";
import {
  getTreatNFTMinterContract,
  getTreatMarketplaceContract,
  getNftBalance,
  getOpenOrdersForSeller,
} from "../treat/utils";
import useBlock from "./useBlock";
import useTreat from "./useTreat";

const useGetNftBalance = (nftArray) => {
  const [totalNftBalances, setBalance] = useState([]);
  const { account }: { account: string } = useWallet();
  const treat = useTreat();
  const treatNFTMinterContract = getTreatNFTMinterContract(treat);
  const treatMarketplaceContract = getTreatMarketplaceContract(treat);
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
      const listedOrders = await getOpenOrdersForSeller(
        treatMarketplaceContract,
        account
      );
      let newNFTBalances = await Promise.all(
        nftArray.map(async (nft) => {
          if (account && treat) {
            const balance = await getNftBalance(
              treatNFTMinterContract,
              account,
              nft.id
            );

            const balanceNumber = balance.toNumber();
            const hasOpenOrder = !!listedOrders.find((o) => o === nft.id);

            console.log(nft.id, balanceNumber);

            if (balanceNumber === 0 && !hasOpenOrder) {
              return undefined;
            } else {
              return { ...nft, balance: balanceNumber, hasOpenOrder };
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
