import BigNumber from "bignumber.js";
import { useCallback, useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import {
  getTreatNFTMinterContract,
  getTreatMarketplaceContract,
  getNftBalance,
  getOpenOrdersForSeller,
  getTreatNFTMinterV1Contract,
} from "../../../packages/treat/utils";
import useBlock from "./useBlock";
import useTreat from "./useTreat";

const useGetNftBalance = (nftArray) => {
  const [totalNftBalances, setBalance] = useState([]);
  const { account }: { account: string } = useMoralis();
  const treat = useTreat();
  const treatNFTMinterContract = getTreatNFTMinterContract(treat);
  const treatMarketplaceContract = getTreatMarketplaceContract(treat);
  const treatMarketplaceV1Contract = getTreatNFTMinterV1Contract(treat);
  const [loading, setLoading] = useState(false);
  const block = useBlock();

  useEffect(() => {
    (async () => {
      setLoading(true);
      // Get open orders
      const listedOrders = await getOpenOrdersForSeller(
        treatMarketplaceContract,
        account
      );

      let newNFTBalances = await Promise.all(
        nftArray.map(async (nft) => {
          if (account && treat) {
            const balanceV1 = await getNftBalance(
              treatMarketplaceV1Contract,
              account,
              nft.id
            );
            // Get balance of NFTs
            const balance = await getNftBalance(
              treatNFTMinterContract,
              account,
              nft.id
            );

            const balanceV1Number = balanceV1.toNumber();
            const balanceNumber = balance.toNumber();
            const hasOpenOrder = !!listedOrders.find((o) => o === nft.id);

            if (balanceNumber === 0 && balanceV1Number === 0 && !hasOpenOrder) {
              return undefined;
            } else {
              return {
                ...nft,
                balance: balanceNumber,
                hasOpenOrder,
                balanceV1Number,
              };
            }
          }
        })
      );

      // @ts-ignore
      newNFTBalances = newNFTBalances.filter((e) => e);

      setBalance(newNFTBalances);
    })()
      .then(() => setLoading(false))
      .catch((err) => console.warn(err));
  }, [nftArray]);

  return { totalNftBalances, loading };
};

export default useGetNftBalance;
// gg luca
