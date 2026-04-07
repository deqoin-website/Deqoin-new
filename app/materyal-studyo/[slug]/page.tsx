import { notFound } from "next/navigation";
import { materyalKategorileri } from "../../../data/materyal-studyo";
import MaterialCategoryClient from "../../../components/MaterialCategoryClient";

type Params = { slug: string };

export default async function MateryalKategoriPage({ params }: { params: Promise<Params> }) {
  const resolvedParams = await params;
  const category = materyalKategorileri.find((c) => c.slug === resolvedParams.slug);

  if (!category) {
    notFound();
  }

  return (
    <main className="site-shell project-detail-shell" style={{ background: "#0a0a0a" }}>
      <MaterialCategoryClient category={category} />
    </main>
  );
}
