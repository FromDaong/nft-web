import {Container} from "@chakra-ui/react";
import {Button} from "@packages/shared/components/Button";
import {Heading} from "@packages/shared/components/Typography/Headings";
import {ImportantText, Text} from "@packages/shared/components/Typography/Text";
import Spinner from "@packages/shared/icons/Spinner";
import {apiEndpoint, timeFromNow} from "@utils/index";
import axios from "axios";
import TreatCore from "core/TreatCore";
import UserAvatar from "core/auth/components/Avatar";
import {gql} from "graphql-request";
import {ExternalLinkIcon} from "lucide-react";
import {useMemo} from "react";
import {useQuery} from "urql";
import Web3 from "web3";

const salesHistory = (nft) => gql`
      query getSales() {
        sales(
          first: 20,
          orderBy: purchaseDate,
          orderDirection: asc,
          where: {
            treatsPurchased_contains: [${nft.id}],
            sourceContract: "0xA38978E839c08046FA80B0fee55736253Ab3B8a3"
          }
        ) {
          id
          cost
          sourceContract
          treatsPurchased
          seller
          buyer
          purchaseDate
        }
      
      }
`;

type SaleItem = {
	id: string;
	cost: string;
	sourceContract: string;
	treatsPurchased: string[];
	seller: string;
	buyer: string;
	purchaseDate: string;
};

const TransactionsPresentation = ({nft}) => {
	const [result] = useQuery({
		query: salesHistory(nft),
	});

	const txHistory = useMemo(() => {
		if (!result.data) return [];
		return [...result.data.sales] as SaleItem[];
	}, [result]);

	const {isLoading, data} = TreatCore.useQuery({
		queryKey: [`resaleHistory:${nft.id}`],
		queryFn: async () => {
			const addresses = txHistory.map((tx) => tx.seller.toLowerCase());
			const res = await axios.post(`${apiEndpoint}/people/get-by-address`, {
				addresses,
			});
			return res.data.data;
		},
		enabled: txHistory.length > 0,
	});

	const txHistoryWithProfile = useMemo(() => {
		if (!data) return [];
		return txHistory.map((tx) => {
			const buyer = data.find(
				(profile) => profile.address.toLowerCase() === tx.buyer.toLowerCase()
			);
			const seller = data.find(
				(profile) => profile.address.toLowerCase() === tx.seller.toLowerCase()
			);
			return {
				...tx,
				buyer: buyer || {address: tx.buyer},
				seller: seller || {address: tx.seller},
				buyerAddress: tx.buyer,
				sellerAddress: tx.seller,
			};
		});
	}, [data]);

	return (
		<Container className="flex flex-col gap-4 py-4">
			{isLoading && (
				<Container className="py-4 justify-center">
					<Spinner />
				</Container>
			)}
			{!isLoading && txHistoryWithProfile.length === 0 && (
				<Container className="py-4 justify-center">
					<Button appearance={"surface"}>NFT has no sales history</Button>
				</Container>
			)}
			{txHistoryWithProfile.map((tx) => (
				<Container
					key={tx.id}
					className="p-2 flex flex-col md:flex-row gap-2 rounded-xl justify-between"
				>
					<Container className="flex gap-4">
						<UserAvatar
							size={32}
							username={tx.buyer.username}
							profile_pic={tx.buyer.profile_pic}
						/>
						<Container>
							<Text>
								<ImportantText>
									Purchased for {Web3.utils.fromWei(tx.cost).toString()} BNB
								</ImportantText>
							</Text>
							<Container className="flex gap-2">
								<Text>
									{tx.buyer.username ??
										tx.buyer.address.slice(0, 5) +
											"..." +
											tx.buyer.address.slice(tx.buyer.address.length - 4)}
								</Text>
								<Text>&bull;</Text>
								<Text>
									{timeFromNow(
										// @ts-ignore
										parseInt(tx.purchaseDate) * 1000
									)}
								</Text>
							</Container>
						</Container>
					</Container>
					<Button appearance={"link"}>
						View on Bscscan <ExternalLinkIcon className="w-5 h-5" />
					</Button>
				</Container>
			))}
		</Container>
	);
};

export default function Activity({nft}) {
	return <TransactionsPresentation nft={nft} />;
}
