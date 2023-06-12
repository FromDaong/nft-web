import Link from "next/link";
import * as LightLogo from "../../public/brand/logo_mono.svg";
import * as DarkLogo from "../../public/brand/logo_white.svg";

import Image from "next/image";
import {useAccount} from "wagmi";

import {styled} from "@styles/theme";
import {Container} from "@packages/shared/components/Container";
import MobileNavbarDropdown from "./components/MobileNavbarDropdown";
import {Button} from "@packages/shared/components/Button";
import {useSession} from "next-auth/react";
import Spinner from "@packages/shared/icons/Spinner";
import {useApplicationTheme} from "@packages/theme/provider";
import ManageUserDropdown from "./components/NavbarUser";
import {useDisclosure} from "@packages/hooks";
import WishlistTray from "@components/Notifications/WishlistTray";
import TransactionHistoryTray from "@components/Notifications/TransactionHistoryTray";
import {History, PlusIcon} from "lucide-react";
import SearchModal from "./search";
import {
	DropdownMenuContent,
	DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import {ConnectWalletButton} from "@packages/post/BuyNFTButton";
import NavbarMenu from "./components/NavbarMenu";

const Nav = styled("nav", {
	zIndex: 30,
	borderColor: "$border",
});

export default function Navbar() {
	const {theme} = useApplicationTheme();
	const {status, data} = useSession();
	const {isConnected: connected} = useAccount();
	const isConnected = status === "authenticated" && connected;
	const loading = status === "loading";

	const {creator} = (data as any) || {};

	const {
		isOpen: isTransactionsTrayOpen,
		onOpen: onOpenTransactionsTray,
		onClose: onCloseTransactionsTray,
	} = useDisclosure();

	return (
		<Container
			className="top-0 z-20 border-b"
			css={{borderColor: "$subtleBorder"}}
		>
			<Nav className="left-0 flex-col hidden w-full lg:flex">
				<Container className="relative w-full h-full px-8 divide-y">
					<div className="w-full relative z-30 flex items-center justify-between py-2 ">
						<Container className={"flex gap-4 items-center"}>
							<Link href={isConnected ? "/" : "/"}>
								<a className="relative w-8 h-8 text-3xl font-medium">
									<Image
										src={theme === "dark" ? DarkLogo : LightLogo}
										alt="Logo"
										layout="fill"
										className="w-12 h-12"
									/>
								</a>
							</Link>
							<Container>
								<SearchModal />
							</Container>
							<NavbarMenu />

							<div className="items-center hidden gap-2 md:flex">
								<Link href="/magazine">
									<a>
										<Button
											appearance={"unstyled"}
											css={{paddingX: "8px", color: "$textContrast"}}
										>
											Magazine
										</Button>
									</a>
								</Link>
							</div>

							<Link href="/dex/ramp">
								<a>
									<Button
										appearance={"unstyled"}
										css={{paddingX: "8px", color: "$textContrast"}}
									>
										Buy Crypto
									</Button>
								</a>
							</Link>
						</Container>

						<div className="flex gap-8">
							<div className="flex md:hidden"></div>
							{!loading &&
								// eslint-disable-next-line no-constant-condition
								(isConnected ? (
									<Container className="flex items-center gap-4">
										{creator && !creator?.pending && (
											<Link href={"/create"}>
												<a>
													<Button
														appearance={"action"}
														css={{
															padding: "0.4rem 1rem",
															height: "100%",
														}}
													>
														<PlusIcon className="w-5 h-5" />
														Create collection
													</Button>
												</a>
											</Link>
										)}
										<WishlistTray />
										<TransactionHistoryTray
											isOpen={isTransactionsTrayOpen}
											onClose={onCloseTransactionsTray}
										/>
										<Button
											appearance={"surface"}
											onClick={onOpenTransactionsTray}
											css={{
												padding: "0.5rem",
											}}
										>
											<History className={"w-5 h-5"} />
										</Button>
										<ManageUserDropdown />
									</Container>
								) : (
									<ConnectWalletButton />
								))}
							{loading && <Spinner />}
						</div>
					</div>
				</Container>
			</Nav>
			<Nav className="top-0 left-0 w-full py-4 lg:hidden">
				<Container className="flex flex-col h-full gap-2 px-2">
					<Container className="flex items-center justify-between">
						<Link href={isConnected ? "/" : "/"}>
							<a className="relative w-8 h-8 text-3xl font-medium">
								<Image
									src={LightLogo}
									alt="Logo"
									layout="fill"
									className="w-16 h-16"
								/>
							</a>
						</Link>
						<Container className="flex gap-4">
							<MobileNavbarDropdown isConnected={isConnected} />
						</Container>
					</Container>
				</Container>
			</Nav>
		</Container>
	);
}

export const DropdownMenuContainer = styled(DropdownMenuContent, {
	backgroundColor: "$surfaceOnSurface",
	borderColor: "$subtleBorder",
});

export const DropdownMenuLink = styled(DropdownMenuItem, {
	"&:hover": {
		backgroundColor: "$elementOnSurface",
	},
});
