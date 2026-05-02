import SeoHead from "@/components/SeoHead";
import { getStaticSeo } from "@/lib/seo-routes";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/seo-structured-data";

export default function Head() {
  const seo = getStaticSeo("/materyal-studyo");
  return (
    <SeoHead
      title={seo.title}
      description={seo.description}
      canonicalPath="/materyal-studyo"
      keywords={seo.keywords}
      jsonLd={[
        buildWebPageJsonLd({
          name: seo.title,
          description: seo.description,
          url: "/materyal-studyo",
        }),
        buildBreadcrumbJsonLd([
          { name: "Ana Sayfa", url: "/" },
          { name: "Materyal Stüdyo", url: "/materyal-studyo" },
        ]),
      ]}
    />
  );
}
