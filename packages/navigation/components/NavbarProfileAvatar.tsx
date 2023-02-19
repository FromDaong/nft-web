import {useDisclosure} from "@packages/hooks";
import NewAvatar from "@packages/shared/components/AvatarNew";
import {Container} from "@packages/shared/components/Container";
import {BoldLink, Text} from "@packages/shared/components/Typography/Text";
import ThemeSwitcherModal from "@packages/theme/ThemeSwitcherModal";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {useAccountModal} from "@rainbow-me/rainbowkit";
import Avvvatars from "avvvatars-react";
import {useUser} from "core/auth/useUser";
import {useSession} from "next-auth/react";
import Link from "next/link";
import {useAccount} from "wagmi";
import {
	DropdownContainer,
	DropdownContent,
	NavDropdownItem,
} from "./DropdownContainer";

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

const NavbarProfileAvatar = () => {
	const {isConnected} = useAccount();
	const {openAccountModal} = useAccountModal();
	const {data: session} = useSession();
	const {profile, creator, isLoading} = useUser();

	const {isOpen, onClose, onOpen} = useDisclosure();

	if (!isConnected) {
		return null;
	}

	return <>
        <ThemeSwitcherModal
            isOpen={isOpen}
            onClose={onClose}
        />
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <Container
                    css={{backgroundColor: "$surfaceOnSurface"}}
                    className="rounded-full"
                >
                    {profile && profile.profile_pic && (
                        <NewAvatar
                            username={profile?.username}
                            imageSrc={profile?.profile_pic}
                            size={32}
                        />
                    )}

                    {!profile?.profile_pic && (
                        <Avvvatars
                            value={"something"}
                            size={32}
                            style="shape"
                        />
                    )}
                </Container>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
                <DropdownContent>
                    <DropdownContainer className="drop-shadow-2xl">
                        <DropdownMenu.DropdownMenuGroup className="py-1">
                            <Link href={`/${profile?.username}`}>

                                <NavDropdownItem className="flex items-center justify-between p-2 rounded-xl hover:cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <Text className="p-2 rounded-full">
                                            <UserCircle
                                                width={20}
                                                height={20}
                                            />
                                        </Text>
                                        <BoldLink>Profile</BoldLink>
                                    </div>
                                </NavDropdownItem>

                            </Link>
                            {!isLoading && !creator && (
                                (<Link href={"/account/upgrade"}>

                                    <NavDropdownItem className="flex items-center justify-between p-2 rounded-xl hover:cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <Text className="p-2 rounded-full">
                                                <BankNotes
                                                    width={20}
                                                    height={20}
                                                />
                                            </Text>
                                            <BoldLink>Become a Creator</BoldLink>
                                        </div>
                                    </NavDropdownItem>

                                </Link>)
                            )}
                            <Link href={"/account"}>

                                <NavDropdownItem className="flex items-center justify-between p-2 rounded-xl hover:cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <Text className="p-2 rounded-full">
                                            <CogIcon
                                                width={20}
                                                height={20}
                                            />
                                        </Text>
                                        <BoldLink>Manage account</BoldLink>
                                    </div>
                                </NavDropdownItem>

                            </Link>
                            <NavDropdownItem
                                onClick={onOpen}
                                className="flex items-center justify-between p-2 rounded-xl hover:cursor-pointer"
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
                            </NavDropdownItem>
                            <NavDropdownItem
                                onClick={openAccountModal}
                                className="flex items-center justify-between p-2 rounded-xl hover:cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <Text className="p-2 rounded-full">
                                        <WalletConnectionIcon
                                            width={20}
                                            height={20}
                                        />
                                    </Text>
                                    <BoldLink>Manage wallet connection</BoldLink>
                                </div>
                            </NavDropdownItem>
                        </DropdownMenu.DropdownMenuGroup>
                    </DropdownContainer>
                </DropdownContent>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    </>;
};

export default NavbarProfileAvatar;
