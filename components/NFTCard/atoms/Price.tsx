import {Heading} from "@packages/shared/components/Typography/Headings";
import {ImportantText, Text} from "@packages/shared/components/Typography/Text";

export const Price = (props: {price: number; currency?: string}) => (
	<Text>
		<ImportantText>
			{props.price ?? "0.0"} {props.currency}
		</ImportantText>
	</Text>
);
