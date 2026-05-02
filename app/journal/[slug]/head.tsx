import SeoHead from "@/components/SeoHead";
import { getJournalDetailSeo } from "@/lib/seo-routes";

export default async function Head({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const seo = await getJournalDetailSeo(slug);
  return <SeoHead title={seo.title} description={seo.description} canonicalPath={`/journal/${slug}`} keywords={seo.keywords} />;
}
