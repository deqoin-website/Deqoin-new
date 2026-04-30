'use client';

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  CloudUpload,
  Eye,
  FileText,
  FolderKanban,
  Globe2,
  Image as ImageIcon,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Sparkles,
  Trash2,
  Upload,
  X,
} from 'lucide-react';

import { useNotification } from '@/components/admin/AdminNotificationProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { SLIDER_IMAGE_URLS } from '@/lib/slider-images';

type TabKey = 'hero' | 'cta' | 'departmanlar';

type CategoryItem = {
  href: string;
  title: string;
  sideLabel: string;
  image: string;
  slug: string;
};

type ContentSection = {
  id: string;
  type: string;
  title?: string;
  subtitle?: string;
  blur?: number;
  overlay?: number;
  image?: string;
  slides?: string[];
  items?: CategoryItem[];
};

type PageContent = {
  page: string;
  sections: ContentSection[];
  metadata?: { updatedAt?: string };
};

const DEFAULT_MIMARI_CATEGORIES: CategoryItem[] = [
  {
    href: '/mimari/insaat-muhendisligi',
    title: 'Mühendislik',
    sideLabel: 'Structural Strength',
    image: '/images/workflow/muhendislik-custom.png',
    slug: 'insaat-muhendisligi',
  },
  {
    href: '/mimari/mimarlik',
    title: 'Mimarlık',
    sideLabel: 'Structural Form',
    image: '/images/workflow/mimarlik-custom.png',
    slug: 'mimarlik',
  },
  {
    href: '/mimari/elektrik-elektronik-muhendisligi',
    title: 'Mekanik',
    sideLabel: 'Power & Logic',
    image: '/images/workflow/mekanik-custom.png',
    slug: 'elektrik-elektronik-muhendisligi',
  },
  {
    href: '/mimari/ic-mimarlik',
    title: 'İç Mimarlık',
    sideLabel: 'Interior Essence',
    image: '/images/workflow/ic-mimarlik-custom.png',
    slug: 'ic-mimarlik',
  },
  {
    href: '/mimari/restorasyon',
    title: 'Restorasyon',
    sideLabel: 'Heritage Revival',
    image: '/images/workflow/restorasyon-custom.png',
    slug: 'restorasyon',
  },
  {
    href: '/mimari/peyzaj-mimarligi',
    title: 'Peyzaj',
    sideLabel: 'Natural Canvas',
    image: '/images/workflow/peyzaj-custom.png',
    slug: 'peyzaj-mimarligi',
  },
];

const TAB_ITEMS: Array<{ key: TabKey; label: string; description: string; icon: typeof FileText }> = [
  { key: 'hero', label: 'Hero', description: 'Başlık ve slider alanı', icon: FileText },
  { key: 'cta', label: 'CTA', description: 'Bir sonraki adım alanı', icon: Sparkles },
  { key: 'departmanlar', label: 'Departmanlar', description: 'Hizmet alanı kartları', icon: FolderKanban },
];

const cloneContent = (value: PageContent) => JSON.parse(JSON.stringify(value)) as PageContent;

const createDefaultContent = (): PageContent => ({
  page: 'mimari',
  sections: [
    {
      id: 'hero',
      type: 'hero',
      title: 'DESIGN STUDIO',
      subtitle: 'MİMARİ TASARIM',
      blur: 0,
      overlay: 30,
      slides: [SLIDER_IMAGE_URLS.mimari],
    },
    {
      id: 'cta',
      type: 'cta',
      image: SLIDER_IMAGE_URLS.mimari,
      blur: 0,
      overlay: 30,
    },
    {
      id: 'categories',
      type: 'categories',
      items: DEFAULT_MIMARI_CATEGORIES,
    },
  ],
});

const normalizeContent = (value: any): PageContent => {
  const base = createDefaultContent();
  const sections = Array.isArray(value?.sections) ? value.sections : [];

  const hero = sections.find((item: any) => item.id === 'hero') || base.sections[0];
  const cta = sections.find((item: any) => item.id === 'cta') || base.sections[1];
  const categories = sections.find((item: any) => item.id === 'categories') || base.sections[2];

  return {
    page: value?.page || 'mimari',
    metadata: value?.metadata,
    sections: [
      {
        ...base.sections[0],
        ...hero,
        slides: Array.isArray(hero?.slides) && hero.slides.length > 0 ? hero.slides : base.sections[0].slides,
      },
      {
        ...base.sections[1],
        ...cta,
      },
      {
        ...base.sections[2],
        ...categories,
        items: Array.isArray(categories?.items) && categories.items.length > 0 ? categories.items : DEFAULT_MIMARI_CATEGORIES,
      },
    ],
  };
};

