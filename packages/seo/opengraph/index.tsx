import Head from "next/head";

export default function OGSEO({ title, description, ogUrl, ogImgUrl }) {
  return (
    <Head>
      <meta key="og:type" property="og:type" content="website" />
      <meta key="og:title" property="og:title" content={title} />
      <meta
        key="og:description"
        property="og:description"
        content={description}
      />
      <meta key="og:image" property="og:image" content={ogImgUrl} />
      <meta key="og:url" property="og:url" content={ogUrl} />
      <meta
        key="twitter:card"
        property="twitter:card"
        content="summary_large_image"
      />
    </Head>
  );
}
