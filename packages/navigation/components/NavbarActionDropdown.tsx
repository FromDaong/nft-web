import { UploadIcon } from "@radix-ui/react-icons";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Kbd, { ctrl_button_emoji } from "@packages/shared/components/Kbd";
import { VideoCameraIcon } from "@heroicons/react/solid";
import { DropdownContainer, DropdownContent } from "./DropdownContainer";
import Link from "next/link";
import { ImportantSmallText } from "@packages/shared/components/Typography/Headings";
import { BoldLink } from "@packages/shared/components/Typography/Text";

const NavbarActionDropdown = () => (
  <DropdownMenu.Root>
    <DropdownMenu.Trigger>
      <button className="flex items-center gap-4 px-4 py-2 font-medium text-white bg-pink-600 rounded-xl">
        <BoldLink>Create</BoldLink>
      </button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Portal>
      <DropdownContent>
        <DropdownContainer>
          <Link href={"/create/"}>
            <a>
              <DropdownMenu.Item className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl hover:cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-gray-100 rounded-full">
                    <UploadIcon className="w-4 h-4 text-gray-500" />
                  </div>
                  <BoldLink>Create new trit</BoldLink>
                </div>
                <span className="flex gap-2 text-sm text-gray-400">
                  <Kbd>{ctrl_button_emoji}</Kbd>
                  <Kbd>P</Kbd>
                </span>
              </DropdownMenu.Item>
            </a>
          </Link>
          <Link href={"/create/live"}>
            <a>
              <DropdownMenu.Item className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl hover:cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-gray-100 rounded-full">
                    <VideoCameraIcon className="w-4 h-4 text-gray-500" />
                  </div>
                  <BoldLink>Start livestream</BoldLink>
                </div>
                <span className="flex gap-2 text-sm text-gray-400">
                  <Kbd>{ctrl_button_emoji}</Kbd>
                  <Kbd>L</Kbd>
                </span>{" "}
              </DropdownMenu.Item>
            </a>
          </Link>
        </DropdownContainer>
      </DropdownContent>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
);

export default NavbarActionDropdown;
