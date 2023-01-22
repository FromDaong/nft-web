import {Container} from "@packages/shared/components/Container";
import {MutedText, Text} from "@packages/shared/components/Typography/Text";

export default function Message({
	text,
	timestamp,
}: {
	text: string;
	timestamp: number;
}) {
	return (
		<Container className="w-full relative group flex justify-between transition-opacity duration-150">
			<Text>{text}</Text>
			<MutedText
				css={{
					backgroundColor: "$surface",
					padding: "4px",
				}}
				className="flex-noshrink opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200"
			>
				{new Date(timestamp).getHours()}:{new Date(timestamp).getUTCMinutes()}{" "}
				{"\n"}
			</MutedText>
		</Container>
	);
}
