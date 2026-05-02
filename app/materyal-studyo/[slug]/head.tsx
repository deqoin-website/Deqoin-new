import SeoHead from "@/components/SeoHead";
import { getMaterialCategorySeo } from "@/lib/seo-routes";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/seo-structured-data";

export default async function Head({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const seo = await getMaterialCategorySeo(slug);
  return (
    <SeoHead
      title={seo.title}
      description={seo.description}
      canonicalPath={`/materyal-studyo/${slug}`}
      keywords={seo.keywords}
      jsonLd={[
        buildWebPageJsonLd({
          name: seo.title,
          description: seo.description,
          url: `/materyal-studyo/${slug}`,
        }),
        buildBreadcrumbJsonLd([
          { name: "Ana Sayfa", url: "/" },
          { name: "Materyal Stüdyo", url: "/materyal-studyo" },
          { name: seo.title, url: `/materyal-studyo/${slug}` },
        ]),
      ]}
    />
  );
}
