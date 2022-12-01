import {Container} from "@packages/shared/components/Container";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import {
	DotsHorizontalIcon,
	CornersIcon,
	ChevronDownIcon,
	ChevronUpIcon,
	Cross1Icon,
	HeartIcon,
	ChatBubbleIcon,
	BackpackIcon,
} from "@radix-ui/react-icons";
import {
	Text,
	SmallText,
	MutedText,
	ImportantText,
} from "@packages/shared/components/Typography/Text";
import {ImportantSmallText} from "@packages/shared/components/Typography/Headings";
import {Divider} from "@packages/shared/components/Divider";
import {Heading} from "@packages/shared/components/Typography/Headings";
import UserAvatar from "core/auth/components/Avatar";
import {Button} from "@packages/shared/components/Button";
import CommentsAndCollectorsTabs from "@packages/comments/components/CommentsTab";
import Link from "next/link";

export default function PostDetail() {
	return (
		<ApplicationLayout>
			<Container className="px-24">
				<Container className="grid p-16 grid-cols-5">
					<Container className="col-span-4">
						<Container className="flex items-center justify-between my-2">
							<Container>
								<Container
									css={{
										width: "32px",
										height: "32px",
										backgroundColor: "$surface",
										borderColor: "$subtleBorder",
									}}
									className="flex items-center justify-center border rounded-full"
								>
									<Link href="/discover">
										<Cross1Icon className="w-5 h-5" />
									</Link>
								</Container>
							</Container>
							<Container className="flex gap-2">
								<Container
									css={{
										width: "32px",
										height: "32px",
										backgroundColor: "$surface",
										borderColor: "$subtleBorder",
									}}
									className="flex items-center justify-center border rounded-full"
								>
									<CornersIcon className="w-5 h-5" />
								</Container>
								<Container
									css={{
										width: "32px",
										height: "32px",
										backgroundColor: "$surface",
										borderColor: "$subtleBorder",
									}}
									className="flex items-center justify-center border rounded-full"
								>
									<DotsHorizontalIcon className="w-5 h-5" />
								</Container>
							</Container>
						</Container>
						<Container className="flex gap-2 items-center justify-center">
							<img
								src="https://i.pinimg.com/originals/7c/d5/3d/7cd53d36d121d839da9600ca055b01db.gif"
								height="60%"
								width="60%"
							/>
							<Container className="grid grid-cols-1 gap-6">
								<Container
									css={{
										width: "32px",
										height: "32px",
										backgroundColor: "$surface",
										borderColor: "$subtleBorder",
									}}
									className="flex items-center justify-center border rounded-full"
								>
									<ChevronUpIcon className="w-5 h-5" />
								</Container>
								<Container
									css={{
										width: "32px",
										height: "32px",
										backgroundColor: "$surface",
										borderColor: "$subtleBorder",
									}}
									className="flex items-center justify-center border rounded-full"
								>
									<ChevronDownIcon className="w-5 h-5" />
								</Container>
							</Container>
						</Container>
					</Container>

					<Container className="col-span-1 ml-2 border-l-2 p-2">
						<Container className="flex items-center justify-between p-2">
							<Container className="flex items-center gap-2">
								<HeartIcon />
								<Text>52</Text>
							</Container>
							<Container className="flex items-center gap-2">
								<ChatBubbleIcon />
								<Text>52</Text>
							</Container>
							<Container className="flex items-center gap-2">
								<BackpackIcon />
								<Text>52</Text>
							</Container>
						</Container>
						<Container>
							<SmallText>Liked by @codeslayer and 5 others</SmallText>
						</Container>
						<Container>
							<Heading size="xs">GAIA Club. Freemint Ape #6</Heading>
						</Container>
						<Container className="flex items-center gap-2 my-2">
							<UserAvatar
								size={40}
								value="Elvin"
							/>
							<a>
								<p>
									<ImportantSmallText>Creator</ImportantSmallText>
								</p>
								<p>
									<MutedText>
										<SmallText>@codeslayer 1 day ago</SmallText>
									</MutedText>
								</p>
							</a>
						</Container>
						<Container>
							<Container className="flex gap-2">
								<Container className="flex items-center">
									<UserAvatar
										value={"chris"}
										size={20}
									/>
									<UserAvatar
										value={"tatenda"}
										size={20}
									/>
								</Container>
								<Text>
									Collected by <ImportantText>@elvin</ImportantText> &{" "}
									<ImportantText>5 others</ImportantText>
								</Text>
							</Container>
						</Container>
						<Container className="my-8">
							<Button fullWidth>Collect</Button>
						</Container>
						<Container>
							<CommentsAndCollectorsTabs />
						</Container>
					</Container>
				</Container>
			</Container>
		</ApplicationLayout>
	);
}
