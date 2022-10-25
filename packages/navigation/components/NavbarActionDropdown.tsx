import { KeyboardIcon, PlusIcon } from "@radix-ui/react-icons";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Button } from "packages/shared/components/Button";
import Link from "next/link";

const NavbarActionDropdown = () => (
  <DropdownMenu.Root>
    <DropdownMenu.Trigger>
      <Button className="flex items-center gap-4 px-6 py-1 text-white bg-pink-600 rounded-full">
        Create <PlusIcon />
      </Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Portal>
      <DropdownMenu.Content className="z-50 py-3 bg-white divide-y divide-y-500/10 min-w-[256px] drop-shadow-xl gap-y-3 rounded-xl">
        <div>
          <Link href={"/creator/post"}>
            <a>
              <DropdownMenu.Item className="flex items-baseline justify-between px-4 py-2 ">
                <span>Create new post</span>
                <span className="flex gap-2 text-sm text-gray-400">
                  <KeyboardIcon className="w-5 h-5" />P
                </span>
              </DropdownMenu.Item>
            </a>
          </Link>
        </div>
        <div>
          <Link href={"/creator/livestream"}>
            <a>
              <DropdownMenu.Item className="flex items-baseline justify-between px-4 py-2 ">
                <span>Start a livestream</span>
                <span className="flex gap-2 text-sm text-gray-400">
                  <KeyboardIcon className="w-5 h-5" />L
                </span>
              </DropdownMenu.Item>
            </a>
          </Link>
        </div>
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
);

export default NavbarActionDropdown;
