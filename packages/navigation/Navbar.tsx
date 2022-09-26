import Link from "next/link";
import NavbarExploreDropdown from "./components/NavbarExploreDropdown";
import NavbarProfileAvatar from "./components/NavbarProfileAvatar";
import NavbarActionDropdown from "./components/NavbarActionDropdown";
import NavbarNotifications from "./components/NavbarNotifications";
import * as Logo from "../../public/brand/logo_mono.svg";
import Image from "next/image";
import { Button } from "packages/shared/components/Button";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 z-40 w-full px-4 shadow-sm lg:px-0 bg-gray-50">
      <div className="flex items-center justify-between max-w-6xl py-3 mx-auto bg-gray-50">
        <div className="flex items-center gap-8">
          <Link href="/">
            <a className="relative w-8 h-8 text-3xl font-bold">
              <Image
                src={Logo}
                alt="Logo"
                layout="fill"
                className="w-12 h-12"
              />
            </a>
          </Link>

          <div className="flex items-center gap-8">
            <Link href="/feed">
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

        <div className="flex gap-4">
          {
            // eslint-disable-next-line no-constant-condition
            true ? (
              <Button className="text-white bg-pink-600 shadow-sm">
                Connect Wallet
              </Button>
            ) : (
              <>
                <NavbarNotifications />
                <NavbarProfileAvatar />
                <NavbarActionDropdown />
              </>
            )
          }
        </div>
      </div>
    </nav>
  );
}
