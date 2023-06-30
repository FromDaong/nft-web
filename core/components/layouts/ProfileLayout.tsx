import {BriefcaseIcon, HomeIcon, UserGroupIcon} from "@heroicons/react/outline";
import {SEOHead} from "@packages/seo/page";
import NewAvatar from "@packages/shared/components/AvatarNew";
import {Button} from "@packages/shared/components/Button";
import {
	Container,
	ContextualContainer,
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
import {useCopyToClipboard, useStorageService} from "@packages/shared/hooks";
import FollowUser from "@packages/shared/icons/FollowUser";
import {useUser} from "core/auth/useUser";
import TreatCore, {ComponentBasicProps} from "core/TreatCore";
import ApplicationFrame from "./ApplicationFrame";
import useSound from "use-sound";
import Link from "next/link";
import {MutableRefObject, useEffect, useMemo, useState} from "react";
import axios from "axios";
import {apiEndpoint} from "@utils/index";
import {SocialProfileJsonLd} from "next-seo";
import {useRouter} from "next/router";
import {contractAddresses} from "@packages/treat/lib/treat-contracts-constants";
import {useBalance} from "wagmi";
import {ExternalLinkIcon} from "@radix-ui/react-icons";
import {
	CameraIcon,
	CircleSlash,
	LucideShoppingBag,
	ShoppingBagIcon,
	Verified,
} from "lucide-react";
import ApplicationLayout from "./ApplicationLayout";
import {Divider} from "@packages/shared/components/Divider";
import {toast} from "sonner";
import {FrostyBackgroundContainer} from "@components/NFTCard/misc/FrostyBackground";
import Spinner from "@packages/shared/icons/Spinner";

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
	scrollerRef?: MutableRefObject<any>;
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
			label: "Sweetshop NFTs",
			href: ``,
			icon: <LucideShoppingBag className="w-5 h-5" />,
		},

		{
			label: "Resale",
			href: "/resale",
			icon: <UserGroupIcon className="w-5 h-5" />,
		},
		{
			label: "Collected",
			href: "/portfolio",
			icon: <BriefcaseIcon className="w-5 h-5" />,
		},
	];

	const profile_tabs = [
		{
			label: "Collected",
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
						color: "orange",
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
						color: "mint",
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
		<ApplicationLayout thisRef={props.scrollerRef}>
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

			<CoverPhoto banner={ownerOfUserProfile?.banner_pic} />

			<Container className="mb-4">
				<ApplicationFrame>
					<ContextualContainer className="grid w-full col-span-1 px-2 xl:grid-cols-3 gap-y-4">
						<Container className="flex flex-col col-span-1 gap-4 xl:col-span-2">
							<Container className="flex items-center gap-4">
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
											borderColor: `$${badge.color}5`,
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
				</ApplicationFrame>
			</Container>
			<Container
				className="mx-auto container max-w-[95vw] lg:max-w-screen-xl w-full"
				css={{
					backgroundColor: "$surface",
					overflowX: "auto",
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
			</Container>
			<Divider />
			<ApplicationFrame>
				<Container className="px-2 pt-4 pb-24">{props.children}</Container>
			</ApplicationFrame>
		</ApplicationLayout>
	);
}

const useUpdateCoverPhoto = (banner_pic) => {
	const [bannerPic, setBannerPic] = useState(banner_pic);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const {uploadToIPFS} = useStorageService();

	const updateCoverPhoto = async (file: File) => {
		setIsLoading(true);
		//const formData = new FormData();
		//formData.append("cover_photo", file);

		// upload to ipfs

		try {
			const ipfs = await uploadToIPFS(file);
			const res = await axios.post(`${apiEndpoint}/profile/methods/patch`, {
				banner_pic: ipfs,
			});
			if (res.status === 200) {
				setBannerPic(ipfs);
				setIsLoading(false);
				return;
			}
			throw "Failed to update";
		} catch (e) {
			console.error(e);
			toast.error("Failed to update cover photo");
		} finally {
			setIsLoading(false);
		}
	};

	return {
		isLoading,
		updateCoverPhoto,
		bannerPic,
	};
};

function CoverPhoto({banner}) {
	const router = useRouter();
	const {profile} = useUser();

	const {
		isLoading: isLoadingCover,
		updateCoverPhoto,
		bannerPic,
	} = useUpdateCoverPhoto(banner);

	const isMine = useMemo(
		() => profile?.username === router.query.username,
		[router.query, profile]
	);
	return (
		<Container
			className="w-full h-[320px] rounded-b-xl relative"
			css={{
				backgroundImage: `url("${bannerPic}")`,
				backgroundPosition: "center",
				backgroundRepeat: "no-repeat",
				backgroundSize: "cover",
				backgroundColor: "$surfaceOnSurface",
			}}
		>
			{isMine && (
				<form
					className="absolute bottom-4 right-4"
					onSubmit={null}
				>
					<label
						className="cursor-pointer"
						htmlFor="cover_photo"
					>
						<FrostyBackgroundContainer
							css={{borderRadius: 999, padding: "1rem"}}
							className="flex items-center justify-center gap-2 transition-all duration-200"
						>
							{!isLoadingCover ? (
								<>
									<CameraIcon className="w-5 h-5" />
									Change cover
								</>
							) : (
								<Text>
									<Spinner />
								</Text>
							)}
						</FrostyBackgroundContainer>
					</label>
					<input
						name={"cover_photo"}
						type="file"
						id="cover_photo"
						hidden
						onChange={(e) => updateCoverPhoto(e.target.files[0])}
					/>
				</form>
			)}
		</Container>
	);
}
