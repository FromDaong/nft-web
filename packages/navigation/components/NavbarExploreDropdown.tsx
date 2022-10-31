import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDownIcon } from "@heroicons/react/solid";
import Link from "next/link";

import {
  DropdownContent,
  NavDropdownContainer,
  NavDropdownItem,
} from "./DropdownContainer";

const ExploreDropdownLinks = [
  {
    label: "Sweetshop",
    link: "/x/nft",
  },
  {
    label: "Creators",
    link: "/x/creator",
  },
  {
    label: "Farm",
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
      <DropdownContent>
        <NavDropdownContainer>
          {ExploreDropdownLinks.map((link) => (
            <Link key={link.link} href={link.link}>
              <a className="w-full h-full">
                <NavDropdownItem className="px-4 py-2 hover:bg-gray-100/90">
                  {link.label}{" "}
                </NavDropdownItem>
              </a>
            </Link>
          ))}
        </NavDropdownContainer>
      </DropdownContent>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
);

export default NavbarExploreDropdown;
