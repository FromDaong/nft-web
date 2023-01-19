import {Container} from "@packages/shared/components/Container";
import {Text} from "@packages/shared/components/Typography/Text";

export default function Message({
	text,
	timestamp,
}: {
	text: string;
	timestamp: number;
}) {
	return (
		<Container className="w-full relative group">
			<Text>{text}</Text>
			<Text
				css={{backgroundColor: "$surface", padding: "4px"}}
				className="absolute top-0 left-0"
			>
				{new Date(timestamp).getHours()}:{new Date(timestamp).getMinutes()}
			</Text>
		</Container>
	);
}
