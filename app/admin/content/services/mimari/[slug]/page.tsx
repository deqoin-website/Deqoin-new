'use client';

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  CloudUpload,
  Eye,
  FolderKanban,
  Image as ImageIcon,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Sparkles,
  Target,
  Trash2,
  Upload,
  Wrench,
} from 'lucide-react';

import { useNotification } from '@/components/admin/AdminNotificationProvider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { SLIDER_IMAGE_URLS } from '@/lib/slider-images';

type TabKey = 'genel' | 'hero' | 'surec' | 'odak' | 'kategoriler';

type DepartmentState = {
  slug: string;
  title: string;
  sideLabel: string;
  description: string;
  image: string;
  mediaType: 'image' | 'video';
  heroBlur: number;
  heroOverlay: number;
  sliderImages: string[];
  process: { title: string; desc: string }[];
  focusAreas: { title: string; icon: string; desc: string }[];
  categories: { label: string; value: string }[];
};

type ProbeStatus = 'idle' | 'loading' | 'ok' | 'error';

const TAB_ITEMS: Array<{ key: TabKey; label: string; description: string; icon: typeof Wrench }> = [
  { key: 'genel', label: 'Genel', description: 'Temel künye ve kapak görseli', icon: Wrench },
  { key: 'hero', label: 'Hero', description: 'Hero katmanı ve slider', icon: ImageIcon },
  { key: 'surec', label: 'Süreç', description: 'Process adımları', icon: Wrench },
  { key: 'odak', label: 'Odak', description: 'Odak alanları ve ikonlar', icon: Target },
  { key: 'kategoriler', label: 'Kategoriler', description: 'Kategori etiketleri', icon: FolderKanban },
];

const cloneDepartment = (value: DepartmentState) => JSON.parse(JSON.stringify(value)) as DepartmentState;

const makeSeed = (slug: string): DepartmentState => ({
  slug,
  title: slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()),
  sideLabel: 'Studio Yönetimi',
  description: 'Bu departman için içerik henüz tanımlanmadı.',
  image: '',
  mediaType: 'image',
  heroBlur: 0,
  heroOverlay: 30,
  sliderImages: [],
  process: [],
  focusAreas: [],
  categories: [{ label: 'TÜM PROJELER', value: 'ALL' }],
});

const normalizeDepartment = (value: any, slug: string): DepartmentState => {
  const seed = makeSeed(slug);
  return {
    slug: value?.slug || slug,
    title: value?.title || seed.title,
    sideLabel: value?.sideLabel || seed.sideLabel,
    description: value?.description || '',
    image: value?.image || '',
    mediaType: value?.mediaType === 'video' ? 'video' : 'image',
    heroBlur: Number(value?.heroBlur || 0),
    heroOverlay: Number(value?.heroOverlay || 30),
    sliderImages: Array.isArray(value?.sliderImages) ? value.sliderImages.filter(Boolean) : [],
    process: Array.isArray(value?.process)
      ? value.process.map((item: any) => ({ title: item?.title || '', desc: item?.desc || '' }))
      : [],
    focusAreas: Array.isArray(value?.focusAreas)
      ? value.focusAreas.map((item: any) => ({ title: item?.title || '', icon: item?.icon || '', desc: item?.desc || '' }))
      : [],
    categories: Array.isArray(value?.categories) && value.categories.length > 0
      ? value.categories.map((item: any) => ({ label: item?.label || '', value: item?.value || '' }))
      : seed.categories,
  };
};

const probeMeta = (status: ProbeStatus) => {
  if (status === 'ok') {
    return {
      label: 'Çalışıyor',
      className: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
      icon: CheckCircle2,
    };
  }

  if (status === 'error') {
    return {
      label: 'Hata',
      className: 'border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300',
      icon: BadgeCheck,
    };
  }

  if (status === 'loading') {
    return {
      label: 'Kontrol',
      className: 'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300',
      icon: Loader2,
    };
  }

  return {
    label: 'Hazır',
    className: 'border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text-muted)]',
    icon: BadgeCheck,
  };
};

