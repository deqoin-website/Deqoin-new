import { notFound } from "next/navigation";

import MaterialCategoryPage from "@/components/material-studio/MaterialCategoryPage";
import { getMaterialFilterGroups, materyalKategorileri } from "@/data/materyal-urunleri";
import { loadMaterialCategoryView } from "@/lib/material-catalog";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return materyalKategorileri.map((category) => ({ slug: category.slug }));
}

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function MateryalKategoriPage({ params }: PageProps) {
  const { slug } = await params;
  const { category, products, exists } = await loadMaterialCategoryView(slug);

  if (!exists) {
    notFound();
  }

  return (
    <MaterialCategoryPage
      categorySlug={category.slug}
      categoryTitle={category.title}
      categoryDescription={category.description}
      products={products}
      filterGroups={getMaterialFilterGroups(category.slug)}
    />
  );
}
