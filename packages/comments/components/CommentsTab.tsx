import * as Tabs from "@radix-ui/react-tabs";
import {Divider} from "@packages/shared/components/Divider";
import {Container} from "@packages/shared/components/Container";
import UserAvatar from "core/auth/components/Avatar";
import {ImportantSmallText} from "@packages/shared/components/Typography/Headings";
import {
	MutedText,
	SmallText,
} from "@packages/shared/components/Typography/Text";
import {Text} from "@packages/shared/components/Typography/Text";
import CommentCard from "./CommentCard";
import SuggestedCreatorCard from "@packages/feed/components/SuggestedCreatorCard";
import {PaperAirplaneIcon} from "@heroicons/react/outline";

export default function CommentsAndCollectorsTabs() {
	const collectors = [
		{
			displayname: "Elvin Anesu",
			username: "codeslayer",
		},
		{
			displayname: "Peter Tosh",
			username: "petertosh",
		},
		{
			displayname: "James Deda",
			username: "jdwemanice",
		},
	];
	const comments = [
		{
			username: "codeslayer",
			content: "nice work bro",
			replies: 0,
			likes: 3,
			posted_date: "2 days ago",
		},
		{
			username: "colleta",
			content: "wonderfull",
			replies: 7,
			likes: 2,
			posted_date: "5 days ago",
		},
		{
			username: "zvaendwa",
			content: "nice one !!",
			replies: 0,
			likes: 0,
			posted_date: "2 hours ago",
		},
	];

	return (
		<Container>
			<Tabs.Root defaultValue="comments">
				<Tabs.TabsList>
					<Container className="flex gap-4">
						<Tabs.Trigger value="comments">
							<Text>Comments</Text>
						</Tabs.Trigger>
						<Tabs.Trigger
							className="px-4 flex gap-2 items-baseline"
							value="collected"
						>
							<Text>Collectors</Text>
							<Container>
								<Container
									className="rounded-full p-1"
									css={{
										backgroundColor: "$gray3",
										borderRadius: "50%",
									}}
								>
									<SmallText>10</SmallText>
								</Container>
							</Container>
						</Tabs.Trigger>
					</Container>
				</Tabs.TabsList>
				<Divider dir="horizontal" />
				<Tabs.Content value="comments">
					<Container className="grid grid-cols-1 gap-6">
						{comments ? (
							comments.map((comment, i) => (
								<CommentCard
									key={i}
									username={comment.username}
									content={comment.content}
									likes={comment.likes}
									replies={comment.replies}
									posted_date={comment.posted_date}
								/>
							))
						) : (
							<Container className="grid grid-cols-1 items-center justify-center">
								<Text> No Comments</Text>
							</Container>
						)}
					</Container>
					<Container
						className="flex justify-between items-center gap-2 py-4"
						style={{
							position: "absolute",
							bottom: 0,
						}}
					>
						<input
							className="max-w-md w-full py-2 px-8 rounded-full border"
							placeholder="Add a comment..."
						/>
						<Container
							css={{
								width: "32px",
								height: "32px",
								backgroundColor: "$surface",
								borderColor: "$subtleBorder",
							}}
							className="flex items-center justify-center border rounded-full"
						>
							<PaperAirplaneIcon className="w-5 h-5" />
						</Container>
					</Container>
				</Tabs.Content>
				<Tabs.Content value="collected">
					<Container className="grid grid-cols-1 gap-6">
						{collectors ? (
							collectors.map((user, i) => (
								<SuggestedCreatorCard
									key={i}
									username={user.username}
									display_name={user.displayname}
									avatar=""
									bio="Mystery SEV. Suddenly, the site goes dark. The dashboard is red. Everything seems fucked. There's no indication why"
									noFollowButton
								/>
							))
						) : (
							<Container className="flex items-center justify-center">
								<MutedText>No one has collected this NFT yet</MutedText>
							</Container>
						)}
					</Container>
				</Tabs.Content>
			</Tabs.Root>
		</Container>
	);
}