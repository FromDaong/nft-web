import React, {createContext, ReactNode, useEffect, useState} from "react";
import {Treat} from "../../../packages/treat";
import {useProvider} from "wagmi";

export interface TreatContext {
	treat?: Treat;
}

export const Context = createContext<TreatContext>({
	treat: undefined,
});

declare global {
	interface Window {
		treatsauce: any;
	}
}

const TreatProvider: React.FC<{children: ReactNode}> = ({children}) => {
	const chainId = 56;
	const provider = useProvider({chainId});
	const [treat, setTreat] = useState<any>();

	if (typeof window !== "undefined") {
		// @ts-ignore
		window.treat = treat;
	}

	useEffect(() => {
		if (provider.network._defaultProvider) {
			const chainId = Number(provider.network.chainId);
			const treatLib = new Treat(provider, chainId, {
				defaultaddress: (provider as any).selectedAddress,
				defaultConfirmations: 1,
				autoGasMultiplier: 1.5,
				testing: false,
				defaultGas: "6000000",
				defaultGasPrice: "180000000000",
				address: [],
				ethereumNodeTimeout: 10000,
			});
			setTreat(treatLib);
			window.treatsauce = treatLib;
		}
	}, [provider]);

	return <Context.Provider value={{treat}}>{children}</Context.Provider>;
};

export default TreatProvider;
