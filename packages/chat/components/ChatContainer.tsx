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
import {useCallback, useState} from "react";
import {TMessage} from "../lib/types";

export default function ChatContainer() {
	const [messages, setMessages] = useState([
		{
			date: new Date().getTime(),
			messageBuckets: [
				{
					sender: {
						_id: "hdhdshjd",
						display_name: "tatenda bako",
						username: "tatenda",
					},
					messages: [
						{
							timestamp: new Date().getTime(),
							text: "Hey there mate",
							sender: {
								_id: "hdhdshjd",
								display_name: "tatenda bako",
								username: "tatenda",
							},
						},
					],
				},
			],
		},
		{
			date: new Date().getTime(),
			messageBuckets: [
				{
					sender: {
						_id: "hdhdshjd",
						display_name: "tatenda bako",
						username: "chris",
					},
					messages: [
						{
							timestamp: new Date().getTime(),
							text: "Cool. Lets do it then",
							sender: {
								_id: "hdhdshjd",
								display_name: "tatenda bako",
								username: "tatenda",
							},
						},
					],
				},
			],
		},
	]);

	const getComposedSingletonBucket = (text, sender) => {
		return {
			date: new Date().getTime(),
			messageBuckets: [
				{
					sender,
					messages: [
						{
							timestamp: new Date().getTime(),
							text,
							sender,
						},
					],
				},
			],
		};
	};

	const getSender = () => ({
		_id: "hdhdshjd",
		display_name: "tatenda bako",
		username: "tatenda",
	});

	const sendMessage = (text: string) => {
		setMessages((messages) => {
			const lastBucket =
				messages.length > 0 ? messages[messages.length - 1] : null;
			if (!lastBucket) {
				return [getComposedSingletonBucket(text, getSender())];
			}

			const lastMessageBucket =
				lastBucket.messageBuckets[lastBucket.messageBuckets.length - 1];
			const lastReceivedMessage =
				lastMessageBucket.messages[lastMessageBucket.messages.length - 1];

			console.log(
				new Date().getTime() - 5 * 1000,
				lastReceivedMessage.timestamp
			);

			if (new Date().getTime() - 5 * 1000 < lastReceivedMessage.timestamp) {
				console.log("is under mintue");
				if (getSender().username === lastMessageBucket.sender.username) {
					lastMessageBucket.messages.push({
						timestamp: new Date().getTime(),
						text,
						sender: getSender(),
					});
					return Array.from(messages);
				}
			}

			if (new Date().getTime() - 1000 * 60 * 60 * 24 < lastBucket.date) {
				lastBucket.messageBuckets.push({
					sender: getSender(),
					messages: [
						{
							timestamp: new Date().getTime(),
							text,
							sender: getSender(),
						},
					],
				});

				messages[0] = lastBucket;
				return Array.from(messages);
			}

			messages[0] = getComposedSingletonBucket(text, getSender());
			return Array.from(messages);
		});
	};

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
			<Container className="flex-1 h-full w-full py-4 flex flex-col gap-12 overflow-y-auto scrollbar">
				{messages.map((bucket) => (
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
