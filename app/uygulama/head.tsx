import SeoHead from "@/components/SeoHead";
import { getStaticSeo } from "@/lib/seo-routes";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/seo-structured-data";

export default function Head() {
  const seo = getStaticSeo("/uygulama");
  return (
    <SeoHead
      title={seo.title}
      description={seo.description}
      canonicalPath="/uygulama"
      keywords={seo.keywords}
      jsonLd={[
        buildWebPageJsonLd({
          name: seo.title,
          description: seo.description,
          url: "/uygulama",
        }),
        buildBreadcrumbJsonLd([
          { name: "Ana Sayfa", url: "/" },
          { name: "Uygulama", url: "/uygulama" },
        ]),
      ]}
    />
  );
}
