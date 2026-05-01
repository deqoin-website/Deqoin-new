import { headers } from "next/headers";
import { notFound } from "next/navigation";

import JournalArticleShell from "@/components/JournalArticleShell";
import { createDefaultJournalDraft, normalizeJournalDraft } from "@/lib/journal-content";

export const dynamic = "force-dynamic";

type JournalArticlePageProps = {
  params: {
    slug: string;
  };
};

async function loadJournalArticle(slug: string) {
  try {
    const headerList = headers();
    const host = headerList.get("x-forwarded-host") || headerList.get("host");
    const protocol = headerList.get("x-forwarded-proto") || "http";

    if (host) {
      const res = await fetch(`${protocol}://${host}/api/journal`, {
        cache: "no-store",
      });
      const payload = await res.json().catch(() => null);
      const draft = normalizeJournalDraft(res.ok ? payload : null);
      const article = draft.articles.find((item) => item.slug === slug);

      if (article) {
        return article;
      }
    }
  } catch {
    // Static fallback below.
  }

  const fallback = createDefaultJournalDraft();
  return fallback.articles.find((article) => article.slug === slug) ?? null;
}

export default async function JournalArticlePage({ params }: JournalArticlePageProps) {
  const { slug } = params;
  const article = await loadJournalArticle(slug);

  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#080808] px-4 py-4 pt-24 text-white md:px-6 md:py-6 md:pt-28">
      <div className="mx-auto w-full max-w-[1700px]">
        <JournalArticleShell article={article} />
      </div>
    </main>
  );
}
