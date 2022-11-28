import { UploadIcon } from "@radix-ui/react-icons";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Kbd, { ctrl_button_emoji } from "@packages/shared/components/Kbd";
import { VideoCameraIcon } from "@heroicons/react/solid";
import {
  DropdownContainer,
  DropdownContent,
  NavDropdownItem,
} from "./DropdownContainer";
import Link from "next/link";
import {
  BoldLink,
  ImportantText,
  LegibleText,
  Text,
} from "@packages/shared/components/Typography/Text";
import { Button } from "@packages/shared/components/Button";
import { SparklesIcon } from "@heroicons/react/outline";

const NavbarActionDropdown = () => (
  <DropdownMenu.Root>
    <DropdownMenu.Trigger>
      <Button className="flex items-center gap-2 px-4 py-2 rounded-xl">
        <SparklesIcon width={14} height={14} />
        Create
      </Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Portal>
      <DropdownContent>
        <DropdownContainer className="shadow-xl">
          <Link href={"/create/"}>
            <a>
              <NavDropdownItem className="flex items-center justify-between p-1 rounded-xl hover:cursor-pointer">
                <div className="flex items-center gap-4">
                  <LegibleText className="p-2 rounded-full">
                    <UploadIcon className="w-4 h-4" />
                  </LegibleText>
                  <ImportantText>Create new trit</ImportantText>
                </div>
                <span className="flex gap-2 text-sm">
                  <LegibleText>
                    <Kbd>{ctrl_button_emoji}</Kbd>
                  </LegibleText>
                  <LegibleText>
                    <Kbd>P</Kbd>
                  </LegibleText>
                </span>
              </NavDropdownItem>
            </a>
          </Link>
          <Link href={"/create/live"}>
            <a>
              <NavDropdownItem className="flex items-center justify-between p-1 rounded-xl hover:cursor-pointer">
                <div className="flex items-center gap-4">
                  <LegibleText className="p-2 rounded-full">
                    <VideoCameraIcon className="w-4 h-4" />
                  </LegibleText>
                  <ImportantText>Start livestream</ImportantText>
                </div>
                <span className="flex gap-2 text-sm">
                  <LegibleText>
                    <Kbd>{ctrl_button_emoji}</Kbd>
                  </LegibleText>
                  <LegibleText>
                    <Kbd>L</Kbd>
                  </LegibleText>
                </span>{" "}
              </NavDropdownItem>
            </a>
          </Link>
        </DropdownContainer>
      </DropdownContent>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
);

export default NavbarActionDropdown;
