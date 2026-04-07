import { notFound } from "next/navigation";
import { use } from "react";
import { uygulamaBirimleri } from "../../../data/uygulama-birimleri";
import ExecutionCategoryClient from "../../../components/ExecutionCategoryClient";

export default function UygulamaBirimiPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const unit = uygulamaBirimleri.find((u) => u.slug === resolvedParams.slug);

  if (!unit) {
    notFound();
  }

  return (
    <main className="site-shell project-detail-shell" style={{ background: "#0a0a0a" }}>
      <ExecutionCategoryClient unit={unit} />
    </main>
  );
}
