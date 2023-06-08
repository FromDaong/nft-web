// withGraphql HOC that injects a urlq graphql provider so the wrapped component can access the graphql client

import {FC} from "react";
import {Client, Provider} from "urql";

export const withGraphql = (Component: FC, client: Client) => {
	const WithGraphQL = (props) => {
		return (
			<Provider value={client}>
				<Component {...props} />
			</Provider>
		);
	};

	return WithGraphQL;
};
