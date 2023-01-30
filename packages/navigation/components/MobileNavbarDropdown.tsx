import Link from "next/link";

import {NavDropdownContainer} from "./DropdownContainer";
import {
	BoldLink,
	ImportantText,
	MutedText,
	Text,
} from "@packages/shared/components/Typography/Text";
import {Container} from "@packages/shared/components/Container";
import {useAccountModal, useConnectModal} from "@rainbow-me/rainbowkit";
import {
	ArrowRightIcon,
	CubeIcon,
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
import {GridIcon, ImageIcon} from "@radix-ui/react-icons";

const BankNotes = (props) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={1.5}
			stroke="currentColor"
			{...props}
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
			/>
		</svg>
	);
};

const UserCircle = (props) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={1.5}
			stroke="currentColor"
			{...props}
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
			/>
		</svg>
	);
};

const CogIcon = (props) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={1.5}
			stroke="currentColor"
			{...props}
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
			/>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
			/>
		</svg>
	);
};

const ThemeIcon = (props) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={1.5}
			stroke="currentColor"
			{...props}
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
			/>
		</svg>
	);
};

const WalletConnectionIcon = (props) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={1.5}
			stroke="currentColor"
			{...props}
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 004.5 10.5a7.464 7.464 0 01-1.15 3.993m1.989 3.559A11.209 11.209 0 008.25 10.5a3.75 3.75 0 117.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 01-3.6 9.75m6.633-4.596a18.666 18.666 0 01-2.485 5.33"
			/>
		</svg>
	);
};

const ShopIcon = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth={1.5}
		stroke="currentColor"
		{...props}
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"
		/>
	</svg>
);

const CreditCardIcon = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth={1.5}
		stroke="currentColor"
		{...props}
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
		/>
	</svg>
);

const FarmIcon = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth={1.5}
		stroke="currentColor"
		{...props}
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z"
		/>
	</svg>
);

const BeakerIcon = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth={1.5}
		stroke="currentColor"
		{...props}
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
		/>
	</svg>
);

const ExploreDropdownLinks = [
	{
		label: "Sweetshop",
		link: "/sweetshop",
		icon: (
			<ShopIcon
				width={20}
				height={20}
			/>
		),
	},
	{
		label: "Magazine",
		link: "https://treatdao.org/magazine",
		icon: (
			<ImageIcon
				width={20}
				height={20}
			/>
		),
	},
	{
		label: "Farm",
		link: "https://treatdao.com/farms",
		icon: (
			<FarmIcon
				width={20}
				height={20}
			/>
		),
	},
	{
		label: "Buy Crypto",
		link: "/dex/ramp",
		icon: (
			<CreditCardIcon
				width={20}
				height={20}
			/>
		),
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
				<Container className="relative px-4 ">
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
						className="fixed top-0 left-0 w-screen h-screen py-8"
					>
						{!props.isConnected && (
							<Container className="relative top-0 left-0 w-screen h-screen">
								<Container className="absolute flex justify-end right-4 top-4">
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
								<Container className="flex flex-col gap-24 h-full px-8 py-12">
									<Container className="flex flex-col gap-2">
										<Heading size="xss">
											<MutedText css={{color: "$textOnSurface"}}>
												NAVIGATION ACTIONS
											</MutedText>
										</Heading>
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
															<ImportantText>{link.icon}</ImportantText>
														</Text>
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
							<Container className="relative flex flex-col gap-4 p-4 py-12">
								<Container className="absolute flex justify-end right-4 top-4">
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
								<ThemeSwitcherModal
									isOpen={isOpen}
									onClose={onClose}
								/>
								<BecomeCreatorModal
									isOpen={upgradeToCreatorIsOpen}
									onClose={onCloseUpgradeToCreator}
								/>
								<Container className="flex flex-col items-center w-full gap-4 text-center">
									<NewAvatar
										username={profile?.username}
										imageSrc={profile.profile_pic}
										size={80}
									/>
									<Container>
										<Heading size="xs">{profile?.display_name}</Heading>
										<Text>@{profile?.username}</Text>
									</Container>
									<Button
										className="w-full"
										css={{padding: "16px"}}
										onClick={openAccountModal}
									>
										<WalletConnectionIcon
											width={20}
											height={20}
										/>
										<span>Manage wallet connection</span>
									</Button>
								</Container>
								<Container className="py-1">
									<Link href={`/${profile?.username}`}>
										<a>
											<Container
												onClick={onClose}
												className="flex items-center justify-between p-4 rounded-xl hover:cursor-pointer"
											>
												<div className="flex items-center gap-4">
													<Text className="p-2 rounded-full">
														<UserCircle
															width={20}
															height={20}
														/>
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
													className="flex items-center justify-between p-4 rounded-xl hover:cursor-pointer"
												>
													<div className="flex items-center gap-4">
														<Text className="p-2 rounded-full">
															<BankNotes
																width={20}
																height={20}
															/>
														</Text>
														<BoldLink>Become a Creator</BoldLink>
													</div>
												</Container>
											</a>
										</Link>
									)}
									<Link href={"/account"}>
										<a>
											<Container
												onClick={onClose}
												className="flex items-center justify-between p-4 rounded-xl hover:cursor-pointer"
											>
												<div className="flex items-center gap-4">
													<Text className="p-2 rounded-full">
														<CogIcon
															width={20}
															height={20}
														/>
													</Text>
													<BoldLink>Manage account</BoldLink>
												</div>
											</Container>
										</a>
									</Link>
									<Container
										onClick={onOpen}
										className="flex items-center justify-between p-4 rounded-xl hover:cursor-pointer"
									>
										<div className="flex items-center gap-4">
											<Text className="p-2 rounded-full">
												<ThemeIcon
													width={20}
													height={20}
												/>
											</Text>
											<BoldLink>Change theme</BoldLink>
										</div>
									</Container>
								</Container>
								<Container className="flex flex-col gap-2 p-4">
									<Divider dir="horizontal" />
									<Heading size="xss">
										<MutedText>NAVIGATION ACTIONS</MutedText>
									</Heading>

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
