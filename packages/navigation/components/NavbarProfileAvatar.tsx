import {
  ArrowRightIcon,
  CurrencyDollarIcon,
  DesktopComputerIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  CogIcon,
} from "@heroicons/react/solid";
import { BoldLink, Text } from "@packages/shared/components/Typography/Text";
import * as Avatar from "@radix-ui/react-avatar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { useAccount } from "wagmi";
import { DropdownContainer, DropdownContent } from "./DropdownContainer";
import WalletConnectButton from "./WalletConnectButton";

const NavbarProfileAvatar = () => {
  // TODO: Implement theme customization
  // const { updateTheme, nextTheme } = useApplicationTheme();
  const { address, isConnected } = useAccount();

  console.log({ address, isConnected });

  if (!isConnected) {
    return null;
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Avatar.Root className="rounded-full shadow">
          <Avatar.Image
            className="object-cover w-10 h-10 rounded-full shadow-md"
            src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
          />
          <Avatar.Fallback className="rounded-full shadow-xl ">
            <Text className="flex items-center justify-center w-10 h-10 border rounded-full">
              TR
            </Text>
          </Avatar.Fallback>
        </Avatar.Root>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownContent>
          <DropdownContainer className="drop-shadow-2xl">
            <DropdownMenu.DropdownMenuGroup>
              <DropdownMenu.DropdownMenuItem>
                <WalletConnectButton />
              </DropdownMenu.DropdownMenuItem>
            </DropdownMenu.DropdownMenuGroup>
            <DropdownMenu.DropdownMenuGroup className="py-2 mt-2">
              <Link href={"/account/upgrade"}>
                <a>
                  <DropdownMenu.Item className="flex items-center justify-between p-2 rounded-xl hover:cursor-pointer">
                    <div className="flex items-center gap-4">
                      <Text className="p-2 rounded-full">
                        <ShoppingBagIcon className="w-5 h-5 " />
                      </Text>
                      <BoldLink>Become a Tritter</BoldLink>
                    </div>
                    <ArrowRightIcon className="w-5 h-5 " />
                  </DropdownMenu.Item>
                </a>
              </Link>
              <DropdownMenu.Item className="flex items-center justify-between p-2 rounded-xl hover:cursor-pointer">
                <div className="flex items-center gap-4">
                  <Text className="p-2 rounded-full">
                    <CurrencyDollarIcon className="w-5 h-5 " />
                  </Text>
                  <BoldLink>Buy crypto</BoldLink>
                </div>
                <ArrowRightIcon className="w-5 h-5 " />
              </DropdownMenu.Item>
              <DropdownMenu.Item className="flex items-center justify-between p-2 rounded-xl hover:cursor-pointer">
                <div className="flex items-center gap-4">
                  <Text className="p-2 rounded-full">
                    <UserCircleIcon className="w-5 h-5 " />
                  </Text>
                  <BoldLink>Profile & account</BoldLink>
                </div>
                <ArrowRightIcon className="w-5 h-5 " />
              </DropdownMenu.Item>
              <DropdownMenu.Item className="flex items-center justify-between p-2 rounded-xl hover:cursor-pointer">
                <div className="flex items-center gap-4">
                  <Text className="p-2 rounded-full">
                    <CogIcon className="w-5 h-5 " />
                  </Text>
                  <BoldLink>Settings & privacy</BoldLink>
                </div>
                <ArrowRightIcon className="w-5 h-5 " />
              </DropdownMenu.Item>
              <DropdownMenu.Item className="flex items-center justify-between p-2 rounded-xl hover:cursor-pointer">
                <div className="flex items-center gap-4">
                  <Text className="p-2 rounded-full">
                    <DesktopComputerIcon className="w-5 h-5 " />
                  </Text>
                  <BoldLink>Display & accessibility</BoldLink>
                </div>
                <ArrowRightIcon className="w-5 h-5 " />
              </DropdownMenu.Item>
            </DropdownMenu.DropdownMenuGroup>
          </DropdownContainer>
        </DropdownContent>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default NavbarProfileAvatar;
