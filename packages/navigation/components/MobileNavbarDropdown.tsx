import Link from "next/link";

import {NavDropdownContainer} from "./DropdownContainer";
import {
	BoldLink,
	ImportantText,
	Text,
} from "@packages/shared/components/Typography/Text";
import {Container} from "@packages/shared/components/Container";
import {useAccountModal, useConnectModal} from "@rainbow-me/rainbowkit";
import {
	ArrowRightIcon,
	DotsVerticalIcon,
	XIcon,
} from "@heroicons/react/outline";
import {Button} from "@packages/shared/components/Button";
import {useDisclosure} from "@packages/hooks";
import BecomeCreatorModal from "@packages/onboarding/BecomeCreatorModal";
import ThemeSwitcherModal from "@packages/theme/ThemeSwitcherModal";
import {Heading} from "@packages/shared/components/Typography/Headings";
import {Divider} from "@packages/shared/components/Divider";
import {useUser} from "core/auth/useUser";
import NewAvatar from "@packages/shared/components/AvatarNew";
import {useRouter} from "next/router";
import {useEffect} from "react";
import {
	PlusIcon,
	Settings,
	SunMoonIcon,
	ThermometerIcon,
	UserIcon,
	WalletIcon,
} from "lucide-react";
import {DashboardIcon} from "@radix-ui/react-icons";

const ExploreDropdownLinks = [
	{
		label: "Sweetshop",
		link: "/sweetshop",
	},
	{
		label: "Creators",
		link: "/creators",
	},
	{
		label: "Magazine",
		link: "/magazine",
	},
	// {
	//	 label: "Farm",
	//	 link: "https://treatdao.com/farms",
	// },
	{
		label: "Buy Crypto",
		link: "/dex/ramp",
	},
];
// dec to binary

