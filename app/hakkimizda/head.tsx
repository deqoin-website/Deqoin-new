import SeoHead from "@/components/SeoHead";
import { getStaticSeo } from "@/lib/seo-routes";

export default function Head() {
  const seo = getStaticSeo("/hakkimizda");
  return <SeoHead title={seo.title} description={seo.description} canonicalPath="/hakkimizda" keywords={seo.keywords} />;
}
