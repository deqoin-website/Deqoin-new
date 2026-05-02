import SeoHead from "@/components/SeoHead";
import { getStaticSeo } from "@/lib/seo-routes";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/seo-structured-data";

export default function Head() {
  const seo = getStaticSeo("/hakkimizda");
  return (
    <SeoHead
      title={seo.title}
      description={seo.description}
      canonicalPath="/hakkimizda"
      keywords={seo.keywords}
      jsonLd={[
        buildWebPageJsonLd({ name: seo.title, description: seo.description, url: "/hakkimizda" }),
        buildBreadcrumbJsonLd([
          { name: "Ana Sayfa", url: "/" },
          { name: "Hakkımızda", url: "/hakkimizda" },
        ]),
      ]}
    />
  );
}
