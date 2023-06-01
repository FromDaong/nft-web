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
import {UserPlus} from "lucide-react";
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
	followers?: [];
	subscribers?: number;
};

export const SkeletonExpandedSuggestedCreatorCard = (props) => (
	<DynamicSkeleton config={FeaturedCreatorSkeleton} />
);

export default function CreatorCard(props: SuggestedCreatorData) {
	return <DefaultCreatorCard {...props} />;
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
					<Container className="flex justify-between w-full gap-4 px-2 py-4">
						<Container className="flex gap-2 items-start">
							<UserAvatar
								profile_pic={profilePicUrl}
								username={props.username.replaceAll(" ", "").trim()}
								size={48}
							/>
							<Container className="flex flex-col gap-2">
								{props.username && (
									<Container className="flex flex-col w-full">
										<Heading size={"xss"}>{props.display_name?.trim()}</Heading>
										<Container className="flex items-center gap-4 ">
											<Username
												username={props.username.replaceAll(" ", "").trim()}
												verified={true}
											/>
											{props.live && <LiveTag />}
										</Container>
										<Text className="mt-2">{props.bio}</Text>
									</Container>
								)}
								{props.isPromoted && (
									<Container className="flex flex-col gap-2">
										{props.isPromoted && (
											<p>
												<MutedText css={{color: "$accentText"}}>
													<SmallText>Promoted</SmallText>
												</MutedText>
											</p>
										)}
									</Container>
								)}
							</Container>
						</Container>
						<Container className="flex gap-4 px-4 h-fit">
							{profile && profile.username !== props.username && (
								<>
									{!isFollowing && (
										<Button
											appearance={"action"}
											onClick={(e) => {
												e.preventDefault();
												e.stopPropagation();
												follow();
											}}
										>
											Follow
										</Button>
									)}
									{isFollowing && (
										<Button
											appearance={"surface"}
											onClick={(e) => {
												e.preventDefault();
												e.stopPropagation();
												unfollow();
											}}
										>
											Unfollow
										</Button>
									)}
								</>
							)}
							{!profile && <Button appearance={"surface"}></Button>}
						</Container>
					</Container>
				</a>
			</Link>
		</Container>
	);
};
