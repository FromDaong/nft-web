import Link from "next/link";
import NavbarExploreDropdown from "./components/NavbarExploreDropdown";
import NavbarProfileAvatar from "./components/NavbarProfileAvatar";
import NavbarActionDropdown from "./components/NavbarActionDropdown";
import NavbarNotifications from "./components/NavbarNotifications";
import * as Logo from "../../public/brand/logo_mono.svg";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="w-full px-4 lg:px-0">
      <div className="flex items-center justify-between">
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
          <NavbarNotifications />
          <NavbarProfileAvatar />
          <NavbarActionDropdown />
        </div>
      </div>
    </nav>
  );
}
