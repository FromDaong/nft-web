import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {Container} from "@packages/shared/components/Container";
import {
	ImportantText,
	MutedText,
	SmallText,
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
					{props.count && <Text>{props.count} editions available</Text>}
					{!props.noPrice && (
						<Container className="flex items-baseline gap-1 mt-2">
							{props.melon_nft && (
								<Container
									css={{
										backgroundColor: "$teal4",
										padding: "4px 12px",
										borderRadius: "999px",
									}}
								>
									<SmallText css={{color: "$teal12"}}>
										<ImportantText>Melon 🍈</ImportantText>
									</SmallText>
								</Container>
							)}
							{!props.melon_nft && (
								<>
									<Heading size={"xss"}>
										{props.price.value ?? "0.0"} {props.price.currency}
									</Heading>
									<MutedText>asking price</MutedText>
								</>
							)}
						</Container>
					)}
				</Container>
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
