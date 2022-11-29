import Link from "next/link";
import * as Logo from "../../public/brand/logo_mono.svg";
import Image from "next/image";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import NavbarExploreDropdown from "./components/NavbarExploreDropdown";

import { styled } from "@styles/theme";
import { BoldLink } from "@packages/shared/components/Typography/Text";
import { useEffect } from "react";
import { init } from "commandbar";

const NavbarProfileAvatar = dynamic(
  () => import("./components/NavbarProfileAvatar")
);
const NavbarActionDropdown = dynamic(
  () => import("./components/NavbarActionDropdown")
);
const NavbarNotifications = dynamic(
  () => import("./components/NavbarNotifications")
);

const Nav = styled("nav", {
  backgroundColor: "$surfaceOnSurface",
});

export default function Navbar() {
  const { status } = useSession();
  const { isConnected: connected, address } = useAccount();

  const isConnected =
    connected && status !== "loading" && status === "authenticated";

    useEffect(() => {
      if(typeof(window) !== "undefined") {
        init('27f44475');
      }
    }, [])

    useEffect(() => {
      if(typeof(window) !=="undefined" && isConnected && address) {
        const loggedInUserId = address; // example
        window.CommandBar.boot(loggedInUserId);

      }
    }, [isConnected, address])

  const notifications = [
    {
      text: "subscribed to your trits for 0.09 BNB",
      actor: "hitta",
      timestamp: Date.now(),
      url: "/c/hitta",
      audience: ["tate2301"],
    },
    {
      text: "followed you",
      timestamp: Date.now(),
      actor: "kamfeskaya",
      url: "/c/hitta",
      audience: ["tate2301"],
    },
  ];

  return (
    <Nav className="fixed top-0 left-0 z-30 w-full lg:px-0 h-[60px]">
      <div className="relative w-full h-full px-4">
        <div className="absolute top-0 left-0 z-20 w-full h-full" />
        <div className="relative z-30 flex items-center justify-between max-w-6xl py-3 mx-auto">
          <div className="flex items-center gap-8">
            <Link href="/">
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
              <Link href="/discover">
                <BoldLink className="font-medium">Trits</BoldLink>
              </Link>
              <Link href="#">
                <BoldLink className="font-medium">
                  <NavbarExploreDropdown />
                </BoldLink>
              </Link>
              <Link href="/magazine">
                <BoldLink className="font-medium">Magazine</BoldLink>
              </Link>
            </div>
          </div>

          <div className="flex md:hidden">
            <HamburgerMenuIcon className="w-8 h-8 p-2 border-2 rounded-full" />
          </div>

          <div className="hidden gap-4 md:flex">
            {
              // eslint-disable-next-line no-constant-condition
              isConnected ? (
                <>
                  {<NavbarNotifications notifications={notifications} />}
                  <NavbarProfileAvatar />
                  {true && <NavbarActionDropdown />}
                </>
              ) : (
                <ConnectButton
                  label="Sign in"
                  chainStatus="icon"
                  showBalance={false}
                />
              )
            }
          </div>
        </div>
      </div>
    </Nav>
  );
}
