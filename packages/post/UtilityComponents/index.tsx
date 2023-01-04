import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {Container} from "@packages/shared/components/Container";
import {
	ImportantText,
	MutedText,
} from "@packages/shared/components/Typography/Text";
import Link from "next/link";
import UserAvatar from "core/auth/components/Avatar";

export const ActionSection = (props) => {
	return (
		<Container className="grid grid-cols-5 gap-2">
			<Container className="flex flex-col col-span-4 gap-4">
				<Container className="flex flex-col w-full">
					<Text
						className="line-clamp-1"
						css={{padding: 0}}
					>
						<ImportantText>{props.name}</ImportantText>
					</Text>
					{!props.hideSeller && (
						<MutedText css={{lineHeight: "12px"}}>
							{props.seller
								? `Listed by ${props.seller.username}`
								: props.username && `Listed by ${props.username}`}
						</MutedText>
					)}
					{props.count && <Text>{props.count} editions available</Text>}
				</Container>

				{!props.noPrice && (
					<Container className="flex items-baseline gap-1">
						<Heading size={"xss"}>
							{props.price.value} {props.price.currency}
						</Heading>
						<MutedText>asking price</MutedText>
					</Container>
				)}
			</Container>
		</Container>
	);
};

export const UserBadge = (props: {username: string; avatar: string}) => {
	return (
		<Link href={`/${props.username}`}>
			<a>
				<Container className="flex gap-2 pr-4 rounded-full ">
					<UserAvatar
						size={24}
						username={props.username}
					/>
					<Text>
						<ImportantText>@{props.username}</ImportantText>
					</Text>
				</Container>
			</a>
		</Link>
	);
};
