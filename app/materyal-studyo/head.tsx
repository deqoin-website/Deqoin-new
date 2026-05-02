import SeoHead from "@/components/SeoHead";
import { getStaticSeo } from "@/lib/seo-routes";

export default function Head() {
  const seo = getStaticSeo("/materyal-studyo");
  return <SeoHead title={seo.title} description={seo.description} canonicalPath="/materyal-studyo" keywords={seo.keywords} />;
}
