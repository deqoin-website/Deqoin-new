'use client';

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState, type ChangeEvent, type DragEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  Layers3,
  Loader2,
  Plus,
  RefreshCcw,
  Save,
  ShieldCheck,
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
import { cn } from '@/lib/utils';

type TabKey = 'main' | 'stats' | 'workflow';

type CorporateStat = {
  label: string;
  value: string;
};

type CorporateSection = {
  title: string;
  content: string;
  image?: string;
};

type CorporateContent = {
  page: 'about';
  title: string;
  subtitle: string;
  description: string;
  image: string;
  stats: CorporateStat[];
  sections: CorporateSection[];
  metadata?: {
    lastUpdatedBy?: string;
    updatedAt?: string;
  };
};

const DEFAULT_STATS: CorporateStat[] = [
  { label: 'DENEYİM', value: '10+ YIL' },
  { label: 'TESLİM EDİLEN', value: '+240 PROJE' },
  { label: 'UZMAN EKİP', value: '40+ KİŞİ' },
];

const DEFAULT_SECTIONS: CorporateSection[] = [
  {
    title: 'KEŞİF VE ANALİZ',
    content: 'Projenin ruhunu ve ihtiyaçlarını anlamak için derinlemesine bir analiz süreci yürütüyoruz.',
  },
  {
    title: 'KONSEPT TASARIM',
    content: 'Analizlerden yola çıkarak, markanıza veya yaşam tarzınıza özel özgün konseptler geliştiriyoruz.',
  },
  {
    title: 'MİMARİ GELİŞTİRME',
    content: 'Onaylanan konsepti, teknik disiplinler ve estetik detaylarla harmanlayarak projelendiriyoruz.',
  },
  {
    title: 'UYGULAMA VE TESLİM',
    content: 'Yüksek kalite standartlarında, anahtar teslim uygulama süreci ile hayallerinizi gerçeğe dönüştürüyoruz.',
  },
];

const createDefaultContent = (): CorporateContent => ({
  page: 'about',
  title: 'TASARIMDAN ÖTE:\nBÜTÜNSEL BİR DENEYİM',
  subtitle: 'BİZ KİMİZ',
  description:
    'Bizler sadece fiziksel yapılar inşa etmiyor; tüm değerlerinizi ortaya koyan bütünsel bir deneyim kurguluyoruz. Tasarımın sadece estetik bir form değil, yaşam biçimini şekillendiren bir disiplin olduğuna inanıyoruz.',
  image: '/images/workflow/hakkimizda-home.png',
  stats: [...DEFAULT_STATS],
  sections: [...DEFAULT_SECTIONS],
  metadata: {
    updatedAt: new Date().toISOString(),
  },
});

const cloneContent = (value: CorporateContent) => JSON.parse(JSON.stringify(value)) as CorporateContent;

const normalizeStat = (value: unknown, fallback: CorporateStat): CorporateStat => {
  if (!value || typeof value !== 'object') return { ...fallback };
  const candidate = value as Partial<CorporateStat>;
  return {
    label: candidate.label?.toString() ?? fallback.label,
    value: candidate.value?.toString() ?? fallback.value,
  };
};

const normalizeSection = (value: unknown, fallback: CorporateSection): CorporateSection => {
  if (!value || typeof value !== 'object') return { ...fallback };
  const candidate = value as Partial<CorporateSection>;
  return {
    title: candidate.title?.toString() ?? fallback.title,
    content: candidate.content?.toString() ?? fallback.content,
    image: candidate.image?.toString() ?? '',
  };
};

