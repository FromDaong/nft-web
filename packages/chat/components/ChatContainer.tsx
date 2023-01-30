import {DotsHorizontalIcon} from "@heroicons/react/outline";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import UserAvatar from "core/auth/components/Avatar";
import Link from "next/link";
import MessagesBucket from "./MessagesBucket";
import SendMessage from "./SendMessage";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
	DropdownContent,
	NavDropdownContainer,
	NavDropdownItem,
} from "@packages/navigation/components/DropdownContainer";
import {useEffect, useMemo, useRef, useState} from "react";
import {ChatEngine} from "../lib";
import useSound from "use-sound";

export default function ChatContainer({username, contact}) {
	const chatContainerRef = useRef(null);
	const [receiveMessageSound] = useSound("/sound/toggle_on.wav");

	const [chatBucket, setChatBucket] = useState([
		{
			date: new Date().getTime(),
			messageBuckets: [],
		},
	]);

	// T-74 Fetch messages from DB
	// T-75 Clear messages on DB
	// T-76 Block user

	const clearAllMessages = () => {
		setChatBucket([]);
	};

	const chatEngine = useMemo(
		() =>
			new ChatEngine(
				{
					_id: "testerid",
					display_name: "tatenda",
					username: username,
				},
				{
					_id: "someotherid",
					display_name: "pacbar",
					username: contact,
				},
				{
					docs: [],
					page: 1,
					totalDocs: 120,
					totalPages: 6,
					hasNextPage: true,
					hasPreviousPage: false,
				},
				async () => ({
					docs: chatBucket
						.map((b) => b.messageBuckets)
						.flat()
						.map((mb) => mb.messages)
						.flat(),
					page: 1,
					totalDocs: 120,
					totalPages: 6,
					hasNextPage: true,
					hasPreviousPage: false,
				}),
				clearAllMessages,
				setChatBucket,
				receiveMessageSound
			),

		[]
	);

	const sendMessage = (text: string) => {
		chatEngine.sendMessage(text, username);
		setChatBucket(Array.from(chatEngine.chatBuckets));
	};

	useEffect(() => {
		if (chatContainerRef.current) {
			const container = chatContainerRef.current;
			container.scrollTo(0, container.clientHeight);
		}
	}, [chatBucket]);

	return (
		<Container className="flex flex-col justify-between h-full">
			<Container className="flex-noshrink">
				<Container
					className="flex justify-between items-center border-b px-4 md:px-8 h-[64px]"
					css={{borderColor: "$border"}}
				>
					<Container>
						<Link href={`/username`}>
							<a className="flex items-center gap-2 py-2">
								<UserAvatar
									size={32}
									username={"Andi Lane"}
								/>
								<Container>
									<Heading size="xss">Andi Lane</Heading>
								</Container>
							</a>
						</Link>
					</Container>
					<Container className="items-center gap-2 p-4 md:flex">
						<Button appearance={"unstyled"}>
							<DropdownMenu.Root>
								<DropdownMenu.Trigger>
									<DotsHorizontalIcon
										width={20}
										height={20}
									/>
								</DropdownMenu.Trigger>
								<DropdownMenu.Portal>
									<DropdownContent>
										<NavDropdownContainer className="p-2 drop-shadow-2xl">
											<NavDropdownItem>
												<Text css={{color: "$textOnSurface"}}>
													Delete all messages
												</Text>
											</NavDropdownItem>
											<NavDropdownItem>
												<Text css={{color: "$textOnSurface"}}>Block</Text>
											</NavDropdownItem>
										</NavDropdownContainer>
									</DropdownContent>
								</DropdownMenu.Portal>
							</DropdownMenu.Root>
						</Button>
					</Container>
				</Container>
			</Container>
			<Container
				ref={chatContainerRef}
				className="relative flex flex-col flex-1 w-full h-full gap-12 px-4 py-4 overflow-y-auto scrollbar md:px-8"
			>
				{chatBucket[0].messageBuckets.length > 0 &&
					chatBucket.map((bucket) => (
						<MessagesBucket
							date={bucket.date}
							messageBuckets={bucket.messageBuckets}
							key={`${bucket.date}-${bucket.messageBuckets[0].messages[0].timestamp}-${bucket.messageBuckets[0].sender.username}`}
						/>
					))}
			</Container>
			<Container className="p-4 flex-noshrink md:px-8 ">
				<Container
					css={{backgroundColor: "$surface"}}
					className="flex items-center w-full py-2"
				>
					<SendMessage sendMessage={sendMessage} />
				</Container>
			</Container>
		</Container>
	);
}
