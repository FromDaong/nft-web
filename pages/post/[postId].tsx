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
} from "@packages/shared/components/Typography/Text";
import {ImportantSmallText} from "@packages/shared/components/Typography/Headings";
import {Heading} from "@packages/shared/components/Typography/Headings";
import UserAvatar from "core/auth/components/Avatar";
import {Button} from "@packages/shared/components/Button";
import CommentsAndCollectorsTabs from "@packages/comments/components/CommentsTab";
import Link from "next/link";
import {PaperAirplaneIcon} from "@heroicons/react/outline";
import {Input} from "@packages/shared/components/Input";

export default function PostDetail() {
	return (
		<ApplicationLayout>
			<ApplicationFrame>
				<Container>
					<Container className="grid grid-cols-1 gap-8 lg:grid-cols-4">
						<Container className="col-span-1 lg:col-span-3">
							<Container className="flex items-center justify-between my-2">
								<Container>
									<Container
										css={{
											width: "16px",
											height: "16px",
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
											width: "16px",
											height: "16px",
											backgroundColor: "$surface",
											borderColor: "$subtleBorder",
										}}
										className="flex items-center justify-center border rounded-full"
									>
										<CornersIcon className="w-5 h-5" />
									</Container>
									<Container
										css={{
											width: "16px",
											height: "16px",
											backgroundColor: "$surface",
											borderColor: "$subtleBorder",
										}}
										className="flex items-center justify-center border rounded-full"
									>
										<DotsHorizontalIcon className="w-5 h-5" />
									</Container>
								</Container>
							</Container>
							<Container className="flex items-center justify-center gap-2">
								<img
									src="https://i.pinimg.com/originals/7c/d5/3d/7cd53d36d121d839da9600ca055b01db.gif"
									height="60%"
									width="60%"
								/>
								<Container className="grid grid-cols-1 gap-6">
									<Container
										css={{
											width: "16px",
											height: "16px",
											backgroundColor: "$surface",
											borderColor: "$subtleBorder",
										}}
										className="flex items-center justify-center border rounded-full"
									>
										<ChevronUpIcon className="w-5 h-5" />
									</Container>
									<Container
										css={{
											width: "16px",
											height: "16px",
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

						<Container className="flex flex-col col-span-1 gap-8 px-4 py-8 xl:px-0">
							<Container className="flex items-center gap-2">
								<UserAvatar
									size={36}
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
							<Container className="flex flex-col gap-2">
								<Container>
									<Heading size="xs">GAIA Club. Freemint Ape #6</Heading>
								</Container>
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
							</Container>
							<Container>
								<Button fullWidth>Collect</Button>
							</Container>
							<Container>
								<CommentsAndCollectorsTabs />
								<Container
									className="fixed left-0 flex items-center justify-between w-full gap-2 px-4 py-4 md:relative"
									style={{
										bottom: "12px",
									}}
								>
									<Input
										className="w-full max-w-md px-8 py-2 border rounded-full"
										placeholder="Add a comment..."
									/>
									<Container
										css={{
											width: "16px",
											height: "16px",
											backgroundColor: "$surface",
											borderColor: "$subtleBorder",
										}}
										className="flex items-center justify-center border rounded-full"
									>
										<PaperAirplaneIcon className="w-5 h-5" />
									</Container>
								</Container>
							</Container>
						</Container>
					</Container>
				</Container>
			</ApplicationFrame>
		</ApplicationLayout>
	);
}
