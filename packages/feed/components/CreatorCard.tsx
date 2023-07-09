import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {
	ImportantText,
	SmallText,
	Text,
} from "@packages/shared/components/Typography/Text";
import DynamicSkeleton from "@packages/skeleton";
import {FeaturedCreatorSkeleton} from "@packages/skeleton/config";
import Link from "next/link";
import {UserIcon, Verified} from "lucide-react";
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
	variant?: "compact" | "default" | "card";
	isCreator?: boolean;
};

export const SkeletonExpandedSuggestedCreatorCard = (props) => (
	<DynamicSkeleton config={FeaturedCreatorSkeleton} />
);

export default function CreatorCard(props: SuggestedCreatorData) {
	switch (props.variant) {
		case "compact":
			return <CompactCreatorCard {...props} />;
		case "card":
			return <CardStyleCreatorCard {...props} />;
		default:
			return <DefaultCreatorCard {...props} />;
	}
}

const CardStyleCreatorCard = (props: SuggestedCreatorData) => {
	return (
		<Link href={`/${props.username}`}>
			<a className="w-full">
				<Container
					css={{
						backdropFilter: "blur(2px)",
					}}
					className=" rounded-xl overflow-hidden h-full w-full flex flex-col justify-between bg-opacity-20"
				>
					<Container className="p-8"></Container>
					<Container className="flex m-2 flex-col gap-2 bg-zinc-900/40 backdrop-blur-lg w-auto p-6 rounded-lg mix-blend-hard-light">
						<Heading
							css={{color: "#fff", marginBottom: "0"}}
							size={"xss"}
						>
							{props.display_name.trim() ? props.display_name : props.username}
						</Heading>
						<Text css={{color: "#fff", fontSize: "small"}}>
							@{props.username}
						</Text>
						<Text
							css={{fontWeight: "500", color: "#fff", marginTop: "0.5rem"}}
							className="line-clamp-4"
						>
							{props.bio.trim()
								? props.bio
								: "A creator on TreatNFTs. Follow them to see their latest NFTs and updates."}
						</Text>
					</Container>
				</Container>
			</a>
		</Link>
	);
};

const DefaultCreatorCard = (props: SuggestedCreatorData) => {
	// T-83 Some profile pics not loading. Use base treatnfts.com - media endpoint /api/v3/media/
	const profilePicUrl = props.avatar;
	const {profile} = useUser();

	const {follow, isFollowing, unfollow} = useFollow(
		profile?._id,
		props.username,
		props.followers ?? []
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
					<Container className="flex items-start gap-2 px-2 py-4">
						<Container>
							<UserAvatar
								profile_pic={profilePicUrl}
								username={props.username.replaceAll(" ", "").trim()}
								size={48}
							/>
						</Container>
						<Container className="flex flex-col w-full">
							<Container className="flex items-center justify-between w-full gap-4">
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
														unfollow();
													} else {
														follow();
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
							<Text className="mt-2 line-clamp-2">{props.bio}</Text>
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
		props.followers ?? []
	);

	return (
		<Container
			css={{
				borderRadius: "8px",
				"&:hover": {
					backgroundColor: "$elementOnSurface",
				},
			}}
			className="overflow-hidden transition-colors duration-200 ease-in-out h-fit"
		>
			<Link href={`/${props.username}`}>
				<a>
					<Container className="flex items-start gap-2 p-4">
						<Container>
							<UserAvatar
								profile_pic={profilePicUrl}
								username={props.username.replaceAll(" ", "").trim()}
								size={32}
							/>
						</Container>
						<Container className="flex flex-col w-full">
							<Container className="flex items-center justify-between w-full gap-4">
								<Container className="flex flex-col">
									<Text css={{color: "$textContrast"}}>
										<ImportantText>
											{props.display_name?.trim()
												? props.display_name?.trim()
												: props.username.replaceAll(" ", "").trim()}
											{props.isCreator && (
												<Text css={{color: "$primary5"}}>
													<Verified className="w-5 h-5" />
												</Text>
											)}
										</ImportantText>
									</Text>
									<Text>{props.username.replaceAll(" ", "").trim()}</Text>
									{isFollowing && (
										<Text>
											<SmallText className="flex items-center gap-2 mt-1">
												<>
													<UserIcon className="w-4 h-4" /> Following
												</>
											</SmallText>
										</Text>
									)}
								</Container>
							</Container>
						</Container>
					</Container>
				</a>
			</Link>
		</Container>
	);
};
