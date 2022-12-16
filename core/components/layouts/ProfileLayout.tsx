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
import {SVG} from "@packages/shared/icons/Spinner";
import {styled} from "@styles/theme";
import TreatCore, {ComponentBasicProps} from "core/TreatCore";
import ApplicationFrame from "./ApplicationFrame";

const tabs = [
	{
		label: "Subscription Content",
		href: "",
	},

	{
		label: "Marketplace",
		href: "/nfts",
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

const ArrowUp = () => (
	<SVG
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth={1.5}
		stroke="currentColor"
		width={20}
		height={20}
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"
		/>
	</SVG>
);

const FollowUser = () => (
	<SVG
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth={1.5}
		width={18}
		height={18}
		css={{stroke: "$surface"}}
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
		/>
	</SVG>
);

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
	};
};

export default function ProfileLayout(props: ProfileLayoutProps) {
	console.log({props});
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
								<Button className="drop-shadow-xl">
									<span>Follow</span>
									<FollowUser />
								</Button>
								<Button appearance={"surface"}>
									<span>Share profile</span>
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
						{tabs.map((tab) => (
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
