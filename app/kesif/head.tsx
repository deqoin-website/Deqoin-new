import SeoHead from "@/components/SeoHead";
import { getStaticSeo } from "@/lib/seo-routes";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/seo-structured-data";

export default function Head() {
  const seo = getStaticSeo("/kesif");
  return (
    <SeoHead
      title={seo.title}
      description={seo.description}
      canonicalPath="/kesif"
      keywords={seo.keywords}
      jsonLd={[
        buildWebPageJsonLd({ name: seo.title, description: seo.description, url: "/kesif" }),
        buildBreadcrumbJsonLd([
          { name: "Ana Sayfa", url: "/" },
          { name: "Keşif", url: "/kesif" },
        ]),
      ]}
    />
  );
}
