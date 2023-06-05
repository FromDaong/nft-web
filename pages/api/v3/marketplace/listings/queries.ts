import {gql} from "graphql-request";

export const graphql_endpoints = {
	resale: gql`
		query resale($sort: String!, $skip: Int!, $first: Int!) {
			marketItems(
				orderBy: $sort
				orderDirection: desc
				skip: $skip
				first: $first
			) {
				nft
				currentSupply
				cost
				isActive
				transactionHash
				seller
			}
		}
	`,
	base_market: gql`
		query tokens($sort: String!) {
			tokens(
				where: {totalSupply_not: "0"}
				orderBy: $sort
				orderDirection: desc
			) {
				identifier
				totalSupply
				totalSaleValue
				totalSales
			}
		}
	`,
};
