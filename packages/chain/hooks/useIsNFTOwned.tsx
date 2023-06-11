import {TreatBalancesContext} from "core/auth/components/TreatBalancesProvider";
import {useContext} from "react";

export const useIsNFTOwned = (id: number) => {
	const {portfolio} = useContext(TreatBalancesContext);

	return portfolio.includes(id);
};
