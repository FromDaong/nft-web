import {Container} from "@packages/shared/components/Container";
import UserAvatar from "core/auth/components/Avatar";
import {ImportantSmallText} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	MutedText,
	SmallText,
	Text,
} from "@packages/shared/components/Typography/Text";
import {HeartIcon, ChatBubbleIcon} from "@radix-ui/react-icons";

type CommentCardData = {
	username: string;
	content: string;
	likes: number;
	replies: number;
	posted_date: string;
};

export default function CommentCard(props: CommentCardData) {
	return (
		<Container className="flex flex-col gap-12">
			<Container className="flex gap-4">
				<UserAvatar
					size={24}
					username={props.username}
				/>
				<a>
					<p>
						<MutedText>
							<ImportantText>@{props.username}</ImportantText>
						</MutedText>
					</p>
					<p>
						<Text>{props.content}</Text>
					</p>
				</a>
			</Container>
		</Container>
	);
}
