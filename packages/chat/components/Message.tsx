import {Container} from "@packages/shared/components/Container";
import {MutedText, Text} from "@packages/shared/components/Typography/Text";

export default function Message({
	text,
	timestamp,
}: {
	text: string;
	timestamp: number;
}) {
	let hours = `${new Date(timestamp).getHours()}`;
	let minutes = `${new Date(timestamp).getMinutes()}`;

	if (parseInt(hours) < 10) {
		hours = "0" + hours;
	}

	if (parseInt(minutes) < 10) {
		minutes = "0" + minutes;
	}

	return (
		<Container className="relative flex justify-between w-full transition-opacity duration-150 group">
			<Text>{text}</Text>
			<MutedText
				css={{
					backgroundColor: "$surface",
					padding: "4px",
				}}
				className="transition-opacity duration-200 opacity-0 flex-noshrink group-hover:opacity-100 group-focus:opacity-100"
			>
				{hours}:{minutes} {"\n"}
			</MutedText>
		</Container>
	);
}
