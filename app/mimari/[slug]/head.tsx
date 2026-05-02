import SeoHead from "@/components/SeoHead";
import { getMimariDetailSeo } from "@/lib/seo-routes";

export default function Head({ params }: { params: { slug: string } }) {
  const seo = getMimariDetailSeo(params.slug);
  return (
    <SeoHead
      title={seo.title}
      description={seo.description}
      canonicalPath={`/mimari/${params.slug}`}
      keywords={seo.keywords}
    />
  );
}
