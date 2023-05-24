import {Heading} from "@packages/shared/components/Typography/Headings";

export const Price = (props: {price: number; currency?: string}) => (
	<Heading size={"xss"}>
		{props.price ?? "0.0"} {props.currency}
	</Heading>
);
