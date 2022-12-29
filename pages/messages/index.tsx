import {SEOHead} from "@packages/seo/page";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	MutedText,
	SmallText,
} from "@packages/shared/components/Typography/Text";
import UserAvatar from "core/auth/components/Avatar";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import Link from "next/link";
import {PaperAirplaneIcon} from "@heroicons/react/outline";

export default function Messages() {
	return (
		<ApplicationLayout>
			<SEOHead title="Messages" />
			<ApplicationFrame>
				<Container
					className="grid grid-cols-1 gap-16 "
					css={{
						height: "calc(100vh - 120px)",
						width: "100%",
						marginTop: "16px",
					}}
				>
					<Container
						className="grid grid-cols-4 col-span-1 overflow-hidden divide-x shadow"
						css={{backgroundColor: "$elementSurface", borderRadius: "16px"}}
					>
						<Container
							className="flex flex-col col-span-1 divide-y"
							css={{
								backgroundColor: "$elementSurface",
								borderColor: "$subtleBorder",
							}}
						>
							<Container className="px-8 py-4">
								<Heading size="sm">Messages</Heading>
							</Container>
							<Container className="flex flex-col divide-y">
								<ChatListItem />
								<ChatListItem />
								<ChatListItem />
								<ChatListItem />
								<ChatListItem />
							</Container>
						</Container>
						<Container
							className="flex flex-col col-span-3"
							css={{
								backgroundColor: "$elementSurface",
								borderColor: "$subtleBorder",
							}}
						>
							<Container
								className="flex justify-between border-b"
								css={{borderColor: "$subtleBorder"}}
							>
								<Container className="flex items-center gap-2 p-4">
									<UserAvatar
										size={64}
										username={"Andi Lane"}
									/>
									<Container className="flex flex-col">
										<Text className="flex gap-2">
											<span>Andi Lane</span>
											<Container
												css={{
													borderColor: "$purple9",
													backgroundColor: "$purple3",
													color: "$purple10",
												}}
												className="p-1 border rounded-full"
											>
												Online
											</Container>
										</Text>
										<MutedText>
											<SmallText>@andi</SmallText>
										</MutedText>
									</Container>
								</Container>
								<Container className="flex items-center gap-2 p-4">
									<Button>Call</Button>
									<Button>Archive</Button>
									<Button>View profile</Button>
								</Container>
							</Container>
							<Container
								className="flex flex-col flex-1 p-4 overflow-y-auto"
								style={{
									position: "relative",
								}}
							>
								<Container className="flex flex-col gap-4">
									<MessageItem
										isMine={false}
										sender={"Andi Lane"}
										text={
											"Hey Olivia, I’ve finished with the requirements doc! I made some notes in the gdoc as well for Phoenix to look over."
										}
									/>
									<MessageItem
										isMine={true}
										sender={"Andi Lane"}
										text={
											"Hey Olivia, I’ve finished with the requirements doc! I made some notes in the gdoc as well for Phoenix to look over."
										}
									/>
								</Container>
								<Container
									className="flex items-center gap-4 py-4"
									style={{
										position: "absolute",
										bottom: 0,
										width: "80%",
									}}
								>
									<input
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

const MessageItem = ({isMine, text, sender}) => {
	return (
		<Container
			className={`w-full flex ${isMine ? "flex-row-reverse" : "flex-row"}`}
		>
			<Container className="flex w-2/3">
				<Container className="flex flex-col gap-2">
					<Container className="flex ">
						<Text>{isMine ? "You" : sender}</Text>
					</Container>
					<Container
						css={{
							backgroundColor: isMine ? "$purple9" : "$elementOnSurface",
							borderRadius: isMine
								? "16px 0px 16px 16px"
								: "0px 16px 16px 16px",
						}}
						className="p-2"
					>
						<Text css={{color: isMine ? "$surface" : "$textContrast"}}>
							{text}
						</Text>
					</Container>
					<Container className="flex justify-end">
						<MutedText>Thursday 11:41AM</MutedText>
					</Container>
				</Container>
			</Container>
		</Container>
	);
};

const ChatListItem = () => {
	return (
		<Link href={"#"}>
			<a>
				<Container
					className="flex gap-2 p-4"
					css={{borderColor: "$subtleBorder"}}
				>
					<Container
						className="h-1 p-1 mt-4 rounded-full"
						css={{backgroundColor: "$purple9"}}
					/>
					<Container className="flex flex-col gap-4">
						<Container className="flex justify-between">
							<Container className="flex gap-2">
								<UserAvatar
									size={40}
									username="Phoenix"
								/>
								<Container className="flex flex-col">
									<p>
										<Text>
											<ImportantText>Phoenix Baker</ImportantText>
										</Text>
									</p>
									<p>
										<MutedText>
											<SmallText>@phoenix</SmallText>
										</MutedText>
									</p>
								</Container>
							</Container>
							<Container>
								<MutedText>
									<SmallText>5 min ago</SmallText>
								</MutedText>
							</Container>
						</Container>
						<Container>
							<Text>
								<SmallText className="line-clamp-2">
									Hey Olivia, Katherine sent me over the latest doc. I just have
									a quick question about the
								</SmallText>
							</Text>
						</Container>
					</Container>
				</Container>
			</a>
		</Link>
	);
};
