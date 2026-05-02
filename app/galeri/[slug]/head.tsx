import SeoHead from "@/components/SeoHead";
import { getGalleryDetailSeo } from "@/lib/seo-routes";

export default async function Head({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const seo = await getGalleryDetailSeo(slug);
  return <SeoHead title={seo.title} description={seo.description} canonicalPath={`/galeri/${slug}`} keywords={seo.keywords} />;
}
