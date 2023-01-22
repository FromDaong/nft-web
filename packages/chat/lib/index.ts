import {apiEndpoint} from "./../../../utils/index";
import pusherClient from "@utils/pusher";
import axios from "axios";
import {Channel} from "pusher-js";
import {
	ChatApiResponse,
	TChatBucket,
	TChatParticipant,
	TMessage,
} from "./types";

export type MessageStatus = "SENT" | "FAILED";
export class ChatEngine {
	private chat_id: string;
	private owner: TChatParticipant;
	private contact: TChatParticipant;
	private totalPages: number;
	private totalMessages: number;
	private currentPage: number;
	private hasNextPage = false;
	private hasPrevPage = false;
	private fetchOlderMessages: () => Promise<ChatApiResponse>;
	private clearAllMessages: () => void;
	private setState: (state: any) => void;

	private channel: Channel;

	chatBuckets: Array<TChatBucket> = [];
	messages: Array<TMessage> = [];

	constructor(
		user: TChatParticipant,
		contact: TChatParticipant,
		messages: ChatApiResponse,
		fetchOlderMessages: () => Promise<ChatApiResponse>,
		clearAllMessages: () => void,
		setState: (state) => void
	) {
		this.chat_id = "messages"; // user.username + "-" + contact.username;
		this.owner = user;
		this.contact = contact;

		this.setChatParams(messages);
		this.fetchOlderMessages = fetchOlderMessages;
		this.clearAllMessages = clearAllMessages;
		this.setState = setState;

		this.hydrateMessages(messages.docs);
		this.bindToChannel();
	}

	private bindToChannel = () => {
		this.channel = pusherClient.subscribe(this.chat_id);
		this.channel.bind("new-message", this.onReceiveMessage);
		this.channel.bind("delete-messages", this.onClearMessages);
	};

	private sendMessageWithPusher = (text) => {
		axios.post(`${apiEndpoint}/chat/send`, {
			chat_id: this.chat_id,
			message: {
				text,
				sender: this.owner,
				timestamp: new Date().getTime(),
			},
		});
	};

	private onReceiveMessage = (data: TMessage) => {
		console.log("Received " + data.text + " from " + data.sender.username);
		if (data.sender.username === this.owner.username) return;
		this.addMessage(data.text, data.sender.username, data.timestamp);
		this.setState(Array.from(this.chatBuckets));
	};

	private onClearMessages = (data: {caller_username: string}) => {
		const caller = this.getMessageSender(data.caller_username);
		if (!caller) return;
		this.messages = [];
		this.chatBuckets = [];
		this.clearAllMessages();
	};

	private setChatParams = (response: ChatApiResponse) => {
		this.messages = response.docs;
		this.hasNextPage = response.hasNextPage;
		this.hasPrevPage = response.hasPreviousPage;
		this.totalMessages = response.totalDocs;
		this.totalPages = response.totalPages;
		this.currentPage = response.page;
	};

	private getMessageSender = (username) => {
		if (this.owner.username === username) return this.owner;
		if (this.contact.username === username) return this.contact;
		return null;
	};

	private getNewSingleBucket = (messageToAdd: TMessage) => ({
		date: new Date().getTime(),
		messageBuckets: [
			{
				sender: messageToAdd.sender,
				messages: [messageToAdd],
			},
		],
	});

	private hydrateMessages = (messages: Array<TMessage>) => {
		messages.map((message) =>
			this.addMessage(message.text, message.sender.username, message.timestamp)
		);
	};

	sendMessage = (
		text: string,
		sender_username: string,
		sendStatus: MessageStatus = "SENT"
	) => {
		this.sendMessageWithPusher(text);
		this.addMessage(text, sender_username);
	};

	addMessage = (
		text: string,
		sender_username: string,
		timestamp: number = new Date().getTime()
	) => {
		const messageSender = this.getMessageSender(sender_username);
		if (!messageSender) throw "Sender is not a chat participant";

		const messageToAdd = {
			timestamp,
			text,
			sender: messageSender,
		};

		this.messages.push(messageToAdd);

		const lastBucket =
			this.chatBuckets.length > 0
				? this.chatBuckets[this.chatBuckets.length - 1]
				: null;
		// No previous messages sent in chat
		if (!lastBucket) {
			this.chatBuckets.push(this.getNewSingleBucket(messageToAdd));
			return;
		}

		const lastMessageBucket =
			lastBucket.messageBuckets[lastBucket.messageBuckets.length - 1];
		const lastReceivedMessage =
			lastMessageBucket.messages[lastMessageBucket.messages.length - 1];

		// Message sent in the last 2 minutes
		if (timestamp - 60 * 1000 < lastReceivedMessage.timestamp) {
			// Message sent by the same participant
			if (messageSender.username === lastMessageBucket.sender.username) {
				lastMessageBucket.messages.push(messageToAdd);
				return;
			}
		}

		// Message sent in the last 24 hours
		if (new Date(timestamp).getDate() !== new Date(lastBucket.date).getDate()) {
			lastBucket.messageBuckets.push({
				sender: messageSender,
				messages: [messageToAdd],
			});

			return;
		}

		this.chatBuckets.push(this.getNewSingleBucket(messageToAdd));
		return;
	};

	deleteMessages = (caller_username: string) => {
		// delete all messages from server
		this.channel.trigger("delete-messages", {
			caller_username,
		});
	};

	getPreviousMessages = () => {
		this.fetchOlderMessages().then((messages) => {
			this.setChatParams(messages);
			this.hydrateMessages(messages.docs);
		});
	};
}
