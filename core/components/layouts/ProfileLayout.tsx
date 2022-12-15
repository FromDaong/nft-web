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

const followers = [
	{
		name: "kamfeskaya",
		imageSrc:
			"https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80",
	},
	{
		name: "kamfeskaya",
		imageSrc:
			"https://images.unsplash.com/photo-1511485977113-f34c92461ad9?ixlib=rb-1.2.1&w=128&h=128&dpr=2&q=80",
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
								<Button className="drop-shadow-xl">Follow</Button>
								<Button appearance={"surface"}>Share profile</Button>
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
