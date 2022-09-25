import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDownIcon } from "@heroicons/react/solid";
import Link from "next/link";

const ExploreDropdownLinks = [
  {
    label: "Sweetshop",
    link: "/sweetshop",
  },
  {
    label: "Resale Marketplace",
    link: "/resale",
  },
  {
    label: "Melon Farm",
    link: "/farm",
  },
  {
    label: "Buy BNB",
    link: "/swap",
  },
];

const NavbarExploreDropdown = () => (
  <DropdownMenu.Root>
    <DropdownMenu.Trigger>
      <span className="flex items-center gap-1 font-medium">
        Explore <ChevronDownIcon className="w-5 h-5" />
      </span>
    </DropdownMenu.Trigger>
    <DropdownMenu.Portal>
      <DropdownMenu.Content className="p-2 bg-white shadow-xl rounded-xl gap-y-3">
        {ExploreDropdownLinks.map((link) => (
          <Link key={link.link} href={link.link}>
            <a className="w-full h-full">
              <DropdownMenu.Item className="px-4 py-2">
                {link.label}{" "}
              </DropdownMenu.Item>
            </a>
          </Link>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
);

export default NavbarExploreDropdown;
