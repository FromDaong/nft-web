import { BoldLink } from "@packages/shared/components/Typography/Text";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

const NFTDropdownSort = () => (
  <DropdownMenu.Root>
    <DropdownMenu.Trigger className="w-24 px-4 py-1 text-sm font-medium">
      <BoldLink>Sort by</BoldLink>
    </DropdownMenu.Trigger>
    <DropdownMenu.Portal>
      <DropdownMenu.Content className="z-30 p-3 shadow-xl gap-y-3 rounded-xl">
        <DropdownMenu.Item className="px-4 py-2">Newest</DropdownMenu.Item>
        <DropdownMenu.Item className="px-4 py-2">Oldest</DropdownMenu.Item>

        <DropdownMenu.Item className="px-4 py-2">
          Price: Lowest first
        </DropdownMenu.Item>
        <DropdownMenu.Item className="px-4 py-2">
          Price: Highest first
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
);

export default NFTDropdownSort;
