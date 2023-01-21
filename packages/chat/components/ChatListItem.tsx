import {Container} from "@packages/shared/components/Container";
import {
	MutedText,
	SmallText,
	Text,
} from "@packages/shared/components/Typography/Text";
import UserAvatar from "core/auth/components/Avatar";
import {TChatParticipant, TMessage} from "../lib/types";
import {timeFromNow} from "@utils/index";
import Link from "next/link";

export default function ChatListItem({
	participant,
	id,
	lastMessage,
	isSelected,
}: {
	participant: TChatParticipant;
	id: string;
	lastMessage: TMessage;
	isSelected?: boolean;
	isActive?: boolean;
	unreadMessages?: number;
}) {
	return (
		<Link href={`/messages/${id}`}>
			<a>
				<Container
					className="relative flex gap-4 p-4"
					css={{
						borderRadius: "16px",
						backgroundColor: isSelected ? "$elementOnSurface" : "transparent",
					}}
				>
					<Container className="flex-1">
						<UserAvatar
							size={44}
							profile_pic={participant.profile_pic}
							username={participant.username}
						/>
					</Container>
					<Container className="w-full">
						<Container className="flex justify-between">
							<Text>{participant.display_name}</Text>
							<MutedText>
								<SmallText>
									{timeFromNow(new Date(lastMessage.timestamp).toUTCString())}{" "}
								</SmallText>
							</MutedText>
						</Container>
						<MutedText
							css={{display: "-webkit-box !important"}}
							className="text-ellipsis ... line-clamp-1"
						>
							{lastMessage.text}
						</MutedText>
					</Container>
				</Container>
			</a>
		</Link>
	);
}
