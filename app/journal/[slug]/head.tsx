import SeoHead from "@/components/SeoHead";
import { createDefaultJournalDraft } from "@/lib/journal-content";
import { getJournalDetailSeo } from "@/lib/seo-routes";
import { buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo-structured-data";

export default async function Head({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const seo = await getJournalDetailSeo(slug);
  const article = createDefaultJournalDraft().articles.find((item) => item.slug === slug);
  return (
    <SeoHead
      title={seo.title}
      description={seo.description}
      canonicalPath={`/journal/${slug}`}
      keywords={seo.keywords}
      jsonLd={[
        buildArticleJsonLd({
          name: seo.title,
          description: seo.description,
          url: `/journal/${slug}`,
          image: article?.coverImage,
        }),
        buildBreadcrumbJsonLd([
          { name: "Ana Sayfa", url: "/" },
          { name: "Journal", url: "/journal" },
          { name: seo.title, url: `/journal/${slug}` },
        ]),
      ]}
    />
  );
}
