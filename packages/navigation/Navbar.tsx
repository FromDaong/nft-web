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
import NavbarUser from "./components/NavbarUser";
import {useDisclosure} from "@packages/hooks";
import NotificationsTray from "@components/Notifications/NotificationsTray";
import TransactionHistoryTray from "@components/Notifications/TransactionHistoryTray";
import RectangleStack from "@packages/shared/icons/RectangleStack";
import {Search} from "lucide-react";
import {SmallText, Text} from "@packages/shared/components/Typography/Text";
import SearchModal from "./search";

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
		<Container className="top-0 z-20">
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
								<Link href="/sweetshop">
									<a>
										<Button
											size={"sm"}
											appearance={"link"}
										>
											Marketplace
										</Button>
									</a>
								</Link>
							</div>
							<div className="items-center hidden gap-4 md:flex">
								<Link href="/magazine">
									<a>
										<Button
											size={"sm"}
											appearance={"link"}
										>
											Browse <ChevronDownIcon className="w-4 h-4" />
										</Button>
									</a>
								</Link>
							</div>
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
														css={{
															borderRadius: "9999px",
															alignItems: "center",
															justifyContent: "center",
														}}
													>
														Create
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
										<NavbarUser />
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
				<Container className="flex flex-col h-full gap-2 px-8">
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
