import {
	BriefcaseIcon,
	CollectionIcon,
	HomeIcon,
	UserGroupIcon,
} from "@heroicons/react/outline";
import {SEOHead} from "@packages/seo/page";
import NewAvatar from "@packages/shared/components/AvatarNew";
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
	ImportantText,
	JustifiedSpan,
	MutedText,
	SmallText,
} from "@packages/shared/components/Typography/Text";
import {useCopyToClipboard} from "@packages/shared/hooks";
import FollowUser from "@packages/shared/icons/FollowUser";
import {useUser} from "core/auth/useUser";
import TreatCore, {ComponentBasicProps} from "core/TreatCore";
import ApplicationFrame from "./ApplicationFrame";
import useSound from "use-sound";
import Link from "next/link";
import {useEffect, useState} from "react";
import axios from "axios";
import {apiEndpoint} from "@utils/index";
import {SocialProfileJsonLd} from "next-seo";
import {useRouter} from "next/router";
import {contractAddresses} from "@packages/treat/lib/treat-contracts-constants";
import {useBalance} from "wagmi";
import {ExternalLinkIcon} from "@radix-ui/react-icons";
import Spinner from "@packages/shared/icons/Spinner";
import {ShoppingBagIcon, Verified} from "lucide-react";
import ApplicationLayout from "./ApplicationLayout";

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
		banner_pic: string;
		profilePicCdnUrl?: string;
		badges: Array<{color: string; name: string}>;
		creator?: any;
	};
};

