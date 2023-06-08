import {createContext} from "react";
import {withGraphql} from "./GraphQLProviders";
import {treatGraphClient} from "@lib/graphClients";

const TreatBalancesContext = createContext({
	portfolio: [],
	created: [],
	sales: [],
	totals: {
		treatBalance: 0,
		melonBalance: 0,
	},
});

const TreatBalancesProvider = ({children}) => {
	return (
		<TreatBalancesContext.Provider
			value={{
				portfolio: [],
				created: [],
				sales: [],
				totals: {
					treatBalance: 0,
					melonBalance: 0,
				},
			}}
		>
			{children}
		</TreatBalancesContext.Provider>
	);
};

export default withGraphql(TreatBalancesProvider, treatGraphClient);
