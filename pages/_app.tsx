import "@rainbow-me/rainbowkit/styles.css";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "pintura/pintura.css";

import "../styles/index.css";

import {Router} from "next/router";
import Head from "next/head";
import ProgressBar from "@badrap/bar-of-progress";
import Navbar from "packages/navigation/Navbar";
import {ThemeProvider} from "packages/theme";
import WagmiWrapper from "core/chain/connect";
import {AppProps} from "next/app";
import type {Session} from "next-auth";
import {ApplicationProvider} from "core/provider";
import AcceptAgeModal from "@packages/modals/AcceptAgeModal";
import {Container} from "@packages/shared/components/Container";
import Footer from "@packages/shared/components/Footer";
import {Analytics} from "@vercel/analytics/react";

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

	// T-33 Implement master action tracker based on profile id. Should includes all actions, create, buy, relist, follow, etc.

	return (
		<>
			<ThemeProvider>
				<ApplicationProvider>
					<WagmiWrapper pageProps={pageProps}>
						<Head>
							<title>Treat DAO</title>
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
			<Analytics />
		</>
	);
}

export default MyApp;
