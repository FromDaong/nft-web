import * as Avatar from "@radix-ui/react-avatar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { useApplicationTheme } from "packages/theme/provider";
import { useAccount } from "wagmi";

type Props = {
  disconnect: () => void;
};

const NavbarProfileAvatar = (props: Props) => {
  const { updateTheme, nextTheme } = useApplicationTheme();
  const {address} = useAccount()

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Avatar.Root className="rounded-full shadow bg-gray-50">
          <Avatar.Image
            className="object-cover w-10 h-10 rounded-full shadow-md"
            src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
          />
          <Avatar.Fallback className="rounded-full shadow-xl ">
            <p className="flex items-center justify-center w-10 h-10 font-medium bg-white border-2 rounded-full text-slate-700">TR</p>
          </Avatar.Fallback>
        </Avatar.Root>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="z-50 py-2 divide-y divide-gray-500/10 min-w-[256px] w-auto bg-white shadow-xl gap-y-3 rounded-xl">
          <div className="px-2 pb-2">
            <div className="flex p-2 items-center font-medium backdrop-contrast-[0.9] shadow shadow-blue-100 bg-blue-500 text-white rounded-xl text-center text-sm">
              <div className="w-1/2">
                76.00 $TREAT
              </div>
              <div className="w-1/2 p-2 text-blue-500 bg-white rounded-xl">
                {address.slice(0,5)}...{address.slice(address.length - 5)}
              </div>
            </div>
          </div>
          <div>
            <Link href={"/messages"}>
              <a>
                <DropdownMenu.Item className="flex justify-between px-4 py-2">
                  <span>Messages</span>
                  <span className="items-baseline text-sm text-gray-400">
                    M
                  </span>
                </DropdownMenu.Item>
              </a>
            </Link>
          </div>
          <div>
            <Link href={"/activity"}>
              <a>
                <DropdownMenu.Item className="flex justify-between px-4 py-2">
                  <span>Activity</span>
                  <span className="items-baseline text-sm text-gray-400">
                    A
                  </span>
                </DropdownMenu.Item>
              </a>
            </Link>
          </div>
          <div>
            <Link href={"/account"}>
              <a>
                <DropdownMenu.Item className="flex justify-between px-4 py-2">
                  <span>Account</span>
                  <span className="items-baseline text-sm text-gray-400">
                    P
                  </span>
                </DropdownMenu.Item>
              </a>
            </Link>
          </div>
          <div>
            <Link href={"/flow/upgrade_to_creator"}>
              <a>
                <DropdownMenu.Item className="flex justify-between px-4 py-2">
                  <span>Become a creator</span>
                  <span className="items-baseline text-sm text-gray-400">
                    U
                  </span>
                </DropdownMenu.Item>
              </a>
            </Link>{" "}
          </div>
          <div>
            <DropdownMenu.Item
              onClick={() => updateTheme(nextTheme)}
              className="flex items-baseline justify-between px-4 py-2 "
            >
              <span>Use {nextTheme} theme</span>
              <span className="text-sm text-gray-400">T</span>
            </DropdownMenu.Item>
          </div>
          <div>
            <DropdownMenu.Item onClick={props.disconnect} className="w-full">
              <button className="flex items-baseline justify-between w-full px-4 py-2">
                <span>Sign out</span>
                <span className="text-sm text-gray-400">S</span>
              </button>
            </DropdownMenu.Item>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default NavbarProfileAvatar;
