import { SEOHead } from "@packages/seo/page";
import ProfileLayout from "core/components/layouts/ProfileLayout";
import { useRouter } from "next/router";

export default function Trits() {
  const router = useRouter();
  return (
    <ProfileLayout>
      <SEOHead title={router.query.username + " - Trit"} />
    </ProfileLayout>
  );
}
