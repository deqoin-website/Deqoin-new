import SeoHead from "@/components/SeoHead";
import { getStaticSeo } from "@/lib/seo-routes";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/seo-structured-data";

export default function Head() {
  const seo = getStaticSeo("/galeri");
  return (
    <SeoHead
      title={seo.title}
      description={seo.description}
      canonicalPath="/galeri"
      keywords={seo.keywords}
      jsonLd={[
        buildWebPageJsonLd({
          name: seo.title,
          description: seo.description,
          url: "/galeri",
        }),
        buildBreadcrumbJsonLd([
          { name: "Ana Sayfa", url: "/" },
          { name: "Galeri", url: "/galeri" },
        ]),
      ]}
    />
  );
}
