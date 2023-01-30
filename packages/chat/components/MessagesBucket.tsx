import {Container} from "@packages/shared/components/Container";
import {MutedText} from "@packages/shared/components/Typography/Text";
import {TChatBucket} from "../lib/types";
import MessageContainer from "./MessageContainer";

export default function MessagesBucket({date, messageBuckets}: TChatBucket) {
	return (
		<Container className="flex flex-col gap-8 w-full">
			<Container className="flex justify-center">
				<MutedText>{new Date(date).toDateString()}</MutedText>
			</Container>
			{messageBuckets.map((message) => (
				<MessageContainer
					key={message.sender.username + `-${date}`}
					user={message.sender}
					messages={message.messages}
				/>
			))}
		</Container>
	);
}
