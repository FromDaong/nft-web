import "@rainbow-me/rainbowkit/styles.css";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "pintura/pintura.css";
import "react-image-lightbox/style.css";
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
import {Toaster} from "react-hot-toast";
import TreatBalancesProvider from "core/auth/components/TreatBalancesProvider";

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
	return (
		<>
			<ThemeProvider>
				<ApplicationProvider>
					<WagmiWrapper pageProps={pageProps}>
						<TreatBalancesProvider>
							<Toaster />
							<Head>
								<title>Treat DAO</title>
							</Head>

							<AcceptAgeModal />
							<Navbar />
							<main>
								<Component {...pageProps} />
							</main>
							<Container className="pb-12">
								<Footer />
							</Container>
						</TreatBalancesProvider>
					</WagmiWrapper>
				</ApplicationProvider>
			</ThemeProvider>
			<Analytics />
		</>
	);
}

export default MyApp;