const normalizeContent = (value: unknown): CorporateContent => {
  const fallback = createDefaultContent();
  if (!value || typeof value !== 'object') return fallback;

  const candidate = value as Partial<CorporateContent>;
  const statsSource = Array.isArray(candidate.stats) && candidate.stats.length > 0 ? candidate.stats : fallback.stats;
  const sectionsSource =
    Array.isArray(candidate.sections) && candidate.sections.length > 0 ? candidate.sections : fallback.sections;

  return {
    page: 'about',
    title: candidate.title?.toString() ?? fallback.title,
    subtitle: candidate.subtitle?.toString() ?? fallback.subtitle,
    description: candidate.description?.toString() ?? fallback.description,
    image: candidate.image?.toString() ?? fallback.image,
    stats: statsSource.map((item, index) => normalizeStat(item, fallback.stats[index] || fallback.stats[0])),
    sections: sectionsSource.map((item, index) => normalizeSection(item, fallback.sections[index] || fallback.sections[0])),
    metadata: candidate.metadata
      ? {
          lastUpdatedBy: candidate.metadata.lastUpdatedBy?.toString(),
          updatedAt: candidate.metadata.updatedAt?.toString(),
        }
      : fallback.metadata,
  };
};

const formatDate = (value?: string) => {
  if (!value) return 'Kayıt yok';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Kayıt yok';
  return new Intl.DateTimeFormat('tr-TR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(parsed);
};

const TAB_ITEMS: Array<{
  key: TabKey;
  label: string;
  description: string;
  icon: typeof FileText;
}> = [
  { key: 'main', label: 'Ana İçerik', description: 'Başlık, açıklama ve görsel', icon: FileText },
  { key: 'stats', label: 'İstatistikler', description: 'Sayısal veriler ve etiketler', icon: BarChart3 },
  { key: 'workflow', label: 'İş Akışı', description: 'Adımlar ve görsel blokları', icon: Layers3 },
];

export default function CorporateAboutAdmin() {
  const { showToast } = useNotification();
  const [data, setData] = useState<CorporateContent>(createDefaultContent());
  const [initialData, setInitialData] = useState<CorporateContent>(createDefaultContent());
  const [isDirty, setIsDirty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('main');
  const [apiError, setApiError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [uploadTarget, setUploadTarget] = useState<string | null>(null);

  const syncTimestamp = useMemo(
    () => data.metadata?.updatedAt || initialData.metadata?.updatedAt || lastSync,
    [data.metadata?.updatedAt, initialData.metadata?.updatedAt, lastSync],
  );

  const loadContent = async () => {
    setLoading(true);
    setApiError(null);

    try {
      const res = await fetch('/api/admin/content/corporate/about', { cache: 'no-store' });
      if (!res.ok) {
        throw new Error(`GET /api/admin/content/corporate/about failed with ${res.status}`);
      }

      const json = normalizeContent(await res.json());
      setData(json);
      setInitialData(cloneContent(json));
      setLastSync(json.metadata?.updatedAt || new Date().toISOString());
      setIsDirty(false);
    } catch (error) {
      console.error('Corporate content load error:', error);
      const fallback = createDefaultContent();
      setData(fallback);
      setInitialData(cloneContent(fallback));
      setApiError('İçerik API bağlantısı okunamadı. Varsayılan verilerle devam ediliyor.');
      showToast('Kurumsal içerik yüklenemedi.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadContent();
  }, []);

  const updateData = (next: CorporateContent) => {
    setData(next);
    setIsDirty(true);
  };

  const handleSave = async () => {
    const payload = normalizeContent(data);
    setSaving(true);
    setApiError(null);

    try {
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

      const json = normalizeContent(await res.json());
      setData(json);
      setInitialData(cloneContent(json));
      setIsDirty(false);
      setLastSync(json.metadata?.updatedAt || new Date().toISOString());
      showToast('Kurumsal içerik başarıyla güncellendi.', 'success');
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

  const updateField = (field: keyof Pick<CorporateContent, 'title' | 'subtitle' | 'description' | 'image'>, value: string) => {
    updateData({
      ...data,
      [field]: value,
    });
  };

  const updateStat = (index: number, field: keyof CorporateStat, value: string) => {
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

  const addWorkflowStep = () => {
    updateData({
      ...data,
      sections: [...data.sections, { title: 'YENİ ADIM', content: '', image: '' }],
    });
  };

  const updateWorkflowStep = (index: number, field: keyof CorporateSection, value: string) => {
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

  const removeWorkflowStep = (index: number) => {
    updateData({
      ...data,
      sections: data.sections.filter((_, sectionIndex) => sectionIndex !== index),
    });
  };

  const uploadFile = async (file: File, target: 'cover' | { index: number }) => {
    setIsUploading(true);
    setUploadTarget(typeof target === 'string' ? 'kapak görseli' : `iş akışı ${target.index + 1}`);

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
        updateData({
          ...data,
          image: url,
        });
      } else {
        const nextSections = [...data.sections];
        nextSections[target.index] = {
          ...nextSections[target.index],
          image: url,
        };
        updateData({
          ...data,
          sections: nextSections,
        });
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

  const handleWorkflowUpload = async (event: ChangeEvent<HTMLInputElement>, index: number) => {
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

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-[color:var(--text-muted)]">
        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm">
          <Loader2 className="h-4 w-4 animate-spin text-[color:var(--accent)]" />
          Kurumsal içerik yükleniyor
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
              <Badge>Kurumsal Felsefe</Badge>
              <Badge variant={isDirty ? 'default' : 'secondary'}>{isDirty ? 'Kaydedilmemiş değişiklik' : 'Senkronize'}</Badge>
              <Badge variant={apiError ? 'outline' : 'secondary'}>{apiError ? 'API uyarısı' : 'API bağlantısı aktif'}</Badge>
              <Badge variant="outline">{data.stats.length} istatistik</Badge>
              <Badge variant="outline">{data.sections.length} adım</Badge>
            </div>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.8fr)] lg:items-end">
              <div className="space-y-3">
                <CardTitle className="text-3xl tracking-[0.08em] text-zinc-50 md:text-5xl">
                  Kurumsal sayfa editörü
                </CardTitle>
                <CardDescription className="max-w-3xl text-base text-zinc-400">
                  `/admin/content/corporate` sayfasındaki ana başlık, görsel, istatistikler ve iş akışı içeriklerini
                  tek panelden yönetin. Kaydetme, yükleme ve API durumlarını doğrudan burada kontrol edin.
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
                  <CloudUpload className="h-4 w-4 text-[color:var(--accent)]" />
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.85fr)]">
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="border-white/10 bg-white/[0.04]">
                <CardHeader className="pb-3">
                  <CardDescription>Son senkronizasyon</CardDescription>
                  <CardTitle className="text-xl tracking-[0.06em]">
                    {formatDate(syncTimestamp || undefined)}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card className="border-white/10 bg-white/[0.04]">
                <CardHeader className="pb-3">
                  <CardDescription>Aktif durum</CardDescription>
                  <CardTitle className="text-xl tracking-[0.06em]">
                    {saving ? 'Kaydediliyor' : isDirty ? 'Düzenleniyor' : 'Hazır'}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card className="border-white/10 bg-white/[0.04]">
                <CardHeader className="pb-3">
                  <CardDescription>Yükleme</CardDescription>
                  <CardTitle className="text-xl tracking-[0.06em]">
                    {isUploading ? uploadTarget || 'Yükleniyor' : 'Beklemede'}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

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

            <Card className="border-white/10 bg-white/[0.04]">
              <CardHeader className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-2xl tracking-[0.06em]">Düzenleme alanı</CardTitle>
                    <CardDescription className="max-w-2xl">
                      Alanları güncelleyin, görsel yükleyin ve değişiklikleri kaydetmeden önce önizlemeyi kontrol edin.
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={handleSave}
                      disabled={saveDisabled}
                      className="bg-[color:var(--accent)] text-black hover:bg-[color:var(--accent)]/90"
                    >
                      {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                      Kaydet
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      disabled={!isDirty || saving}
                      className="border-white/10 bg-white/[0.03]"
                    >
                      <RefreshCcw className="mr-2 h-4 w-4" />
                      Sıfırla
                    </Button>
                  </div>
                </div>

                <div className="grid gap-2 rounded-3xl border border-white/10 bg-black/20 p-2 md:grid-cols-3">
                  {TAB_ITEMS.map((tab) => {
                    const Icon = tab.icon;
                    const active = activeTab === tab.key;

                    return (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setActiveTab(tab.key)}
                        className={cn(
                          'flex flex-col gap-1 rounded-2xl px-4 py-3 text-left transition-all',
                          active
                            ? 'bg-[color:var(--accent)] text-black shadow-[0_12px_35px_rgba(166,137,102,0.25)]'
                            : 'bg-transparent text-zinc-300 hover:bg-white/[0.04] hover:text-zinc-50',
                        )}
                      >
                        <span className="flex items-center gap-2 text-sm font-semibold tracking-[0.08em]">
                          <Icon className="h-4 w-4" />
                          {tab.label}
                        </span>
                        <span className={cn('text-xs tracking-normal', active ? 'text-black/70' : 'text-zinc-500')}>
                          {tab.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <AnimatePresence mode="wait">
                  {activeTab === 'main' && (
                    <motion.div
                      key="main"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      className="grid gap-6"
                    >
                      <Card className="border-white/10 bg-white/[0.03]">
                        <CardHeader>
                          <CardTitle className="text-lg tracking-[0.06em]">Sayfa başlıkları</CardTitle>
                          <CardDescription>Üst başlık ve ana başlık metinlerini düzenleyin.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                              Üst başlık
                            </label>
                            <Input
                              value={data.subtitle}
                              onChange={(event) => updateField('subtitle', event.target.value)}
                              placeholder="BİZ KİMİZ"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                              Ana başlık
                            </label>
                            <Textarea
                              value={data.title}
                              onChange={(event) => updateField('title', event.target.value)}
                              placeholder="TASARIMDAN ÖTE: BÜTÜNSEL BİR DENEYİM"
                              className="min-h-[120px]"
                            />
                            <p className="text-xs text-zinc-500">
                              Satır kırımı için yeni satır kullanın. Başlık doğrudan front-end'de aynı düzenle gösterilir.
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
                        <Card className="border-white/10 bg-white/[0.03]">
                          <CardHeader>
                            <CardTitle className="text-lg tracking-[0.06em]">Kapak görseli</CardTitle>
                            <CardDescription>
                              Dosya yükleyin ya da sürükleyip bırakın. Yükleme doğrudan `api/upload` üzerinden gider.
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div
                              role="button"
                              tabIndex={0}
                              onClick={() => document.getElementById('corporate-cover-input')?.click()}
                              onDragOver={(event) => event.preventDefault()}
                              onDrop={handleDrop}
                              className="group relative flex min-h-[320px] cursor-pointer flex-col overflow-hidden rounded-3xl border border-dashed border-white/15 bg-black/20 transition-colors hover:border-[color:var(--accent)]"
                            >
                              {data.image ? (
                                <img src={data.image} alt="Kurumsal kapak görseli" className="h-full w-full object-cover" />
                              ) : (
                                <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
                                  <div className="rounded-full border border-white/10 bg-white/5 p-4 text-[color:var(--accent)]">
                                    <ImageIcon className="h-6 w-6" />
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-sm font-medium text-zinc-100">Kapak görseli ekle</p>
                                    <p className="text-xs text-zinc-500">
                                      PNG, JPG veya WEBP dosyası yükleyin. Görsel alanı tam genişlikte gösterilir.
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

                            <input id="corporate-cover-input" type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />

                            <div className="space-y-2">
                              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                                Açıklama metni
                              </label>
                              <Textarea
                                value={data.description}
                                onChange={(event) => updateField('description', event.target.value)}
                                placeholder="Kurumsal açıklama metni..."
                                className="min-h-[180px]"
                              />
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-white/10 bg-white/[0.03]">
                          <CardHeader>
                            <CardTitle className="text-lg tracking-[0.06em]">Canlı özet</CardTitle>
                            <CardDescription>Kaydetmeden önce sayfanın görünümünü burada kontrol edin.</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-5">
                            <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/30">
                              {data.image ? (
                                <img src={data.image} alt="Kapak önizleme" className="h-56 w-full object-cover" />
                              ) : (
                                <div className="flex h-56 items-center justify-center text-sm text-zinc-500">
                                  Görsel önizleme bekleniyor
                                </div>
                              )}
                            </div>

                            <div className="space-y-2">
                              <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--accent)]">{data.subtitle}</p>
                              <h3 className="whitespace-pre-line text-xl font-semibold tracking-[0.06em] text-zinc-50">
                                {data.title}
                              </h3>
                              <p className="text-sm leading-7 text-zinc-400">{data.description}</p>
                            </div>

                            <Separator />

                            <div className="grid gap-3">
                              {data.metadata?.lastUpdatedBy && (
                                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm">
                                  <span className="text-zinc-500">Son düzenleyen</span>
                                  <span className="text-zinc-100">{data.metadata.lastUpdatedBy}</span>
                                </div>
                              )}
                              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm">
                                <span className="text-zinc-500">Son kaydı</span>
                                <span className="text-zinc-100">{formatDate(syncTimestamp || undefined)}</span>
                              </div>
                              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm">
                                <span className="text-zinc-500">Durum</span>
                                <span className={isDirty ? 'text-amber-300' : 'text-emerald-300'}>
                                  {isDirty ? 'Yayına hazır değil' : 'Yayına hazır'}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'stats' && (
                    <motion.div
                      key="stats"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      className="space-y-4"
                    >
                      <Card className="border-white/10 bg-white/[0.03]">
                        <CardHeader className="flex-row items-center justify-between gap-4 space-y-0">
                          <div>
                            <CardTitle className="text-lg tracking-[0.06em]">Sayısal veriler</CardTitle>
                            <CardDescription>
                              İstatistik kartlarının etiket ve değer alanlarını buradan güncelleyin.
                            </CardDescription>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={addStat}
                            className="border-white/10 bg-white/[0.03]"
                          >
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
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => removeStat(index)}
                                    className="h-9 px-3 text-zinc-400 hover:bg-white/5 hover:text-red-300"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Sil
                                  </Button>
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
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-white/10 bg-white/[0.03]">
                        <CardHeader>
                          <CardTitle className="text-lg tracking-[0.06em]">Önizleme</CardTitle>
                          <CardDescription>İstatistiklerin front-end düzenine yakın görünümünü kontrol edin.</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                            {data.stats.map((stat, index) => (
                              <div
                                key={`preview-${index}`}
                                className="rounded-3xl border border-white/10 bg-black/20 p-5"
                              >
                                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{stat.label}</p>
                                <p className="mt-3 text-2xl font-semibold tracking-[0.08em] text-zinc-50">{stat.value}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {activeTab === 'workflow' && (
                    <motion.div
                      key="workflow"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      className="space-y-4"
                    >
                      <Card className="border-white/10 bg-white/[0.03]">
                        <CardHeader className="flex-row items-center justify-between gap-4 space-y-0">
                          <div>
                            <CardTitle className="text-lg tracking-[0.06em]">İş akışı adımları</CardTitle>
                            <CardDescription>
                              Her adım için başlık, açıklama ve isteğe bağlı görsel yükleyin.
                            </CardDescription>
                          </div>
                          <Button
                            type="button"
                            onClick={addWorkflowStep}
                            className="bg-[color:var(--accent)] text-black hover:bg-[color:var(--accent)]/90"
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Adım ekle
                          </Button>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          {data.sections.length === 0 && (
                            <div className="rounded-3xl border border-dashed border-white/10 bg-black/20 p-8 text-center text-sm text-zinc-500">
                              Henüz iş akışı adımı yok. Yeni bir adım ekleyebilirsiniz.
                            </div>
                          )}

                          <div className="grid gap-4">
                            {data.sections.map((section, index) => (
                              <div
                                key={`${section.title}-${index}`}
                                className="grid gap-4 rounded-3xl border border-white/10 bg-black/20 p-4 lg:grid-cols-[180px_minmax(0,1fr)]"
                              >
                                <div className="flex flex-col gap-3">
                                  <div className="flex items-center justify-between gap-3">
                                    <Badge variant="secondary">
                                      Adım {String(index + 1).padStart(2, '0')}
                                    </Badge>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      onClick={() => removeWorkflowStep(index)}
                                      className="h-9 px-3 text-zinc-400 hover:bg-white/5 hover:text-red-300"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Sil
                                    </Button>
                                  </div>

                                  <label
                                    htmlFor={`corporate-workflow-image-${index}`}
                                    className="group flex min-h-[220px] cursor-pointer items-center justify-center overflow-hidden rounded-3xl border border-dashed border-white/15 bg-white/[0.02] text-center transition-colors hover:border-[color:var(--accent)]"
                                  >
                                    {section.image ? (
                                      <img
                                        src={section.image}
                                        alt={`İş akışı ${index + 1}`}
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
                                            Adım kartını destekleyen görsel alanı.
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                  </label>
                                  <input
                                    id={`corporate-workflow-image-${index}`}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(event) => void handleWorkflowUpload(event, index)}
                                  />
                                </div>

                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                                      Adım başlığı
                                    </label>
                                    <Input
                                      value={section.title}
                                      onChange={(event) => updateWorkflowStep(index, 'title', event.target.value)}
                                      placeholder="Adım başlığı"
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                                      Açıklama
                                    </label>
                                    <Textarea
                                      value={section.content}
                                      onChange={(event) => updateWorkflowStep(index, 'content', event.target.value)}
                                      placeholder="Kısa açıklama..."
                                      className="min-h-[120px]"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-white/10 bg-white/[0.03]">
                        <CardHeader>
                          <CardTitle className="text-lg tracking-[0.06em]">İş akışı önizlemesi</CardTitle>
                          <CardDescription>Adım sırasını, görselleri ve içerik tonunu burada kontrol edin.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                          {data.sections.map((section, index) => (
                            <div
                              key={`workflow-preview-${index}`}
                              className="grid gap-4 rounded-3xl border border-white/10 bg-black/20 p-4 md:grid-cols-[120px_minmax(0,1fr)]"
                            >
                              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                                {section.image ? (
                                  <img src={section.image} alt={section.title} className="h-32 w-full object-cover" />
                                ) : (
                                  <div className="flex h-32 items-center justify-center text-xs uppercase tracking-[0.18em] text-zinc-600">
                                    Görsel yok
                                  </div>
                                )}
                              </div>

                              <div className="space-y-2">
                                <Badge variant="secondary">Adım {String(index + 1).padStart(2, '0')}</Badge>
                                <h4 className="text-lg font-semibold tracking-[0.06em] text-zinc-50">{section.title}</h4>
                                <p className="text-sm leading-7 text-zinc-400">{section.content}</p>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="sticky top-6 border-white/10 bg-white/[0.04]">
              <CardHeader className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge>Canlı Önizleme</Badge>
                  <Badge variant={isDirty ? 'default' : 'secondary'}>{isDirty ? 'Taslak' : 'Yayın durumu'}</Badge>
                </div>
                <CardTitle className="text-2xl tracking-[0.08em]">{data.subtitle}</CardTitle>
                <CardDescription className="whitespace-pre-line text-base text-zinc-400">{data.title}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/30">
                  {data.image ? (
                    <img src={data.image} alt="Kurumsal önizleme" className="h-56 w-full object-cover" />
                  ) : (
                    <div className="flex h-56 items-center justify-center text-sm text-zinc-500">
                      Kapak görseli bekleniyor
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--accent)]">{data.subtitle}</p>
                  <p className="whitespace-pre-line text-sm leading-7 text-zinc-300">{data.description}</p>
                </div>

                <Separator />

                <div className="grid gap-3">
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm">
                    <span className="text-zinc-500">İstatistikler</span>
                    <span className="text-zinc-100">{data.stats.length}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm">
                    <span className="text-zinc-500">İş akışı adımları</span>
                    <span className="text-zinc-100">{data.sections.length}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm">
                    <span className="text-zinc-500">API durumu</span>
                    <span className={apiError ? 'text-amber-300' : 'text-emerald-300'}>
                      {apiError ? 'Kontrol gerekli' : 'Bağlı'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/[0.04]">
              <CardHeader>
                <CardTitle className="text-lg tracking-[0.06em]">Kontrol listesi</CardTitle>
                <CardDescription>Bu ekrandaki kritik akışlar doğrudan doğrulandı.</CardDescription>
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
                  Kapak ve adım görselleri `api/upload` ile yükleniyor.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AdminSaveBar isVisible={isDirty} onSave={handleSave} onCancel={handleCancel} isSaving={saving} />
    </div>
  );
}
