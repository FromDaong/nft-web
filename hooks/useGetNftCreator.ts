import BigNumber from "bignumber.js";
import React, { useCallback, useEffect, useState } from "react";
import { useWallet } from "use-wallet";
import bsc from "@binance-chain/bsc-use-wallet";
import { getTreatNFTMinterContract, getNftCreator } from "../treat/utils";
import useBlock from "./useBlock";
import useTreat from "./useTreat";

const useGetNftCreator = (nftArray) => {
  const [nftCreatorAddress, setNftCreatorAddress] = useState([]);
  const { account }: { account: string } = useWallet();
  const treat = useTreat();
  const treatNFTMinterContract = getTreatNFTMinterContract(treat);
  const block = useBlock();

  const fetchBalance = useCallback(
    async (id) => {
      const nftCreatorAddress = await getNftCreator(treatNFTMinterContract, id);
      setNftCreatorAddress(nftCreatorAddress);
    },
    [account, treat]
  );

  useEffect(() => {
    (async () => {
      const newNFTCreator = await Promise.all(
        nftArray.map(async (nft) => {
          if (account && treat) {
            const nftCreatorAddress = await getNftCreator(
              treatNFTMinterContract,
              nft.id
            );

            const creatorAddress = await nftCreatorAddress.toNumber();
            return { ...nft, nftCreatorAddress: creatorAddress };
          }
        })
      );
      // setBalance(newNFTCreator);
    })();
  }, [nftArray]);

  return nftCreatorAddress;
};

export default useGetNftCreator;
