import SeoHead from "@/components/SeoHead";
import { getStaticSeo } from "@/lib/seo-routes";

export default function Head() {
  const seo = getStaticSeo("/faaliyet-alanlarimiz");
  return <SeoHead title={seo.title} description={seo.description} canonicalPath="/faaliyet-alanlarimiz" keywords={seo.keywords} />;
}
