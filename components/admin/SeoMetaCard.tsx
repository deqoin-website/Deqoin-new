'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { SeoMeta } from '@/lib/seo-meta';

type SeoMetaCardProps = {
  meta: SeoMeta;
  onChange: (next: SeoMeta) => void;
  title?: string;
  description?: string;
  canonicalHint?: string;
  schemaOptions?: string[];
};

export default function SeoMetaCard({
  meta,
  onChange,
  title = 'SEO',
  description = 'Bu alanlar sayfa başlığı, açıklama ve arama görünümü için kullanılır.',
  canonicalHint,
  schemaOptions,
}: SeoMetaCardProps) {
  const schemaList = schemaOptions && schemaOptions.length > 0 ? schemaOptions.join(', ') : 'Service, Product, Article';

  return (
    <Card className="border border-[color:var(--line)] bg-[color:var(--surface-muted)] shadow-none">
      <CardHeader className="border-b border-[color:var(--line)]">
        <CardTitle className="text-base text-[color:var(--text)]">{title}</CardTitle>
        <CardDescription className="text-[color:var(--text-muted)]">
          {description} Şema tipi: {schemaList}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">SEO Başlığı</label>
          <Input
            value={meta.title}
            onChange={(event) => onChange({ ...meta, title: event.target.value })}
            className="h-11 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
            placeholder="Sayfa başlığı"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">SEO Açıklama</label>
          <Textarea
            value={meta.description}
            onChange={(event) => onChange({ ...meta, description: event.target.value })}
            rows={4}
            className="min-h-28 rounded-[1.5rem] border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
            placeholder="Sayfanın kısa açıklaması"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">Anahtar Kelimeler</label>
          <Textarea
            value={meta.keywords}
            onChange={(event) => onChange({ ...meta, keywords: event.target.value })}
            rows={3}
            className="min-h-24 rounded-[1.5rem] border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
            placeholder="villa iç mimarlık, kapadokya mimarlık"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">OG Görseli</label>
          <Input
            value={meta.ogImage}
            onChange={(event) => onChange({ ...meta, ogImage: event.target.value })}
            className="h-11 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
            placeholder="https://..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">Canonical Yol</label>
          <Input
            value={meta.canonicalPath}
            onChange={(event) => onChange({ ...meta, canonicalPath: event.target.value })}
            className="h-11 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
            placeholder={canonicalHint || '/ornek-sayfa'}
          />
        </div>

        <div className="flex items-center justify-between gap-3 rounded-[1.25rem] border border-[color:var(--line)] bg-[color:var(--surface)] p-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-[color:var(--text)]">Aramada gösterme</p>
            <p className="text-xs text-[color:var(--text-muted)]">Açılırsa sayfa index almaz.</p>
          </div>
          <Checkbox
            checked={meta.noIndex}
            onCheckedChange={(checked) => onChange({ ...meta, noIndex: checked === true })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">Schema Tipi</label>
          <Input
            value={meta.schemaType}
            onChange={(event) => onChange({ ...meta, schemaType: event.target.value })}
            className="h-11 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
            placeholder="Service"
          />
        </div>
      </CardContent>
    </Card>
  );
}