const formatDate = (value?: string) => {
  if (!value) return 'Tarih yok';
  return new Date(value).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export default function ServiceDetailEditor() {
  const params = useParams();
  const rawSlug = params?.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug || 'mimarlik';
  const { showToast } = useNotification();

  const [department, setDepartment] = useState<DepartmentState>(() => makeSeed(slug));
  const [initialDepartment, setInitialDepartment] = useState<DepartmentState>(() => makeSeed(slug));
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('genel');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [apiStatus, setApiStatus] = useState({
    department: 'loading' as ProbeStatus,
    upload: 'idle' as ProbeStatus,
    updatedAt: '',
  });

  const loadDepartment = useCallback(async () => {
    setIsLoading(true);
    setApiStatus((prev) => ({ ...prev, department: 'loading' }));

    try {
      const res = await fetch(`/api/admin/departments/${slug}`, { cache: 'no-store' });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data || data.error) {
        throw new Error(data?.error || 'Department load failed');
      }

      const next = normalizeDepartment(data, slug);
      setDepartment(next);
      setInitialDepartment(cloneDepartment(next));
      setApiStatus({
        department: 'ok',
        upload: 'idle',
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Department load error:', error);
      const fallback = makeSeed(slug);
      setDepartment(fallback);
      setInitialDepartment(cloneDepartment(fallback));
      setApiStatus({
        department: 'error',
        upload: 'idle',
        updatedAt: new Date().toISOString(),
      });
      showToast('Departman verisi yüklenemedi.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast, slug]);

  useEffect(() => {
    loadDepartment();
  }, [loadDepartment]);

  useEffect(() => {
    const syncTheme = () => {
      setTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
    };

    syncTheme();
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => observer.disconnect();
  }, []);

  const mutateDepartment = (updater: (draft: DepartmentState) => void) => {
    setDepartment((prev) => {
      const next = cloneDepartment(prev);
      updater(next);
      return next;
    });
    setIsDirty(true);
  };

  const uploadFile = async (file: File) => {
    setApiStatus((prev) => ({ ...prev, upload: 'loading' }));
    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', file.name);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const payload = await res.json().catch(() => null);
    if (!res.ok) {
      setApiStatus((prev) => ({ ...prev, upload: 'error', updatedAt: new Date().toISOString() }));
      throw new Error(payload?.details || payload?.error || 'Upload failed');
    }

    const uploadedUrl = payload?.url || payload?.downloadUrl;
    if (!uploadedUrl) {
      setApiStatus((prev) => ({ ...prev, upload: 'error', updatedAt: new Date().toISOString() }));
      throw new Error('Upload URL missing');
    }

    setApiStatus((prev) => ({ ...prev, upload: 'ok', updatedAt: new Date().toISOString() }));
    return uploadedUrl as string;
  };

  const saveDepartment = async (nextDepartment = department) => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/departments/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...nextDepartment, slug }),
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(payload?.error || 'Save failed');
      }

      const next = normalizeDepartment(payload || nextDepartment, slug);
      setDepartment(next);
      setInitialDepartment(cloneDepartment(next));
      setIsDirty(false);
      setApiStatus((prev) => ({ ...prev, department: 'ok', updatedAt: new Date().toISOString() }));
      showToast('Departman kaydedildi.', 'success');
    } catch (error) {
      console.error('Department save error:', error);
      showToast(error instanceof Error ? error.message : 'Kayıt başarısız.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setDepartment(cloneDepartment(initialDepartment));
    setIsDirty(false);
    showToast('Değişiklikler geri alındı.', 'info');
  };

  const currentHero = department.image;
  const updatedLabel = apiStatus.updatedAt ? formatDate(apiStatus.updatedAt) : 'Henüz yok';

  const apiCards = [
    {
      title: 'Departman API',
      href: `/api/admin/departments/${slug}`,
      status: apiStatus.department,
      note: 'Başlık, açıklama, süreç ve kategori kartlarını okur/yazar.',
    },
    {
      title: 'Upload servisi',
      href: '/api/upload',
      status: apiStatus.upload,
      note: 'Hero görseli ve slider içerikleri için kullanılır.',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-[color:var(--accent)]">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-[2rem] border border-[color:var(--line)] bg-[color:var(--surface)] shadow-[var(--shadow)]"
      >
        <div className="flex flex-col gap-6 p-5 sm:p-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl space-y-4">
            <Badge className="border border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text-muted)]">
              <Sparkles className="mr-2 h-3 w-3" />
              DETAYLI HİZMET EDİTÖRÜ
            </Badge>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-[color:var(--text)] sm:text-4xl">
                {department.title}
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-[color:var(--text-muted)]">
                Bu departmanın tüm yayın katmanlarını tek ekranda düzenleyin. Hero, süreç, odak ve
                kategori yapısı modern bir yönetim kabuğu içinde toplandı.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text-muted)]">
                Slug: {slug}
              </Badge>
              <Badge variant="outline" className="border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text-muted)]">
                Tema: {theme === 'light' ? 'Aydınlık' : 'Karanlık'}
              </Badge>
              <Badge variant="outline" className="border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text-muted)]">
                Son güncelleme: {updatedLabel}
              </Badge>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[470px]">
            <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[color:var(--text-muted)]">Hero</p>
              <p className="mt-1 text-2xl font-semibold text-[color:var(--text)]">{department.sliderImages.length}</p>
              <p className="mt-2 text-xs text-[color:var(--text-muted)]">Slider görseli</p>
            </div>
            <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[color:var(--text-muted)]">Süreç</p>
              <p className="mt-1 text-2xl font-semibold text-[color:var(--text)]">{department.process.length}</p>
              <p className="mt-2 text-xs text-[color:var(--text-muted)]">Adım sayısı</p>
            </div>
            <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[color:var(--text-muted)]">Odak</p>
              <p className="mt-1 text-2xl font-semibold text-[color:var(--text)]">{department.focusAreas.length}</p>
              <p className="mt-2 text-xs text-[color:var(--text-muted)]">Odak alanı</p>
            </div>
            <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[color:var(--text-muted)]">API</p>
              <p className="mt-1 text-2xl font-semibold text-[color:var(--text)]">
                {apiStatus.department === 'ok' ? 'Hazır' : 'Kontrol'}
              </p>
              <p className="mt-2 text-xs text-[color:var(--text-muted)]">Departman ve upload uçları takip ediliyor</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-[color:var(--line)] px-5 py-4 sm:px-6">
          {TAB_ITEMS.map((tab) => (
            <Button
              key={tab.key}
              type="button"
              variant={activeTab === tab.key ? 'default' : 'outline'}
              className={
                activeTab === tab.key
                  ? 'bg-[color:var(--accent)] text-[color:var(--text-inverse)] hover:bg-[color:var(--accent-soft)]'
                  : 'border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)] hover:bg-[color:var(--surface)]'
              }
              onClick={() => setActiveTab(tab.key)}
            >
              <tab.icon className="mr-2 h-4 w-4" />
              {tab.label}
            </Button>
          ))}
        </div>
      </motion.section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_360px]">
        <Card className="border border-[color:var(--line)] bg-[color:var(--surface)] shadow-[var(--shadow)]">
          <CardHeader className="border-b border-[color:var(--line)]">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <CardTitle className="text-lg text-[color:var(--text)]">
                  {TAB_ITEMS.find((item) => item.key === activeTab)?.label} Paneli
                </CardTitle>
                <CardDescription className="text-[color:var(--text-muted)]">
                  {TAB_ITEMS.find((item) => item.key === activeTab)?.description}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)]"
                  onClick={loadDepartment}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Yenile
                </Button>
                <Button
                  type="button"
                  className="bg-[color:var(--accent)] text-[color:var(--text-inverse)] hover:bg-[color:var(--accent-soft)]"
                  onClick={() => saveDepartment(department)}
                  disabled={isSaving}
                >
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Kaydet
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 p-5 sm:p-6">
            {activeTab === 'genel' && (
              <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
                <Card className="border border-[color:var(--line)] bg-[color:var(--surface-muted)] shadow-none">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base text-[color:var(--text)]">Kapak Görseli</CardTitle>
                    <CardDescription className="text-[color:var(--text-muted)]">
                      Hero görselini sürükle-bırak ile değiştirin.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <label className="group relative flex aspect-[4/3] cursor-pointer items-center justify-center overflow-hidden rounded-[1.5rem] border-2 border-dashed border-[color:var(--line)] bg-[color:var(--surface)]">
                      {currentHero ? (
                        <img src={currentHero} alt={department.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center gap-3 p-6 text-center text-[color:var(--text-muted)]">
                          <Upload className="h-7 w-7 text-[color:var(--accent)]" />
                          <p className="text-sm font-medium text-[color:var(--text)]">Görsel ekleyin</p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*,video/*"
                        className="hidden"
                        onChange={async (event) => {
                          const file = event.target.files?.[0];
                          if (!file) return;
                          try {
                            const url = await uploadFile(file);
                            const next = cloneDepartment(department);
                            next.image = url;
                            next.mediaType = file.type.startsWith('video/') ? 'video' : 'image';
                            setDepartment(next);
                            setIsDirty(true);
                            await saveDepartment(next);
                            showToast('Kapak görseli güncellendi.', 'success');
                          } catch (error) {
                            showToast(error instanceof Error ? error.message : 'Yükleme başarısız.', 'error');
                          } finally {
                            event.target.value = '';
                          }
                        }}
                      />
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <Badge variant="outline" className="border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text-muted)]">
                        Media: {department.mediaType}
                      </Badge>
                      <Badge variant="outline" className="border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text-muted)]">
                        Blur: {department.heroBlur}px
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid gap-4">
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">Başlık</label>
                      <Input
                        value={department.title}
                        onChange={(event) => mutateDepartment((draft) => { draft.title = event.target.value; })}
                        className="h-12 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">Yan Etiket</label>
                      <Input
                        value={department.sideLabel}
                        onChange={(event) => mutateDepartment((draft) => { draft.sideLabel = event.target.value; })}
                        className="h-12 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)]"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">Açıklama</label>
                    <Textarea
                      value={department.description}
                      onChange={(event) => mutateDepartment((draft) => { draft.description = event.target.value; })}
                      rows={9}
                      className="min-h-40 rounded-[1.5rem] border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)]"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">Hero Blur</label>
                      <Input
                        type="number"
                        min={0}
                        max={60}
                        value={department.heroBlur}
                        onChange={(event) => mutateDepartment((draft) => { draft.heroBlur = Number(event.target.value); })}
                        className="h-12 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">Hero Katman (%)</label>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={department.heroOverlay}
                        onChange={(event) => mutateDepartment((draft) => { draft.heroOverlay = Number(event.target.value); })}
                        className="h-12 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'hero' && (
              <div className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Card className="border border-[color:var(--line)] bg-[color:var(--surface-muted)] shadow-none">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-base text-[color:var(--text)]">Hero Ayarları</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">Blur</label>
                        <Input
                          type="range"
                          min={0}
                          max={60}
                          value={department.heroBlur}
                          onChange={(event) => mutateDepartment((draft) => { draft.heroBlur = Number(event.target.value); })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">Overlay</label>
                        <Input
                          type="range"
                          min={0}
                          max={100}
                          value={department.heroOverlay}
                          onChange={(event) => mutateDepartment((draft) => { draft.heroOverlay = Number(event.target.value); })}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border border-[color:var(--line)] bg-[color:var(--surface-muted)] shadow-none">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-base text-[color:var(--text)]">Slider Özeti</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="rounded-[1.25rem] border border-[color:var(--line)] bg-[color:var(--surface)] p-4 text-sm text-[color:var(--text-muted)]">
                        {department.sliderImages.length} slider görseli mevcut.
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                        onClick={() => document.getElementById('detail-slider-add')?.click()}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Slider Görseli Ekle
                      </Button>
                      <input
                        id="detail-slider-add"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (event) => {
                          const file = event.target.files?.[0];
                          if (!file) return;
                          try {
                            const url = await uploadFile(file);
                            const next = cloneDepartment(department);
                            next.sliderImages.push(url);
                            setDepartment(next);
                            setIsDirty(true);
                            await saveDepartment(next);
                            showToast('Slider görseli eklendi.', 'success');
                          } catch (error) {
                            showToast(error instanceof Error ? error.message : 'Yükleme başarısız.', 'error');
                          } finally {
                            event.target.value = '';
                          }
                        }}
                      />
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {department.sliderImages.map((slide, index) => (
                    <Card key={`${slide}-${index}`} className="overflow-hidden border border-[color:var(--line)] bg-[color:var(--surface-muted)] shadow-none">
                      <div className="aspect-[16/10]">
                        <img src={slide} alt={`Slide ${index + 1}`} className="h-full w-full object-cover" />
                      </div>
                      <CardContent className="flex items-center justify-between gap-2 p-4">
                        <span className="text-sm text-[color:var(--text-muted)]">Slide {index + 1}</span>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-10 w-10 border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                            onClick={() => document.getElementById(`detail-slider-replace-${index}`)?.click()}
                          >
                            <ImageIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-10 w-10 border-rose-500/20 bg-rose-500/10 text-rose-700 hover:bg-rose-500 hover:text-white dark:text-rose-300"
                            onClick={() =>
                              mutateDepartment((draft) => {
                                draft.sliderImages.splice(index, 1);
                              })
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <input
                            id={`detail-slider-replace-${index}`}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (event) => {
                              const file = event.target.files?.[0];
                              if (!file) return;
                              try {
                                const url = await uploadFile(file);
                                const next = cloneDepartment(department);
                                next.sliderImages[index] = url;
                                setDepartment(next);
                                setIsDirty(true);
                                await saveDepartment(next);
                                showToast('Slider görseli güncellendi.', 'success');
                              } catch (error) {
                                showToast(error instanceof Error ? error.message : 'Yükleme başarısız.', 'error');
                              } finally {
                                event.target.value = '';
                              }
                            }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {department.sliderImages.length === 0 && (
                    <div className="rounded-[1.5rem] border border-dashed border-[color:var(--line)] bg-[color:var(--surface-muted)] p-8 text-center text-sm text-[color:var(--text-muted)] md:col-span-2 xl:col-span-3">
                      Henüz slider görseli eklenmedi.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'surec' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-semibold text-[color:var(--text)]">İş Süreci</h3>
                    <p className="text-sm text-[color:var(--text-muted)]">Adımlar, açıklamalar ve akış.</p>
                  </div>
                  <Button type="button" className="bg-[color:var(--accent)] text-[color:var(--text-inverse)] hover:bg-[color:var(--accent-soft)]" onClick={() => mutateDepartment((draft) => draft.process.push({ title: 'Yeni Adım', desc: 'Açıklama' }))}>
                    <Plus className="mr-2 h-4 w-4" />
                    Adım Ekle
                  </Button>
                </div>
                <div className="space-y-3">
                  {department.process.map((item, index) => (
                    <Card key={`${item.title}-${index}`} className="border border-[color:var(--line)] bg-[color:var(--surface-muted)] shadow-none">
                      <CardContent className="grid gap-3 p-4 lg:grid-cols-[220px_minmax(0,1fr)_auto]">
                        <Input
                          value={item.title}
                          onChange={(event) => mutateDepartment((draft) => { draft.process[index].title = event.target.value; })}
                          className="h-11 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                        />
                        <Textarea
                          value={item.desc}
                          onChange={(event) => mutateDepartment((draft) => { draft.process[index].desc = event.target.value; })}
                          className="min-h-24 rounded-[1.25rem] border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-11 w-11 border-rose-500/20 bg-rose-500/10 text-rose-700 hover:bg-rose-500 hover:text-white dark:text-rose-300"
                          onClick={() => mutateDepartment((draft) => { draft.process.splice(index, 1); })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                  {department.process.length === 0 && (
                    <div className="rounded-[1.5rem] border border-dashed border-[color:var(--line)] bg-[color:var(--surface-muted)] p-8 text-center text-sm text-[color:var(--text-muted)]">
                      Henüz süreç adımı yok.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'odak' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-semibold text-[color:var(--text)]">Odak Alanları</h3>
                    <p className="text-sm text-[color:var(--text-muted)]">İkon, başlık ve açıklamalar.</p>
                  </div>
                  <Button type="button" className="bg-[color:var(--accent)] text-[color:var(--text-inverse)] hover:bg-[color:var(--accent-soft)]" onClick={() => mutateDepartment((draft) => draft.focusAreas.push({ title: 'Yeni Odak', icon: 'sparkles', desc: 'Açıklama' }))}>
                    <Plus className="mr-2 h-4 w-4" />
                    Odak Ekle
                  </Button>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  {department.focusAreas.map((item, index) => (
                    <Card key={`${item.title}-${index}`} className="border border-[color:var(--line)] bg-[color:var(--surface-muted)] shadow-none">
                      <CardContent className="space-y-3 p-4">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <Input
                            value={item.icon}
                            onChange={(event) => mutateDepartment((draft) => { draft.focusAreas[index].icon = event.target.value; })}
                            className="h-11 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                          />
                          <Input
                            value={item.title}
                            onChange={(event) => mutateDepartment((draft) => { draft.focusAreas[index].title = event.target.value; })}
                            className="h-11 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                          />
                        </div>
                        <Textarea
                          value={item.desc}
                          onChange={(event) => mutateDepartment((draft) => { draft.focusAreas[index].desc = event.target.value; })}
                          className="min-h-24 rounded-[1.25rem] border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                        />
                        <div className="flex justify-end">
                          <Button
                            type="button"
                            variant="outline"
                            className="border-rose-500/20 bg-rose-500/10 text-rose-700 hover:bg-rose-500 hover:text-white dark:text-rose-300"
                            onClick={() => mutateDepartment((draft) => { draft.focusAreas.splice(index, 1); })}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Sil
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {department.focusAreas.length === 0 && (
                    <div className="rounded-[1.5rem] border border-dashed border-[color:var(--line)] bg-[color:var(--surface-muted)] p-8 text-center text-sm text-[color:var(--text-muted)] lg:col-span-2">
                      Henüz odak alanı yok.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'kategoriler' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-semibold text-[color:var(--text)]">Kategoriler</h3>
                    <p className="text-sm text-[color:var(--text-muted)]">Departman kartlarını etiketleyin.</p>
                  </div>
                  <Button type="button" className="bg-[color:var(--accent)] text-[color:var(--text-inverse)] hover:bg-[color:var(--accent-soft)]" onClick={() => mutateDepartment((draft) => draft.categories.push({ label: 'Yeni Kategori', value: 'NEW' }))}>
                    <Plus className="mr-2 h-4 w-4" />
                    Kategori Ekle
                  </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {department.categories.map((item, index) => (
                    <Card key={`${item.label}-${index}`} className="border border-[color:var(--line)] bg-[color:var(--surface-muted)] shadow-none">
                      <CardContent className="grid gap-3 p-4">
                        <Input
                          value={item.label}
                          onChange={(event) => mutateDepartment((draft) => { draft.categories[index].label = event.target.value; })}
                          className="h-11 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                        />
                        <Input
                          value={item.value}
                          onChange={(event) => mutateDepartment((draft) => { draft.categories[index].value = event.target.value; })}
                          className="h-11 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                        />
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text-muted)]">
                            {item.value || 'VALUE'}
                          </Badge>
                          <Button
                            type="button"
                            variant="outline"
                            className="border-rose-500/20 bg-rose-500/10 text-rose-700 hover:bg-rose-500 hover:text-white dark:text-rose-300"
                            onClick={() => mutateDepartment((draft) => { draft.categories.splice(index, 1); })}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Sil
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {department.categories.length === 0 && (
                    <div className="rounded-[1.5rem] border border-dashed border-[color:var(--line)] bg-[color:var(--surface-muted)] p-8 text-center text-sm text-[color:var(--text-muted)] md:col-span-2">
                      Henüz kategori yok.
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
          <Card className="border border-[color:var(--line)] bg-[color:var(--surface)] shadow-[var(--shadow)]">
            <CardHeader className="border-b border-[color:var(--line)]">
              <CardTitle className="text-lg text-[color:var(--text)]">API Bağlantıları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-5 sm:p-6">
              {apiCards.map((item) => {
                const meta = probeMeta(item.status);
                const Icon = meta.icon;
                return (
                  <div key={item.href} className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-[color:var(--text)]">{item.title}</p>
                          <Badge className={`border ${meta.className} px-2 py-0.5 text-[0.65rem] uppercase tracking-[0.24em]`}>
                            <Icon className={`mr-1 h-3 w-3 ${item.status === 'loading' ? 'animate-spin' : ''}`} />
                            {meta.label}
                          </Badge>
                        </div>
                        <p className="text-xs leading-5 text-[color:var(--text-muted)]">{item.note}</p>
                      </div>
                      <Eye className="mt-1 h-4 w-4 text-[color:var(--text-muted)]" />
                    </div>
                    <p className="mt-3 text-[0.65rem] uppercase tracking-[0.24em] text-[color:var(--text-muted)]">
                      {item.href}
                    </p>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="border border-[color:var(--line)] bg-[color:var(--surface)] shadow-[var(--shadow)]">
            <CardHeader className="border-b border-[color:var(--line)]">
              <CardTitle className="text-lg text-[color:var(--text)]">Hızlı İşlem</CardTitle>
              <CardDescription className="text-[color:var(--text-muted)]">Kaydet, geri al, yenile.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 p-5 sm:p-6">
              <Button
                type="button"
                className="w-full bg-[color:var(--accent)] text-[color:var(--text-inverse)] hover:bg-[color:var(--accent-soft)]"
                onClick={() => saveDepartment(department)}
                disabled={isSaving}
              >
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CloudUpload className="mr-2 h-4 w-4" />}
                Kaydet
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)]"
                onClick={handleCancel}
                disabled={!isDirty}
              >
                Vazgeç
              </Button>
              <Separator className="bg-[color:var(--line)]" />
              <Button
                type="button"
                variant="outline"
                className="w-full border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                onClick={loadDepartment}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Yeniden Yükle
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-[color:var(--line)] bg-[color:var(--surface)] shadow-[var(--shadow)]">
            <CardHeader className="border-b border-[color:var(--line)]">
              <CardTitle className="text-lg text-[color:var(--text)]">Geri Dönüş</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-5 sm:p-6">
              <Button asChild variant="outline" className="w-full border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)]">
                <Link href="/admin/content/services/mimari">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Mimari Genel Ayarlar
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)]">
                <Link href="/admin/projects">
                  <FolderKanban className="mr-2 h-4 w-4" />
                  Proje Havuzu
                </Link>
              </Button>
            </CardContent>
          </Card>
        </aside>
      </section>
    </div>
  );
}