const probeMeta = (status: 'idle' | 'loading' | 'ok' | 'error') => {
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

export default function MimariEditor() {
  const { showToast, confirm: premiumConfirm } = useNotification();
  const [activeTab, setActiveTab] = useState<TabKey>('hero');
  const [content, setContent] = useState<PageContent>(createDefaultContent());
  const [initialContent, setInitialContent] = useState<PageContent>(createDefaultContent());
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newService, setNewService] = useState({ title: '', sideLabel: '', slug: '', image: SLIDER_IMAGE_URLS.mimari });
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [apiStatus, setApiStatus] = useState({
    content: 'loading' as 'idle' | 'loading' | 'ok' | 'error',
    upload: 'idle' as 'idle' | 'loading' | 'ok' | 'error',
    updatedAt: '',
  });

  const fetchContent = useCallback(async () => {
    setIsLoading(true);
    setApiStatus((prev) => ({ ...prev, content: 'loading' }));

    try {
      const res = await fetch('/api/content?page=mimari', { cache: 'no-store' });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error || 'Content load failed');
      }

      const nextContent = normalizeContent(data || createDefaultContent());
      setContent(nextContent);
      setInitialContent(cloneContent(nextContent));
      setApiStatus({
        content: 'ok',
        upload: 'idle',
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Mimari content load error:', error);
      const fallback = createDefaultContent();
      setContent(fallback);
      setInitialContent(cloneContent(fallback));
      setApiStatus({
        content: 'error',
        upload: 'idle',
        updatedAt: new Date().toISOString(),
      });
      showToast('Mimari içerik yüklenemedi.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  useEffect(() => {
    const syncTheme = () => {
      setTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
    };

    syncTheme();
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => observer.disconnect();
  }, []);

  const mutateContent = (updater: (draft: PageContent) => void) => {
    setContent((prev) => {
      const next = cloneContent(prev);
      updater(next);
      return next;
    });
    setIsDirty(true);
  };

  const uploadFile = async (file: File) => {
    setApiStatus((prev) => ({ ...prev, upload: 'loading' }));

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('filename', file.name);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(payload?.details || payload?.error || 'Upload failed');
      }

      const uploadedUrl = payload?.url || payload?.downloadUrl;
      if (!uploadedUrl) {
        throw new Error('Upload URL missing');
      }

      setApiStatus((prev) => ({ ...prev, upload: 'ok', updatedAt: new Date().toISOString() }));
      return uploadedUrl as string;
    } catch (error) {
      setApiStatus((prev) => ({ ...prev, upload: 'error', updatedAt: new Date().toISOString() }));
      throw error;
    }
  };

  const saveContent = async (nextContent = content) => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: 'mimari',
          sections: nextContent.sections,
        }),
      });

      const refreshed = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(refreshed?.details || refreshed?.error || 'Content save failed');
      }

      const normalized = normalizeContent(refreshed || nextContent);
      setContent(normalized);
      setInitialContent(cloneContent(normalized));
      setIsDirty(false);
      setApiStatus((prev) => ({ ...prev, content: 'ok', updatedAt: new Date().toISOString() }));
      showToast('Mimari içerik kaydedildi.', 'success');
    } catch (error) {
      console.error('Mimari content save error:', error);
      showToast(error instanceof Error ? error.message : 'İçerik kaydedilemedi.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setContent(cloneContent(initialContent));
    setIsDirty(false);
    showToast('Değişiklikler geri alındı.', 'info');
  };

  const heroSection = content.sections.find((section) => section.id === 'hero');
  const ctaSection = content.sections.find((section) => section.id === 'cta');
  const categorySection = content.sections.find((section) => section.id === 'categories');
  const categoryItems = Array.isArray(categorySection?.items) ? categorySection.items : DEFAULT_MIMARI_CATEGORIES;
  const updatedLabel = apiStatus.updatedAt ? new Date(apiStatus.updatedAt).toLocaleDateString('tr-TR') : 'Henüz yok';

  const addCategory = () => {
    mutateContent((draft) => {
      const categories = draft.sections.find((section) => section.id === 'categories');
      categories?.items?.push({
        href: '/mimari/yeni-departman',
        title: 'Yeni Departman',
        sideLabel: 'New Studio',
        image: SLIDER_IMAGE_URLS.mimari,
        slug: 'yeni-departman',
      });
    });
  };

  const removeCategory = async (index: number) => {
    const ok = await premiumConfirm({
      title: 'DEPARTMANI SİL',
      message: 'Bu hizmet alanını silmek istediğinize emin misiniz?',
      confirmText: 'SİL',
      cancelText: 'VAZGEÇ',
      isDanger: true,
    });
    if (!ok) return;

    mutateContent((draft) => {
      const categories = draft.sections.find((section) => section.id === 'categories');
      categories?.items?.splice(index, 1);
    });
  };

  const openCategoryDetail = (item: CategoryItem) => `/admin/content/services/mimari/${item.slug}`;

  const apiCards = [
    {
      title: 'Sayfa içeriği',
      href: '/api/content?page=mimari',
      status: apiStatus.content,
      note: 'Hero, CTA ve kategoriler bu kayıt üzerinden okunup yazılır.',
    },
    {
      title: 'Upload servisi',
      href: '/api/upload',
      status: apiStatus.upload,
      note: 'Slider, CTA ve departman görselleri için kullanılır.',
    },
    {
      title: 'Kategori kaynağı',
      href: '/api/content/mimari-categories',
      status: 'ok' as const,
      note: 'Aynı alanın ayrı kategori upsert uç noktası.',
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
              MİMARİ GENEL AYARLARI
            </Badge>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-[color:var(--text)] sm:text-4xl">
                Mimari stüdyo girişini yönetin
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-[color:var(--text-muted)]">
                Hero, CTA ve departman kartları aynı ekranda düzenlenir. Görsel yüklemeleri otomatik
                kaydedilir ve ekran light/dark tema ile uyumlu çalışır.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text-muted)]">
                {content.page}
              </Badge>
              <Badge variant="outline" className="border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text-muted)]">
                Son güncelleme: {updatedLabel}
              </Badge>
              <Badge variant="outline" className="border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text-muted)]">
                Tema: {theme === 'light' ? 'Aydınlık' : 'Karanlık'}
              </Badge>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[470px]">
            <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[color:var(--text-muted)]">Hero</p>
              <p className="mt-1 text-2xl font-semibold text-[color:var(--text)]">{heroSection?.slides?.length || 0}</p>
              <p className="mt-2 text-xs text-[color:var(--text-muted)]">Slider görseli</p>
            </div>
            <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[color:var(--text-muted)]">Departman</p>
              <p className="mt-1 text-2xl font-semibold text-[color:var(--text)]">{categoryItems.length}</p>
              <p className="mt-2 text-xs text-[color:var(--text-muted)]">Yönetilen kartlar</p>
            </div>
            <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[color:var(--text-muted)]">CTA</p>
              <p className="mt-1 text-2xl font-semibold text-[color:var(--text)]">{ctaSection?.image ? '1' : '0'}</p>
              <p className="mt-2 text-xs text-[color:var(--text-muted)]">Bir sonraki adım alanı</p>
            </div>
            <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[color:var(--text-muted)]">API</p>
              <p className="mt-1 text-2xl font-semibold text-[color:var(--text)]">
                {apiStatus.content === 'ok' ? 'Hazır' : 'Kontrol'}
              </p>
              <p className="mt-2 text-xs text-[color:var(--text-muted)]">Content + upload uçları aktif</p>
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
                  onClick={fetchContent}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Yenile
                </Button>
                <Button
                  type="button"
                  className="bg-[color:var(--accent)] text-[color:var(--text-inverse)] hover:bg-[color:var(--accent-soft)]"
                  onClick={() => saveContent(content)}
                  disabled={isSaving}
                >
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Kaydet
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 p-5 sm:p-6">
            {activeTab === 'hero' && (
              <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
                <Card className="border border-[color:var(--line)] bg-[color:var(--surface-muted)] shadow-none">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base text-[color:var(--text)]">Hero Görseli</CardTitle>
                    <CardDescription className="text-[color:var(--text-muted)]">
                      Slide görselini değiştirin.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <label className="group relative flex aspect-[4/3] cursor-pointer items-center justify-center overflow-hidden rounded-[1.5rem] border-2 border-dashed border-[color:var(--line)] bg-[color:var(--surface)]">
                      {heroSection?.slides?.[0] ? (
                        <img src={heroSection.slides[0]} alt="Hero" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center gap-3 p-6 text-center text-[color:var(--text-muted)]">
                          <Upload className="h-7 w-7 text-[color:var(--accent)]" />
                          <p className="text-sm font-medium text-[color:var(--text)]">Hero görseli ekleyin</p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (event) => {
                          const file = event.target.files?.[0];
                          if (!file) return;
                          try {
                            const url = await uploadFile(file);
                            const nextContent = cloneContent(content);
                            const hero = nextContent.sections.find((section) => section.id === 'hero');
                            if (hero) hero.slides = [url];
                            setContent(nextContent);
                            setIsDirty(true);
                            await saveContent(nextContent);
                            showToast('Hero görseli güncellendi.', 'success');
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
                        Blur: {heroSection?.blur || 0}px
                      </Badge>
                      <Badge variant="outline" className="border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text-muted)]">
                        Overlay: %{heroSection?.overlay || 30}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid gap-4">
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">Başlık</label>
                      <Input
                        value={heroSection?.title || ''}
                        onChange={(event) =>
                          mutateContent((draft) => {
                            const hero = draft.sections.find((section) => section.id === 'hero');
                            if (hero) hero.title = event.target.value;
                          })
                        }
                        className="h-12 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">Alt Slogan</label>
                      <Input
                        value={heroSection?.subtitle || ''}
                        onChange={(event) =>
                          mutateContent((draft) => {
                            const hero = draft.sections.find((section) => section.id === 'hero');
                            if (hero) hero.subtitle = event.target.value;
                          })
                        }
                        className="h-12 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)]"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">Blur</label>
                      <Input
                        type="range"
                        min={0}
                        max={60}
                        value={heroSection?.blur || 0}
                        onChange={(event) =>
                          mutateContent((draft) => {
                            const hero = draft.sections.find((section) => section.id === 'hero');
                            if (hero) hero.blur = Number(event.target.value);
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">Overlay</label>
                      <Input
                        type="range"
                        min={0}
                        max={100}
                        value={heroSection?.overlay || 30}
                        onChange={(event) =>
                          mutateContent((draft) => {
                            const hero = draft.sections.find((section) => section.id === 'hero');
                            if (hero) hero.overlay = Number(event.target.value);
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-[color:var(--text)]">Hero Slider</p>
                      <Button
                        type="button"
                        variant="outline"
                        className="border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)]"
                        onClick={() => document.getElementById('mimari-hero-add')?.click()}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Görsel Ekle
                      </Button>
                    </div>
                    <input
                      id="mimari-hero-add"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (event) => {
                          const file = event.target.files?.[0];
                          if (!file) return;
                          try {
                            const url = await uploadFile(file);
                            const nextContent = cloneContent(content);
                            const hero = nextContent.sections.find((section) => section.id === 'hero');
                            if (hero) {
                              hero.slides = hero.slides || [];
                              hero.slides.push(url);
                            }
                            setContent(nextContent);
                            setIsDirty(true);
                            await saveContent(nextContent);
                            showToast('Hero görseli eklendi.', 'success');
                          } catch (error) {
                          showToast(error instanceof Error ? error.message : 'Yükleme başarısız.', 'error');
                        } finally {
                          event.target.value = '';
                        }
                      }}
                    />
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {(heroSection?.slides || []).map((slide, index) => (
                        <Card key={`${slide}-${index}`} className="overflow-hidden border border-[color:var(--line)] bg-[color:var(--surface-muted)] shadow-none">
                          <div className="aspect-[16/10]">
                            <img src={slide} alt={`Slide ${index + 1}`} className="h-full w-full object-cover" />
                          </div>
                          <CardContent className="flex items-center justify-between gap-2 p-4">
                            <span className="text-sm text-[color:var(--text-muted)]">Slide {index + 1}</span>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-10 w-10 border-rose-500/20 bg-rose-500/10 text-rose-700 hover:bg-rose-500 hover:text-white dark:text-rose-300"
                              onClick={() =>
                                mutateContent((draft) => {
                                  const hero = draft.sections.find((section) => section.id === 'hero');
                                  if (!hero?.slides) return;
                                  hero.slides.splice(index, 1);
                                })
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'cta' && (
              <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
                <Card className="border border-[color:var(--line)] bg-[color:var(--surface-muted)] shadow-none">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base text-[color:var(--text)]">CTA Görseli</CardTitle>
                    <CardDescription className="text-[color:var(--text-muted)]">
                      Sonraki adım alanının kapak görseli.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <label className="group relative flex aspect-[4/3] cursor-pointer items-center justify-center overflow-hidden rounded-[1.5rem] border-2 border-dashed border-[color:var(--line)] bg-[color:var(--surface)]">
                      {ctaSection?.image ? (
                        <img src={ctaSection.image} alt="CTA" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center gap-3 p-6 text-center text-[color:var(--text-muted)]">
                          <Globe2 className="h-7 w-7 text-[color:var(--accent)]" />
                          <p className="text-sm font-medium text-[color:var(--text)]">CTA görseli ekleyin</p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (event) => {
                          const file = event.target.files?.[0];
                          if (!file) return;
                          try {
                            const url = await uploadFile(file);
                            const nextContent = cloneContent(content);
                            const cta = nextContent.sections.find((section) => section.id === 'cta');
                            if (cta) cta.image = url;
                            setContent(nextContent);
                            setIsDirty(true);
                            await saveContent(nextContent);
                            showToast('CTA görseli güncellendi.', 'success');
                          } catch (error) {
                            showToast(error instanceof Error ? error.message : 'Yükleme başarısız.', 'error');
                          } finally {
                            event.target.value = '';
                          }
                        }}
                      />
                    </label>
                  </CardContent>
                </Card>

                <div className="grid gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">CTA Blur</label>
                      <Input
                        type="range"
                        min={0}
                        max={60}
                        value={ctaSection?.blur || 0}
                        onChange={(event) =>
                          mutateContent((draft) => {
                            const cta = draft.sections.find((section) => section.id === 'cta');
                            if (cta) cta.blur = Number(event.target.value);
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">CTA Overlay</label>
                      <Input
                        type="range"
                        min={0}
                        max={100}
                        value={ctaSection?.overlay || 30}
                        onChange={(event) =>
                          mutateContent((draft) => {
                            const cta = draft.sections.find((section) => section.id === 'cta');
                            if (cta) cta.overlay = Number(event.target.value);
                          })
                        }
                      />
                    </div>
                  </div>

                  <Card className="border border-[color:var(--line)] bg-[color:var(--surface-muted)] shadow-none">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-base text-[color:var(--text)]">CTA Durumu</CardTitle>
                      <CardDescription className="text-[color:var(--text-muted)]">
                        Görsel ve katman ayarları tek bakışta.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3 sm:grid-cols-2">
                      <Badge variant="outline" className="border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text-muted)]">
                        Blur: {ctaSection?.blur || 0}px
                      </Badge>
                      <Badge variant="outline" className="border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text-muted)]">
                        Overlay: %{ctaSection?.overlay || 30}
                      </Badge>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'departmanlar' && (
              <div className="space-y-4">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-[color:var(--text)]">Hizmet Alanları</h3>
                    <p className="text-sm text-[color:var(--text-muted)]">
                      Departman kartlarını düzenleyin ve detay sayfalarına gidin.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)]"
                      onClick={addCategory}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Departman Ekle
                    </Button>
                    <Button asChild className="bg-[color:var(--accent)] text-[color:var(--text-inverse)] hover:bg-[color:var(--accent-soft)]">
                      <Link href="/admin/studios/mimarlik">
                        <FolderKanban className="mr-2 h-4 w-4" />
                        Mimari Stüdyo
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                  {categoryItems.map((item, index) => (
                    <Card key={`${item.slug}-${index}`} className="overflow-hidden border border-[color:var(--line)] bg-[color:var(--surface-muted)] shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
                      <div className="aspect-[16/10] bg-[color:var(--surface)]">
                        <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                      </div>
                      <CardContent className="space-y-4 p-4">
                        <div className="space-y-2">
                          <Input
                            value={item.title}
                            onChange={(event) =>
                              mutateContent((draft) => {
                                const categories = draft.sections.find((section) => section.id === 'categories');
                                if (!categories?.items?.[index]) return;
                                categories.items[index].title = event.target.value;
                              })
                            }
                            className="h-11 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                          />
                          <Input
                            value={item.sideLabel}
                            onChange={(event) =>
                              mutateContent((draft) => {
                                const categories = draft.sections.find((section) => section.id === 'categories');
                                if (!categories?.items?.[index]) return;
                                categories.items[index].sideLabel = event.target.value;
                              })
                            }
                            className="h-11 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                          />
                          <Input
                            value={item.slug}
                            onChange={(event) =>
                              mutateContent((draft) => {
                                const categories = draft.sections.find((section) => section.id === 'categories');
                                if (!categories?.items?.[index]) return;
                                categories.items[index].slug = event.target.value;
                                categories.items[index].href = `/mimari/${event.target.value}`;
                              })
                            }
                            className="h-11 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                          />
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <Button
                            asChild
                            variant="outline"
                            className="border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                          >
                            <Link href={openCategoryDetail(item)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Detaya Git
                            </Link>
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            className="border-rose-500/20 bg-rose-500/10 text-rose-700 hover:bg-rose-500 hover:text-white dark:text-rose-300"
                            onClick={() => removeCategory(index)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Sil
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {categoryItems.length === 0 && (
                    <div className="rounded-[1.5rem] border border-dashed border-[color:var(--line)] bg-[color:var(--surface-muted)] p-8 text-center text-sm text-[color:var(--text-muted)] md:col-span-2 2xl:col-span-3">
                      Henüz departman kartı yok.
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
                Mimari içerik, upload ve kategori uçları.
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
                      <ChevronRight className="mt-1 h-4 w-4 text-[color:var(--text-muted)]" />
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
              <CardDescription className="text-[color:var(--text-muted)]">
                Değişiklikleri yayınlayın veya geri alın.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 p-5 sm:p-6">
              <Button
                type="button"
                className="w-full bg-[color:var(--accent)] text-[color:var(--text-inverse)] hover:bg-[color:var(--accent-soft)]"
                onClick={() => saveContent(content)}
                disabled={isSaving}
              >
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CloudUpload className="mr-2 h-4 w-4" />}
                Değişiklikleri Kaydet
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
                onClick={fetchContent}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Yeniden Yükle
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-[color:var(--line)] bg-[color:var(--surface)] shadow-[var(--shadow)]">
            <CardHeader className="border-b border-[color:var(--line)]">
              <CardTitle className="text-lg text-[color:var(--text)]">Yeni Departman</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-5 sm:p-6">
              <Button
                type="button"
                className="w-full bg-[color:var(--accent)] text-[color:var(--text-inverse)] hover:bg-[color:var(--accent-soft)]"
                onClick={() => setIsAddModalOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Kart Ekle
              </Button>
            </CardContent>
          </Card>
        </aside>
      </section>

      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-2 backdrop-blur-md sm:p-4" onClick={() => setIsAddModalOpen(false)}>
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ type: 'spring', damping: 24, stiffness: 220 }}
              className="mt-2 w-full max-w-2xl overflow-hidden rounded-[2rem] border border-[color:var(--line)] bg-[color:var(--surface)] shadow-[0_35px_100px_rgba(0,0,0,0.45)] sm:mt-0"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 border-b border-[color:var(--line)] bg-[color:var(--surface-muted)] px-5 py-4 sm:px-6">
                <div>
                  <p className="text-[0.65rem] uppercase tracking-[0.32em] text-[color:var(--text-muted)]">Yeni Departman</p>
                  <h2 className="text-xl font-semibold tracking-tight text-[color:var(--text)]">Kart ekle</h2>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4 p-5 sm:p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    value={newService.title}
                    onChange={(event) => setNewService((prev) => ({ ...prev, title: event.target.value }))}
                    className="h-12 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)]"
                    placeholder="Departman adı"
                  />
                  <Input
                    value={newService.sideLabel}
                    onChange={(event) => setNewService((prev) => ({ ...prev, sideLabel: event.target.value }))}
                    className="h-12 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)]"
                    placeholder="Yan etiket"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    value={newService.slug}
                    onChange={(event) => setNewService((prev) => ({ ...prev, slug: event.target.value }))}
                    className="h-12 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)]"
                    placeholder="slug"
                  />
                  <Input
                    value={newService.image}
                    onChange={(event) => setNewService((prev) => ({ ...prev, image: event.target.value }))}
                    className="h-12 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)]"
                    placeholder="Görsel URL"
                  />
                </div>
                <Button
                  type="button"
                  className="w-full bg-[color:var(--accent)] text-[color:var(--text-inverse)] hover:bg-[color:var(--accent-soft)]"
                  onClick={() => {
                    if (!newService.title || !newService.slug) {
                      showToast('Başlık ve slug zorunludur.', 'error');
                      return;
                    }
                    mutateContent((draft) => {
                      const categories = draft.sections.find((section) => section.id === 'categories');
                      categories?.items?.push({
                        href: `/mimari/${newService.slug}`,
                        title: newService.title,
                        sideLabel: newService.sideLabel,
                        image: newService.image || SLIDER_IMAGE_URLS.mimari,
                        slug: newService.slug,
                      });
                    });
                    setIsAddModalOpen(false);
                    setNewService({ title: '', sideLabel: '', slug: '', image: SLIDER_IMAGE_URLS.mimari });
                  }}
                >
                  Kartı Ekle
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
