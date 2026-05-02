import SeoHead from "@/components/SeoHead";
import { getUygulamaDetailSeo } from "@/lib/seo-routes";

export default function Head({ params }: { params: { slug: string } }) {
  const seo = getUygulamaDetailSeo(params.slug);
  return (
    <SeoHead
      title={seo.title}
      description={seo.description}
      canonicalPath={`/uygulama/${params.slug}`}
      keywords={seo.keywords}
    />
  );
}
