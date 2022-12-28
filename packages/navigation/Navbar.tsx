import Link from "next/link";
import * as Logo from "../../public/brand/logo_mono.svg";
import Image from "next/image";
import {useAccount} from "wagmi";
import dynamic from "next/dynamic";
import NavbarExploreDropdown from "./components/NavbarExploreDropdown";
import NavbarSearchDropdown from "../search/NavbarSearchDropdown";

import {styled} from "@styles/theme";
import {
	BoldLink,
	ImportantText,
	Text,
} from "@packages/shared/components/Typography/Text";
import {ChatIcon, PhotographIcon} from "@heroicons/react/outline";
import {Container} from "@packages/shared/components/Container";
import MobileNavbarDropdown from "./components/MobileNavbarDropdown";
import ThemedConnectButton from "core/chain/ConnectButton";
import {Button} from "@packages/shared/components/Button";
import {useSession} from "next-auth/react";
import Spinner from "@packages/shared/icons/Spinner";
import {ConnectButton} from "@rainbow-me/rainbowkit";

const NavbarProfileAvatar = dynamic(
	() => import("./components/NavbarProfileAvatar")
);
const NavbarActionDropdown = dynamic(
	() => import("./components/NavbarActionDropdown")
);

const Nav = styled("nav", {
	backgroundColor: "$elementSurface",
	zIndex: 30,
});

const NotificationsIcon = (props) => {
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
				d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5"
			/>
		</svg>
	);
};

export default function Navbar() {
	const {status, data} = useSession();
	const {isConnected: connected} = useAccount();
	const isConnected = status === "authenticated" && connected;
	const loading = status === "loading";

	const {profile, creator} = (data as any) || {};

	return (
		<Container>
			<Nav className="hidden md:block fixed top-0 left-0 w-full xl:px-0 h-[60px] shadow">
				<Container className="relative w-full h-full px-8 xl:px-0">
					<div className="absolute top-0 left-0 z-20 w-full h-full" />
					<div className="container relative z-30 flex items-center justify-between py-3 mx-auto">
						<div className="flex items-center gap-8">
							<Link href={isConnected ? "/" : "/"}>
								<a className="relative w-8 h-8 text-3xl font-medium">
									<Image
										src={Logo}
										alt="Logo"
										layout="fill"
										className="w-12 h-12"
									/>
								</a>
							</Link>

							<div className="items-center hidden gap-8 md:flex">
								<Link href="/sweetshop">
									<a>
										<BoldLink className="font-medium">Sweetshop</BoldLink>
									</a>
								</Link>
							</div>
							<div className="items-center hidden gap-8 md:flex">
								<Link href="/explore">
									<a>
										<BoldLink className="font-medium">Explore</BoldLink>
									</a>
								</Link>
							</div>
							<div className="items-center hidden gap-8 md:flex">
								<Link href="/dex/farm">
									<a>
										<BoldLink className="font-medium">Farming</BoldLink>
									</a>
								</Link>
							</div>
							<div className="items-center hidden gap-8 md:flex">
								<Link href="/dex/bridge">
									<a>
										<BoldLink className="font-medium">Bridge</BoldLink>
									</a>
								</Link>
							</div>
							<div className="items-center hidden gap-8 md:flex">
								<Link href="/beta">
									<a className="flex items-center gap-1">
										<BoldLink className="font-medium">Beta</BoldLink>
										<p>
											<Text
												css={{
													backgroundColor: "$totmPurple",
													color: "#fff",
													padding: "4px 4px",
													borderRadius: "4px",
													fontSize: "10px",
												}}
											>
												<ImportantText>NEW</ImportantText>
											</Text>
										</p>
									</a>
								</Link>
							</div>
						</div>
						{false && (
							<div className="items-center hidden w-full max-w-md gap-8 md:flex">
								<NavbarSearchDropdown />
							</div>
						)}

						<div className="flex gap-4">
							<div className="flex md:hidden"></div>
							{!loading &&
								// eslint-disable-next-line no-constant-condition
								(isConnected ? (
									<Container className="flex items-center gap-4">
										{/*<Link href={"/notifications"}>
											<a>
												<Button
													css={{
														borderRadius: "9999px",
														padding: "8px !important",
													}}
													className="flex items-center justify-center rounded-full"
													appearance={"surface"}
												>
													<NotificationsIcon
														width={20}
														height={20}
													/>
												</Button>
											</a>
												</Link>*/}
										{creator && (
											<Link href={"/create"}>
												<a>
													<Button
														appearance={"surface"}
														css={{borderRadius: "9999px"}}
													>
														<PhotographIcon
															width={18}
															height={18}
														/>
														<span>Create post</span>
													</Button>
												</a>
											</Link>
										)}
										<NavbarProfileAvatar />
									</Container>
								) : (
									<ConnectButton />
								))}
							{loading && <Spinner />}
						</div>
					</div>
				</Container>
			</Nav>
			<Nav className="fixed top-0 left-0 w-full py-4 shadow md:hidden">
				<Container className="flex flex-col h-full gap-2 px-8">
					<Container className="flex items-center justify-between">
						<Link href={isConnected ? "/" : "/"}>
							<a className="relative w-8 h-8 text-3xl font-medium">
								<Image
									src={Logo}
									alt="Logo"
									layout="fill"
									className="w-16 h-16"
								/>
							</a>
						</Link>
						<Container className="flex gap-4">
							<MobileNavbarDropdown isConnected={isConnected} />
							{isConnected && <NavbarProfileAvatar />}
						</Container>
					</Container>
				</Container>
			</Nav>
		</Container>
	);
}
