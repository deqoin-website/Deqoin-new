import { notFound } from "next/navigation";

import MaterialProductDetail from "@/components/material-studio/MaterialProductDetail";
import { materialProducts } from "@/data/materyal-urunleri";
import { loadMaterialProductView } from "@/lib/material-catalog";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return materialProducts.map((product) => ({
    slug: product.categorySlug,
    "urun-slug": product.slug,
  }));
}

type PageProps = {
  params: Promise<{
    slug: string;
    "urun-slug": string;
  }>;
};

export default async function MaterialProductPage({ params }: PageProps) {
  const { slug, ["urun-slug"]: productSlug } = await params;
  const { category, product, relatedProducts, exists } = await loadMaterialProductView(slug, productSlug);

  if (!exists) {
    notFound();
  }

  if (!product) {
    notFound();
  }

  return (
    <MaterialProductDetail
      categorySlug={category.slug}
      categoryTitle={category.title}
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
