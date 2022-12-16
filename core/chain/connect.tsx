import {
	RainbowKitProvider,
	lightTheme,
	connectorsForWallets,
	DisclaimerComponent,
	darkTheme,
	RainbowKitAuthenticationProvider,
	createAuthenticationAdapter,
	AuthenticationStatus,
} from "@rainbow-me/rainbowkit";
import {
	injectedWallet,
	walletConnectWallet,
	metaMaskWallet,
	coinbaseWallet,
} from "@rainbow-me/rainbowkit/wallets";

import {Chain, configureChains, createClient, WagmiConfig} from "wagmi";
import {alchemyProvider} from "wagmi/providers/alchemy";
import {publicProvider} from "wagmi/providers/public";
import {ReactNode, useEffect, useMemo, useRef, useState} from "react";
import {
	RainbowKitSiweNextAuthProvider,
	GetSiweMessageOptions,
} from "core/auth/components/AuthenticationProvider";
import {useTheme} from "@packages/theme";
import authenticationAdapter from "./connectAdapter";
import {SiweMessage} from "siwe";
import {SessionProvider, useSession} from "next-auth/react";
import {useDisclosure} from "@packages/hooks";
import CreateProfileModal from "@packages/onboarding/CreateProfileModal";

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
		default: "https://bsc-dataseed.binance.org",
	},
	blockExplorers: {
		default: {name: "Bscscan", url: "https://bscscan.com"},
	},
	testnet: false,
};

export const {chains, provider} = configureChains(
	[binance],
	[publicProvider()]
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
			walletConnectWallet({chains: [binance]}),
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

const Disclaimer: DisclaimerComponent = ({Text, Link}) => (
	<Text>
		By connecting your wallet, you agree to the{" "}
		<Link href="/tos">Terms of Service</Link> and acknowledge you have read and
		understand the protocol <Link href="/tos">Disclaimer</Link>
	</Text>
);

const WagmiWrapper = ({
	children,
	pageProps,
}: {
	children: ReactNode;
	pageProps: any;
}) => {
	const {theme} = useTheme();

	const themes = {
		light: lightTheme({
			accentColor: "#121212",
			accentColorForeground: "white",
		}),
		dark: darkTheme(),
		pink: lightTheme({
			accentColor: "#121212",
			accentColorForeground: "white",
		}),
	};

	return (
		<WagmiConfig client={wagmiClient}>
			<SessionProvider
				refetchInterval={0}
				session={pageProps.session}
			>
				<RainbowKitSiweNextAuthProvider>
					<RainbowKitProvider
						modalSize="compact"
						appInfo={{
							appName: "Trit",
							disclaimer: Disclaimer,
						}}
						showRecentTransactions={true}
						chains={[binance]}
						theme={themes[theme]}
					>
						<SessionRequires />
						{children}
					</RainbowKitProvider>
				</RainbowKitSiweNextAuthProvider>
			</SessionProvider>
		</WagmiConfig>
	);
};

const SessionRequires = () => {
	const {data} = useSession();
	const {isOpen, onOpen, onClose} = useDisclosure();

	useEffect(() => {
		// @ts-ignore
		if (data && !data.profile) {
			onOpen();
		} else {
			onClose();
		}
	}, [data]);

	return (
		<>
			<CreateProfileModal
				isOpen={isOpen}
				onClose={onClose}
			/>
		</>
	);
};

export default WagmiWrapper;
