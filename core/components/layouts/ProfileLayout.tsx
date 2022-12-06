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
import {Tab, TabsContainer} from "@packages/shared/components/Tabs";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {
	Bull,
	JustifiedSpan,
	MutedText,
} from "@packages/shared/components/Typography/Text";
import VerifiedBadge from "@packages/shared/components/VerifiedBadge";
import {styled} from "@styles/theme";
import {apiEndpoint} from "@utils/index";
import axios from "axios";
import TreatCore, {ComponentBasicProps} from "core/TreatCore";
import {useRouter} from "next/router";
import {useEffect} from "react";

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
		label: "Collected",
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
	borderRadius: "50%",
	height: "128px",
	width: "128px",
	position: "absolute",
	bottom: "0",
	transform: "translate(36px, 36px)",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	overflow: "hidden",
	border: "8px solid $surface",
});

const UserHeader = ({profile_pic}) => {
	return (
		<div className="w-full">
			<div
				className="w-full"
				style={{
					height: "256px",
					background: "linear-gradient(220.55deg, #FFED46 0%, #FF7EC7 100%)",
				}}
			>
				<FluidContainer className="relative flex h-full">
					<AvatarContainer className="drop-shadow">
						<Avatar
							name="Tatenda Chris"
							imageSrc={profile_pic}
							size={{width: "128px", height: "128px"}}
						/>
					</AvatarContainer>
				</FluidContainer>
			</div>
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
		profile_picture?: string;
		profilePicCdnUrl?: string;
	};
};

export default function ProfileLayout(props: ProfileLayoutProps) {
	const profile = props.userProfile;
	const user = {
		username: profile.username,
		displayName: profile ? profile.display_name : "",
		bio: profile ? profile.bio : "",
		followers: profile.followers ?? 0,
		following: profile.following ?? 0,
		earnings: profile.earnings ?? 0,
		address: profile ? profile.address : "",
		profile_pic: profile
			? profile.profile_picture ?? profile.profilePicCdnUrl
			: "",
	};

	return (
		<>
			<SEOHead title={profile.username + " - Trit"} />

			<UserHeader profile_pic={user.profile_pic} />

			<FluidContainer className="mt-[26px] flex justify-between px-4">
				<ContextualContainer className="flex flex-col max-w-lg gap-y-4">
					<Container>
						<Heading
							size="sm"
							className="flex items-center gap-1"
						>
							<span>{user.displayName ?? "Loading profile details"}</span>
							<VerifiedBadge size={16} />
						</Heading>
						<MutedText>{user.username}</MutedText>
					</Container>
					<Container
						variant={"unstyled"}
						className="flex w-full"
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
						<AvatarGroup people={followers} />
					</Container>
					<Text>{user.bio ?? "Loading profile details"}</Text>
					<Container variant={"unstyled"}>
						<Container className="flex gap-x-4">
							<ProfileDropdown
								address={user.address}
								username={user.username}
							/>
							<Button className="drop-shadow-xl">Follow</Button>
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
			<FluidContainer
				justified
				className="flex flex-col mt-[26px] px-4"
			>
				{props.children}
			</FluidContainer>
		</>
	);
}
