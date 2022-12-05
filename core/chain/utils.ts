import {contractAddresses} from "@packages/treat/lib/constants";

export const getContractAddress = (contract_name: string) => {
	const contract = contractAddresses[contract_name]["56"];
	return contract;
};
