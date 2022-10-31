import { UploadIcon } from "@radix-ui/react-icons";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Kbd, { ctrl_button_emoji } from "@packages/shared/components/Kbd";
import { VideoCameraIcon } from "@heroicons/react/solid";
import { DropdownContainer, DropdownContent } from "./DropdownContainer";

const NavbarActionDropdown = () => (
  <DropdownMenu.Root>
    <DropdownMenu.Trigger>
      <button className="flex items-center gap-4 px-6 py-2 font-medium text-white bg-pink-600 border shadow-sm rounded-xl">
        Create
      </button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Portal>
      <DropdownContent>
        <DropdownContainer>
          <DropdownMenu.Item className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl hover:cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-100 rounded-full">
                <UploadIcon className="w-4 h-4 text-gray-500" />
              </div>
              <p className="font-medium">Create new trit</p>
            </div>
            <span className="flex gap-2 text-sm text-gray-400">
              <Kbd>{ctrl_button_emoji}</Kbd>
              <Kbd>P</Kbd>
            </span>
          </DropdownMenu.Item>
          <DropdownMenu.Item className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl hover:cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-100 rounded-full">
                <VideoCameraIcon className="w-4 h-4 text-gray-500" />
              </div>
              <p className="font-medium">Start livestream</p>
            </div>
            <span className="flex gap-2 text-sm text-gray-400">
              <Kbd>{ctrl_button_emoji}</Kbd>
              <Kbd>L</Kbd>
            </span>{" "}
          </DropdownMenu.Item>
        </DropdownContainer>
      </DropdownContent>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
);

export default NavbarActionDropdown;
