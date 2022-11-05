import {
  RainbowKitProvider,
  lightTheme,
  connectorsForWallets,
  DisclaimerComponent,
} from "@rainbow-me/rainbowkit";
import {
  injectedWallet,
  walletConnectWallet,
  metaMaskWallet,
  coinbaseWallet,
} from "@rainbow-me/rainbowkit/wallets";

import { Chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { ReactNode } from "react";
import {
  RainbowKitSiweNextAuthProvider,
  GetSiweMessageOptions,
} from "core/auth/components/AuthenticationProvider";

const binance: Chain = {
  id: 56,
  name: "Binance Smart Chain",
  network: "bsc",
  nativeCurrency: {
    decimals: 18,
    name: "Binance",
    symbol: "BNB",
  },
  rpcUrls: {
    default: "https://bsc-dataseed1.binance.org",
  },
  blockExplorers: {
    default: { name: "Bscscan", url: "https://bscscan.com" },
  },
  testnet: false,
};

const { provider } = configureChains(
  [binance],
  [alchemyProvider({ apiKey: "yourAlchemyApiKey" }), publicProvider()]
);

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      injectedWallet({
        chains: [binance],
        shimDisconnect: true,
      }),
      metaMaskWallet({
        chains: [binance],
        shimDisconnect: true,
      }),
      coinbaseWallet({
        chains: [binance],
        appName: "Treat",
      }),
      walletConnectWallet({ chains: [binance] }),
    ],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: "Sign in to Trit",
});

const Disclaimer: DisclaimerComponent = ({ Text, Link }) => (
  <Text>
    By connecting your wallet, you agree to the{" "}
    <Link href="/tos">Terms of Service</Link> and acknowledge you have read and
    understand the protocol <Link href="/tos">Disclaimer</Link>
  </Text>
);

const WagmiWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitSiweNextAuthProvider
        getSiweMessageOptions={getSiweMessageOptions}
      >
        <RainbowKitProvider
          modalSize="compact"
          appInfo={{
            appName: "Trit",
            disclaimer: Disclaimer,
          }}
          showRecentTransactions={true}
          chains={[binance]}
          theme={lightTheme({
            accentColor: "#db2777",
            accentColorForeground: "white",
          })}
        >
          {children}
        </RainbowKitProvider>
      </RainbowKitSiweNextAuthProvider>
    </WagmiConfig>
  );
};

export default WagmiWrapper;
