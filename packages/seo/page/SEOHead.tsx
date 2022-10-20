import Head from "next/head";
import { ReactNode } from "react";

export default function SEOHead(seo_props: {
  children?: ReactNode;
  title?: string
}) {
  return (
    <Head>
      <title>
        {seo_props.title}
      </title>
      {seo_props.children}
    </Head>
  );
}
