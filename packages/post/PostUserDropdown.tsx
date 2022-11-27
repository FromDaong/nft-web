import { DotsHorizontalIcon } from "@heroicons/react/outline";
import {
  DropdownContent,
  NavDropdownContainer,
  NavDropdownItem,
} from "@packages/navigation/components/DropdownContainer";
import {
  BoldLink,
  ImportantText,
  Text,
} from "@packages/shared/components/Typography/Text";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Link from "next/link";

const PostDropdownOptions = [
  {
    label: "Follow",
    link: "/sweetshop",
  },
  {
    label: "Copy link to post",
    link: "/sweetshop",
  },
  {
    label: "Send tip",
    link: "/farm",
  },
  {
    label: "Block user",
    link: "/swap",
  },
];

export default function PostUserDropdown() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <BoldLink className="flex items-center gap-1">
          <DotsHorizontalIcon className="w-5 h-5" />
        </BoldLink>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownContent>
          <NavDropdownContainer className="drop-shadow-2xl p-2">
            {PostDropdownOptions.map((link) => (
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
}
