import * as Avatar from "@radix-ui/react-avatar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { useApplicationTheme } from "packages/theme/provider";

type Props = {
  disconnect: () => void
}

const NavbarProfileAvatar = (props: Props) => {
  const { updateTheme, nextTheme } = useApplicationTheme();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Avatar.Root className="rounded-full shadow bg-gray-50">
          <Avatar.Image
            className="object-cover w-10 h-10 rounded-full shadow-md"
            src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
          />
          <Avatar.Fallback className="w-10 h-10 rounded-full shadow-md">
            <p>TR</p>
          </Avatar.Fallback>
        </Avatar.Root>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="z-50 p-3 bg-white shadow-xl gap-y-3 rounded-xl">
          <Link href={"/messages"}>
            <a>
              <DropdownMenu.Item className="px-4 py-2">
                Messages
              </DropdownMenu.Item>
            </a>
          </Link>
          <Link href={"/activity"}>
            <a>
              <DropdownMenu.Item className="px-4 py-2">
                Activity
              </DropdownMenu.Item>
            </a>
          </Link>
          <Link href={"/account"}>
            <a>
              <DropdownMenu.Item className="px-4 py-2">
                Account
              </DropdownMenu.Item>
            </a>
          </Link>
          <DropdownMenu.Separator />
          <DropdownMenu.Group>
            <Link href={"/flow/upgrade_to_creator"}>
              <a>
                <DropdownMenu.Item className="px-4 py-2">
                  Become a creator
                </DropdownMenu.Item>
              </a>
            </Link>{" "}
            <DropdownMenu.Item
              onClick={() => updateTheme(nextTheme)}
              className="px-4 py-2"
            >
              Use {nextTheme} theme
            </DropdownMenu.Item>
          </DropdownMenu.Group>
          <DropdownMenu.Separator />
          <DropdownMenu.Item onClick={props.disconnect} className="w-full">
            <button className="px-4 py-2">Sign out</button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default NavbarProfileAvatar;
