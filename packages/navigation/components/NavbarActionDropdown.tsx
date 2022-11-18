import { UploadIcon } from "@radix-ui/react-icons";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Kbd, { ctrl_button_emoji } from "@packages/shared/components/Kbd";
import { VideoCameraIcon } from "@heroicons/react/solid";
import { DropdownContainer, DropdownContent } from "./DropdownContainer";
import Link from "next/link";
import {
  BoldLink,
  LegibleText,
  Text,
} from "@packages/shared/components/Typography/Text";
import { Button } from "@packages/shared/components/Button";

const NavbarActionDropdown = () => (
  <DropdownMenu.Root>
    <DropdownMenu.Trigger>
      <Button className="flex items-center gap-4 px-4 py-2 rounded-xl">
        Create
      </Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Portal>
      <DropdownContent>
        <DropdownContainer>
          <Link href={"/create/"}>
            <BoldLink>
              <DropdownMenu.Item className="flex items-center justify-between p-2 rounded-xl hover:cursor-pointer">
                <div className="flex items-center gap-4">
                  <LegibleText className="p-2 rounded-full">
                    <UploadIcon className="w-4 h-4" />
                  </LegibleText>
                  <Text appearance={"hiContrast"}>Create new trit</Text>
                </div>
                <span className="flex gap-2 text-sm">
                  <LegibleText>
                    <Kbd>{ctrl_button_emoji}</Kbd>
                  </LegibleText>
                  <LegibleText>
                    <Kbd>P</Kbd>
                  </LegibleText>
                </span>
              </DropdownMenu.Item>
            </BoldLink>
          </Link>
          <Link href={"/create/live"}>
            <BoldLink>
              <DropdownMenu.Item className="flex items-center justify-between p-2 rounded-xl hover:cursor-pointer">
                <div className="flex items-center gap-4">
                  <LegibleText className="p-2 rounded-full">
                    <VideoCameraIcon className="w-4 h-4" />
                  </LegibleText>
                  <Text appearance={"hiContrast"}>Start livestream</Text>
                </div>
                <span className="flex gap-2 text-sm">
                  <LegibleText>
                    <Kbd>{ctrl_button_emoji}</Kbd>
                  </LegibleText>
                  <LegibleText>
                    <Kbd>L</Kbd>
                  </LegibleText>
                </span>{" "}
              </DropdownMenu.Item>
            </BoldLink>
          </Link>
        </DropdownContainer>
      </DropdownContent>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
);

export default NavbarActionDropdown;
