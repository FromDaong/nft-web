import {getCssText, reset, styled} from "@styles/theme";
import Document, {Head, Html, Main, NextScript} from "next/document";

import Script from "next/script";

const Body = styled("body", {
	backgroundColor: "$surface",
	color: "$text",
});

class MyDocument extends Document {
	static async getInitialProps(ctx) {
		const initialProps = await Document.getInitialProps(ctx);
		return {...initialProps};
	}

	render() {
		return (
			<Html>
				<Head>
					<link
						rel="icon"
						type="image/x-icon"
						href="/favicon.ico"
					/>
					<link
						rel="shortcut icon"
						type="image/x-icon"
						href="/favicon.ico"
					/>
					<link
						href="/favicon-16x16.png"
						rel="icon"
						type="image/png"
						sizes="16x16"
					/>
					<link
						href="/favicon-32x32.png"
						rel="icon"
						type="image/png"
						sizes="32x32"
					/>
					<link
						rel="apple-touch-icon"
						href="/apple-touch-icon.png"
					></link>
					<link
						rel="manifest"
						href="/site.webmanifest"
					/>
					<meta
						name="description"
						content="Spicy content. Directly from the Creators"
					/>
					<link
						rel="preconnect"
						href="https://fonts.googleapis.com"
					/>
					<link
						rel="preconnect"
						href="https://fonts.gstatic.com"
						crossOrigin="true"
					/>
					<link
						href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
						rel="stylesheet"
					/>

					<meta
						name="theme-color"
						content="#333333"
					/>
					<meta
						name="referrer"
						content={"strict-origin"}
					/>
					<style
						id="stitches"
						dangerouslySetInnerHTML={{__html: getCssText()}}
					/>
				</Head>
				<Body
					style={{marginRight: "0 !important"}}
					className="subpixel-antialiased"
				>
					<Main />
					<NextScript />

					<Script
						strategy="lazyOnload"
						async
						defer
						dangerouslySetInnerHTML={{
							__html: `(function(h,o,t,j,a,r){
									h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
									h._hjSettings={hjid:3531786,hjsv:6};
									a=o.getElementsByTagName('head')[0];
									r=o.createElement('script');r.async=1;
									r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
									a.appendChild(r);
								})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`,
						}}
					/>
					<Script
						strategy="lazyOnload"
						async
						defer
						dangerouslySetInnerHTML={{
							__html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
							new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
							j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
							'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
							})(window,document,'script','dataLayer','GTM-5MVFCZ9');`,
						}}
					/>
					<Script
						strategy="lazyOnload"
						async
						defer
						dangerouslySetInnerHTML={{
							__html: `
						!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
    					posthog.init('phc_ftxk2r2OtpzYhmK5DdURPJXfcyQSIIfga4wj8EMobFp',{api_host:'https://app.posthog.com'})
					`,
						}}
					/>
					<Script
						strategy="lazyOnload"
						async
						src="https://widget.xp.network/wscript.js"
					/>
					{false && (
						<noscript>
							<iframe
								src="https://www.googletagmanager.com/ns.html?id=GTM-5MVFCZ9"
								height="0"
								width="0"
								style={{
									display: "none",
									visibility: "hidden",
								}}
							></iframe>
						</noscript>
					)}
				</Body>
			</Html>
		);
	}
}

MyDocument.getInitialProps = async function getInitialProps(ctx) {
	// render page
	const results = await ctx.defaultGetInitialProps(ctx);
	const stitchesCssString = getCssText();
	reset();

	return {
		...results,
		styles: (
			<>
				{results.styles}
				<style
					id="stitches"
					dangerouslySetInnerHTML={{__html: stitchesCssString}}
				/>
			</>
		),
	};
};

export default MyDocument;
