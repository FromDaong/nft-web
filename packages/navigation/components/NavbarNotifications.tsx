import { LightningBoltIcon } from "@heroicons/react/solid";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

const NavbarNotifications = () => (
  <DropdownMenu.Root>
    <DropdownMenu.Trigger>
      <div className="flex items-center justify-center w-10 h-10 border rounded-full bg-gray-50">
        <LightningBoltIcon className="w-5 h-5" />
      </div>
    </DropdownMenu.Trigger>
    <DropdownMenu.Portal>
      <DropdownMenu.Content className="z-50 w-64 bg-white divide-y shadow-xl gap-y-3 rounded-xl">
        <DropdownMenu.Label className="px-3 py-2 text-sm text-gray-400">
          Notifications
        </DropdownMenu.Label>
        <DropdownMenu.Group className="px-3 py-2">
          <p className="text-center">No notifications yet</p>
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
);

export default NavbarNotifications;
