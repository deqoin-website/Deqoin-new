import SeoHead from "@/components/SeoHead";
import { getMaterialCategory, getMaterialProduct } from "@/data/materyal-urunleri";
import { getMaterialProductSeo } from "@/lib/seo-routes";
import { buildBreadcrumbJsonLd, buildProductJsonLd } from "@/lib/seo-structured-data";

export default async function Head({
  params,
}: {
  params: Promise<{ slug: string; "urun-slug": string }>;
}) {
  const { slug, ["urun-slug"]: productSlug } = await params;
  const seo = await getMaterialProductSeo(slug, productSlug);
  const category = getMaterialCategory(slug);
  const product = getMaterialProduct(slug, productSlug);
  return (
    <SeoHead
      title={seo.title}
      description={seo.description}
      canonicalPath={`/materyal-studyo/${slug}/${productSlug}`}
      keywords={seo.keywords}
      jsonLd={[
        buildProductJsonLd({
          name: seo.title,
          description: seo.description,
          url: `/materyal-studyo/${slug}/${productSlug}`,
          image: product?.gallery?.length ? product.gallery : product?.heroImage,
          sku: product?.sku,
          category: category?.title,
          brand: product?.brandName || "deqoin",
        }),
        buildBreadcrumbJsonLd([
          { name: "Ana Sayfa", url: "/" },
          { name: "Materyal Stüdyo", url: "/materyal-studyo" },
          { name: slug, url: `/materyal-studyo/${slug}` },
          { name: seo.title, url: `/materyal-studyo/${slug}/${productSlug}` },
        ]),
      ]}
    />
  );
}
