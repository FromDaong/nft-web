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

export default function ChatContainer({username, contact}) {
	const chatContainerRef = useRef(null);
	const [chatBucket, setChatBucket] = useState([
		{
			date: new Date().getTime(),
			messageBuckets: [],
		},
	]);

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
				setChatBucket
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
					className="flex justify-between"
					css={{borderColor: "$subtleBorder"}}
				>
					<Container>
						<Link href={`/username`}>
							<a className="flex items-center gap-2 md:p-4 py-2">
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
					<Container className="md:flex items-center gap-2 p-4">
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
				className="flex-1 h-full w-full py-4 flex flex-col gap-12 overflow-y-auto scrollbar"
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
			<Container className="flex-noshrink">
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
