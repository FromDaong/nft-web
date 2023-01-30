import Head from "next/head";
import {ReactNode} from "react";

export default function SEOHead(seo_props: {
	children?: ReactNode;
	title?: string;
	description?: string;
	type?: "page" | "profile" | "nft";
	data?: object;
}) {
	const content_type = seo_props.type ?? "page";
	const search = new URLSearchParams({
		...seo_props.data,
		type: content_type,
	});
	return (
		<Head>
			<title>{seo_props.title}</title>
			<meta
				key="og:type"
				property="og:type"
				content="website"
			/>
			<meta
				key="og:title"
				property="og:title"
				content={seo_props.title}
			/>
			<meta
				key="og:description"
				property="og:description"
				content={seo_props.description}
			/>
			<meta
				key="og:image"
				property="og:image"
				content={`/api/v3/og?${search}`}
			/>
			<meta
				key="og:url"
				property="og:url"
				content={"https://treatnfts.com"}
			/>
			<meta
				key="twitter:card"
				property="twitter:card"
				content="summary_large_image"
			/>
			{seo_props.children}
		</Head>
	);
}
