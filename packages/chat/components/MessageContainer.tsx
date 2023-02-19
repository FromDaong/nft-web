import {Container} from "@packages/shared/components/Container";
import UserAvatar from "core/auth/components/Avatar";
import Link from "next/link";
import {TChatParticipant, TMessage} from "../lib/types";
import Message from "./Message";

export default function MessageContainer({
	user,
	messages,
}: {
	user: TChatParticipant;
	messages: Array<TMessage>;
}) {
	return (
        <Container className="flex gap-4">
			<Link href={`/${user.username}`} className="flex-noshrink">

                <UserAvatar
                    username={user.username}
                    profile_pic={user.profile_pic}
                    size={24}
                />

            </Link>
			<Container className="w-full">
				{messages.map((message) => (
					<Message
						text={message.text}
						key={message.sender + `${message.timestamp}`}
						timestamp={message.timestamp}
					/>
				))}
			</Container>
		</Container>
    );
}
