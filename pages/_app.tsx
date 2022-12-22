import "@rainbow-me/rainbowkit/styles.css";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "pintura/pintura.css";

import "../styles/index.css";

import {Router, useRouter} from "next/router";
import Head from "next/head";
import ProgressBar from "@badrap/bar-of-progress";
import Navbar from "packages/navigation/Navbar";
import {ThemeProvider} from "packages/theme";
import WagmiWrapper from "core/chain/connect";
import {AppProps} from "next/app";
import type {Session} from "next-auth";
import {ApplicationProvider} from "core/provider";
import AcceptAgeModal from "@packages/modals/AcceptAgeModal";
import {useEffect} from "react";
import {Container} from "@packages/shared/components/Container";
import Footer from "@packages/shared/components/Footer";
import {useConnectModal} from "@rainbow-me/rainbowkit";
import {publicRoutes} from "@utils/routes";
import {useSession} from "next-auth/react";

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
	// T-24 implement captcha

	// T-27 Implement error and success toasts

	return (
		<ThemeProvider>
			<ApplicationProvider>
				<WagmiWrapper pageProps={pageProps}>
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

					<AcceptAgeModal />
					<Navbar />
					<main className="mt-[60px]">
						<Component {...pageProps} />
					</main>
					<Container className="pb-12">
						<Footer />
					</Container>
				</WagmiWrapper>
			</ApplicationProvider>
		</ThemeProvider>
	);
}

export default MyApp;
