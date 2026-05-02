import SeoHead from "@/components/SeoHead";
import { getStaticSeo } from "@/lib/seo-routes";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/seo-structured-data";

export default function Head() {
  const seo = getStaticSeo("/tasarim");
  return (
    <SeoHead
      title={seo.title}
      description={seo.description}
      canonicalPath="/tasarim"
      keywords={seo.keywords}
      jsonLd={[
        buildWebPageJsonLd({ name: seo.title, description: seo.description, url: "/tasarim" }),
        buildBreadcrumbJsonLd([
          { name: "Ana Sayfa", url: "/" },
          { name: "Tasarım", url: "/tasarim" },
        ]),
      ]}
    />
  );
}
