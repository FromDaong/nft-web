import {Heading} from "@packages/shared/components/Typography/Headings";
import {Container} from "@packages/shared/components/Container";

export const DetailSection = (props) => {
	return (
		<Container className="w-full gap-2">
			<Container className="flex flex-col w-full gap-1">
				<Container className="flex items-baseline justify-between w-full gap-2">
					<Heading
						size={"xss"}
						className="w-3/4 text-ellipsis"
						css={{padding: 0}}
					>
						{props.name}
					</Heading>
					{props.children}
				</Container>
				{props.ListedBy && (
					<Container className="flex gap-2">
						<props.ListedBy username={props.seller.username} />
					</Container>
				)}
				{props.Price && (
					<props.Price
						price={props.price.value}
						currency={props.price.currency}
					/>
				)}
			</Container>
		</Container>
	);
};
