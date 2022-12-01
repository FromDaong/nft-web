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

type SuggestedCreatorData = {
	username: string;
	display_name: string;
	avatar: string;
	isPromoted?: boolean;
	isExpanded?: boolean;
	bio: string;
	noFollowButton?: boolean;
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
		<Link href={`/${props.username}`}>
			<a>
				<Container className="flex justify-between w-full">
					<Container className="flex gap-4">
						<Link href={props.username}>
							<a>
								<UserAvatar
									size={40}
									value={props.username}
								/>
							</a>
						</Link>
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
					{!props.noFollowButton && (
						<Container>
							<Button>Follow</Button>
						</Container>
					)}
				</Container>
			</a>
		</Link>
	);
};

const ExpandSuggestedCreatorCard = (props: SuggestedCreatorData) => {
	return (
		<Container>
			<Container className="flex justify-between w-full gap-4">
				<Container css={{width: "40px", height: "40px"}}>
					<UserAvatar
						size={40}
						value={props.username}
					/>
				</Container>
				<Container className="flex flex-col gap-2">
					<Container className="flex justify-between w-full gap-2">
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
						{props.noFollowButton && (
							<Container>
								<Button>Follow</Button>
							</Container>
						)}
					</Container>
					<Container>
						{props.isExpanded && (
							<p>
								<Text className="line-clamp-2">{props.bio}</Text>
							</p>
						)}
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
	);
};
