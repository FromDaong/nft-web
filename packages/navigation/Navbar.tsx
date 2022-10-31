import Link from "next/link";
import NavbarExploreDropdown from "./components/NavbarExploreDropdown";
import NavbarProfileAvatar from "./components/NavbarProfileAvatar";
import NavbarActionDropdown from "./components/NavbarActionDropdown";
import NavbarNotifications from "./components/NavbarNotifications";
import * as Logo from "../../public/brand/logo_mono.svg";
import Image from "next/image";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();
  const { data: session, status } = useSession();
  const loading = status === "loading";

  const logout = () => {
    disconnect();
    //await signOut();
  };
  const notifications = [
    {
      text: "subscribed to your trits for 0.09 BNB",
      actor: "hitta",
      timestamp: Date.now(),
      url: "/c/hitta",
      audience: ["tate2301"],
    },
    {
      text: "@hitta followed you",
      timestamp: Date.now(),
      url: "/c/hitta",
      audience: ["tate2301"],
    },
  ];

  return (
    <nav className="fixed top-0 left-0 z-30 w-full shadow-sm lg:px-0">
      <div className="relative w-full px-4">
        <div className="absolute top-0 left-0 z-20 w-full h-full bg-gray-50/70 backdrop-blur-lg" />
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
                <a className="font-medium">Discover</a>
              </Link>
              <Link href="#">
                <a className="font-medium">
                  <NavbarExploreDropdown />
                </a>
              </Link>
              <Link href="/magazine">
                <a className="font-medium">Magazine</a>
              </Link>
            </div>
          </div>

          <div className="flex md:hidden">
            <HamburgerMenuIcon className="w-8 h-8 p-2 border-2 rounded-full border-gray-200/70" />
          </div>

          <div className="hidden gap-4 md:flex">
            {
              // eslint-disable-next-line no-constant-condition
              !isConnected ? (
                <ConnectButton
                  label="Connect your wallet"
                  chainStatus="icon"
                  showBalance={false}
                />
              ) : (
                <>
                  <NavbarNotifications notifications={notifications} />
                  <NavbarProfileAvatar />
                  {true && <NavbarActionDropdown />}
                </>
              )
            }
          </div>
        </div>
      </div>
    </nav>
  );
}
