import {Heading} from "@packages/shared/components/Typography/Headings";
import {
	MutedText,
	SmallText,
	Text,
} from "@packages/shared/components/Typography/Text";
import {Divider} from "@packages/shared/components/Divider";
import UserAvatar from "core/auth/components/Avatar";
import {ImportantSmallText} from "@packages/shared/components/Typography/Headings";
import {
	DotsHorizontalIcon,
	HeartIcon,
	ChatBubbleIcon,
	BackpackIcon,
} from "@radix-ui/react-icons";

export default function CollectibleCard() {
	return (
		<div className="border-2 rounded-xl">
			<div className="flex p-2  items-center justify-between">
				<div className="flex items-center gap-2">
					<UserAvatar
						size={40}
						value="Elvin"
					/>
					<a>
						<p>
							<ImportantSmallText>Elvin</ImportantSmallText>
						</p>
						<p>
							<MutedText>
								<SmallText>@codeslayer</SmallText>
							</MutedText>
						</p>
					</a>
				</div>
				<Text>
					<DotsHorizontalIcon className="w-5 h-5" />
				</Text>
			</div>
			<img src="https://img.freepik.com/free-vector/hand-drawn-nft-style-ape-illustration_23-2149622021.jpg?w=2000" />
			<div className="p-2">
				<div>
					<p>
						<Heading size="xs">Golden Shadows</Heading>
					</p>
					<div className="flex justify-around my-2">
						<div className="flex gap-3 items-center">
							<HeartIcon />
							57
						</div>
						<div className="flex gap-3 items-center">
							<ChatBubbleIcon />2
						</div>
						<div className="flex gap-3 items-center">
							<BackpackIcon />
							333 / 333
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
