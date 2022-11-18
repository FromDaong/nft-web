import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDownIcon } from "@heroicons/react/solid";
import Link from "next/link";

import {
  DropdownContent,
  NavDropdownContainer,
  NavDropdownItem,
} from "./DropdownContainer";
import { BoldLink } from "@packages/shared/components/Typography/Text";

const ExploreDropdownLinks = [
  {
    label: "Sweetshop",
    link: "/marketplace/nft",
  },
  {
    label: "Creators",
    link: "/discover/creator",
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
      <BoldLink className="flex items-center gap-1">
        Explore <ChevronDownIcon className="w-5 h-5" />
      </BoldLink>
    </DropdownMenu.Trigger>
    <DropdownMenu.Portal>
      <DropdownContent>
        <NavDropdownContainer>
          {ExploreDropdownLinks.map((link) => (
            <Link key={link.link} href={link.link}>
              <BoldLink className="w-full h-full">
                <NavDropdownItem className="px-4 py-2">
                  {link.label}
                </NavDropdownItem>
              </BoldLink>
            </Link>
          ))}
        </NavDropdownContainer>
      </DropdownContent>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
);

export default NavbarExploreDropdown;
