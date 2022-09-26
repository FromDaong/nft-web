import { LightningBoltIcon } from "@radix-ui/react-icons";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { TriggerButton } from "packages/shared/components/Button";
import Link from "next/link";

const NavbarActionDropdown = () => (
  <DropdownMenu.Root>
    <DropdownMenu.Trigger>
      <TriggerButton className="flex items-center gap-4 px-5 py-3 text-gray-800 bg-gray-300 rounded-full">
        Create <LightningBoltIcon />
      </TriggerButton>
    </DropdownMenu.Trigger>
    <DropdownMenu.Portal>
      <DropdownMenu.Content className="p-3 shadow-xl gap-y-3 rounded-xl">
        <Link href={"/create/nft"}>
          <a>
            <DropdownMenu.Item className="px-4 py-2">
              Create NFT
            </DropdownMenu.Item>
          </a>
        </Link>
        <Link href={"/create/collection"}>
          <a>
            <DropdownMenu.Item className="px-4 py-2">
              Create NFT Collection
            </DropdownMenu.Item>
          </a>
        </Link>
        <Link href={"/create/livestream"}>
          <a>
            <DropdownMenu.Item className="px-4 py-2">
              Start a Livestream
            </DropdownMenu.Item>
          </a>
        </Link>
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
);

export default NavbarActionDropdown;