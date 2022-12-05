import {ChevronDownIcon} from "@heroicons/react/solid";
import {ProfileDropdown} from "@packages/Dropdowns";
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
import {ComponentBasicProps} from "core/TreatCore";
import {useRouter} from "next/router";
import {Pencil1Icon} from "@radix-ui/react-icons";
import EditCoverPhoto from "@packages/modals/CropPhotoModal/CropPhotoModal";
import EditProfilePhoto from "@packages/modals/CropPhotoModal/CropPhotoModal";
import {useEffect, useState} from "react";
import {useDisclosure} from "@packages/hooks";

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

const UserHeader = () => {
	const {
		isOpen: isCoverEditorOpen,
		onClose: onCoverEditorOpen,
		onOpen: onCoverEditorClose,
	} = useDisclosure();
	const {
		isOpen: isEditPhotoOpen,
		onClose: onEditPhotoOpen,
		onOpen: onEditPhotoClose,
	} = useDisclosure();

	const [coverImage, setCoverImage] = useState(null);
	const [profileImage, setProfileImage] = useState(null);

	useEffect(() => {
		if (coverImage) {
			console.log(coverImage);
			onCoverEditorOpen();
		}
	}, [coverImage]);

	useEffect(() => {
		if (profileImage) {
			console.log(profileImage);
			onEditPhotoOpen();
		}
	}, [profileImage]);

	return (
		<div className="w-full">
			<EditCoverPhoto
				isOpen={isCoverEditorOpen}
				onClose={onCoverEditorClose}
				image={coverImage}
				width={5}
				height={2}
			/>
			<EditProfilePhoto
				isOpen={isEditPhotoOpen}
				onClose={onEditPhotoClose}
				image={profileImage}
				width={1}
				height={1}
			/>
			<div
				className="w-full"
				style={{
					height: "256px",
					background: "linear-gradient(220.55deg, #FFED46 0%, #FF7EC7 100%)",
				}}
			>
				<FluidContainer className="relative flex h-full">
					<Container className="flex items-center justify-center w-full gap-1 transition-opacity duration-75 delay-75 opacity-0 bg-gray-800/20 hover:opacity-100">
						<Container
							className="flex items-center justify-center rounded-full"
							style={{
								width: "32px",
								height: "32px",
								backgroundColor: "#00000090",
								position: "relative",
							}}
						>
							<Pencil1Icon />
							<input
								type={"file"}
								style={{
									opacity: 0,
									position: "absolute",
								}}
								onChange={(e) =>
									setCoverImage(window.URL.createObjectURL(e.target.files[0]))
								}
							/>
						</Container>
					</Container>
					<AvatarContainer className="drop-shadow">
						<Avatar
							name="Tatenda Chris"
							imageSrc="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=90"
							size={{width: "128px", height: "128px"}}
						/>
					</AvatarContainer>
					<Container
						style={{
							borderRadius: "50%",
							height: "128px",
							width: "128px",
							position: "absolute",
							bottom: "0",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							overflow: "hidden",
							border: "8px solid $surface",
							left: 35,
						}}
					>
						<Container
							className="flex items-center justify-center transition-opacity duration-75 delay-75 rounded-full opacity-0 bg-gray-800/20 hover:opacity-100"
							style={{
								width: "32px",
								height: "32px",
								backgroundColor: "#00000090",
								borderColor: "$subtleBorder",
								position: "relative",
								top: 35,
							}}
						>
							<Pencil1Icon />
							<input
								type={"file"}
								style={{
									opacity: 0,
									position: "absolute",
								}}
								onChange={(e) =>
									setProfileImage(window.URL.createObjectURL(e.target.files[0]))
								}
							/>
						</Container>
					</Container>
				</FluidContainer>
			</div>
		</div>
	);
};

export default function ProfileLayout(props: ComponentBasicProps) {
	const router = useRouter();
	const query = router.query;

	const user = {
		username: query.username as string,
		displayName: "Kamfeskaya",
		bio: "Latino Artist. Author. Producer. Daddy. Hand-drawn 1:1s capturing the energy of a moment. Life is beautiful.",
		followers: 241,
		following: 245,
		earnings: 47.0,
		address: "0x0eEd1d0Aa085a1C41aDf5184FAE07025217bF44c",
	};

	return (
		<>
			<UserHeader />

<<<<<<< HEAD
			<FluidContainer className="mt-[26px] flex justify-between">
				<ContextualContainer className="flex flex-col max-w-lg px-4 gap-y-4">
=======
			<FluidContainer className="mt-[26px] flex justify-between px-4">
				<ContextualContainer className="flex flex-col max-w-lg gap-y-4">
>>>>>>> 53cc61681e2787a9d948a6e8a4d58aa3caf1e594
					<Container>
						<Heading
							size="sm"
							className="flex items-center gap-1"
						>
							<span>{user.displayName}</span>
							<VerifiedBadge size={16} />
						</Heading>
						<MutedText>@kamfeskaya</MutedText>
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
							</Text>{" "}
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
					<Text>{user.bio}</Text>
					<Container variant={"unstyled"}>
						<Container className="flex gap-x-4">
							<ProfileDropdown username={user.username} />
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
