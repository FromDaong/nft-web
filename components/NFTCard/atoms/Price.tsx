import {Heading} from "@packages/shared/components/Typography/Headings";
import {ImportantText, Text} from "@packages/shared/components/Typography/Text";
import axios from "axios";
import TreatCore from "core/TreatCore";

export const Price = (props: {price: number; currency?: string}) => {
	const {isLoading: bnbPriceLoading, data: bnbPrice} = TreatCore.useQuery({
		queryKey: ["bnbPrice"],
		queryFn: async () => {
			const res = await axios.get(
				"https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd"
			);
			return res.data.binancecoin.usd;
		},
	});
	return (
		<Text className="flex gap-2">
			<ImportantText>
				{props.price ?? "0.0"} {props.currency}
			</ImportantText>
			&bull;
			{bnbPrice && (
				<ImportantText>
					{Intl.NumberFormat("en-US", {
						style: "currency",
						currency: "USD",
					}).format(props.price * bnbPrice)}
				</ImportantText>
			)}
		</Text>
	);
};
