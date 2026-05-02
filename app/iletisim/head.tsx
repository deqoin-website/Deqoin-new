import SeoHead from "@/components/SeoHead";
import { getStaticSeo } from "@/lib/seo-routes";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/seo-structured-data";

export default function Head() {
  const seo = getStaticSeo("/iletisim");
  return (
    <SeoHead
      title={seo.title}
      description={seo.description}
      canonicalPath="/iletisim"
      keywords={seo.keywords}
      jsonLd={[
        buildWebPageJsonLd({ name: seo.title, description: seo.description, url: "/iletisim" }),
        buildBreadcrumbJsonLd([
          { name: "Ana Sayfa", url: "/" },
          { name: "İletişim", url: "/iletisim" },
        ]),
      ]}
    />
  );
}
