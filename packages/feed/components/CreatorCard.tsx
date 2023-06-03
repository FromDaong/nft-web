import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {
	ImportantText,
	MutedText,
	SmallText,
	Text,
} from "@packages/shared/components/Typography/Text";
import DynamicSkeleton from "@packages/skeleton";
import {FeaturedCreatorSkeleton} from "@packages/skeleton/config";
import Link from "next/link";
import LiveTag from "./LiveTag";
import {UserIcon, UserPlus} from "lucide-react";
import Avvvatars from "avvvatars-react";
import Username from "./Username";
import {useFollow} from "@packages/hooks/useFollow";
import {useUser} from "core/auth/useUser";
import UserAvatar from "core/auth/components/Avatar";
import {Heading} from "@packages/shared/components/Typography/Headings";

type SuggestedCreatorData = {
	username: string;
	display_name: string;
	avatar: string;
	isPromoted?: boolean;
	isExpanded?: boolean;
	border?: boolean;
	live?: boolean;
	noFollowButton?: boolean;
	bio: string;
	noBg?: boolean;
	followers?: any[];
	subscribers?: number;
	variant?: "compact" | "default";
};

export const SkeletonExpandedSuggestedCreatorCard = (props) => (
	<DynamicSkeleton config={FeaturedCreatorSkeleton} />
);

export default function CreatorCard(props: SuggestedCreatorData) {
	switch (props.variant) {
		case "compact":
			return <CompactCreatorCard {...props} />;
		default:
			return <DefaultCreatorCard {...props} />;
	}
}

const DefaultCreatorCard = (props: SuggestedCreatorData) => {
	// T-83 Some profile pics not loading. Use base treatnfts.com - media endpoint /api/v3/media/
	const profilePicUrl = props.avatar;
	const {profile} = useUser();
	console.log({props});
	const {follow, isFollowing, unfollow} = useFollow(
		profile?._id,
		props.username,
		props.followers
	);

	return (
		<Container
			css={{
				borderRadius: "8px",
				height: "100%",
				"&:hover": {
					backgroundColor: "$elementOnSurface",
				},
			}}
			className="overflow-hidden transition-colors duration-200 ease-in-out"
		>
			<Link href={`/${props.username}`}>
				<a>
					<Container className="flex gap-2 items-start px-2 py-4">
						<Container>
							<UserAvatar
								profile_pic={profilePicUrl}
								username={props.username.replaceAll(" ", "").trim()}
								size={48}
							/>
						</Container>
						<Container className="flex flex-col w-full">
							<Container className="flex justify-between items-center gap-4 w-full">
								<Container>
									<Heading size={"xss"}>{props.display_name?.trim()}</Heading>
									<Username
										username={props.username.replaceAll(" ", "").trim()}
										verified={true}
									/>
								</Container>
								<Container className="flex gap-4 px-4 h-fit">
									{profile && profile.username !== props.username && (
										<>
											<Button
												size={"sm"}
												appearance={isFollowing ? "surface" : "action"}
												onClick={(e) => {
													e.preventDefault();
													e.stopPropagation();
													if (isFollowing) {
														follow();
													} else {
														unfollow();
													}
												}}
											>
												{isFollowing ? "Unfollow" : "Follow"}
											</Button>
										</>
									)}
									{!profile && <Button appearance={"surface"}></Button>}
								</Container>
							</Container>
							<Text className="mt-2">{props.bio}</Text>
						</Container>
					</Container>
				</a>
			</Link>
		</Container>
	);
};

const CompactCreatorCard = (props: SuggestedCreatorData) => {
	// T-83 Some profile pics not loading. Use base treatnfts.com - media endpoint /api/v3/media/
	const profilePicUrl = props.avatar;
	const {profile} = useUser();
	console.log({props});
	const {follow, isFollowing, unfollow} = useFollow(
		profile?._id,
		props.username,
		props.followers
	);

	return (
		<Container
			css={{
				borderRadius: "8px",
				height: "100%",
				"&:hover": {
					backgroundColor: "$elementOnSurface",
				},
			}}
			className="overflow-hidden transition-colors duration-200 ease-in-out"
		>
			<Link href={`/${props.username}`}>
				<a>
					<Container className="flex gap-2 items-start px-2 py-4">
						<Container>
							<UserAvatar
								profile_pic={profilePicUrl}
								username={props.username.replaceAll(" ", "").trim()}
								size={48}
							/>
						</Container>
						<Container className="flex flex-col w-full">
							<Container className="flex justify-between items-center gap-4 w-full">
								<Container>
									<Heading size={"xss"}>{props.display_name?.trim()}</Heading>
									<Username
										username={props.username.replaceAll(" ", "").trim()}
										verified={true}
									/>
									<Text className="mt-2 flex gap-2 items-center">
										{isFollowing && (
											<>
												<UserIcon className="w-4 h-4" /> Following
											</>
										)}
									</Text>
								</Container>
							</Container>
						</Container>
					</Container>
				</a>
			</Link>
		</Container>
	);
};
