import Artworker from "@packages/photo-editor";
import { SEOHead } from "@packages/seo/page";

export default function Editor() {
  return (
    <>
      <SEOHead title="Image Editor" />
      <div className="mt-12">
        <Artworker />
      </div>
    </>
  );
}
