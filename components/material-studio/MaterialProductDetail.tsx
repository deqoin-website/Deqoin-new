"use client";

import { useState } from "react";

import Link from "next/link";
import MaterialProductGallery from "@/components/material-studio/MaterialProductGallery";
import ProductCard from "@/components/material-studio/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { MaterialProduct } from "@/data/materyal-urunleri";

type MaterialProductDetailProps = {
  categorySlug: string;
  categoryTitle: string;
  product: MaterialProduct;
  relatedProducts: MaterialProduct[];
};

export default function MaterialProductDetail({
  categorySlug,
  categoryTitle,
  product,
  relatedProducts,
}: MaterialProductDetailProps) {
  const [tabValue, setTabValue] = useState("technical");
  const stockTone =
    product.stockStatus === "limited"
      ? "border-amber-400/20 bg-amber-400/10 text-amber-200"
      : product.stockStatus === "made-to-order"
        ? "border-sky-400/20 bg-sky-400/10 text-sky-200"
        : "border-emerald-400/20 bg-emerald-400/10 text-emerald-200";

  return (
    <main className="mx-auto w-full max-w-[1600px] px-4 py-8 md:px-6 md:py-10">
      <div className="mb-8 flex items-center gap-3 text-sm text-zinc-500">
        <Link href="/materyal-studyo" className="transition-colors hover:text-white">
          materyal-studyo
        </Link>
        <span>/</span>
        <Link href={`/materyal-studyo/${categorySlug}`} className="transition-colors hover:text-white">
          {categoryTitle}
        </Link>
        <span>/</span>
        <span className="text-white">{product.title}</span>
      </div>

      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <MaterialProductGallery images={product.gallery} title={product.title} />

        <div className="space-y-6">
          <Card className="border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] shadow-[0_20px_70px_rgba(0,0,0,0.28)]">
            <CardContent className="space-y-5 p-5 md:p-6">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="secondary" className="w-fit border-white/10 bg-white/[0.04] text-zinc-300">
                  {product.sku}
                </Badge>
                {product.brandName ? (
                  <Badge variant="outline" className="border-white/10 bg-white/[0.03] text-zinc-300">
                    {product.brandName}
                  </Badge>
                ) : null}
                <span className={cn("rounded-full border px-3 py-1 text-[0.62rem] uppercase tracking-[0.26em]", stockTone)}>
                  {product.stockLabel || "Stokta"}
                </span>
              </div>

              <div className="space-y-3">
                <h1 className="max-w-3xl text-3xl font-medium tracking-tight text-white md:text-5xl">
                  {product.title}
                </h1>
                <p className="max-w-2xl text-base leading-7 text-zinc-400 md:text-lg">
                  {product.description}
                </p>
              </div>

              {product.techTags && product.techTags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {product.techTags.map((tag) => (
                    <Badge key={tag} variant="outline" className="border-white/10 bg-white/[0.03] text-zinc-300">
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : null}

              <div className="grid gap-3 sm:grid-cols-2">
                <Button className="h-12 rounded-full px-6 text-sm tracking-[0.18em] uppercase">
                  {product.ctaLabel || "Numune İste"}
                </Button>
                <Button
                  variant="outline"
                  className="h-12 rounded-full border-white/15 bg-white/5 px-6 text-sm tracking-[0.18em] uppercase text-white hover:bg-white/10 hover:text-white"
                >
                  Mimari Bilgi Al
                </Button>
              </div>

              <div className="rounded-[1.35rem] border border-white/10 bg-black/15 p-4 text-sm text-zinc-400">
                Proje ekibine teknik not, uygulama detayı veya numune talebi göndermek için bu alan kullanılabilir.
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.03]">
            <CardHeader className="px-5 py-4">
              <CardTitle className="text-base font-medium tracking-[0.22em] text-zinc-200">
                Temel Bilgiler
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="grid gap-3">
                {product.details.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/10 px-4 py-3"
                  >
                    <span className="text-sm uppercase tracking-[0.22em] text-zinc-500">{item.label}</span>
                    <span className="text-sm text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mt-10">
        <Card className="border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.025))] shadow-[0_20px_70px_rgba(0,0,0,0.2)]">
          <CardContent className="p-5 md:p-6">
            <Tabs value={tabValue} onValueChange={setTabValue} className="gap-6">
              <TabsList className="w-full flex-wrap justify-start bg-black/10">
                <TabsTrigger value="technical">Teknik Detaylar</TabsTrigger>
                <TabsTrigger value="application">Uygulama Alanları</TabsTrigger>
                <TabsTrigger value="similar">Benzer Materyaller</TabsTrigger>
              </TabsList>

              <TabsContent value="technical" className="space-y-4">
                <div className="grid gap-3 md:grid-cols-2">
                  {product.technicalDetails.map((item) => (
                    <div key={item.label} className="rounded-2xl border border-white/10 bg-black/10 p-4">
                      <p className="text-[0.68rem] uppercase tracking-[0.3em] text-zinc-500">{item.label}</p>
                      <p className="mt-2 text-sm text-white">{item.value}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="application" className="space-y-4">
                <div className="grid gap-3 md:grid-cols-3">
                  {product.applicationAreas.map((area) => (
                    <div key={area} className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-sm text-white">
                      {area}
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="similar" className="space-y-4">
                {relatedProducts.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {relatedProducts.map((related) => (
                      <ProductCard
                        key={related.slug}
                        href={`/materyal-studyo/${categorySlug}/${related.slug}`}
                        product={related}
                        compact
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-black/10 p-8 text-sm text-zinc-500">
                    Bu kategori için benzer materyal bulunmuyor.
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
