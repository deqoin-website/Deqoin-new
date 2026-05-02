import SeoHead from "@/components/SeoHead";
import { uygulamaBirimleri } from "@/data/uygulama-birimleri";
import { getUygulamaDetailSeo } from "@/lib/seo-routes";
import { buildBreadcrumbJsonLd, buildServiceJsonLd } from "@/lib/seo-structured-data";

export default async function Head({ params }: { params: { slug: string } }) {
  const seo = await getUygulamaDetailSeo(params.slug);
  const service = uygulamaBirimleri.find((item) => item.slug === params.slug);
  return (
    <SeoHead
      title={seo.title}
      description={seo.description}
      canonicalPath={`/uygulama/${params.slug}`}
      keywords={seo.keywords}
      jsonLd={[
        buildServiceJsonLd({
          name: seo.title,
          description: seo.description,
          url: `/uygulama/${params.slug}`,
          image: service?.image,
        }),
        buildBreadcrumbJsonLd([
          { name: "Ana Sayfa", url: "/" },
          { name: "Uygulama", url: "/uygulama" },
          { name: seo.title, url: `/uygulama/${params.slug}` },
        ]),
      ]}
    />
  );
}
