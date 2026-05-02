import SeoHead from "@/components/SeoHead";
import { projectsData } from "@/data/projects";
import { getGalleryDetailSeo } from "@/lib/seo-routes";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/seo-structured-data";

export default async function Head({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const seo = await getGalleryDetailSeo(slug);
  const project = projectsData.find((item) => item.slug === slug);
  return (
    <SeoHead
      title={seo.title}
      description={seo.description}
      canonicalPath={`/galeri/${slug}`}
      keywords={seo.keywords}
      jsonLd={[
        buildWebPageJsonLd({
          name: seo.title,
          description: seo.description,
          url: `/galeri/${slug}`,
          image: project?.coverImage,
        }),
        buildBreadcrumbJsonLd([
          { name: "Ana Sayfa", url: "/" },
          { name: "Galeri", url: "/galeri" },
          { name: seo.title, url: `/galeri/${slug}` },
        ]),
      ]}
    />
  );
}