const MobileNavbarDropdown = (props: {isConnected: boolean}) => {
	const {openAccountModal} = useAccountModal();
	const {openConnectModal} = useConnectModal();
	const {profile, creator, isLoading} = useUser();
	const router = useRouter();

	const {isOpen, onClose, onOpen} = useDisclosure();
	const {
		isOpen: menuOpen,
		onClose: onMenuClose,
		onOpen: onMenuOpen,
	} = useDisclosure();

	const {isOpen: upgradeToCreatorIsOpen, onClose: onCloseUpgradeToCreator} =
		useDisclosure();

	useEffect(() => {
		onMenuClose();
	}, [router.pathname]);

	return (
		<Container>
			<Button
				appearance={"surface"}
				css={{padding: "8px", borderRadius: "9999px"}}
				onClick={onMenuOpen}
			>
				<DotsVerticalIcon
					width={20}
					height={20}
				/>
			</Button>
			{menuOpen && (
				<Container className="relative px-4">
					<Container className="flex justify-end">
						<Button css={{padding: "8px"}}>
							<XIcon
								width={20}
								height={20}
							/>
						</Button>
					</Container>
					<NavDropdownContainer
						css={{zIndex: 9999, width: "100vw !important"}}
						className="fixed top-0 left-0 w-screen h-screen"
					>
						{!props.isConnected && (
							<Container className="relative top-0 left-0 w-full p-8 h-w-full">
								<Container className="absolute flex justify-end right-8 top-8">
									<Button
										className="flex items-center"
										appearance={"subtle"}
										onClick={onMenuClose}
										css={{padding: "8px", borderRadius: "9999px"}}
									>
										<XIcon
											width={20}
											height={20}
										/>
									</Button>
								</Container>
								<Container className="flex flex-col h-full gap-24 py-12">
									<Container className="flex flex-col gap-2">
										{ExploreDropdownLinks.map((link) => (
											<Link
												key={link.link}
												href={link.link}
											>
												<a className="flex items-center justify-between">
													<Container
														onClick={onClose}
														className="flex items-center gap-8 py-4"
													>
														<Text>
															<ImportantText> {link.label}</ImportantText>
														</Text>
													</Container>
													<ArrowRightIcon className="w-5 h-5" />
												</a>
											</Link>
										))}
									</Container>
									<Button
										css={{padding: "16px"}}
										fullWidth
										onClick={openConnectModal}
									>
										Login with wallet
									</Button>
								</Container>
							</Container>
						)}
						{props.isConnected && !isLoading && (
							<Container className="relative flex flex-col gap-4 p-4 py-8">
								<Container className="absolute flex justify-end right-4 top-4">
									<Button
										className="flex items-center"
										appearance={"surface"}
										onClick={onMenuClose}
										css={{padding: "8px", borderRadius: "9999px"}}
									>
										<XIcon
											width={20}
											height={20}
										/>
									</Button>
								</Container>
								<ThemeSwitcherModal
									isOpen={isOpen}
									onClose={onClose}
								/>
								<BecomeCreatorModal
									isOpen={upgradeToCreatorIsOpen}
									onClose={onCloseUpgradeToCreator}
								/>
								<Container className="flex flex-col w-full gap-4">
									<NewAvatar
										username={profile?.username}
										imageSrc={profile.profile_pic}
										size={80}
									/>
									<Container>
										<Heading size="xs">{profile?.display_name}</Heading>
										<Text>@{profile?.username}</Text>
									</Container>
									<Container className="flex gap-4">
										<Button
											className="w-full"
											onClick={openAccountModal}
											appearance={"surface"}
											fullWidth
										>
											<WalletIcon className="w-5 h-5" />
											Wallet
										</Button>
										{creator && !creator?.pending && (
											<Link href={"/create"}>
												<a>
													<Button
														className="w-full"
														onClick={openAccountModal}
														fullWidth
													>
														<PlusIcon className="w-5 h-5" /> Create
													</Button>
												</a>
											</Link>
										)}
									</Container>
								</Container>
								<Container className="py-1">
									<Link href={`/studio`}>
										<a>
											<Container
												onClick={onClose}
												className="flex items-center justify-between p-2 rounded-xl hover:cursor-pointer"
											>
												<div className="flex items-center gap-4">
													<Text className="p-2 rounded-full">
														<DashboardIcon className="w-5 h-5" />
													</Text>
													<BoldLink>Dashboard</BoldLink>
												</div>
											</Container>
										</a>
									</Link>
									<Link href={`/${profile?.username}`}>
										<a>
											<Container
												onClick={onClose}
												className="flex items-center justify-between p-2 rounded-xl hover:cursor-pointer"
											>
												<div className="flex items-center gap-4">
													<Text className="p-2 rounded-full">
														<UserIcon className="w-5 h-5" />
													</Text>
													<BoldLink>Profile</BoldLink>
												</div>
											</Container>
										</a>
									</Link>
									{!isLoading && !creator && (
										<Link href={"/account/upgrade"}>
											<a>
												<Container
													onClick={onClose}
													className="flex items-center justify-between p-2 rounded-xl hover:cursor-pointer"
												>
													<div className="flex items-center gap-4">
														<Text className="p-2 rounded-full"></Text>
														<BoldLink>Become a Creator</BoldLink>
													</div>
												</Container>
											</a>
										</Link>
									)}
									<Container
										onClick={onOpen}
										className="flex items-center justify-between p-2 rounded-xl hover:cursor-pointer"
									>
										<div className="flex items-center gap-4">
											<Text className="p-2 rounded-full">
												<Settings className="w-5 h-5" />
											</Text>
											<BoldLink>Manage account</BoldLink>
										</div>
									</Container>
									<Container
										onClick={onOpen}
										className="flex items-center justify-between p-2 rounded-xl hover:cursor-pointer"
									>
										<div className="flex items-center gap-4">
											<Text className="p-2 rounded-full">
												<SunMoonIcon className="w-5 h-5" />
											</Text>
											<BoldLink>Change theme</BoldLink>
										</div>
									</Container>
								</Container>
								<Container className="flex flex-col gap-2 p-4">
									<Divider dir="horizontal" />

									{ExploreDropdownLinks.map((link) => (
										<Link
											key={link.link}
											href={link.link}
										>
											<a>
												<Container
													onClick={onClose}
													className="flex items-center justify-between py-3 rounded-xl hover:cursor-pointer"
												>
													<div className="flex items-center justify-between w-full gap-4">
														<BoldLink>{link.label}</BoldLink>
														<ArrowRightIcon className="w-5 h-5" />
													</div>
												</Container>
											</a>
										</Link>
									))}
								</Container>
							</Container>
						)}
					</NavDropdownContainer>
				</Container>
			)}
		</Container>
	);
};

export default MobileNavbarDropdown;
