import {
	ClipboardCheckIcon,
	ClipboardCopyIcon,
	LinkIcon,
	ShareIcon,
} from "@heroicons/react/outline";
import {ChevronDownIcon} from "@heroicons/react/solid";
import {ProfileDropdown} from "@packages/Dropdowns";
import {SEOHead} from "@packages/seo/page";
import NewAvatar, {AvatarGroup} from "@packages/shared/components/AvatarNew";
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
import {useCopyToClipboard} from "@packages/shared/hooks";
import ArrowUp from "@packages/shared/icons/ArrowUp";
import FollowUser from "@packages/shared/icons/FollowUser";
import {styled} from "@styles/theme";
import {useUser} from "core/auth/useUser";
import TreatCore, {ComponentBasicProps} from "core/TreatCore";
import ApplicationFrame from "./ApplicationFrame";
import useSound from "use-sound";
import Link from "next/link";
import {useState} from "react";
import axios from "axios";
import {apiEndpoint} from "@utils/index";

const AvatarContainer = styled("div", {
	borderRadius: "9999px",
	height: "96px",
	width: "96px",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	overflow: "hidden",
	backgroundColor: "$surface",
	padding: "2px",
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
		/>
	);
};

type ProfileLayoutProps = ComponentBasicProps & {
	userProfile?: {
		username: string;
		display_name: string;
		bio: string;
		following: Array<string>;
		followers: Array<string>;
		earnings: number;
		address: string;
		profile_pic?: string;
		profilePicCdnUrl?: string;
		badges: Array<{color: string; name: string}>;
		creator?: any;
	};
};

