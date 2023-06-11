/* eslint-disable @typescript-eslint/no-empty-function */
import {apiEndpoint} from "@utils/index";
import axios from "axios";
import TreatCore from "core/TreatCore";
import {createContext, useContext, useEffect, useMemo, useState} from "react";
import {toast} from "sonner";
import {gql, useQuery} from "urql";
import {useAccount} from "wagmi";

const myBalancesQuery = gql`
	query fetchBalances($address: String!, $skip: Int!) {
		balances(
			where: {
				account_contains_nocase: "0x585865b1bd74b773B8FeF871289ac895742B22bC"
				value_not: "0"
			}
			first: 1000
			skip: $skip
		) {
			id
			value
			token {
				identifier
			}
		}
	}
`;

const usePortfolio = () => {
	const {address} = useAccount();
	const [skip, setSkip] = useState(0);

	// recursively fetch all balances until you get error or empty array

	const [{data: {balances = []} = {}, fetching, error}, refetch] = useQuery({
		query: myBalancesQuery,
		variables: {
			address: `${address}`,
			skip: `${skip}`,
		},
		pause: !address,
	});

	useEffect(() => {
		if (balances.length === 1000) {
			setSkip(+skip + 1000);
			refetch({requestPolicy: "network-only"});
		}
	}, [balances]);

	return {
		portfolio: balances.map((balance) => balance.token.identifier),
	};
};

export const TreatBalancesContext = createContext({
	portfolio: [],
	created: [],
	sales: [],
	totals: {
		treatBalance: 0,
		melonBalance: 0,
	},
});

const TreatBalancesProvider = ({children}) => {
	const {portfolio} = usePortfolio();

	return (
		<TreatBalancesContext.Provider
			value={{
				portfolio,
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

export default TreatBalancesProvider;
