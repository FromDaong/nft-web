import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDownIcon } from "@heroicons/react/solid";
import Link from "next/link";

import {
  DropdownContent,
  NavDropdownContainer,
  NavDropdownItem,
} from "./DropdownContainer";
import {
  BoldLink,
  ImportantText,
  Text,
} from "@packages/shared/components/Typography/Text";

const ExploreDropdownLinks = [
  {
    label: "Sweetshop",
    link: "/sweetshop",
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
        <NavDropdownContainer className="drop-shadow-2xl p-2">
          {ExploreDropdownLinks.map((link) => (
            <Link key={link.link} href={link.link}>
              <a>
                <NavDropdownItem>
                  <Text>
                    <ImportantText> {link.label}</ImportantText>
                  </Text>
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
