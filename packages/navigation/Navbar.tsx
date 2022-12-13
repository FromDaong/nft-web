import Link from "next/link";
import * as Logo from "../../public/brand/logo_mono.svg";
import Image from "next/image";
import {useAccount} from "wagmi";
import dynamic from "next/dynamic";
import NavbarExploreDropdown from "./components/NavbarExploreDropdown";
import NavbarSearchDropdown from "../search/NavbarSearchDropdown";

import {styled} from "@styles/theme";
import {BoldLink} from "@packages/shared/components/Typography/Text";
import {ChatIcon} from "@heroicons/react/outline";
import {Container} from "@packages/shared/components/Container";
import MobileNavbarDropdown from "./components/MobileNavbarDropdown";
import ThemedConnectButton from "core/chain/ConnectButton";

const NavbarProfileAvatar = dynamic(
	() => import("./components/NavbarProfileAvatar")
);
const NavbarActionDropdown = dynamic(
	() => import("./components/NavbarActionDropdown")
);

const Nav = styled("nav", {
	backgroundColor: "$surfaceOnSurface",
	zIndex: 30,
});

export default function Navbar() {
	const {isConnected: connected, status} = useAccount();

	const isConnected =
		connected && status !== "reconnecting" && status === "connected";

	return (
		<Container>
			<Nav className="hidden md:block fixed top-0 left-0 w-full xl:px-0 h-[60px] shadow">
				<Container className="relative w-full h-full px-8  xl:px-0">
					<div className="absolute top-0 left-0 z-20 w-full h-full" />
					<div className="container relative z-30 flex items-center justify-between py-3 mx-auto">
						<div className="flex items-center gap-8">
							<Link href={isConnected ? "/discover" : "/"}>
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
								<NavbarExploreDropdown />
							</div>
						</div>
						{false && (
							<div className="items-center hidden w-full max-w-md gap-8 md:flex">
								<NavbarSearchDropdown />
							</div>
						)}

						<div className="flex gap-4">
							<div className="flex md:hidden"></div>
							{
								// eslint-disable-next-line no-constant-condition
								isConnected ? (
									<>
										<Container>
											<Container
												css={{
													width: "32px",
													height: "32px",
													backgroundColor: "$surface",
													borderColor: "$subtleBorder",
												}}
												className="flex items-center justify-center border rounded-full"
											>
												<ChatIcon className="w-5 h-5" />
											</Container>
										</Container>
										<NavbarProfileAvatar />
										{true && <NavbarActionDropdown />}
									</>
								) : (
									<ThemedConnectButton />
								)
							}
						</div>
					</div>
				</Container>
			</Nav>
			<Nav className="fixed top-0 left-0 w-full py-4 shadow md:hidden">
				<Container className="flex flex-col h-full gap-2 px-8">
					<Container className="flex items-center justify-between">
						<Link href={isConnected ? "/discover" : "/"}>
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
