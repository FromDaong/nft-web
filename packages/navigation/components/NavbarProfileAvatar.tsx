import {
	ArrowRightIcon,
	CurrencyDollarIcon,
	DesktopComputerIcon,
	ShoppingBagIcon,
	UserCircleIcon,
	CogIcon,
} from "@heroicons/react/solid";
import {useDisclosure} from "@packages/hooks";
import BecomeCreatorModal from "@packages/onboarding/BecomeCreatorModal";
import {BoldLink, Text} from "@packages/shared/components/Typography/Text";
import ThemeSwitcherModal from "@packages/theme/ThemeSwitcherModal";
import * as Avatar from "@radix-ui/react-avatar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import UserAvatar from "core/auth/components/Avatar";
import Link from "next/link";
import {useAccount} from "wagmi";
import {
	DropdownContainer,
	DropdownContent,
	NavDropdownItem,
} from "./DropdownContainer";
import WalletConnectButton from "./WalletConnectButton";

const NavbarProfileAvatar = () => {
	// TODO: Implement theme customization
	// const { updateTheme, nextTheme } = useApplicationTheme();
	const {address, isConnected} = useAccount();
	const {isOpen, onClose, onOpen} = useDisclosure();
	const {
		isOpen: upgradeToCreatorIsOpen,
		onOpen: onOpenUpgradeToCreator,
		onClose: onCloseUpgradeToCreator,
	} = useDisclosure();

	if (!isConnected) {
		return null;
	}

	return (
		<>
			<ThemeSwitcherModal
				isOpen={isOpen}
				onClose={onClose}
			/>
			<BecomeCreatorModal
				isOpen={upgradeToCreatorIsOpen}
				onClose={onCloseUpgradeToCreator}
			/>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<UserAvatar
						size={32}
						value={address}
					/>
				</DropdownMenu.Trigger>
				<DropdownMenu.Portal>
					<DropdownContent>
						<DropdownContainer className="drop-shadow-2xl">
							<DropdownMenu.DropdownMenuGroup>
								<DropdownMenu.DropdownMenuItem>
									<WalletConnectButton />
								</DropdownMenu.DropdownMenuItem>
							</DropdownMenu.DropdownMenuGroup>
							<DropdownMenu.DropdownMenuGroup className="py-2 mt-2">
								<NavDropdownItem
									onClick={onOpenUpgradeToCreator}
									className="flex items-center justify-between p-2 rounded-xl hover:cursor-pointer"
								>
									<div className="flex items-center gap-4">
										<Text className="p-2 rounded-full">
											<ShoppingBagIcon className="w-5 h-5 " />
										</Text>
										<BoldLink>Become a Tritter</BoldLink>
									</div>
									<Text>
										<ArrowRightIcon className="w-5 h-5 " />
									</Text>
								</NavDropdownItem>
								<NavDropdownItem className="flex items-center justify-between p-2 rounded-xl hover:cursor-pointer">
									<div className="flex items-center gap-4">
										<Text className="p-2 rounded-full">
											<CurrencyDollarIcon className="w-5 h-5 " />
										</Text>
										<BoldLink>Buy crypto</BoldLink>
									</div>
									<Text>
										<ArrowRightIcon className="w-5 h-5 " />
									</Text>
								</NavDropdownItem>
								<Link href={"/account"}>
									<a>
										<NavDropdownItem className="flex items-center justify-between p-2 rounded-xl hover:cursor-pointer">
											<div className="flex items-center gap-4">
												<Text className="p-2 rounded-full">
													<CogIcon className="w-5 h-5 " />
												</Text>
												<BoldLink>Manage account</BoldLink>
											</div>
											<Text>
												<ArrowRightIcon className="w-5 h-5 " />
											</Text>
										</NavDropdownItem>
									</a>
								</Link>
								<NavDropdownItem
									onClick={onOpen}
									className="flex items-center justify-between p-2 rounded-xl hover:cursor-pointer"
								>
									<div className="flex items-center gap-4">
										<Text className="p-2 rounded-full">
											<DesktopComputerIcon className="w-5 h-5 " />
										</Text>
										<BoldLink>Change theme</BoldLink>
									</div>
									<Text>
										<ArrowRightIcon className="w-5 h-5 " />
									</Text>
								</NavDropdownItem>
							</DropdownMenu.DropdownMenuGroup>
						</DropdownContainer>
					</DropdownContent>
				</DropdownMenu.Portal>
			</DropdownMenu.Root>
		</>
	);
};

export default NavbarProfileAvatar;
