'use client';

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useState } from 'react';
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
  Wrench,
  X,
} from 'lucide-react';

import { useNotification } from '@/components/admin/AdminNotificationProvider';
import { AdminImageDropzone } from '@/components/admin/AdminImageDropzone';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { SLIDER_IMAGE_URLS } from '@/lib/slider-images';
import { materyalKategorileri } from '../../../../../../data/materyal-studyo';

type TabKey = 'genel' | 'hero' | 'surec' | 'odak' | 'urunler';

type ProductItem = {
  title: string;
  image: string;
  category: string;
  brand: string;
  model: string;
  collection: string;
  finish: string;
  usage: string;
  priceLabel: string;
  desc: string;
  link: string;
  highlights: string[];
};

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
  cardLabel: string;
  brand: string;
  model: string;
  series: string;
  finish: string;
  usage: string;
  priceLabel: string;
  highlight: string;
  products: ProductItem[];
};

type ProbeStatus = 'idle' | 'loading' | 'ok' | 'error';

const TAB_ITEMS: Array<{ key: TabKey; label: string; description: string; icon: typeof Wrench }> = [
  { key: 'genel', label: 'Genel', description: 'Künye ve kapak görseli', icon: Wrench },
  { key: 'hero', label: 'Hero', description: 'Slider ve katman ayarları', icon: ImageIcon },
  { key: 'surec', label: 'Süreç', description: 'Malzeme hikayesi ve adımlar', icon: Wrench },
  { key: 'odak', label: 'Odak', description: 'Öne çıkan materyal özellikleri', icon: Target },
  { key: 'urunler', label: 'Ürünler', description: 'Marka, model ve ürün kartları', icon: FolderKanban },
];

const cloneDepartment = (value: DepartmentState) => JSON.parse(JSON.stringify(value)) as DepartmentState;

const makeSeed = (slug: string): DepartmentState => {
  const matched = materyalKategorileri.find((item) => item.slug === slug);
  const productSeed = matched?.products?.map((item, index) => ({
    title: item.brand || item.model || `${matched?.title || slug} ${index + 1}`,
    image: item.image,
    category: item.category,
    brand: item.brand,
    model: item.model,
    collection: item.collectionName || item.collection || '',
    finish: item.finish || '',
    usage: item.usage || '',
    priceLabel: item.priceLabel || '',
    desc: item.description,
    link: item.link || '',
    highlights: item.highlights || [],
  })) || [];

  return {
    slug,
    title: matched?.title || slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()),
    sideLabel: matched?.sideLabel || 'Material Studio',
    description: matched?.description || 'Bu malzeme kategorisi için içerik henüz tanımlanmadı.',
    image: matched?.image || SLIDER_IMAGE_URLS.material,
    mediaType: 'image',
    heroBlur: 0,
    heroOverlay: 30,
    sliderImages: matched?.sliderImages?.length ? matched.sliderImages : [SLIDER_IMAGE_URLS.material],
    process: matched?.longDescription?.content?.map((line, index) => ({
      title: `Not ${index + 1}`,
      desc: line,
    })) || [],
    focusAreas: [],
    categories: matched?.categories?.length
      ? matched.categories.map((item) => ({ label: item.label, value: item.value }))
      : [{ label: 'TÜM PROJELER', value: 'ALL' }],
    cardLabel: matched?.cardLabel || 'Product collection',
    brand: matched?.brand || 'DEQOIN Atelier',
    model: matched?.model || slug.toUpperCase(),
    series: matched?.series || matched?.highlight || '',
    finish: matched?.finish || '',
    usage: matched?.usage || '',
    priceLabel: matched?.priceLabel || 'Proje bazlı teklif',
    highlight: matched?.highlight || '',
    products: productSeed.length > 0 ? productSeed : [{
      title: matched?.title || slug,
      image: matched?.image || SLIDER_IMAGE_URLS.material,
      category: matched?.sideLabel || 'Koleksiyon',
      brand: matched?.brand || 'DEQOIN Atelier',
      model: matched?.model || slug.toUpperCase(),
      collection: matched?.series || '',
      finish: matched?.finish || '',
      usage: matched?.usage || '',
      priceLabel: matched?.priceLabel || 'Proje bazlı teklif',
      desc: matched?.description || '',
      link: '',
      highlights: matched?.highlight ? [matched.highlight] : [],
    }],
  };
};

