import { Button } from "@packages/shared/components/Button";
import { Heading } from "@packages/shared/components/Typography/Headings";
import { BoldLink, Text } from "@packages/shared/components/Typography/Text";
import * as Avatar from "@radix-ui/react-avatar";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { getChainNameById } from "core/chain";

export default function WalletConnectButton() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        return (
          <div
            {...(!mounted && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!mounted || !account || !chain) {
                return (
                  <Button onClick={openConnectModal} type="button">
                    Verify wallet signature
                  </Button>
                );
              }

              return (
                <div className="pb-2 rounded-xl">
                  <div
                    style={{ display: "flex" }}
                    className="flex items-center justify-between py-2 rounded-xl hover:cursor-pointer"
                  >
                    <Button
                      onClick={openAccountModal}
                      className="flex items-center py-4 mb-2 gap-x-3"
                      appearance={"surface"}
                      fullWidth
                    >
                      <Avatar.Root className="rounded-full">
                        <Avatar.Image
                          className="object-cover w-10 h-10 rounded-full shadow-md"
                          src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
                        />
                      </Avatar.Root>
                      <div className="w-full">
                        <Heading size="xs">Terry Rivers</Heading>
                        <Text>{account.displayName}</Text>
                      </div>
                    </Button>
                  </div>
                  {chain.unsupported ? (
                    <div
                      onClick={openChainModal}
                      className="flex flex-col px-4 py-2 rounded-xl hover:cursor-pointer bg-red-400/10"
                    >
                      <span className="font-medium text-red-600">
                        Oops, {getChainNameById(chain.id)} network unsupported
                      </span>
                      <span className="flex text-sm opacity-70">
                        Please switch to a supported network
                      </span>
                    </div>
                  ) : (
                    <Button
                      fullWidth
                      onClick={openAccountModal}
                      className="p-2 "
                      appearance={"default"}
                    >
                      Manage wallet connection
                    </Button>
                  )}
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
