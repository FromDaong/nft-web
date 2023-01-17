import {Container} from "@packages/shared/components/Container";

type Participant = {
	username: string;
	profile_pic?: string;
	display_name: string;
	_id: string;
};

type Message = {
	timestamp: number;
	text: string;
	sender: Participant;
};

type Chat = {
	participants: [Participant];
	messages: [Message];
};

export default function Chat() {
	return <Container></Container>;
}
