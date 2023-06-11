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
import {Analytics} from "@vercel/analytics/react";
import TreatBalancesProvider from "core/auth/components/TreatBalancesProvider";
import {Provider} from "urql";
import {treatGraphClient} from "@lib/graphClients";
import {Toaster} from "sonner";

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
		<Provider value={treatGraphClient}>
			<ApplicationProvider>
				<WagmiWrapper pageProps={pageProps}>
					<TreatBalancesProvider>
						<ThemeProvider>
							<Toaster />
							<Head>
								<title>Treat DAO</title>
							</Head>

							<AcceptAgeModal />
							<Navbar />
							<Component {...pageProps} />
						</ThemeProvider>
					</TreatBalancesProvider>
				</WagmiWrapper>
			</ApplicationProvider>
			<Analytics />
		</Provider>
	);
}

export default MyApp;