const normalizeDepartment = (value: any, slug: string): DepartmentState => {
  const seed = makeSeed(slug);
  return {
    slug: value?.slug || slug,
    title: value?.title || seed.title,
    sideLabel: value?.sideLabel || seed.sideLabel,
    description: value?.description || seed.description,
    image: value?.image || seed.image,
    mediaType: value?.mediaType === 'video' ? 'video' : 'image',
    heroBlur: Number(value?.heroBlur || 0),
    heroOverlay: Number(value?.heroOverlay || 30),
    sliderImages: Array.isArray(value?.sliderImages) ? value.sliderImages.filter(Boolean) : seed.sliderImages,
    process: Array.isArray(value?.process)
      ? value.process.map((item: any) => ({ title: item?.title || '', desc: item?.desc || '' }))
      : seed.process,
    focusAreas: Array.isArray(value?.focusAreas)
      ? value.focusAreas.map((item: any) => ({ title: item?.title || '', icon: item?.icon || '', desc: item?.desc || '' }))
      : seed.focusAreas,
    categories: Array.isArray(value?.categories) && value.categories.length > 0
      ? value.categories.map((item: any) => ({ label: item?.label || '', value: item?.value || '' }))
      : seed.categories,
    cardLabel: value?.cardLabel || seed.cardLabel,
    brand: value?.brand || seed.brand,
    model: value?.model || seed.model,
    series: value?.series || seed.series,
    finish: value?.finish || seed.finish,
    usage: value?.usage || seed.usage,
    priceLabel: value?.priceLabel || seed.priceLabel,
    highlight: value?.highlight || seed.highlight,
    products: Array.isArray(value?.products) && value.products.length > 0
      ? value.products.map((item: any) => ({
          title: item?.title || '',
          image: item?.image || seed.image,
          category: item?.category || '',
          brand: item?.brand || '',
          model: item?.model || '',
          collection: item?.collectionName || item?.collection || '',
          finish: item?.finish || '',
          usage: item?.usage || '',
          priceLabel: item?.priceLabel || '',
          desc: item?.desc || item?.description || '',
          link: item?.link || '',
          highlights: Array.isArray(item?.highlights) ? item.highlights.filter(Boolean) : [],
        }))
      : seed.products,
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

export default function MaterialDetailEditor() {
  const params = useParams();
  const rawSlug = params?.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug || 'mobilya';
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
    upload: 'loading' as ProbeStatus,
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
      setApiStatus((prev) => ({
        department: 'ok',
        upload: prev.upload,
        updatedAt: new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Department load error:', error);
      const fallback = makeSeed(slug);
      setDepartment(fallback);
      setInitialDepartment(cloneDepartment(fallback));
      setApiStatus((prev) => ({
        department: 'error',
        upload: prev.upload,
        updatedAt: new Date().toISOString(),
      }));
      showToast('Materyal kartı yüklenemedi.', 'error');
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

  const probeUploadService = useCallback(async () => {
    setApiStatus((prev) => ({ ...prev, upload: 'loading' }));

    try {
      const res = await fetch('/api/upload', { method: 'GET', cache: 'no-store' });
      if (!res.ok) {
        throw new Error('Upload health check failed');
      }

      setApiStatus((prev) => ({ ...prev, upload: 'ok', updatedAt: new Date().toISOString() }));
    } catch (error) {
      console.error('Upload probe error:', error);
      setApiStatus((prev) => ({ ...prev, upload: 'error', updatedAt: new Date().toISOString() }));
    }
  }, []);

  useEffect(() => {
    probeUploadService();
  }, [probeUploadService]);

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
      const payload = {
        ...nextDepartment,
        products: nextDepartment.products.map((item) => ({
          ...item,
          collectionName: item.collection,
        })),
      };
      const res = await fetch(`/api/admin/departments/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, slug }),
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
      showToast('Materyal kartı kaydedildi.', 'success');
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
      note: 'Başlık, açıklama, süreç ve ürün kartlarını okur/yazar.',
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
              MATERYAL DETAYLI EDİTÖR
            </Badge>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-[color:var(--text)] sm:text-4xl">
                {department.title}
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-[color:var(--text-muted)]">
                Bu kartın yayın katmanlarını tek ekranda düzenleyin. Hero, süreç, odak ve ürün
                yapısı modern bir yönetim kabuğu içinde toplandı.
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
              <p className="mt-2 text-xs text-[color:var(--text-muted)]">Not sayısı</p>
            </div>
            <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[color:var(--text-muted)]">Ürün</p>
              <p className="mt-1 text-2xl font-semibold text-[color:var(--text)]">{department.products.length}</p>
              <p className="mt-2 text-xs text-[color:var(--text-muted)]">Yönetilen kartlar</p>
            </div>
            <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[color:var(--text-muted)]">API</p>
              <p className="mt-1 text-2xl font-semibold text-[color:var(--text)]">
                {apiStatus.department === 'ok' && apiStatus.upload === 'ok' ? 'Çalışıyor' : 'Kontrol'}
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
                    <AdminImageDropzone
                      aspectClassName="aspect-[4/3]"
                      accept="image/*,video/*"
                      buttonLabel="Kapak seç"
                      description="Hero görselini sürükle-bırak ile değiştirin."
                      emptySubtitle="Kapak görselini sürükleyin veya tıklayıp seçin."
                      emptyTitle="Kapak görseli ekleyin"
                      previewAlt={department.title}
                      previewType={department.mediaType === 'video' ? 'video' : 'image'}
                      previewUrl={currentHero}
                      title="Kapak Görseli"
                      onFileSelect={async (file) => {
                        const url = await uploadFile(file);
                        const next = cloneDepartment(department);
                        next.image = url;
                        next.mediaType = file.type.startsWith('video/') ? 'video' : 'image';
                        setDepartment(next);
                        setIsDirty(true);
                        await saveDepartment(next);
                        showToast('Kapak görseli güncellendi.', 'success');
                      }}
                    />
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
                      <AdminImageDropzone
                        aspectClassName="aspect-[16/10]"
                        accept="image/*"
                        buttonLabel="Slider ekle"
                        description="Yeni slider görseli yükleyin."
                        emptySubtitle="Yeni slider görselini sürükleyin veya tıklayıp seçin."
                        emptyTitle="Slider görseli ekleyin"
                        title="Slider Görseli Ekle"
                        onFileSelect={async (file) => {
                          const url = await uploadFile(file);
                          const next = cloneDepartment(department);
                          next.sliderImages.push(url);
                          setDepartment(next);
                          setIsDirty(true);
                          await saveDepartment(next);
                          showToast('Slider görseli eklendi.', 'success');
                        }}
                      />
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {department.sliderImages.map((slide, index) => (
                    <Card key={`${slide}-${index}`} className="overflow-hidden border border-[color:var(--line)] bg-[color:var(--surface-muted)] shadow-none">
                      <AdminImageDropzone
                        aspectClassName="aspect-[16/10]"
                        accept="image/*"
                        buttonLabel="Değiştir"
                        description={`Slide ${index + 1} görselini sürükleyip bırakın.`}
                        emptySubtitle={`Slide ${index + 1} görselini seçin.`}
                        emptyTitle={`Slide ${index + 1}`}
                        previewAlt={`Slide ${index + 1}`}
                        previewUrl={slide}
                        title={`Slide ${index + 1}`}
                        onFileSelect={async (file) => {
                          const url = await uploadFile(file);
                          const next = cloneDepartment(department);
                          next.sliderImages[index] = url;
                          setDepartment(next);
                          setIsDirty(true);
                          await saveDepartment(next);
                          showToast('Slider görseli güncellendi.', 'success');
                        }}
                      />
                      <CardContent className="flex items-center justify-end gap-2 p-4">
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
                    <h3 className="text-base font-semibold text-[color:var(--text)]">Malzeme Notları</h3>
                    <p className="text-sm text-[color:var(--text-muted)]">Açıklama adımları ve hikaye akışı.</p>
                  </div>
                  <Button
                    type="button"
                    className="bg-[color:var(--accent)] text-[color:var(--text-inverse)] hover:bg-[color:var(--accent-soft)]"
                    onClick={() => mutateDepartment((draft) => draft.process.push({ title: 'Yeni Not', desc: 'Açıklama' }))}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Not Ekle
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
                      Henüz not yok.
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
                  <Button
                    type="button"
                    className="bg-[color:var(--accent)] text-[color:var(--text-inverse)] hover:bg-[color:var(--accent-soft)]"
                    onClick={() => mutateDepartment((draft) => draft.focusAreas.push({ title: 'Yeni Odak', icon: 'sparkles', desc: 'Açıklama' }))}
                  >
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

            {activeTab === 'urunler' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-semibold text-[color:var(--text)]">Ürün Kartları</h3>
                    <p className="text-sm text-[color:var(--text-muted)]">Marka, model, seri ve kullanım bilgilerini yönetin.</p>
                  </div>
                  <Button
                    type="button"
                    className="bg-[color:var(--accent)] text-[color:var(--text-inverse)] hover:bg-[color:var(--accent-soft)]"
                    onClick={() =>
                      mutateDepartment((draft) =>
                        draft.products.push({
                          title: 'Yeni Ürün',
                          image: department.image,
                          category: 'Koleksiyon',
                          brand: department.brand,
                          model: 'NEW-01',
                          collection: department.series,
                          finish: department.finish,
                          usage: department.usage,
                          priceLabel: department.priceLabel,
                          desc: department.description,
                          link: '',
                          highlights: department.highlight ? [department.highlight] : [],
                        }),
                      )
                    }
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Ürün Ekle
                  </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {department.products.map((item, index) => (
                    <Card key={`${item.title}-${index}`} className="overflow-hidden border border-[color:var(--line)] bg-[color:var(--surface-muted)] shadow-none">
                      <AdminImageDropzone
                        aspectClassName="aspect-[16/10]"
                        accept="image/*"
                        buttonLabel="Görsel seç"
                        description="Ürün kartı görselini sürükleyip bırakın."
                        emptySubtitle="Ürün görselini sürükleyin veya tıklayıp seçin."
                        emptyTitle="Ürün görseli"
                        previewAlt={item.title}
                        previewUrl={item.image}
                        title={item.title}
                        onFileSelect={async (file) => {
                          const url = await uploadFile(file);
                          mutateDepartment((draft) => {
                            if (!draft.products[index]) return;
                            draft.products[index].image = url;
                          });
                        }}
                      />
                      <CardContent className="space-y-3 p-4">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <Input
                            value={item.brand}
                            onChange={(event) => mutateDepartment((draft) => { draft.products[index].brand = event.target.value; })}
                            className="h-11 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                            placeholder="Marka"
                          />
                          <Input
                            value={item.model}
                            onChange={(event) => mutateDepartment((draft) => { draft.products[index].model = event.target.value; })}
                            className="h-11 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                            placeholder="Model"
                          />
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <Input
                            value={item.title}
                            onChange={(event) => mutateDepartment((draft) => { draft.products[index].title = event.target.value; })}
                            className="h-11 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                            placeholder="Ürün adı"
                          />
                          <Input
                            value={item.category}
                            onChange={(event) => mutateDepartment((draft) => { draft.products[index].category = event.target.value; })}
                            className="h-11 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                            placeholder="Kategori"
                          />
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <Input
                            value={item.collection}
                            onChange={(event) => mutateDepartment((draft) => { draft.products[index].collection = event.target.value; })}
                            className="h-11 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                            placeholder="Seri"
                          />
                          <Input
                            value={item.priceLabel}
                            onChange={(event) => mutateDepartment((draft) => { draft.products[index].priceLabel = event.target.value; })}
                            className="h-11 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                            placeholder="Fiyat etiketi"
                          />
                        </div>
                        <Input
                          value={item.finish}
                          onChange={(event) => mutateDepartment((draft) => { draft.products[index].finish = event.target.value; })}
                          className="h-11 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                          placeholder="Finish / yüzey"
                        />
                        <Input
                          value={item.usage}
                          onChange={(event) => mutateDepartment((draft) => { draft.products[index].usage = event.target.value; })}
                          className="h-11 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                          placeholder="Kullanım alanı"
                        />
                        <Textarea
                          value={item.desc}
                          onChange={(event) => mutateDepartment((draft) => { draft.products[index].desc = event.target.value; })}
                          className="min-h-28 rounded-[1.25rem] border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                          placeholder="Ürün açıklaması"
                        />
                        <Input
                          value={item.link}
                          onChange={(event) => mutateDepartment((draft) => { draft.products[index].link = event.target.value; })}
                          className="h-11 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                          placeholder="Detay bağlantısı"
                        />
                        <Textarea
                          value={item.highlights.join(', ')}
                          onChange={(event) => mutateDepartment((draft) => { draft.products[index].highlights = event.target.value.split(',').map((value) => value.trim()).filter(Boolean); })}
                          className="min-h-24 rounded-[1.25rem] border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                          placeholder="Öne çıkanlar, virgülle ayırın"
                        />
                        <div className="flex items-center justify-between gap-2">
                          <Badge variant="outline" className="border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text-muted)]">
                            {item.brand || 'Marka'} / {item.model || 'Model'}
                          </Badge>
                          <Button
                            type="button"
                            variant="outline"
                            className="border-rose-500/20 bg-rose-500/10 text-rose-700 hover:bg-rose-500 hover:text-white dark:text-rose-300"
                            onClick={() => mutateDepartment((draft) => { draft.products.splice(index, 1); })}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Sil
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {department.products.length === 0 && (
                    <div className="rounded-[1.5rem] border border-dashed border-[color:var(--line)] bg-[color:var(--surface-muted)] p-8 text-center text-sm text-[color:var(--text-muted)] md:col-span-2">
                      Henüz ürün yok.
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
              <CardDescription className="text-[color:var(--text-muted)]">
                Materyal departman ve upload uçları.
              </CardDescription>
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
                <Link href="/admin/content/services/material">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Materyal Genel Ayarlar
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)]">
                <Link href={`/admin/studios/${slug}`}>
                  <FolderKanban className="mr-2 h-4 w-4" />
                  Materyal Stüdyo
                </Link>
              </Button>
            </CardContent>
          </Card>
        </aside>
      </section>
    </div>
  );
}
