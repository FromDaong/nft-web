import Layout from "../components/Layout";

export default function Test() {
  return (
    <Layout>
      <picture>
        <source
          srcset="//ucarecdn.com/92c9f14d-5220-4cf5-8f9f-65d269e99ef7/-/format/webp/"
          type="image/webp"
        />
        <img src="//ucarecdn.com/92c9f14d-5220-4cf5-8f9f-65d269e99ef7/-/format/jpeg/" />
      </picture>
    </Layout>
  );
}
