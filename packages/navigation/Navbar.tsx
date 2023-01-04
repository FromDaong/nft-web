import Link from "next/link";
import * as LightLogo from "../../public/brand/logo_mono.svg";
import * as DarkLogo from "../../public/brand/logo_white.svg";

import Image from "next/image";
import {useAccount} from "wagmi";
import dynamic from "next/dynamic";
import NavbarSearchDropdown from "../search/NavbarSearchDropdown";

import {styled} from "@styles/theme";
import {BoldLink} from "@packages/shared/components/Typography/Text";
import {PhotographIcon} from "@heroicons/react/outline";
import {Container} from "@packages/shared/components/Container";
import MobileNavbarDropdown from "./components/MobileNavbarDropdown";
import {Button} from "@packages/shared/components/Button";
import {useSession} from "next-auth/react";
import Spinner from "@packages/shared/icons/Spinner";
import {ConnectButton} from "@rainbow-me/rainbowkit";
import {useApplicationTheme} from "@packages/theme/provider";

const NavbarProfileAvatar = dynamic(
	() => import("./components/NavbarProfileAvatar")
);

const Nav = styled("nav", {
	backgroundColor: "$elementSurface",
	zIndex: 30,
});

export default function Navbar() {
	const {theme} = useApplicationTheme();
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
										src={theme === "dark" ? DarkLogo : LightLogo}
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
								<Link href="https://treatdao.org/magazine">
									<a>
										<BoldLink className="font-medium">Magazine</BoldLink>
									</a>
								</Link>
							</div>
							<div className="items-center hidden gap-8 md:flex">
								<Link href="https://treatdao.com/farms">
									<a>
										<BoldLink className="font-medium">Farm</BoldLink>
									</a>
								</Link>
							</div>
							<div className="items-center hidden gap-8 md:flex">
								<Link href="/dex/ramp">
									<a>
										<BoldLink className="font-medium">Buy Crypto</BoldLink>
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
														<span>Create NFT</span>
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
