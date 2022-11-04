import { BoldLink } from "@packages/shared/components/Typography/Text";
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
                  <button onClick={openConnectModal} type="button">
                    Verify wallet signature
                  </button>
                );
              }

              return (
                <div className="flex flex-col gap-1 p-2 border border-gray-100 rounded-xl">
                  <div
                    style={{ display: "flex", gap: 12 }}
                    className="flex items-center justify-between px-4 py-2 rounded-xl hover:cursor-pointer"
                  >
                    <button
                      onClick={openAccountModal}
                      className="flex items-center py-2 gap-x-3"
                    >
                      <Avatar.Root className="rounded-full shadow bg-gray-50">
                        <Avatar.Image
                          className="object-cover w-10 h-10 rounded-full shadow-md"
                          src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
                        />
                      </Avatar.Root>
                      <div className="flex flex-col">
                        <h6 className="font-medium text-gray-900">
                          Terry Rivers
                        </h6>
                        <p className="text-sm text-gray-500">
                          {account.displayName}
                        </p>
                      </div>
                    </button>
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
                    <button
                      onClick={openAccountModal}
                      className="gap-4 p-2 bg-gray-100 rounded-xl hover:bg-gray-50 hover:cursor-pointer"
                    >
                      <BoldLink>Manage wallet connection</BoldLink>
                    </button>
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
