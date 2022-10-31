import {
  ArrowRightIcon,
  CurrencyDollarIcon,
  DesktopComputerIcon,
  LogoutIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  CogIcon,
} from "@heroicons/react/solid";
import * as Avatar from "@radix-ui/react-avatar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { useApplicationTheme } from "packages/theme/provider";
import { useAccount } from "wagmi";
import { DropdownContainer, DropdownContent } from "./DropdownContainer";

type Props = {
  disconnect: () => void;
};

const NavbarProfileAvatar = (props: Props) => {
  const { updateTheme, nextTheme } = useApplicationTheme();
  const { address } = useAccount();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Avatar.Root className="rounded-full shadow bg-gray-50">
          <Avatar.Image
            className="object-cover w-10 h-10 rounded-full shadow-md"
            src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
          />
          <Avatar.Fallback className="rounded-full shadow-xl ">
            <p className="flex items-center justify-center w-10 h-10 font-medium bg-white border rounded-full drop-shadow-sm shadow-pink-500/10 text-slate-700">
              TR
            </p>
          </Avatar.Fallback>
        </Avatar.Root>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownContent>
          <DropdownContainer>
            <DropdownMenu.Item className="flex justify-between p-2 rounded-xl hover:bg-gray-50 hover:cursor-pointer">
              <div className="flex items-center gap-4 py-2">
                <Avatar.Root className="rounded-full shadow bg-gray-50">
                  <Avatar.Image
                    className="object-cover w-10 h-10 rounded-full shadow-md"
                    src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
                  />
                </Avatar.Root>
                <div className="flex flex-col">
                  <p className="font-medium text-gray-900">Terry Rivers</p>
                  <p className="text-sm font-medium text-gray-500">
                    {address.slice(0, 5) +
                      "..." +
                      address.slice(address.length - 4)}
                  </p>
                </div>
              </div>
            </DropdownMenu.Item>
            <DropdownMenu.DropdownMenuGroup className="py-2">
              <Link href={"/account/upgrade"}>
                <a>
                  <DropdownMenu.Item className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 hover:cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-gray-100 rounded-full">
                        <ShoppingBagIcon className="w-5 h-5 text-gray-700" />
                      </div>
                      <p className="font-medium">
                        Upgrade to a Tritter account
                      </p>
                    </div>
                    <ArrowRightIcon className="w-5 h-5 text-gray-700" />
                  </DropdownMenu.Item>
                </a>
              </Link>
              <DropdownMenu.Item className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 hover:cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-gray-100 rounded-full">
                    <CurrencyDollarIcon className="w-5 h-5 text-gray-700" />
                  </div>
                  <p className="font-medium">Buy crypto</p>
                </div>
                <ArrowRightIcon className="w-5 h-5 text-gray-700" />
              </DropdownMenu.Item>
            </DropdownMenu.DropdownMenuGroup>
            <DropdownMenu.DropdownMenuGroup className="py-2">
              <DropdownMenu.Item className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 hover:cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-gray-100 rounded-full">
                    <UserCircleIcon className="w-5 h-5 text-gray-700" />
                  </div>
                  <p className="font-medium">Profile & account</p>
                </div>
                <ArrowRightIcon className="w-5 h-5 text-gray-700" />
              </DropdownMenu.Item>
              <DropdownMenu.Item className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 hover:cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-gray-100 rounded-full">
                    <CogIcon className="w-5 h-5 text-gray-700" />
                  </div>
                  <p className="font-medium">Settings & privacy</p>
                </div>
                <ArrowRightIcon className="w-5 h-5 text-gray-700" />
              </DropdownMenu.Item>
              <DropdownMenu.Item className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 hover:cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-gray-100 rounded-full">
                    <DesktopComputerIcon className="w-5 h-5 text-gray-700" />
                  </div>
                  <p className="font-medium">Display & accessibility</p>
                </div>
                <ArrowRightIcon className="w-5 h-5 text-gray-700" />
              </DropdownMenu.Item>
            </DropdownMenu.DropdownMenuGroup>
            <DropdownMenu.DropdownMenuGroup className="py-2">
              <DropdownMenu.Item
                onClick={disconnect}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 hover:cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-gray-100 rounded-full">
                    <LogoutIcon className="w-5 h-5 text-gray-700" />{" "}
                  </div>
                  <p className="font-medium">Sign out</p>
                </div>
              </DropdownMenu.Item>
            </DropdownMenu.DropdownMenuGroup>
          </DropdownContainer>
        </DropdownContent>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default NavbarProfileAvatar;
