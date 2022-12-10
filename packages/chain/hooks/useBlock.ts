import {useEffect, useState} from "react";
import web3 from "@utils/web3";

const useBlock = () => {
	const [block, setBlock] = useState(0);

	useEffect(() => {
		const interval = setInterval(async () => {
			const latestBlockNumber = await web3.eth.getBlockNumber();
			if (block !== latestBlockNumber) {
				setBlock(latestBlockNumber);
			}
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	return block;
};

export default useBlock;
