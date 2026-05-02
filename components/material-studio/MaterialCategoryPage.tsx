"use client";

import { useMemo, useState } from "react";

import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";

import MaterialFilterSidebar from "@/components/material-studio/MaterialFilterSidebar";
import ProductCard from "@/components/material-studio/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { MaterialProduct, MaterialProductFilterGroup } from "@/data/materyal-urunleri";

type MaterialCategoryPageProps = {
  categorySlug: string;
  categoryTitle: string;
  categoryDescription: string;
  products: MaterialProduct[];
  filterGroups: MaterialProductFilterGroup[];
};

export default function MaterialCategoryPage({
  categorySlug,
  categoryTitle,
  categoryDescription,
  products,
  filterGroups,
}: MaterialCategoryPageProps) {
  const [searchValue, setSearchValue] = useState("");
  const [selectedValues, setSelectedValues] = useState<Record<string, string[]>>({
    "renk-tonu": [],
    "yuzey-tipi": [],
    "kullanim-alani": [],
  });

  const filteredProducts = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    return products.filter((product) => {
      const searchTarget = [
        product.title,
        product.shortInfo,
        product.sku,
        product.description,
        product.details.map((detail) => detail.value).join(" "),
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = query === "" || searchTarget.includes(query);

      const matchesFilters = filterGroups.every((group) => {
        const selected = selectedValues[group.key] ?? [];
        if (selected.length === 0) return true;
        return selected.some((value) => product.filterValues[group.key].includes(value));
      });

      return matchesSearch && matchesFilters;
    });
  }, [filterGroups, products, searchValue, selectedValues]);

  const handleToggle = (groupKey: string, value: string) => {
    setSelectedValues((current) => {
      const groupValues = current[groupKey] ?? [];
      const nextValues = groupValues.includes(value)
        ? groupValues.filter((item) => item !== value)
        : [...groupValues, value];

      return {
        ...current,
        [groupKey]: nextValues,
      };
    });
  };

  const clearAll = () => {
    setSearchValue("");
    setSelectedValues({
      "renk-tonu": [],
      "yuzey-tipi": [],
      "kullanim-alani": [],
    });
  };

  return (
    <main className="mx-auto w-full max-w-[1600px] px-4 py-8 md:px-6 md:py-10">
      <Card className="mb-8 border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] shadow-[0_24px_90px_rgba(0,0,0,0.28)]">
        <CardContent className="space-y-6 p-5 md:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-zinc-500">
                <Link href="/materyal-studyo" className="transition-colors hover:text-white">
                  materyal-studyo
                </Link>
                <span>/</span>
                <span className="text-white">{categorySlug}</span>
              </div>
              <div className="space-y-2">
                <Badge variant="secondary" className="w-fit border-white/10 bg-white/[0.04] text-zinc-300">
                  Kategori Listeleme
                </Badge>
                <h1 className="text-3xl font-medium tracking-tight text-white md:text-5xl">{categoryTitle}</h1>
                <p className="max-w-3xl text-base leading-7 text-zinc-400">{categoryDescription}</p>
              </div>
            </div>

            <Button
              asChild
              variant="outline"
              className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/materyal-studyo">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Tüm Kategoriler
              </Link>
            </Button>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-[1.3rem] border border-white/10 bg-black/10 px-4 py-3">
              <p className="text-[0.62rem] uppercase tracking-[0.32em] text-zinc-500">Görünüm</p>
              <p className="mt-2 text-sm text-white">3'lü / 4'lü grid, geniş ekran uyumlu</p>
            </div>
            <div className="rounded-[1.3rem] border border-white/10 bg-black/10 px-4 py-3">
              <p className="text-[0.62rem] uppercase tracking-[0.32em] text-zinc-500">Filtreler</p>
              <p className="mt-2 text-sm text-white">Renk tonu, yüzey tipi, kullanım alanı</p>
            </div>
            <div className="rounded-[1.3rem] border border-white/10 bg-black/10 px-4 py-3">
              <p className="text-[0.62rem] uppercase tracking-[0.32em] text-zinc-500">Kart dili</p>
              <p className="mt-2 text-sm text-white">Fiyat yerine teknik etiketler, stok durumu ve CTA etiketleri</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
        <MaterialFilterSidebar
          groups={filterGroups}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          selectedValues={selectedValues}
          onToggle={handleToggle}
          onClearAll={clearAll}
        />

        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-3">
            <div className="flex items-center gap-3 text-sm text-zinc-400">
              <Package className="h-4 w-4 text-zinc-500" />
              <span>{filteredProducts.length} ürün</span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.slug}
                href={`/materyal-studyo/${categorySlug}/${product.slug}`}
                product={product}
              />
            ))}
          </div>

          {filteredProducts.length === 0 ? (
            <Card className="border-white/10 bg-white/[0.03]">
              <CardContent className="flex min-h-[280px] flex-col items-center justify-center gap-3 text-center">
                <p className="text-lg text-white">Eşleşen materyal bulunamadı.</p>
                <p className="max-w-lg text-sm leading-7 text-zinc-500">
                  Filtreleri temizleyip tekrar deneyin veya kategori katalog verisini genişletin.
                </p>
                <Button variant="outline" onClick={clearAll} className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white">
                  Filtreleri Temizle
                </Button>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </section>
    </main>
  );
}
