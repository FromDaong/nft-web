import Link from "next/link";
import * as LightLogo from "../../public/brand/logo_mono.svg";
import * as DarkLogo from "../../public/brand/logo_white.svg";

import Image from "next/image";
import {useAccount} from "wagmi";

import {styled} from "@styles/theme";
import {ChevronDownIcon, PlusCircleIcon} from "@heroicons/react/outline";
import {Container} from "@packages/shared/components/Container";
import MobileNavbarDropdown from "./components/MobileNavbarDropdown";
import {Button} from "@packages/shared/components/Button";
import {useSession} from "next-auth/react";
import Spinner from "@packages/shared/icons/Spinner";
import {ConnectButton} from "@rainbow-me/rainbowkit";
import {useApplicationTheme} from "@packages/theme/provider";
import ManageUserDropdown from "./components/NavbarUser";
import {useDisclosure} from "@packages/hooks";
import NotificationsTray from "@components/Notifications/NotificationsTray";
import TransactionHistoryTray from "@components/Notifications/TransactionHistoryTray";
import RectangleStack from "@packages/shared/icons/RectangleStack";
import {CoinsIcon, PlusIcon, Search, ShoppingBag, UserIcon} from "lucide-react";
import {
	BoldLink,
	SmallText,
	Text,
} from "@packages/shared/components/Typography/Text";
import SearchModal from "./search";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {ShoppingBagIcon} from "@heroicons/react/solid";
import {StackIcon} from "@radix-ui/react-icons";
import {Portal, Transition} from "@headlessui/react";
import {useEffect, useRef, useState} from "react";
import {useRouter} from "next/router";

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
			css={{borderColor: "$border"}}
		>
			<Nav className="left-0 flex-col hidden w-full md:flex">
				<Container className="relative w-full h-full px-8 divide-y xl:px-4">
					<div className="container relative z-30 flex items-center justify-between py-2 mx-auto">
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
							<BrowseDropdownMenu />
						</Container>
						<div className="flex h-full w-96">
							<SearchModal>
								<SearchModal.SearchInput />
								<Container className="flex flex-col gap-4 ">
									<SearchModal.ResultSection heading="Creators">
										<></>
									</SearchModal.ResultSection>
								</Container>
							</SearchModal>
						</div>
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
										<NotificationsTray />
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
											<RectangleStack className={"w-5 h-5"} />
										</Button>
										<ManageUserDropdown />
									</Container>
								) : (
									<ConnectButton />
								))}
							{loading && <Spinner />}
						</div>
					</div>
				</Container>
			</Nav>
			<Nav className="top-0 left-0 w-full py-4 md:hidden">
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

function BrowseDropdownMenu() {
	const [isOpen, setIsOpen] = useState(false);
	const router = useRouter();

	useEffect(() => {
		if (isOpen) {
			const onClose = () => {
				setIsOpen(false);
			};
			onClose();
		}
	}, [router]);

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		}
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isOpen]);

	return (
		<div className="items-center hidden gap-4 md:flex">
			<DropdownMenu onOpenChange={setIsOpen}>
				<DropdownMenuTrigger>
					<Button
						appearance={"unstyled"}
						css={{color: "$textContrast"}}
					>
						Browse <ChevronDownIcon className="w-4 h-4" />
					</Button>
				</DropdownMenuTrigger>
				<Transition
					show={isOpen}
					enter="transition ease-out duration-100"
					enterFrom="transform opacity-0 scale-95"
					enterTo="transform opacity-100 scale-100"
					leave="transition ease-in duration-75"
					leaveFrom="transform opacity-100 scale-100"
					leaveTo="transform opacity-0 scale-95"
				>
					<Portal>
						<DropdownMenuContent className="w-48 p-2 transition-opacity duration-200 bg-white border shadow-2xl rounded-xl z-50">
							<DropdownMenuItem className="p-2 rounded-lg cursor-pointer hover:bg-zinc-100">
								<Link href="/sweetshop">
									<a>
										<BoldLink className="flex items-center gap-4">
											<ShoppingBag className="w-5 h-5" />
											Sweetshop
										</BoldLink>
									</a>
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem className="p-2 rounded-lg cursor-pointer hover:bg-zinc-100">
								<Link href="/collection">
									<a>
										<BoldLink className="flex items-center gap-4">
											<StackIcon className="w-5 h-5" />
											Collections
										</BoldLink>
									</a>
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem className="p-2 rounded-lg cursor-pointer hover:bg-zinc-100">
								<Link href="/people">
									<a>
										<BoldLink className="flex items-center gap-4">
											<UserIcon className="w-5 h-5" /> Profiles
										</BoldLink>
									</a>
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem className="p-2 rounded-lg cursor-pointer hover:bg-zinc-100">
								<Link href="/dex/ramp">
									<a>
										<BoldLink>
											<CoinsIcon className="w-5 h-5" />
											Buy crypto
										</BoldLink>
									</a>
								</Link>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</Portal>
				</Transition>
			</DropdownMenu>
		</div>
	);
}
