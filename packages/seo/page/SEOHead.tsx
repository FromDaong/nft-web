import Head from "next/head";
import { ReactNode } from "react";
import OGSEO from "../opengraph";

export default function SEOHead(seo_props: {
  children?: ReactNode;
  title?: string;
}) {
  return (
    <Head>
      <title>{seo_props.title}</title>
      <OGSEO
        ogImgUrl={"https://treatnfts.com/api/v3/og"}
        ogUrl="https://treatnfts.com"
        title={seo_props.title}
        description={seo_props.title}
      />
      {seo_props.children}
    </Head>
  );
}
