import SeoHead from "@/components/SeoHead";
import { getMaterialCategorySeo } from "@/lib/seo-routes";

export default async function Head({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const seo = await getMaterialCategorySeo(slug);
  return (
    <SeoHead
      title={seo.title}
      description={seo.description}
      canonicalPath={`/materyal-studyo/${slug}`}
      keywords={seo.keywords}
    />
  );
}
