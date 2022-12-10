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
		default: {name: "Bscscan", url: "https://bscscan.com"},
	},
	testnet: false,
};

const {provider} = configureChains(
	[binance],
	[alchemyProvider({apiKey: "yourAlchemyApiKey"}), publicProvider()]
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

const WagmiWrapper = ({children}: {children: ReactNode}) => {
	const {theme} = useTheme();

	const fetchingStatusRef = useRef(false);
	const verifyingRef = useRef(false);
	const [authStatus, setAuthStatus] = useState<AuthenticationStatus>("loading");

	// Fetch user when:
	useEffect(() => {
		const fetchStatus = async () => {
			if (fetchingStatusRef.current || verifyingRef.current) {
				return;
			}

			fetchingStatusRef.current = true;

			try {
				const response = await fetch("/api/me");
				const json = await response.json();
				setAuthStatus(json.address ? "authenticated" : "unauthenticated");
			} catch (_error) {
				setAuthStatus("unauthenticated");
			} finally {
				fetchingStatusRef.current = false;
			}
		};

		// 1. page loads
		fetchStatus();

		// 2. window is focused (in case user logs out of another window)
		window.addEventListener("focus", fetchStatus);
		return () => window.removeEventListener("focus", fetchStatus);
	}, []);

	const authAdapter = useMemo(() => {
		return createAuthenticationAdapter({
			getNonce: async () => {
				const response = await fetch("/api/nonce");
				return await response.text();
			},

			createMessage: ({nonce, address, chainId}) => {
				return new SiweMessage({
					domain: window.location.host,
					address,
					statement: "Sign in with Ethereum to the app.",
					uri: window.location.origin,
					version: "1",
					chainId,
					nonce,
				});
			},

			getMessageBody: ({message}) => {
				return message.prepareMessage();
			},

			verify: async ({message, signature}) => {
				verifyingRef.current = true;

				try {
					const response = await fetch("/api/verify", {
						method: "POST",
						headers: {"Content-Type": "application/json"},
						body: JSON.stringify({message, signature}),
					});

					const authenticated = Boolean(response.ok);

					if (authenticated) {
						setAuthStatus(authenticated ? "authenticated" : "unauthenticated");
					}

					return authenticated;
				} catch (error) {
					return false;
				} finally {
					verifyingRef.current = false;
				}
			},

			signOut: async () => {
				setAuthStatus("unauthenticated");
				await fetch("/api/logout");
			},
		});
	}, []);

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
			<RainbowKitAuthenticationProvider
				adapter={authAdapter}
				status={authStatus}
			>
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
					{children}
				</RainbowKitProvider>
			</RainbowKitAuthenticationProvider>
		</WagmiConfig>
	);
};

export default WagmiWrapper;
