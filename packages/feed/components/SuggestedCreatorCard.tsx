import Avatar from "@packages/shared/components/AvatarNew";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {
	ImportantText,
	MutedText,
	SmallText,
	Text,
} from "@packages/shared/components/Typography/Text";
import UserAvatar from "core/auth/components/Avatar";
import Link from "next/link";
import LiveTag from "./LiveTag";

type SuggestedCreatorData = {
	username: string;
	display_name: string;
	avatar: string;
	isPromoted?: boolean;
	isExpanded?: boolean;
	border?: boolean;
	live?: boolean;
	bio: string;
};

export default function SuggestedCreatorCard(props: SuggestedCreatorData) {
	return props.isExpanded ? (
		<ExpandSuggestedCreatorCard {...props} />
	) : (
		<CollapseSuggestedCreatorCard {...props} />
	);
}

const CollapseSuggestedCreatorCard = (props: SuggestedCreatorData) => {
	return (
		<Container
			css={{
				border: `1px ${props.border ? "solid" : null} $subtleBorder`,
				padding: props.border ? "16px" : null,
				borderRadius: "16px",
				backgroundColor: "$elementSurface",
				height: "auto",
			}}
			className="flex justify-between w-full"
		>
			<Container className="flex gap-4">
				<UserAvatar
					size={40}
					value={props.username}
				/>
				<Container className="gap-2">
					<Container>
						<p>
							<Text>
								<ImportantText>{props.display_name}</ImportantText>
							</Text>
						</p>
						<p>
							<MutedText>
								<SmallText>@{props.username}</SmallText>
							</MutedText>
						</p>
					</Container>
				</Container>
			</Container>
			<Container>
				<Button>Follow</Button>
			</Container>
		</Container>
	);
};

const ExpandSuggestedCreatorCard = (props: SuggestedCreatorData) => {
	return (
		<Link href={`/${props.username}`}>
			<a>
				<Container
					css={{
						border: `1px ${props.border ? "solid" : null} $subtleBorder`,
						padding: props.border ? "16px" : null,
						borderRadius: "16px",
						backgroundColor: "$elementSurface",
						height: "100%",
					}}
				>
					<Container className="flex justify-between w-full gap-4">
						<Container css={{width: "40px", height: "40px"}}>
							<UserAvatar
								size={40}
								value={props.username}
							/>
						</Container>
						<Container className="flex flex-col gap-8">
							<Container className="flex justify-between w-full gap-2">
								<Container>
									<Container>
										<Container className="flex items-center gap-4">
											<Text>
												<ImportantText>{props.display_name}</ImportantText>
											</Text>
											{props.live && <LiveTag />}
										</Container>
									</Container>
									<p>
										<MutedText>
											<SmallText>@{props.username}</SmallText>
										</MutedText>
									</p>
								</Container>
							</Container>
							<Container className="flex flex-col gap-4">
								{props.isExpanded && (
									<p>
										<Text className="line-clamp-4">{props.bio}</Text>
									</p>
								)}
								<Container className="flex gap-4">
									<Text className="flex items-baseline gap-1">
										<ImportantText>45k</ImportantText>
										<>Followers</>
									</Text>
									<Text className="flex items-baseline gap-1">
										<ImportantText>10k</ImportantText>
										<>Subscribers</>
									</Text>
								</Container>
								{props.isPromoted && (
									<p>
										<MutedText>
											<SmallText>Promoted</SmallText>
										</MutedText>
									</p>
								)}
							</Container>
						</Container>
					</Container>
				</Container>
			</a>
		</Link>
	);
};
