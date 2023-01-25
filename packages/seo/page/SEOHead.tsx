import Head from "next/head";
import {ReactNode} from "react";
import OGSEO from "../opengraph";

export default function SEOHead(seo_props: {
	children?: ReactNode;
	title?: string;
	description?: string;
	type?: "page" | "profile" | "nft";
}) {
	const content_type = seo_props.type ?? "page";
	return (
		<Head>
			<title>{seo_props.title}</title>
			<OGSEO
				ogImgUrl={`/api/v3/og?type=${content_type}`}
				ogUrl="https://treatnfts.com"
				title={seo_props.title}
				description={seo_props.title}
			/>
			{seo_props.children}
		</Head>
	);
}
