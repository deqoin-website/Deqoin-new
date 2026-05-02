import SeoHead from "@/components/SeoHead";
import { getStaticSeo } from "@/lib/seo-routes";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/seo-structured-data";

export default function Head() {
  const seo = getStaticSeo("/departman-ekipleri");
  return (
    <SeoHead
      title={seo.title}
      description={seo.description}
      canonicalPath="/departman-ekipleri"
      keywords={seo.keywords}
      jsonLd={[
        buildWebPageJsonLd({
          name: seo.title,
          description: seo.description,
          url: "/departman-ekipleri",
        }),
        buildBreadcrumbJsonLd([
          { name: "Ana Sayfa", url: "/" },
          { name: "Departman Ekipleri", url: "/departman-ekipleri" },
        ]),
      ]}
    />
  );
}
