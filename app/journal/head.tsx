import SeoHead from "@/components/SeoHead";
import { getStaticSeo } from "@/lib/seo-routes";

export default function Head() {
  const seo = getStaticSeo("/journal");
  return <SeoHead title={seo.title} description={seo.description} canonicalPath="/journal" keywords={seo.keywords} />;
}
