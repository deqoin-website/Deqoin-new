import SeoHead from "@/components/SeoHead";
import { getMaterialProductSeo } from "@/lib/seo-routes";

export default async function Head({
  params,
}: {
  params: Promise<{ slug: string; "urun-slug": string }>;
}) {
  const { slug, ["urun-slug"]: productSlug } = await params;
  const seo = await getMaterialProductSeo(slug, productSlug);
  return (
    <SeoHead
      title={seo.title}
      description={seo.description}
      canonicalPath={`/materyal-studyo/${slug}/${productSlug}`}
      keywords={seo.keywords}
    />
  );
}
