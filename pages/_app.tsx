import "@rainbow-me/rainbowkit/styles.css";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

import "../styles/index.css";

import {Router} from "next/router";
import Head from "next/head";
import ProgressBar from "@badrap/bar-of-progress";
import Navbar from "packages/navigation/Navbar";
import Footer from "packages/shared/components/Footer";
import {ThemeProvider} from "packages/theme";
import {FpjsProvider} from "@fingerprintjs/fingerprintjs-pro-react";
import WagmiWrapper from "core/chain/connect";
import {UniversalCommandbar} from "@packages/commandbar";
import {AppProps} from "next/app";
import type {Session} from "next-auth";
import {SessionProvider} from "next-auth/react";
import {useDeveloperTools} from "@packages/hooks";
import {useEffect} from "react";
import Onboarding from "@packages/ikaros/onboarding";
import FollowersModal from "@packages/modals/FollowersModal";
import {ApplicationProvider} from "core/provider";

const progress = new ProgressBar({
	size: 3,
	color: "#805ad5",
	className: "bar-of-progress",
	delay: 100,
});
Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeComplete", progress.finish);
Router.events.on("routeChangeError", progress.finish);

function MyApp({
	Component,
	pageProps,
}: AppProps<{
	session: Session;
}>) {
	const {toggleDesignMode} = useDeveloperTools();

	useEffect(() => {
		toggleDesignMode(false);
	}, []);

	return (
		<ThemeProvider>
			<SessionProvider
				session={pageProps.session}
				refetchInterval={0}
			>
				<ApplicationProvider>
					<WagmiWrapper>
						<Head>
							<title>Treat DAO</title>
							<meta
								name="title"
								content="Treat DAO"
							/>
							<meta
								name="image"
								content="https://i.imgur.com/OEiuwp4.jpg"
							/>
							<meta
								property="og:image"
								content="https://i.imgur.com/OEiuwp4.jpg"
							/>

							<meta
								name="description"
								content="Treat is an exclusive platform for creators to sell NFTs. Hold $TREAT to have a say on which creators are chosen & new platform features."
							/>
						</Head>
						{
							// /<FollowersModal />
						}
						<UniversalCommandbar />
						<Onboarding
							config={{}}
							isOpen={false}
						/>
						<Navbar />
						<main className="mt-[60px]">
							<Component {...pageProps} />
						</main>
					</WagmiWrapper>
				</ApplicationProvider>
			</SessionProvider>
		</ThemeProvider>
	);
}

export default MyApp;
