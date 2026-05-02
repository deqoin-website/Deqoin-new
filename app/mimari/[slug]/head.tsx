import SeoHead from "@/components/SeoHead";
import { mimariServices } from "@/data/mimari-hizmetler";
import { getMimariDetailSeo } from "@/lib/seo-routes";
import { buildBreadcrumbJsonLd, buildServiceJsonLd } from "@/lib/seo-structured-data";

export default async function Head({ params }: { params: { slug: string } }) {
  const seo = await getMimariDetailSeo(params.slug);
  const service = mimariServices.find((item) => item.slug === params.slug);
  return (
    <SeoHead
      title={seo.title}
      description={seo.description}
      canonicalPath={`/mimari/${params.slug}`}
      keywords={seo.keywords}
      jsonLd={[
        buildServiceJsonLd({
          name: seo.title,
          description: seo.description,
          url: `/mimari/${params.slug}`,
          image: service?.image,
        }),
        buildBreadcrumbJsonLd([
          { name: "Ana Sayfa", url: "/" },
          { name: "Mimari", url: "/mimari" },
          { name: seo.title, url: `/mimari/${params.slug}` },
        ]),
      ]}
    />
  );
}
