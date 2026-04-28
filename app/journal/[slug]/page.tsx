import { notFound } from "next/navigation";

import JournalArticleShell from "@/components/JournalArticleShell";
import { getJournalArticleBySlug } from "@/data/journal";

type JournalArticlePageProps = {
  params: {
    slug: string;
  };
};

export default async function JournalArticlePage({ params }: JournalArticlePageProps) {
  const { slug } = params;
  const article = getJournalArticleBySlug(slug);

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
