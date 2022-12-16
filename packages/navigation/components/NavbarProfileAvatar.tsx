import {GlobeAltIcon, LogoutIcon} from "@heroicons/react/outline";
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
import {Divider} from "@packages/shared/components/Divider";
import {BoldLink, Text} from "@packages/shared/components/Typography/Text";
import ThemeSwitcherModal from "@packages/theme/ThemeSwitcherModal";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {ConnectButton, useAccountModal} from "@rainbow-me/rainbowkit";
import UserAvatar from "core/auth/components/Avatar";
import Link from "next/link";
import {useAccount} from "wagmi";
import {
	DropdownContainer,
	DropdownContent,
	NavDropdownItem,
} from "./DropdownContainer";

const NavbarProfileAvatar = () => {
	const {address, isConnected} = useAccount();
	const {openAccountModal} = useAccountModal();

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
					<ConnectButton />
				</DropdownMenu.Trigger>
				<DropdownMenu.Portal>
					<DropdownContent>
						<DropdownContainer className="drop-shadow-2xl">
							<DropdownMenu.DropdownMenuGroup className="py-2 mt-2">
								<NavDropdownItem
									onClick={openAccountModal}
									className="flex items-center justify-between p-2 rounded-xl hover:cursor-pointer"
								>
									<div className="flex items-center gap-4">
										<Text className="p-2 rounded-full">
											<GlobeAltIcon className="w-5 h-5 " />
										</Text>
										<BoldLink>Wallet connection</BoldLink>
									</div>
								</NavDropdownItem>
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
								<NavDropdownItem
									onClick={onOpen}
									className="flex items-center justify-between p-2 rounded-xl hover:cursor-pointer"
								>
									<div className="flex items-center gap-4">
										<Text className="p-2 rounded-full">
											<LogoutIcon className="w-5 h-5 " />
										</Text>
										<BoldLink>Sign out</BoldLink>
									</div>
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
