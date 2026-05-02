import SeoHead from "@/components/SeoHead";
import { getStaticSeo } from "@/lib/seo-routes";

export default function Head() {
  const seo = getStaticSeo("/tasarim");
  return <SeoHead title={seo.title} description={seo.description} canonicalPath="/tasarim" keywords={seo.keywords} />;
}
