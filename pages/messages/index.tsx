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
						marginTop: "32px",
					}}
				>
					<Container
						className="col-span-1 grid grid-cols-4 shadow divide-x overflow-hidden"
						css={{backgroundColor: "$elementSurface", borderRadius: "16px"}}
					>
						<Container
							className="col-span-1 flex flex-col divide-y"
							css={{
								backgroundColor: "$elementSurface",
								borderColor: "$subtleBorder",
							}}
						>
							<Container className="py-4 px-8">
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
							className="col-span-3 flex flex-col"
							css={{
								backgroundColor: "$elementSurface",
								borderColor: "$subtleBorder",
							}}
						>
							<Container
								className="border-b flex justify-between"
								css={{borderColor: "$subtleBorder"}}
							>
								<Container className="flex gap-2">
									<UserAvatar
										size={64}
										value={"Andi Lane"}
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
												className="p-1 rounded-full border"
											>
												Online
											</Container>
										</Text>
										<MutedText>
											<SmallText>@andi</SmallText>
										</MutedText>
									</Container>
								</Container>
								<Container className="flex gap-2">
									<Button>Call</Button>
									<Button>Archive</Button>
									<Button>View profile</Button>
								</Container>
							</Container>
							<Container className="flex-1 overflow-y-auto flex flex-col">
								<Container className="flex flex-col gap-4">
                  <MessageItem 
                  isMine={false} 
                  sender={"Andi Lane"} 
                  text={"Hey Olivia, I’ve finished with the requirements doc! I made some notes in the gdoc as well for Phoenix to look over."} 
                  />
                  <MessageItem 
                  isMine={true} 
                  sender={"Andi Lane"} 
                  text={"Hey Olivia, I’ve finished with the requirements doc! I made some notes in the gdoc as well for Phoenix to look over."} 
                  />
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
			<Container className="w-2/3 flex">
				<Container className="flex flex-col gap-2">
					<Container className="flex justify-between">
						<Text>{isMine ? "You" : sender}</Text>
						<MutedText>Thursday 11:41AM</MutedText>
					</Container>
					<Container
						css={{
							backgroundColor: isMine ? "$purple9" : "$elementOnSurface",
						}}
						className="p-2"
					>
						<Text css={{color: isMine ? "$surface" : "$textContrast"}}>
							{text}
						</Text>
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
					className="p-4 flex gap-2"
					css={{borderColor: "$subtleBorder"}}
				>
					<Container
						className="rounded-full h-1 p-1 mt-4"
						css={{backgroundColor: "$purple9"}}
					/>
					<Container className="flex flex-col gap-4">
						<Container className="flex justify-between">
							<Container className="flex gap-2">
								<UserAvatar
									size={40}
									value="Phoenix"
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
