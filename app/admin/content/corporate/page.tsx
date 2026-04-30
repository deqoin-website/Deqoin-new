'use client';

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useMemo, useState, type ChangeEvent, type DragEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Clock3,
  FileText,
  Image as ImageIcon,
  Loader2,
  Plus,
  RefreshCcw,
  Save,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react';

import { AdminSaveBar } from '@/components/admin/AdminSaveBar';
import { useNotification } from '@/components/admin/AdminNotificationProvider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  CURRENT_ABOUT_CONTENT,
  createAboutDefaultContent,
  normalizeAboutContent,
  type AboutContent,
  type AboutSection,
  type AboutStat,
} from '@/lib/about-content';
import { cn } from '@/lib/utils';

const DEFAULT_SYNC_INTERVAL_MS = 15000;

const cloneContent = (value: AboutContent) => JSON.parse(JSON.stringify(value)) as AboutContent;

const formatDate = (value?: string) => {
  if (!value) return 'Kayıt yok';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Kayıt yok';
  return new Intl.DateTimeFormat('tr-TR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(parsed);
};

const createPreviewContent = (data: AboutContent) => ({
  ...CURRENT_ABOUT_CONTENT,
  ...data,
});

export default function CorporateAboutAdmin() {
  const { showToast } = useNotification();
  const [data, setData] = useState<AboutContent>(createAboutDefaultContent());
  const [initialData, setInitialData] = useState<AboutContent>(createAboutDefaultContent());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [uploadTarget, setUploadTarget] = useState<string | null>(null);

  const syncTimestamp = useMemo(
    () => data.metadata?.updatedAt || initialData.metadata?.updatedAt || lastSync,
    [data.metadata?.updatedAt, initialData.metadata?.updatedAt, lastSync],
  );

  const loadContent = useCallback(
    async (silent = false) => {
      if (!silent) {
        setLoading(true);
      }

      setApiError(null);

      try {
        const res = await fetch('/api/admin/content/corporate/about', { cache: 'no-store' });
        if (!res.ok) {
          throw new Error(`GET /api/admin/content/corporate/about failed with ${res.status}`);
        }

        const json = normalizeAboutContent(await res.json());
        setData(json);
        setInitialData(cloneContent(json));
        setLastSync(json.metadata?.updatedAt || new Date().toISOString());
        setIsDirty(false);
      } catch (error) {
        console.error('Corporate content load error:', error);
        const fallback = createAboutDefaultContent();
        setData(fallback);
        setInitialData(cloneContent(fallback));
        setApiError('İçerik API bağlantısı okunamadı. Varsayılan verilerle devam ediliyor.');
        if (!silent) {
          showToast('Hakkımızda içeriği yüklenemedi.', 'error');
        }
      } finally {
        if (!silent) {
          setLoading(false);
        }
      }
    },
    [showToast],
  );

  useEffect(() => {
    void loadContent();
  }, [loadContent]);

  useEffect(() => {
    const refresh = () => {
      if (!isDirty && !saving) {
        void loadContent(true);
      }
    };

    const interval = window.setInterval(refresh, DEFAULT_SYNC_INTERVAL_MS);
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, [isDirty, loadContent, saving]);

  const updateData = (next: AboutContent) => {
    setData(next);
    setIsDirty(true);
  };

  const updateField = (field: keyof Pick<AboutContent, 'title' | 'subtitle' | 'description' | 'image'>, value: string) => {
    updateData({
      ...data,
      [field]: value,
    });
  };

  const updateStat = (index: number, field: keyof AboutStat, value: string) => {
    const nextStats = [...data.stats];
    nextStats[index] = {
      ...nextStats[index],
      [field]: value,
    };
    updateData({
      ...data,
      stats: nextStats,
    });
  };

  const addStat = () => {
    updateData({
      ...data,
      stats: [...data.stats, { label: 'YENİ ETİKET', value: 'YENİ DEĞER' }],
    });
  };

  const removeStat = (index: number) => {
    updateData({
      ...data,
      stats: data.stats.filter((_, statIndex) => statIndex !== index),
    });
  };

  const updateSection = (index: number, field: keyof AboutSection, value: string) => {
    const nextSections = [...data.sections];
    nextSections[index] = {
      ...nextSections[index],
      [field]: value,
    };
    updateData({
      ...data,
      sections: nextSections,
    });
  };

  const addSection = () => {
    updateData({
      ...data,
      sections: [...data.sections, { title: 'YENİ BLOK', content: '', image: '' }],
    });
  };

  const removeSection = (index: number) => {
    updateData({
      ...data,
      sections: data.sections.filter((_, sectionIndex) => sectionIndex !== index),
    });
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const nextSections = [...data.sections];
    const target = direction === 'up' ? index - 1 : index + 1;

    if (target < 0 || target >= nextSections.length) return;

    [nextSections[index], nextSections[target]] = [nextSections[target], nextSections[index]];
    updateData({
      ...data,
      sections: nextSections,
    });
  };

  const saveAbout = async () => {
    setSaving(true);
    setApiError(null);

    try {
      const payload = normalizeAboutContent(data);
      const res = await fetch('/api/admin/content/corporate/about', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`PUT /api/admin/content/corporate/about failed with ${res.status}`);
      }

      const json = normalizeAboutContent(await res.json());
      setData(json);
      setInitialData(cloneContent(json));
      setIsDirty(false);
      setLastSync(json.metadata?.updatedAt || new Date().toISOString());
      showToast('Hakkımızda içeriği başarıyla güncellendi.', 'success');
    } catch (error) {
      console.error('Corporate content save error:', error);
      setApiError('Kaydetme sırasında bir API hatası oluştu.');
      showToast('Güncelleme sırasında hata oluştu.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setData(cloneContent(initialData));
    setIsDirty(false);
    showToast('Değişiklikler geri alındı.', 'info');
  };

  const resetToDefaults = () => {
    const fallback = createAboutDefaultContent();
    setData(fallback);
    setIsDirty(true);
    showToast('Varsayılan Hakkımızda içeriği yüklendi.', 'info');
  };

  const uploadFile = async (file: File, target: 'cover' | { index: number }) => {
    setIsUploading(true);
    setUploadTarget(typeof target === 'string' ? 'kapak görseli' : `alt blok ${target.index + 1}`);

    try {
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        body: file,
      });

      if (!res.ok) {
        throw new Error(`Upload failed with ${res.status}`);
      }

      const blob = await res.json();
      const url = blob?.url?.toString() || '';

      if (!url) {
        throw new Error('Upload response missing url');
      }

      if (target === 'cover') {
        updateField('image', url);
      } else {
        updateSection(target.index, 'image', url);
      }

      showToast('Görsel başarıyla yüklendi.', 'success');
    } catch (error) {
      console.error('Upload error:', error);
      showToast('Görsel yüklenemedi.', 'error');
    } finally {
      setIsUploading(false);
      setUploadTarget(null);
    }
  };

  const handleCoverUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    await uploadFile(file, 'cover');
  };

  const handleSectionUpload = async (event: ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    await uploadFile(file, { index });
  };

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    await uploadFile(file, 'cover');
  };

  const saveDisabled = loading || saving || !isDirty;
  const preview = createPreviewContent(data);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-[color:var(--text-muted)]">
        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm">
          <Loader2 className="h-4 w-4 animate-spin text-[color:var(--accent)]" />
          Hakkımızda içeriği yükleniyor
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(166,137,102,0.16),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(255,255,255,0.08),_transparent_26%),linear-gradient(180deg,_rgba(8,8,10,0.98),_rgba(11,12,16,0.96))]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(circle_at_center,_rgba(166,137,102,0.13),_transparent_62%)] blur-3xl" />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
        <Card className="border-white/10 bg-white/[0.04]">
          <CardHeader className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>Hakkımızda</Badge>
              <Badge variant={isDirty ? 'default' : 'secondary'}>{isDirty ? 'Kaydedilmemiş değişiklik' : 'Senkronize'}</Badge>
              <Badge variant={apiError ? 'outline' : 'secondary'}>{apiError ? 'API uyarısı' : 'API bağlantısı aktif'}</Badge>
              <Badge variant="outline">{data.stats.length} istatistik</Badge>
              <Badge variant="outline">{data.sections.length} blok</Badge>
            </div>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.75fr)] lg:items-end">
              <div className="space-y-3">
                <CardTitle className="text-3xl tracking-[0.08em] text-zinc-50 md:text-5xl">
                  Hakkımızda sayfa editörü
                </CardTitle>
                <CardDescription className="max-w-3xl text-base text-zinc-400">
                  Ana sayfadaki Hakkımızda bloğunu ve bu sayfanın destekleyici bloklarını tek panelden yönetin.
                  Değişiklikler canlı önizlemede görünür, kaydedildikten sonra ana sayfaya da yansır.
                </CardDescription>
              </div>

              <div className="grid gap-3 rounded-3xl border border-white/10 bg-black/20 p-4 text-xs uppercase tracking-[0.22em] text-zinc-400">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono">GET /api/admin/content/corporate/about</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                </div>
                <Separator />
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono">PUT /api/admin/content/corporate/about</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                </div>
                <Separator />
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono">Yükleme /api/upload</span>
                  <Upload className="h-4 w-4 text-[color:var(--accent)]" />
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {apiError && (
          <Card className="border-amber-400/20 bg-amber-400/5">
            <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full border border-amber-400/20 bg-amber-400/10 p-2 text-amber-300">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-100">API uyarısı</p>
                  <p className="text-sm text-zinc-400">{apiError}</p>
                </div>
              </div>
              <Button variant="outline" onClick={() => void loadContent()} className="border-white/10 bg-white/[0.03]">
                <RefreshCcw className="mr-2 h-4 w-4" />
                Yeniden dene
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
          <Card className="sticky top-6 border-white/10 bg-white/[0.04]">
            <CardHeader className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-2xl tracking-[0.06em]">Ana sayfa önizlemesi</CardTitle>
                  <CardDescription>
                    Ana sayfadaki Hakkımızda bölümünün birebir düzenini burada görürsünüz.
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Canlı mirror</Badge>
                  <Badge variant="outline">{formatDate(syncTimestamp || undefined)}</Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid gap-6 lg:grid-cols-2 lg:items-center"
              >
                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                    {preview.subtitle}
                  </p>
                  <h2 className="text-4xl font-thin tracking-tight text-zinc-50 md:text-6xl" style={{ fontFamily: 'var(--font-smooch), sans-serif' }}>
                    {preview.title}
                  </h2>
                  <p className="max-w-xl text-base leading-8 text-zinc-400 md:text-xl" style={{ fontFamily: 'var(--font-smooch), sans-serif' }}>
                    {preview.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">Ana sayfa ile aynı kaynak</Badge>
                    <Badge variant="outline">Editörden güncellenir</Badge>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/30">
                  {preview.image ? (
                    <img src={preview.image} alt="Hakkımızda kapak önizleme" className="h-[320px] w-full object-cover" />
                  ) : (
                    <div className="flex h-[320px] items-center justify-center text-sm text-zinc-500">
                      Kapak görseli bekleniyor
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent p-4">
                    <div className="flex items-center justify-between gap-3 text-xs text-zinc-200">
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Ana sayfa görseli
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1">
                        <Sparkles className="h-3.5 w-3.5" />
                        Canlı önizleme
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <Separator />

              <div className="grid gap-3 md:grid-cols-3">
                {preview.stats.map((stat, index) => (
                  <div key={`preview-stat-${index}`} className="rounded-3xl border border-white/10 bg-black/20 p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{stat.label}</p>
                    <p className="mt-3 text-2xl font-semibold tracking-[0.08em] text-zinc-50">{stat.value}</p>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="grid gap-3">
                {preview.sections.map((section, index) => (
                  <div
                    key={`preview-section-${index}`}
                    className="grid gap-4 rounded-3xl border border-white/10 bg-black/20 p-4 md:grid-cols-[140px_minmax(0,1fr)]"
                  >
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                      {section.image ? (
                        <img src={section.image} alt={section.title} className="h-28 w-full object-cover" />
                      ) : (
                        <div className="flex h-28 items-center justify-center text-xs uppercase tracking-[0.18em] text-zinc-600">
                          Görsel yok
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Badge variant="secondary">Blok {String(index + 1).padStart(2, '0')}</Badge>
                      <h4 className="text-lg font-semibold tracking-[0.06em] text-zinc-50">{section.title}</h4>
                      <p className="text-sm leading-7 text-zinc-400">{section.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-white/10 bg-white/[0.04]">
              <CardHeader className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-2xl tracking-[0.06em]">Ana içerik</CardTitle>
                    <CardDescription>
                      Ana sayfadaki Hakkımızda bölümünü etkileyen alanları düzenleyin.
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={resetToDefaults} className="border-white/10 bg-white/[0.03]">
                      Varsayılan
                    </Button>
                    <Button variant="outline" onClick={() => void loadContent()} className="border-white/10 bg-white/[0.03]">
                      <RefreshCcw className="mr-2 h-4 w-4" />
                      Senkronize et
                    </Button>
                    <Button
                      onClick={saveAbout}
                      disabled={saveDisabled}
                      className="bg-[color:var(--accent)] text-black hover:bg-[color:var(--accent)]/90"
                    >
                      {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                      Kaydet
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                    Üst etiket
                  </label>
                  <Input
                    value={data.subtitle}
                    onChange={(event) => updateField('subtitle', event.target.value)}
                    placeholder="BİZ KİMİZ"
                    className="border-white/10 bg-black/20 text-zinc-100 placeholder:text-zinc-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                    Ana başlık
                  </label>
                  <Textarea
                    value={data.title}
                    onChange={(event) => updateField('title', event.target.value)}
                    placeholder="Sizin hikayeniz, sizin mekanınız."
                    className="min-h-[120px] border-white/10 bg-black/20 text-zinc-100 placeholder:text-zinc-500"
                  />
                  <p className="text-xs text-zinc-500">
                    Satır kırmak isterseniz yeni satır kullanın; ana sayfada aynı şekilde görünür.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                    Açıklama metni
                  </label>
                  <Textarea
                    value={data.description}
                    onChange={(event) => updateField('description', event.target.value)}
                    placeholder="Hakkımızda açıklama metni..."
                    className="min-h-[180px] border-white/10 bg-black/20 text-zinc-100 placeholder:text-zinc-500"
                  />
                </div>

                <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(240px,0.8fr)]">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => document.getElementById('corporate-cover-input')?.click()}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={handleDrop}
                    className="group relative flex min-h-[280px] cursor-pointer flex-col overflow-hidden rounded-3xl border border-dashed border-white/15 bg-black/20 transition-colors hover:border-[color:var(--accent)]"
                  >
                    {data.image ? (
                      <img src={data.image} alt="Hakkımızda kapak görseli" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
                        <div className="rounded-full border border-white/10 bg-white/5 p-4 text-[color:var(--accent)]">
                          <ImageIcon className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-zinc-100">Kapak görseli ekle</p>
                          <p className="text-xs text-zinc-500">
                            PNG, JPG veya WEBP yükleyin. Görsel ana sayfada da kullanılacak.
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent p-4">
                      <div className="flex items-center justify-between gap-3 text-xs text-zinc-200">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          API üzerinden yüklenir
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1">
                          <Upload className="h-3.5 w-3.5" />
                          Sürükle bırak destekli
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <input
                      id="corporate-cover-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleCoverUpload}
                    />

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-300">
                      <div className="flex items-center gap-2 text-zinc-100">
                        <Clock3 className="h-4 w-4 text-[color:var(--accent)]" />
                        Son senkronizasyon
                      </div>
                      <div className="mt-2 text-zinc-400">{formatDate(syncTimestamp || undefined)}</div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-300">
                      <div className="flex items-center gap-2 text-zinc-100">
                        <Sparkles className="h-4 w-4 text-[color:var(--accent)]" />
                        Yayın durumu
                      </div>
                      <div className={cn('mt-2 font-medium', isDirty ? 'text-amber-300' : 'text-emerald-300')}>
                        {isDirty ? 'Taslak değişiklikler var' : 'Ana sayfa ile senkronize'}
                      </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-300">
                      <div className="flex items-center gap-2 text-zinc-100">
                        <FileText className="h-4 w-4 text-[color:var(--accent)]" />
                        API bağlantısı
                      </div>
                      <div className="mt-2 text-zinc-400">
                        GET, PUT ve upload akışları bu panel üzerinden doğrulanır.
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/[0.04]">
              <CardHeader className="flex-row items-center justify-between gap-4 space-y-0">
                <div>
                  <CardTitle className="text-xl tracking-[0.06em]">İstatistikler</CardTitle>
                  <CardDescription>Bu kartlar ana sayfadaki editlenebilir Hakkımızda verisinin parçasıdır.</CardDescription>
                </div>
                <Button type="button" variant="outline" onClick={addStat} className="border-white/10 bg-white/[0.03]">
                  <Plus className="mr-2 h-4 w-4" />
                  İstatistik ekle
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.stats.length === 0 && (
                  <div className="rounded-3xl border border-dashed border-white/10 bg-black/20 p-8 text-center text-sm text-zinc-500">
                    Henüz istatistik yok. Yeni bir kart ekleyebilirsiniz.
                  </div>
                )}

                <div className="grid gap-4">
                  {data.stats.map((stat, index) => (
                    <div key={`${stat.label}-${index}`} className="rounded-3xl border border-white/10 bg-black/20 p-4">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <Badge variant="secondary">İstatistik {String(index + 1).padStart(2, '0')}</Badge>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            disabled={index === 0}
                            onClick={() => {
                              const next = [...data.stats];
                              if (index > 0) {
                                [next[index - 1], next[index]] = [next[index], next[index - 1]];
                                updateData({ ...data, stats: next });
                              }
                            }}
                            className="h-8 w-8 text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            disabled={index === data.stats.length - 1}
                            onClick={() => {
                              const next = [...data.stats];
                              if (index < next.length - 1) {
                                [next[index + 1], next[index]] = [next[index], next[index + 1]];
                                updateData({ ...data, stats: next });
                              }
                            }}
                            className="h-8 w-8 text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => removeStat(index)}
                            className="h-8 px-3 text-zinc-400 hover:bg-white/5 hover:text-red-300"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Sil
                          </Button>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                            Etiket
                          </label>
                          <Input
                            value={stat.label}
                            onChange={(event) => updateStat(index, 'label', event.target.value)}
                            placeholder="DENEYİM"
                            className="border-white/10 bg-black/20 text-zinc-100 placeholder:text-zinc-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                            Değer
                          </label>
                          <Input
                            value={stat.value}
                            onChange={(event) => updateStat(index, 'value', event.target.value)}
                            placeholder="10+ YIL"
                            className="border-white/10 bg-black/20 text-zinc-100 placeholder:text-zinc-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/[0.04]">
              <CardHeader className="flex-row items-center justify-between gap-4 space-y-0">
                <div>
                  <CardTitle className="text-xl tracking-[0.06em]">Destek blokları</CardTitle>
                  <CardDescription>Hakkımızda sayfasındaki alt açıklama bloklarını düzenleyin.</CardDescription>
                </div>
                <Button type="button" onClick={addSection} className="bg-[color:var(--accent)] text-black hover:bg-[color:var(--accent)]/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Blok ekle
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.sections.length === 0 && (
                  <div className="rounded-3xl border border-dashed border-white/10 bg-black/20 p-8 text-center text-sm text-zinc-500">
                    Henüz destek blokları yok. Yeni bir blok ekleyebilirsiniz.
                  </div>
                )}

                <AnimatePresence initial={false}>
                  {data.sections.map((section, index) => (
                    <motion.div
                      key={`${section.title}-${index}`}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      className="grid gap-4 rounded-3xl border border-white/10 bg-black/20 p-4 lg:grid-cols-[200px_minmax(0,1fr)]"
                    >
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between gap-3">
                          <Badge variant="secondary">Blok {String(index + 1).padStart(2, '0')}</Badge>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              disabled={index === 0}
                              onClick={() => moveSection(index, 'up')}
                              className="h-8 w-8 text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
                            >
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              disabled={index === data.sections.length - 1}
                              onClick={() => moveSection(index, 'down')}
                              className="h-8 w-8 text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => removeSection(index)}
                              className="h-8 px-3 text-zinc-400 hover:bg-white/5 hover:text-red-300"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Sil
                            </Button>
                          </div>
                        </div>

                        <label
                          htmlFor={`corporate-section-image-${index}`}
                          className="group flex min-h-[180px] cursor-pointer items-center justify-center overflow-hidden rounded-3xl border border-dashed border-white/15 bg-white/[0.02] text-center transition-colors hover:border-[color:var(--accent)]"
                        >
                          {section.image ? (
                            <img
                              src={section.image}
                              alt={`Destek blok ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="space-y-3 p-5 text-zinc-500">
                              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[color:var(--accent)]">
                                <Upload className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-zinc-100">Görsel ekle</p>
                                <p className="mt-1 text-xs leading-5">
                                  Blok görseli opsiyoneldir.
                                </p>
                              </div>
                            </div>
                          )}
                        </label>
                        <input
                          id={`corporate-section-image-${index}`}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) => void handleSectionUpload(event, index)}
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                            Blok başlığı
                          </label>
                          <Input
                            value={section.title}
                            onChange={(event) => updateSection(index, 'title', event.target.value)}
                            placeholder="KEŞİF VE ANALİZ"
                            className="border-white/10 bg-black/20 text-zinc-100 placeholder:text-zinc-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                            İçerik
                          </label>
                          <Textarea
                            value={section.content}
                            onChange={(event) => updateSection(index, 'content', event.target.value)}
                            placeholder="Kısa açıklama..."
                            className="min-h-[140px] border-white/10 bg-black/20 text-zinc-100 placeholder:text-zinc-500"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/[0.04]">
              <CardHeader>
                <CardTitle className="text-lg tracking-[0.06em]">Kontrol listesi</CardTitle>
                <CardDescription>Bu ekrandaki kritik akışlar doğrudan doğrulanır.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-zinc-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  İçerik `GET` isteği ile yükleniyor.
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-zinc-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Değişiklikler `PUT` isteği ile kaydediliyor.
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-zinc-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Görseller `api/upload` ile yükleniyor.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AdminSaveBar isVisible={isDirty} onSave={saveAbout} onCancel={handleCancel} isSaving={saving} />
    </div>
  );
}
