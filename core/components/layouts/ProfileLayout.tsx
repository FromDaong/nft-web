import {ShareIcon} from "@heroicons/react/outline";
import {ChevronDownIcon} from "@heroicons/react/solid";
import {ProfileDropdown} from "@packages/Dropdowns";
import {SEOHead} from "@packages/seo/page";
import Avatar, {AvatarGroup} from "@packages/shared/components/AvatarNew";
import {Button} from "@packages/shared/components/Button";
import {
	Container,
	ContextualContainer,
	FluidContainer,
} from "@packages/shared/components/Container";
import CreatorBadge, {
	BriefcaseBadge,
} from "@packages/shared/components/CreatorBadget";
import {Tab, TabsContainer} from "@packages/shared/components/Tabs";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {
	Bull,
	ImportantText,
	JustifiedSpan,
	MutedText,
	SmallText,
} from "@packages/shared/components/Typography/Text";
import VerifiedBadge from "@packages/shared/components/VerifiedBadge";
import ArrowUp from "@packages/shared/icons/ArrowUp";
import FollowUser from "@packages/shared/icons/FollowUser";
import {SVG} from "@packages/shared/icons/Spinner";
import {styled} from "@styles/theme";
import {useUser} from "core/auth/useUser";
import TreatCore, {ComponentBasicProps} from "core/TreatCore";
import {useSession} from "next-auth/react";
import ApplicationFrame from "./ApplicationFrame";

const creator_tabs = [
	{
		label: "Subscription Content",
		href: "",
	},
	{
		label: "Sweetshop",
		href: "/nfts",
	},
	{
		label: "Collections",
		href: "/collections",
	},
	{
		label: "Portfolio",
		href: "/collected",
	},
	/*{
    label: "Curated",
    href: "/curated",
  },*/
];

const profile_tabs = [
	{
		label: "Portfolio",
		href: "/collected",
	},
	{
		label: "Resale Marketplace",
		href: "/nfts",
	},
];

const AvatarContainer = styled("div", {
	borderRadius: "16px",
	height: "128px",
	width: "128px",
	position: "absolute",
	bottom: "0",
	transform: "translateY(36px)",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	overflow: "hidden",
	border: "8px solid $surface",
	backgroundColor: "$surface",
	padding: "8px",
});

const UserHeader = ({profile_pic}) => {
	return (
		<div
			className="w-full"
			style={{
				height: "360px",
				background: "linear-gradient(220.55deg, #FFED46 0%, #FF7EC7 100%)",
				display: "flex",
			}}
		>
			<Container className="relative flex h-full container mx-auto">
				<AvatarContainer className="drop-shadow">
					<Avatar
						name="Tatenda Chris"
						imageSrc={profile_pic}
						size={{width: "100%", height: "100%"}}
					/>
				</AvatarContainer>
			</Container>
		</div>
	);
};

type ProfileLayoutProps = ComponentBasicProps & {
	userProfile?: {
		username: string;
		display_name: string;
		bio: string;
		following: number;
		followers: number;
		earnings: number;
		address: string;
		profile_pic?: string;
		profilePicCdnUrl?: string;
		badges: Array<{color: string; name: string}>;
		creator?: any;
	};
};

export default function ProfileLayout(props: ProfileLayoutProps) {
	const {data: session} = useSession();
	const {isLoading, isConnected, profile: userProfile} = useUser();

	const profile = props.userProfile;
	const user = {
		username: profile.username,
		displayName: profile ? profile.display_name : "",
		bio: profile ? profile.bio : "",
		followers: profile.followers ?? 0,
		following: profile.following ?? 0,
		earnings: profile.earnings ?? 0,
		address: profile ? profile.address : "",
		profile_pic: profile.profile_pic,
		creator: profile.creator,
	};

	return (
		<>
			<SEOHead title={profile.username + " - Trit"} />

			<UserHeader profile_pic={user.profile_pic} />

			<Container className="container mx-auto py-8 px-4 xl:px-0">
				<FluidContainer className="mt-[26px] flex justify-between px-4">
					<ContextualContainer className="flex flex-col max-w-2xl gap-y-4">
						<Container className="flex flex-col gap-1">
							<Container>
								<Heading
									size="sm"
									className="flex items-center gap-1"
								>
									<span>{user.displayName ?? "Loading profile details"}</span>
									<VerifiedBadge size={16} />
								</Heading>
								<MutedText>@{user.username}</MutedText>
							</Container>
							<Container className="flex gap-4 items-center mt-2">
								<Text className="flex gap-1 items-center">
									<CreatorBadge />
									<ImportantText>Verified Creator</ImportantText>
								</Text>
								<Text className="h-full">&bull;</Text>
								<Text className="flex gap-1 items-center">
									<BriefcaseBadge />
									<ImportantText>TreatDAO Team</ImportantText>
								</Text>
							</Container>
							<Text className="mt-2">
								{user.bio ?? "Loading profile details"}
							</Text>
						</Container>
						<Container className="flex gap-4 flex-row flex-wrap">
							{props.userProfile.badges?.map((badge) => (
								<Container
									key={badge.name}
									css={{backgroundColor: `$${badge.color}3`}}
									className="px-2 py-1 rounded-xl"
								>
									<Text css={{color: `$${badge.color}10`}}>
										<ImportantText>
											<SmallText>{badge.name}</SmallText>
										</ImportantText>
									</Text>
								</Container>
							))}
						</Container>
						<Container
							variant={"unstyled"}
							className="flex w-full mb-4"
						>
							<>
								<Text
									appearance={"hiContrast"}
									weight={"bold"}
								>
									{user.following}
								</Text>
								{""}
								<JustifiedSpan>Following</JustifiedSpan>
							</>
							<Bull />
							<>
								<Text
									appearance={"hiContrast"}
									weight={"bold"}
								>
									{user.followers}
								</Text>
								<JustifiedSpan>Followers</JustifiedSpan>
							</>
							<Bull />

							<>
								<Text
									appearance={"hiContrast"}
									weight={"bold"}
								>
									{user.earnings}
								</Text>
								<JustifiedSpan>Collectors</JustifiedSpan>
							</>
						</Container>
						<Container variant={"unstyled"}>
							<Container className="flex gap-x-4">
								{!isLoading && userProfile.address !== user.address && (
									<Button>
										<span>Follow</span>
										<FollowUser />
									</Button>
								)}
								<Button appearance={"surface"}>
									<span>Copy profile link</span>
									<ArrowUp />
								</Button>
							</Container>
						</Container>
					</ContextualContainer>
				</FluidContainer>

				<FluidContainer
					justified
					className="flex mt-[26px]"
				>
					<TabsContainer>
						{(user?.creator ? creator_tabs : profile_tabs).map((tab) => (
							<Tab
								key={tab.href}
								href={`/${user.username}${tab.href}`}
								label={tab.label}
							/>
						))}
					</TabsContainer>
				</FluidContainer>
			</Container>
			<ApplicationFrame>{props.children}</ApplicationFrame>
		</>
	);
}
