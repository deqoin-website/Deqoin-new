import SeoHead from "@/components/SeoHead";
import { getStaticSeo } from "@/lib/seo-routes";

export default function Head() {
  const seo = getStaticSeo("/mimari");
  return <SeoHead title={seo.title} description={seo.description} canonicalPath="/mimari" keywords={seo.keywords} />;
}
