import {gql} from "graphql-request";

export const graphql_endpoints = {
	resale: gql`
		query resale(
			$sort: String!
			$skip: Int!
			$first: Int!
			$direction: String!
		) {
			marketItems(
				orderBy: $sort
				orderDirection: $direction
				skip: $skip
				first: $first
				where: {currentSupply_not: "0"}
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
	sold_out: gql`
		{
			tokens(first: 1000, where: {totalSupply: "0"}) {
				identifier
			}
		}
	`,
};
