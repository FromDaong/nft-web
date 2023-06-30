import {useUser} from "core/auth/useUser";
import {gql} from "urql";
import {useAccount} from "wagmi";

export const useCreator = () => {
	const {creator, isLoading} = useUser();
	return {creator: creator ?? {}, isLoading};
};

const activityQueries = {
	marketSales: gql`
        query sales($address: String!) {
            sales(
				where: {
					buyer: $address
					sourceContract_not_in: [
						"0xA38978E839c08046FA80B0fee55736253Ab3B8a3"
						"0xe0f5df4915242e4c4c06d2964eda53c448fec442"
					]
				}
			)  {
                id
                cost
                purchaseDate
                quantity
                buyer
                seller
                treatsPurchased
            }
    `,
	resaleSales: gql`
        query sales($address: String!) {
            sales(
                where: {
                    seller: $address
                    sourceContract: "0xA38978E839c08046FA80B0fee55736253Ab3B8a3"
                }
            ) {
                id
                cost
                purchaseDate
                quantity
                buyer
                seller
                treatsPurchased
            }
    `,
	transfers: gql`
		query transfers($address: String!) {
			transfers(where: {from: $address}) {
				id
			}
		}
	`,
	purchases: gql`
		query purchases($address: String!) {
			sales(
				where: {
					buyer: $address
					sourceContract_not_in: [
						"0xA38978E839c08046FA80B0fee55736253Ab3B8a3"
						"0xe0f5df4915242e4c4c06d2964eda53c448fec442"
					]
				}
			) {
				id
				cost
				purchaseDate
				quantity
				seller
				treatsPurchased
				buyer
			}
		}
	`,
};

export const useActivity = () => {
	const {address} = useAccount();
};