export default function ProfileLayout(props: ProfileLayoutProps) {
	const {isLoading, profile: loggedInUser} = useUser();
	const [, copy] = useCopyToClipboard();
	const [copyFx] = useSound("/sound/toggle_on.wav");
	const router = useRouter();

	const profile = props.userProfile;

	const [openingMessages, setOpeningMessages] = useState(false);

	const [ownerOfUserProfile] = useState({
		username: profile.username,
		display_name: profile ? profile.display_name : "",
		bio: profile ? profile.bio : "",
		followers: profile.followers,
		following: profile.following,
		earnings: profile.earnings ?? 0,
		address: profile ? profile.address : "",
		profile_pic: profile.profile_pic,
		banner_pic: profile.banner_pic,
		creator: profile.creator,
		badges: [
			...profile.badges,
			(props.userProfile.creator || props.userProfile.creator?.approved) &&
			!props.userProfile.creator?.pending
				? {color: "pink", name: "Verified Creator 🎀"}
				: {color: "purple", name: "Collector"},
		],
	});

	const [userBadges, setBadges] = useState(ownerOfUserProfile.badges);
	const {data: treatBalance, isLoading: isBalanceLoading} = useBalance({
		addressOrName: ownerOfUserProfile.address,
		token: contractAddresses.treatToken[56],
	});

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
	const [ownedNFTsCount, _, createNFTsCount] = TreatCore.useQueries({
		queries: [
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
			label: "Home",
			href: "",
			icon: <HomeIcon className="w-5 h-5" />,
		},
		{
			label: "Marketplace",
			href: "/listings",
			icon: <ShoppingBagIcon className="w-5 h-5" />,
		},
		{
			label: "Resale",
			href: "/resale",
			icon: <UserGroupIcon className="w-5 h-5" />,
		},
		{
			label: "Collections",
			href: "/collections",
			icon: <CollectionIcon className="w-5 h-5" />,
		},
		{
			label: "Owned",
			href: "/portfolio",
			icon: <BriefcaseIcon className="w-5 h-5" />,
		},
	];

	const profile_tabs = [
		{
			label: "Owned",
			href: "/portfolio",
			icon: <BriefcaseIcon className="w-5 h-5" />,
		},
		{
			label: "Resale",
			href: "/resale",
			icon: <UserGroupIcon className="w-5 h-5" />,
		},
	];

	const [followers, setFollowers] = useState(profile.followers);

	const copyProfileUrlToClipboard = () => {
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

	const createChatIfNotExist = () => {
		setOpeningMessages(true);
		console.log({loggedInUser});
		axios
			.get(`${apiEndpoint}/chat/username/${ownerOfUserProfile.username}`)
			.then((res) => {
				router.push(`/messages/${res.data.data.id}`);
			})
			.catch((err) => {
				console.log({err});
				setOpeningMessages(false);
			});
	};

	const isFollowing = followers.includes(loggedInUser?._id);

	useEffect(() => {
		if (ownedNFTsCount.data) {
			if (
				userBadges.find(
					(badge) =>
						badge.name === "Diamond Treator" ||
						badge.name === "Gold Treator" ||
						badge.name === "Silver Treator"
				)
			)
				return;
			if (ownedNFTsCount.data > 250) {
				setBadges([
					...userBadges,
					{
						color: "blue",
						name: "Diamond Treator",
					},
				]);

				return;
			}

			if (ownedNFTsCount.data > 100) {
				setBadges([
					...userBadges,
					{
						color: "amber",
						name: "Gold Treator",
					},
				]);

				return;
			}

			if (ownedNFTsCount.data > 50) {
				setBadges([
					...userBadges,
					{
						color: "sand",
						name: "Silver Treator",
					},
				]);

				return;
			}
		}
	}, [ownedNFTsCount.data]);

	useEffect(() => {
		if (treatBalance) {
			if (
				userBadges.find(
					(badge) => badge.name === "Melon" || badge.name === "Hodlr"
				)
			)
				return;
			if (parseInt(treatBalance?.formatted) > 73400) {
				setBadges([
					...userBadges,
					{
						color: "teal",
						name: "Melon",
					},
				]);

				return;
			}

			if (parseInt(treatBalance?.formatted) > 36700) {
				setBadges([
					...userBadges,
					{
						color: "red",
						name: "Hodlr",
					},
				]);

				return;
			}
		}
	}, [treatBalance]);

	return (
		<ApplicationLayout>
			<SEOHead
				title={ownerOfUserProfile?.username + " - TreatDAO"}
				description={ownerOfUserProfile?.bio}
				type={"profile"}
				data={{
					bio: ownerOfUserProfile.bio,
					username: ownerOfUserProfile.username,
					display_name: ownerOfUserProfile.display_name ?? "TreatDAO Profile",
					profile_picture: ownerOfUserProfile.profile_pic,
					banner_pic: ownerOfUserProfile.banner_pic,
				}}
			/>
			<SocialProfileJsonLd
				type="Person"
				name={ownerOfUserProfile?.username}
				url={`https://treatnfts.com/${ownerOfUserProfile?.username}`}
				sameAs={[]}
			/>

			<Container
				className="w-full h-[320px]"
				css={{
					backgroundImage: `url("${ownerOfUserProfile.banner_pic}")`,
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
					backgroundSize: "cover",
					backgroundColor: "$surfaceOnSurface",
				}}
			/>

			<Container className="py-8 pb-0 mx-auto ">
				<FluidContainer className="container flex justify-between px-4 max-w-screen-xl mx-auto">
					<ContextualContainer className="grid justify-between w-full col-span-1 xl:grid-cols-3 gap-y-4">
						<Container className="col-span-1 xl:col-span-2">
							<Container className="flex gap-4 items-center">
								<NewAvatar
									username="Tatenda Chris"
									imageSrc={ownerOfUserProfile.profile_pic}
									size={48}
								/>
								<Container className="flex flex-col gap-1">
									<Container>
										<Heading
											size="xs"
											className="flex items-center gap-1"
										>
											{ownerOfUserProfile.display_name ?? "TreatDAO Explorer"}{" "}
											{ownerOfUserProfile.creator && (
												<Text css={{color: "$primary5"}}>
													<Verified className="w-5 h-5" />
												</Text>
											)}
										</Heading>
										<MutedText>@{ownerOfUserProfile.username}</MutedText>
									</Container>
								</Container>
							</Container>
							<Text className="hidden max-w-2xl mt-2 md:flex">
								{ownerOfUserProfile.bio ?? "Loading profile details"}
							</Text>
							<Container className="flex flex-row flex-wrap gap-2 mt-2 rounded-full">
								{userBadges.map((badge) => (
									<Container
										key={badge.name}
										css={{
											backgroundColor: `$${badge.color}2`,
											borderColor: "$subtleBorder",
										}}
										className="px-4 py-1 border rounded-full shadow-sm"
									>
										<Text css={{color: `$${badge.color}10`, fontWeight: 500}}>
											<SmallText>
												<ImportantText>{badge.name}</ImportantText>
											</SmallText>
										</Text>
									</Container>
								))}
							</Container>
							<Container className="hidden w-full mt-2 mb-4 md:flex">
								<Container className="flex gap-2">
									<Text
										appearance={"hiContrast"}
										weight={"bold"}
									>
										{ownerOfUserProfile.following.length} Following
									</Text>
								</Container>
								<Bull />
								<Container className="flex gap-2">
									<Text
										appearance={"hiContrast"}
										weight={"bold"}
									>
										{followers.length} Followers
									</Text>
								</Container>
							</Container>
							<Container className="flex flex-col gap-4 md:hidden">
								<Container className="flex w-full mt-2 mb-4">
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

						<Container className="flex h-fit xl:justify-end">
							<Container className="relative flex h-auto">
								<Container className="flex flex-wrap gap-4 h-fit">
									{!isLoading &&
										loggedInUser &&
										loggedInUser.address !== ownerOfUserProfile.address && (
											<Button
												onClick={followOrUnfollow}
												className="focus:scale-110"
												appearance={isFollowing ? "subtle" : "primary"}
											>
												{isFollowing ? (
													"Unfollow"
												) : (
													<>
														<ImportantText>Follow</ImportantText>
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
												appearance={"accent"}
												className="transition-transform duration-100 hover:scale-105"
											>
												<ExternalLinkIcon
													width={16}
													height={16}
												/>
												<ImportantText>View on Bscscan</ImportantText>
											</Button>
										</a>
									</Link>
								</Container>
							</Container>
						</Container>
					</ContextualContainer>
				</FluidContainer>
			</Container>
			<FluidContainer
				justified
				className="flex sticky top-0 z-50"
				css={{
					backgroundColor: "$surface",
				}}
			>
				<TabsContainer>
					{(ownerOfUserProfile?.creator ? creator_tabs : profile_tabs).map(
						(tab) => (
							<Tab
								key={tab.href}
								href={`/${ownerOfUserProfile.username}${tab.href}`}
								label={tab.label}
								icon={tab.icon}
							/>
						)
					)}
				</TabsContainer>
			</FluidContainer>
			<ApplicationFrame>
				<Container className="px-2">{props.children}</Container>
			</ApplicationFrame>
		</ApplicationLayout>
	);
}
