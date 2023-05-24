import {Container} from "@packages/shared/components/Container";
import {ImportantText, Text} from "@packages/shared/components/Typography/Text";
import Link from "next/link";

export const Collection = (props: {
	picture: string;
	name: string;
	href: string;
}) => (
	<Link href={props.href}>
		<a>
			<Container
				className="flex items-center gap-2 p-1 pr-2 bg-gray-100 rounded-xl w-fit"
				css={{backgroundColor: "$elementOnSurface"}}
			>
				<img
					src={props.picture}
					alt={props.name}
					className="w-8 h-8 bg-white rounded-xl"
				/>
				<Text className="uppercase">
					<ImportantText>{props.name}</ImportantText>
				</Text>
			</Container>
		</a>
	</Link>
);
