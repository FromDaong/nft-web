import {
  getNftCreator,
  getTreatNFTMinterContract,
} from "../../../packages/treat/utils";
import { useEffect, useState } from "react";

import { useMoralis } from "react-moralis";
import useTreat from "./useTreat";

const useGetNftCreator = (nftArray) => {
  const [nftCreatorAddress, setNftCreatorAddress] = useState([]);
  const { account }: { account: string } = useMoralis();
  const treat = useTreat();
  const treatNFTMinterContract = getTreatNFTMinterContract(treat);

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
