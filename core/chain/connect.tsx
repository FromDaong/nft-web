import { getDefaultWallets, RainbowKitProvider, lightTheme } from "@rainbow-me/rainbowkit";
import { Chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

import { ReactNode } from "react";

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

const { chains, provider } = configureChains(
  [binance],
  [alchemyProvider({ apiKey: process.env.ALCHEMY_ID }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Treat",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const WagmiWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider modalSize="compact" chains={chains} theme={lightTheme({
        accentColor: '#db2777',
        accentColorForeground: 'white',
      })}>{children}</RainbowKitProvider>
    </WagmiConfig>
  );
};

export default WagmiWrapper;