export default function ProfileLayout(props: ProfileLayoutProps) {
	const {isLoading, isConnected, profile: loggedInUser} = useUser();
	const [value, copy] = useCopyToClipboard();
	const [copyFx] = useSound("/sound/toggle_on.wav");

	const profile = props.userProfile;

	const [ownerOfUserProfile, setOwnerOfUserProfile] = useState({
		username: profile.username,
		display_name: profile ? profile.display_name : "",
		bio: profile ? profile.bio : "",
		followers: profile.followers,
		following: profile.following,
		earnings: profile.earnings ?? 0,
		address: profile ? profile.address : "",
		profile_pic: profile.profile_pic,
		creator: profile.creator,
		badges: [
			...profile.badges,
			props.userProfile.creator
				? {color: "pink", name: "Verified Creator"}
				: {color: "purple", name: "Collector"},
		],
	});

	const getSubscriptionNFTsCount = async () => {
		const res = await axios.get(
			`${apiEndpoint}/marketplace/methods/count/subscription?address=${ownerOfUserProfile.address}`
		);
		return res.data.data;
	};

	const getResaleNFTsCount = async () => {
		const res = await axios.get(
			`${apiEndpoint}/marketplace/methods/count/resale?address=${ownerOfUserProfile.address}`
		);
		return res.data.data;
	};

	const getCollectionsCount = async () => {
		const res = await axios.get(
			`${apiEndpoint}/marketplace/methods/count/collection?address=${ownerOfUserProfile.address}`
		);
		return res.data.data;
	};

	const getOwnedNFTsCount = async () => {
		const res = await axios.get(
			`${apiEndpoint}/marketplace/methods/count/owned?address=${ownerOfUserProfile.address}`
		);
		return res.data.data;
	};

	const getCreateNFTsCount = async () => {
		const res = await axios.get(
			`${apiEndpoint}/marketplace/methods/count/created?address=${ownerOfUserProfile.address}`
		);
		return res.data.data;
	};

	const getBadges = async () => {
		const res = await axios.get(
			`${apiEndpoint}/marketplace/methods/get-badges-for-address?address=${ownerOfUserProfile.address}`
		);
		return res.data.data;
	};

	// Fetch all in one batch using react query useQueries
	const [
		subscriptionNFTsCount,
		resaleNFTsCount,
		collectionsCount,
		ownedNFTsCount,
		badges,
		createdNFTsCount,
	] = TreatCore.useQueries({
		queries: [
			{
				queryKey: ["subscriptionNFTsCount", ownerOfUserProfile.address],
				queryFn: getSubscriptionNFTsCount,
			},
			{
				queryKey: ["resaleNFTsCount", ownerOfUserProfile.address],
				queryFn: getResaleNFTsCount,
			},
			{
				queryKey: ["collectionsCount", ownerOfUserProfile.address],
				queryFn: getCollectionsCount,
			},
			{
				queryKey: ["ownedNFTsCount", ownerOfUserProfile.address],
				queryFn: getOwnedNFTsCount,
			},
			{
				queryKey: ["badges", ownerOfUserProfile.address],
				queryFn: getBadges,
			},
			{
				queryKey: ["createNFTsCount", ownerOfUserProfile.address],
				queryFn: getCreateNFTsCount,
			},
		],
	});

	const creator_tabs = [
		{
			label: "Subscription",
			href: "",
			count: subscriptionNFTsCount.data,
		},
		{
			label: "Collections",
			href: "/collections",
			count: collectionsCount.data,
		},
		{
			label: "Sweetshop",
			href: "/sweetshop",
			count: createdNFTsCount.data,
		},
		{
			label: "Listed",
			href: "/listed",
			count: resaleNFTsCount.data,
		},

		{
			label: "Owned",
			href: "/portfolio",
			count: ownedNFTsCount.data,
		},
		/*{
    label: "Curated",
    href: "/curated",
  },*/
	];

	const profile_tabs = [
		{
			label: "Collections",
			href: "/collections",
			count: collectionsCount.data,
		},
		{
			label: "Sweetshop",
			href: "/listed",
			count: resaleNFTsCount.data,
		},
		{
			label: "Owned",
			href: "/portfolio",
			count: ownedNFTsCount.data,
		},
	];

	console.log({
		subscriptionNFTsCount,
		resaleNFTsCount,
		collectionsCount,
		ownedNFTsCount,
		badges,
	});

	const [followers, setFollowers] = useState(profile.followers);

	const copyProfileUrlToClipboard = () => {
		// Get base domain
		const baseDomain = window.location.origin;
		copy(`${baseDomain}/${ownerOfUserProfile.username}`);
		copyFx();
	};

	const followOrUnfollow = () => {
		if (followers.includes(loggedInUser._id)) {
			setFollowers(followers.filter((id) => id !== loggedInUser._id));

			axios
				.post(`${apiEndpoint}/profile/${profile?.username}/unfollow`)
				.catch((err) => {
					console.log({err});
					setFollowers(followers.concat(loggedInUser._id));
				});
		}

		if (!followers.includes(loggedInUser._id)) {
			setFollowers(followers.concat(loggedInUser._id));
			axios
				.post(`${apiEndpoint}/profile/${profile?.username}/follow`)
				.catch((err) => {
					console.log({err});
					setFollowers(followers.filter((id) => id !== loggedInUser._id));
				});
		}
	};

	const isFollowing = followers.includes(loggedInUser?._id);

	return (
		<>
			<SEOHead title={profile?.username + " - Trit"} />

			{
				// <UserHeader profile_pic={user.profile_pic} />
			}

			<Container className="container mx-auto py-8 px-4 xl:px-0">
				<FluidContainer className="flex justify-between px-4">
					<ContextualContainer className="grid col-span-1 xl:grid-cols-3 justify-between w-full gap-y-4">
						<Container className="col-span-1 xl:col-span-2">
							<Container className="flex gap-8">
								<AvatarContainer
									className="drop-shadow-sm border"
									css={{borderColor: "$subtleBorder", padding: "4px"}}
								>
									<NewAvatar
										username="Tatenda Chris"
										imageSrc={ownerOfUserProfile.profile_pic}
										size_def={{width: "100%", height: "100%"}}
									/>
								</AvatarContainer>

								<Container className="flex flex-col gap-1">
									<Container>
										<Heading
											size="sm"
											className="flex items-center gap-1"
										>
											<span>
												{ownerOfUserProfile.display_name ??
													"Loading profile details"}
											</span>
											<VerifiedBadge size={16} />
										</Heading>
										<MutedText>@{ownerOfUserProfile.username}</MutedText>
									</Container>
									<Container className="flex gap-4 flex-row flex-wrap rounded-full mt-2">
										{ownerOfUserProfile.badges?.map((badge) => (
											<Container
												key={badge.name}
												css={{backgroundColor: `$${badge.color}2`}}
												className="px-3 py-1 rounded-xl"
											>
												<Text css={{color: `$${badge.color}10`}}>
													<ImportantText>
														<SmallText>{badge.name}</SmallText>
													</ImportantText>
												</Text>
											</Container>
										))}
									</Container>
									<Text className="mt-2 max-w-2xl">
										{ownerOfUserProfile.bio ?? "Loading profile details"}
									</Text>
									<Container className="flex w-full mb-4 mt-2">
										<>
											<Text
												appearance={"hiContrast"}
												weight={"bold"}
											>
												{ownerOfUserProfile.following.length}
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
												{followers.length}
											</Text>
											<JustifiedSpan>Followers</JustifiedSpan>
										</>
									</Container>
								</Container>
							</Container>
						</Container>

						<Container className="h-fit xl:justify-end flex">
							<Container className="flex h-auto relative">
								<Container className="flex gap-x-4 h-fit">
									{!isLoading &&
										loggedInUser &&
										loggedInUser.address !== ownerOfUserProfile.address && (
											<Button
												onClick={followOrUnfollow}
												className="focus:scale-110"
												appearance={isFollowing ? "surface" : "action"}
											>
												{isFollowing ? (
													"Unfollow"
												) : (
													<>
														<span>Follow</span>
														<FollowUser />
													</>
												)}
											</Button>
										)}
									<Link
										href={`https://bscscan.com/address/${ownerOfUserProfile.address}`}
									>
										<a
											target={"_blank"}
											rel={"noopener"}
										>
											<Button
												appearance={"surface"}
												className="hover:scale-105 transition-transform duration-100"
											>
												<span>View on Bscscan</span>
												<LinkIcon
													width={16}
													height={16}
												/>
											</Button>
										</a>
									</Link>
									<Button
										onClick={copyProfileUrlToClipboard}
										appearance={"surface"}
										className="hover:scale-105 transition-transform duration-100"
									>
										<span>Copy profile link</span>
										{!value && (
											<ClipboardCopyIcon
												width={16}
												height={16}
											/>
										)}
										{value && (
											<ClipboardCheckIcon
												width={16}
												height={16}
											/>
										)}
									</Button>
								</Container>
							</Container>
						</Container>
					</ContextualContainer>
				</FluidContainer>

				<FluidContainer
					justified
					className="flex py-8"
				>
					<TabsContainer>
						{(ownerOfUserProfile?.creator ? creator_tabs : profile_tabs).map(
							(tab) => (
								<Tab
									key={tab.href}
									href={`/${ownerOfUserProfile.username}${tab.href}`}
									label={tab.label}
									count={tab.count}
								/>
							)
						)}
					</TabsContainer>
				</FluidContainer>
			</Container>
			<ApplicationFrame>{props.children}</ApplicationFrame>
		</>
	);
}
