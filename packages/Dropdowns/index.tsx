import { ChevronDownIcon } from "@heroicons/react/outline";
import { DropdownContent } from "@packages/navigation/components/DropdownContainer";
import { profile_utils } from "@packages/profile";
import { Button } from "@packages/shared/components/Button";
import { ImportantSmallText } from "@packages/shared/components/Typography/Text";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { styled } from "@styles/theme";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";

export const DropdownMenuItem = styled(DropdownMenu.Item, {
  padding: "8px 16px",
  "&:hover": {
    backgroundColor: "$elementOnSurface",
    cursor: "pointer",
    borderRadius: "15px",
  },
});

export const ProfileDropdown = (user: { username: string }) => {
  const { address } = useAccount();
  const router = useRouter();
  const share_profile = () => {
    return console.log(
      profile_utils(router.query.username).share_profile(address)
    );
  };
  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button
            css={{ backgroundColor: "$surface" }}
            outlined
            className="flex items-center drop-shadow-xl"
          >
            0x0093...0832
            <ChevronDownIcon className="w-4 h-4" />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownContent
            className="drop-shadow-2xl"
            css={{
              backgroundColor: "$surface",
              padding: "4px",
              borderRadius: "21px",
              minWidth: "180px",
              marginTop: "6px",
            }}
          >
            <DropdownMenu.Group>
              <DropdownMenuItem>
                <ImportantSmallText>Send a tip</ImportantSmallText>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={share_profile}>
                <ImportantSmallText>Share</ImportantSmallText>
              </DropdownMenuItem>
            </DropdownMenu.Group>
            <DropdownMenu.Group>
              <DropdownMenuItem>
                <ImportantSmallText css={{ color: "$errorText" }}>
                  Block
                </ImportantSmallText>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ImportantSmallText css={{ color: "$errorText" }}>
                  Report
                </ImportantSmallText>
              </DropdownMenuItem>
            </DropdownMenu.Group>
          </DropdownContent>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </>
  );
};
