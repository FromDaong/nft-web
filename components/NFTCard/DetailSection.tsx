import {Text} from "@packages/shared/components/Typography/Headings";
import {Container} from "@packages/shared/components/Container";
import {ImportantText} from "@packages/shared/components/Typography/Text";

export const DetailSection = (props) => {
	return (
		<Container className="w-full gap-2 flex flex-col">
			<Container className="flex flex-col w-full gap-1">
				<Container className="flex items-baseline justify-between w-full gap-2">
					<Text
						className="w-3/4 text-ellipsis line-clamp-2 leading-tight"
						css={{padding: 0, color: "$textContrast"}}
					>
						<ImportantText>{props.name}</ImportantText>
					</Text>
					{props.children}
				</Container>
				{props.ListedBy && (
					<Container className="flex gap-2">
						<props.ListedBy username={props.seller.username} />
					</Container>
				)}
				{props.Price && (
					<Container className="mt-2">
						<props.Price
							price={props.price.value}
							currency={props.price.currency}
						/>
					</Container>
				)}
			</Container>
		</Container>
	);
};
