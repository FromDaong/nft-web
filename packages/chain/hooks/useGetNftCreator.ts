import {getNftCreator, getTreatNFTMinterContract} from "@packages/chain/utils";
import {useEffect, useState} from "react";

import {useAccount} from "wagmi";
import useTreat from "./useTreat";

const useGetNftCreator = (nftArray) => {
	const [nftCreatorAddress, setNftCreatorAddress] = useState([]);
	const {address: account} = useAccount();
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
						return {...nft, nftCreatorAddress: creatorAddress};
					}
				})
			);
			// setBalance(newNFTCreator);
		})();
	}, [nftArray]);

	return nftCreatorAddress;
};

export default useGetNftCreator;
