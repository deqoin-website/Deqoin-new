import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import CloudinaryImage from "@/components/CloudinaryImage";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { MaterialProduct } from "@/data/materyal-urunleri";

type ProductCardProps = {
  href: string;
  product: MaterialProduct;
  className?: string;
  compact?: boolean;
};

export default function ProductCard({ href, product, className, compact = false }: ProductCardProps) {
  const stockTone =
    product.stockStatus === "limited"
      ? "border-amber-400/20 bg-amber-400/10 text-amber-200"
      : product.stockStatus === "made-to-order"
        ? "border-sky-400/20 bg-sky-400/10 text-sky-200"
        : "border-emerald-400/20 bg-emerald-400/10 text-emerald-200";
  const ctaTone =
    product.ctaVariant === "request-sample"
      ? "border-violet-400/20 bg-violet-400/10 text-violet-100"
      : product.ctaVariant === "request-quote"
        ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-100"
        : "border-white/10 bg-white/[0.04] text-white";

  return (
    <Card
      className={cn(
        "group overflow-hidden border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] shadow-[0_20px_70px_rgba(0,0,0,0.28)] transition-transform duration-300 hover:-translate-y-1 hover:border-white/20",
        className,
      )}
    >
      <Link href={href} className="block h-full">
        <div className={cn("relative overflow-hidden", compact ? "aspect-[4/3]" : "aspect-[4/5]")}>
          <CloudinaryImage
            src={product.heroImage}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/30 px-3 py-1 text-[0.62rem] uppercase tracking-[0.28em] text-white/80 backdrop-blur-sm">
            {product.sku}
          </div>

          <div className={cn("absolute right-4 top-4 rounded-full border px-3 py-1 text-[0.62rem] uppercase tracking-[0.26em] backdrop-blur-sm", stockTone)}>
            {product.stockLabel || "Stokta"}
          </div>

          <div className="absolute bottom-4 right-4 rounded-full border border-white/15 bg-black/25 p-2 text-white/80 backdrop-blur-sm">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>

        <div className="space-y-4 p-4">
          <div className="space-y-2">
            {product.brandName ? (
              <p className="text-[0.65rem] uppercase tracking-[0.32em] text-zinc-500">
                {product.brandName}
              </p>
            ) : null}
            <h3 className={cn("font-medium tracking-[0.02em] text-white", compact ? "text-base" : "text-lg")}>
              {product.title}
            </h3>
            <p className="text-sm leading-6 text-zinc-400">{product.shortInfo}</p>
          </div>

          {product.techTags && product.techTags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {product.techTags.slice(0, compact ? 2 : 3).map((tag) => (
                <Badge key={tag} variant="outline" className="border-white/10 bg-white/[0.03] text-[0.58rem] text-zinc-300">
                  {tag}
                </Badge>
              ))}
            </div>
          ) : null}

          <div className="flex items-center justify-between gap-3">
            <span className="text-[0.64rem] uppercase tracking-[0.28em] text-zinc-500">
              Hızlı işlem
            </span>
            <span className={cn("inline-flex h-9 items-center rounded-full border px-4 text-[0.68rem] uppercase tracking-[0.2em]", ctaTone)}>
              {product.ctaLabel || "Bilgi Al"}
            </span>
          </div>
        </div>
      </Link>
    </Card>
  );
}
