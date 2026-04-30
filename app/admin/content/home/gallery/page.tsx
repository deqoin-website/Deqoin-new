'use client';

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useRef, useState, type ChangeEvent } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowDown,
  ArrowUp,
  BadgeCheck,
  CheckCircle2,
  Database,
  Eye,
  Image as ImageIcon,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react';

import { AdminImageDropzone } from '@/components/admin/AdminImageDropzone';
import { AdminSaveBar } from '@/components/admin/AdminSaveBar';
import { useNotification } from '@/components/admin/AdminNotificationProvider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { SLIDER_IMAGE_URLS } from '@/lib/slider-images';

type SliderImage = {
  src: string;
  alt: string;
  caption?: string;
  title?: string;
  description?: string;
};

type SliderForm = {
  title: string;
  buttonText: string;
  buttonHref: string;
  slides: SliderImage[];
};

type ApiStatus = 'idle' | 'loading' | 'ok' | 'error';

const DEFAULT_FORM: SliderForm = {
  title: 'GALERİ',
  buttonText: 'TÜM GALERİYİ GÖR',
  buttonHref: '/galeri',
  slides: [],
};

const FALLBACK_SLIDES: SliderImage[] = [
  { src: '/images/projects/gallery_1.png', alt: 'DEQOIN slider görseli 1', caption: '01', title: 'Residence Lobby', description: 'Minimal yüzeyler, dengeli ışık ve sakin bir giriş atmosferi.' },
  { src: '/images/projects/gallery_2.png', alt: 'DEQOIN slider görseli 2', caption: '02', title: 'Material Study', description: 'Doğal dokular, net detaylar ve kontrollü kontrast.' },
  { src: SLIDER_IMAGE_URLS.mimari, alt: 'DEQOIN slider görseli 3', caption: '03', title: 'Architectural Frame', description: 'Mekanı tanımlayan sade çizgiler ve güçlü oranlar.' },
  { src: SLIDER_IMAGE_URLS.material, alt: 'DEQOIN slider görseli 4', caption: '04', title: 'Design Detail', description: 'Yüzey geçişleri ve dingin bir kompozisyon dili.' },
  { src: SLIDER_IMAGE_URLS.execution, alt: 'DEQOIN slider görseli 5', caption: '05', title: 'Execution Layer', description: 'Uygulama kalitesi, temiz bitişler ve net sonuçlar.' },
];

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function textOrFallback(value: unknown, fallback: string) {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function probeMeta(status: ApiStatus) {
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
    label: 'Bekliyor',
    className: 'border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text-muted)]',
    icon: BadgeCheck,
  };
}

function normalizeSlides(input: any, title = DEFAULT_FORM.title): SliderImage[] {
  const candidates = Array.isArray(input?.slides)
    ? input.slides
    : Array.isArray(input?.images)
      ? input.images
      : Array.isArray(input?.gallery)
        ? input.gallery
        : Array.isArray(input)
          ? input
          : [];

  const slides = candidates
    .map((item: any, index: number) => {
      if (typeof item === 'string') {
        const src = item.trim();
        if (!src) return null;
        return {
          src,
          alt: `${title} görseli ${index + 1}`,
          caption: String(index + 1).padStart(2, '0'),
          title: `${title} ${index + 1}`,
          description: `Otomatik oluşturulan proje özeti ${String(index + 1).padStart(2, '0')}.`,
        };
      }

      if (item && typeof item === 'object') {
        const src = String(item.src ?? item.url ?? item.image ?? '').trim();
        if (!src) return null;
        return {
          src,
          alt: textOrFallback(item.alt ?? item.imageAlt, `${title} görseli ${index + 1}`),
          caption: textOrFallback(item.caption, String(index + 1).padStart(2, '0')),
          title: textOrFallback(item.title ?? item.projectTitle, `${title} ${index + 1}`),
          description: textOrFallback(
            item.description ?? item.subtitle,
            `Otomatik oluşturulan proje özeti ${String(index + 1).padStart(2, '0')}.`,
          ),
        };
      }

      return null;
    })
    .filter(Boolean) as SliderImage[];

  return slides.length > 0 ? slides : FALLBACK_SLIDES;
}

function normalizeSliderPayload(payload: any): SliderForm {
  const candidate = payload?.sliderHero ?? payload?.gallery ?? payload?.content?.gallery ?? payload?.slider ?? payload;
  const title = textOrFallback(candidate?.title ?? candidate?.content?.title, DEFAULT_FORM.title);
  const buttonText = textOrFallback(candidate?.buttonText ?? candidate?.content?.buttonText, DEFAULT_FORM.buttonText);
  const buttonHref = textOrFallback(candidate?.buttonHref ?? candidate?.content?.buttonHref, DEFAULT_FORM.buttonHref);
  const slides = normalizeSlides(candidate, title);

  return { title, buttonText, buttonHref, slides };
}

export default function HomeGalleryAdminPage() {
  const { showToast } = useNotification();
  const [form, setForm] = useState<SliderForm>(DEFAULT_FORM);
  const [initialForm, setInitialForm] = useState<SliderForm>(DEFAULT_FORM);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mediaUploadIndex, setMediaUploadIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [apiStatus, setApiStatus] = useState({
    content: 'loading' as ApiStatus,
    upload: 'loading' as ApiStatus,
    updatedAt: '',
  });
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const selectedSlide = form.slides[selectedIndex] || form.slides[0] || null;
  const updatedLabel = apiStatus.updatedAt ? new Date(apiStatus.updatedAt).toLocaleDateString('tr-TR') : 'Henüz yok';
  const contentMeta = probeMeta(apiStatus.content);
  const uploadMeta = probeMeta(apiStatus.upload);
  const ContentStatusIcon = contentMeta.icon;
  const UploadStatusIcon = uploadMeta.icon;

  const syncTheme = useCallback(() => {
    setTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
  }, []);

  const markDirty = () => setIsDirty(true);

  const fetchSlider = useCallback(async () => {
    setIsLoading(true);
    setApiStatus((prev) => ({ ...prev, content: 'loading' }));

    try {
      const res = await fetch('/api/gallery', { cache: 'no-store' });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error || 'fetch failed');
      }

      const next = normalizeSliderPayload(data);
      setForm(next);
      setInitialForm(clone(next));
      setSelectedIndex(0);
      setApiStatus((prev) => ({
        ...prev,
        content: 'ok',
        updatedAt: new Date().toISOString(),
      }));
    } catch (error) {
      const next = { ...DEFAULT_FORM, slides: FALLBACK_SLIDES };
      setForm(next);
      setInitialForm(clone(next));
      setSelectedIndex(0);
      setApiStatus((prev) => ({
        ...prev,
        content: 'error',
        updatedAt: new Date().toISOString(),
      }));
      showToast('Slider verisi alınamadı. Varsayılan değerler kullanıldı.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchSlider();
  }, [fetchSlider]);

  useEffect(() => {
    syncTheme();
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, [syncTheme]);

  useEffect(() => {
    if (form.slides.length === 0) {
      setSelectedIndex(0);
      return;
    }

    if (selectedIndex > form.slides.length - 1) {
      setSelectedIndex(form.slides.length - 1);
    }
  }, [form.slides, selectedIndex]);

  const updateField = (field: keyof Omit<SliderForm, 'slides'>, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    markDirty();
  };

  const updateSlide = (index: number, field: keyof SliderImage, value: string) => {
    setForm((prev) => {
      const next = [...prev.slides];
      const current = next[index];
      if (!current) return prev;
      next[index] = { ...current, [field]: value };
      return { ...prev, slides: next };
    });
    markDirty();
  };

  const addSlide = () => {
    setForm((prev) => ({
      ...prev,
      slides: [
        ...prev.slides,
        {
          src: '',
          alt: '',
          caption: String(prev.slides.length + 1).padStart(2, '0'),
          title: `${prev.title} ${String(prev.slides.length + 1).padStart(2, '0')}`,
          description: `Otomatik oluşturulan proje özeti ${String(prev.slides.length + 1).padStart(2, '0')}.`,
        },
      ],
    }));
    setSelectedIndex(form.slides.length);
    markDirty();
  };

  const removeSlide = (index: number) => {
    setForm((prev) => ({
      ...prev,
      slides: prev.slides.filter((_, itemIndex) => itemIndex !== index),
    }));
    setSelectedIndex((prev) => {
      if (form.slides.length <= 1) return 0;
      if (prev === index) return index >= form.slides.length - 1 ? Math.max(0, form.slides.length - 2) : index;
      if (prev > index) return prev - 1;
      return prev;
    });
    markDirty();
  };

  const moveSlide = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    setForm((prev) => {
      const next = [...prev.slides];
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...prev, slides: next };
    });
    setSelectedIndex((prev) => {
      if (prev === index) return target;
      if (prev === target) return index;
      return prev;
    });
    markDirty();
  };

  const uploadSlideImage = async (index: number, file: File) => {
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

      setForm((prev) => {
        const next = [...prev.slides];
        const current = next[index];
        if (!current) return prev;
        next[index] = {
          ...current,
          src: uploadedUrl,
          alt: current.alt?.trim() ? current.alt : `Slider görseli ${index + 1}`,
        };
        return { ...prev, slides: next };
      });
      setSelectedIndex(index);
      setApiStatus((prev) => ({
        ...prev,
        upload: 'ok',
        updatedAt: new Date().toISOString(),
      }));
      markDirty();
      return uploadedUrl as string;
    } catch (error) {
      setApiStatus((prev) => ({
        ...prev,
        upload: 'error',
        updatedAt: new Date().toISOString(),
      }));
      throw error;
    }
  };

  const handleSlideUpload = async (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await uploadSlideImage(index, file);
      showToast('Görsel yüklendi.', 'success');
    } catch (error) {
      showToast('Görsel yüklenemedi.', 'error');
    } finally {
      event.target.value = '';
    }
  };

  const triggerSlideUpload = (index: number) => {
    setMediaUploadIndex(index);
    setSelectedIndex(index);
    uploadInputRef.current?.click();
  };

  const saveContent = async () => {
    setIsSaving(true);

    try {
      const payload = {
        title: form.title.trim() || DEFAULT_FORM.title,
        buttonText: form.buttonText.trim() || DEFAULT_FORM.buttonText,
        buttonHref: form.buttonHref.trim() || DEFAULT_FORM.buttonHref,
        slides: form.slides
          .map((item, index) => ({
            src: item.src.trim(),
            alt: item.alt.trim() || item.src.trim() || form.title,
            caption: item.caption?.trim() || '',
            title: item.title?.trim() || `${form.title} ${String(index + 1).padStart(2, '0')}`,
            description:
              item.description?.trim() ||
              `Otomatik oluşturulan proje özeti ${String(index + 1).padStart(2, '0')}.`,
          }))
          .filter((item) => Boolean(item.src)),
      };

      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Save failed');
      }

      const refreshed = await res.json();
      const next = normalizeSliderPayload(refreshed);
      setForm(next);
      setInitialForm(clone(next));
      setSelectedIndex((prev) => Math.min(prev, Math.max(0, next.slides.length - 1)));
      setIsDirty(false);
      setApiStatus((prev) => ({ ...prev, content: 'ok', updatedAt: new Date().toISOString() }));
      showToast('Slider hero içeriği kaydedildi.', 'success');
    } catch (error) {
      console.error(error);
      showToast('Slider hero kaydedilemedi.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setForm(clone(initialForm));
    setSelectedIndex(0);
    setIsDirty(false);
    showToast('Değişiklikler geri alındı.', 'info');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-[color:var(--accent)]">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <input
        ref={uploadInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (event) => {
          const file = event.target.files?.[0];
          if (!file) return;

          try {
            await uploadSlideImage(mediaUploadIndex ?? selectedIndex ?? 0, file);
          } finally {
            event.target.value = '';
            setMediaUploadIndex(null);
          }
        }}
      />

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-[2rem] border border-[color:var(--line)] bg-[color:var(--surface)] shadow-[var(--shadow)]"
      >
        <div className="flex flex-col gap-6 p-5 sm:p-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl space-y-4">
            <Badge className="border border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text-muted)]">
              <Sparkles className="mr-2 h-3 w-3" />
              ANA SAYFA GALERİ SLIDER
            </Badge>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-[color:var(--text)] sm:text-4xl">
                Görsel slider yönetimi
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-[color:var(--text-muted)]">
                Başlık, CTA ve sıralı görselleri buradan yönetin. Aynı veri sözleşmesi mobil full-screen slider ve masaüstü sinematik hero ile paylaşılır.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text-muted)]">
                {form.slides.length} görsel
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
              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[color:var(--text-muted)]">Content</p>
              <p className="mt-1 text-2xl font-semibold text-[color:var(--text)]">/api/gallery</p>
              <p className="mt-2 text-xs text-[color:var(--text-muted)]">Slider hero verisi bu uç noktadan okunur ve kaydedilir.</p>
            </div>
            <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[color:var(--text-muted)]">Upload</p>
              <p className="mt-1 text-2xl font-semibold text-[color:var(--text)]">{uploadMeta.label}</p>
              <p className="mt-2 text-xs text-[color:var(--text-muted)]">Slider görsellerini buradan güvenli şekilde değiştirirsiniz.</p>
            </div>
            <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[color:var(--text-muted)]">Seçili</p>
              <p className="mt-1 text-2xl font-semibold text-[color:var(--text)]">
                {selectedIndex + 1}/{Math.max(form.slides.length, 1)}
              </p>
              <p className="mt-2 text-xs text-[color:var(--text-muted)]">Şu an düzenlenen slide.</p>
            </div>
            <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[color:var(--text-muted)]">Kayıt</p>
              <p className="mt-1 text-2xl font-semibold text-[color:var(--text)]">{isDirty ? 'Düzenlendi' : 'Temiz'}</p>
              <p className="mt-2 text-xs text-[color:var(--text-muted)]">Kaydetmeden çıkarsanız değişiklikler kaybolur.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-[color:var(--line)] px-5 py-4 sm:px-6">
          {isDirty && (
            <Button
              type="button"
              variant="outline"
              className="border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)]"
              onClick={handleCancel}
              disabled={isSaving}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Geri al
            </Button>
          )}
          <Button
            type="button"
            className="bg-[color:var(--accent)] text-[color:var(--text-inverse)] hover:bg-[color:var(--accent-soft)]"
            onClick={saveContent}
            disabled={isSaving}
          >
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {isSaving ? 'KAYDEDİLİYOR...' : 'DEĞİŞİKLİKLERİ KAYDET'}
          </Button>
        </div>
      </motion.section>

      <AdminSaveBar isVisible={isDirty} onSave={saveContent} onCancel={handleCancel} isSaving={isSaving} />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <Card className="border border-[color:var(--line)] bg-[color:var(--surface)] shadow-[var(--shadow)]">
          <CardHeader className="space-y-4 border-b border-[color:var(--line)]">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <CardTitle className="text-lg text-[color:var(--text)]">Slide Sırası</CardTitle>
                <CardDescription className="text-[color:var(--text-muted)]">
                  Görselleri ekle, sırala ve buradan hızlıca değiştir.
                </CardDescription>
              </div>
              <Button
                type="button"
                className="bg-[color:var(--accent)] text-[color:var(--text-inverse)] hover:bg-[color:var(--accent-soft)]"
                onClick={addSlide}
              >
                <Plus className="mr-2 h-4 w-4" />
                Görsel ekle
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge className={contentMeta.className}>
                <ContentStatusIcon className="mr-2 h-3 w-3" />
                {contentMeta.label}
              </Badge>
              <Badge className={uploadMeta.className}>
                <UploadStatusIcon className="mr-2 h-3 w-3" />
                Upload
              </Badge>
              <Badge className="border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text-muted)]">
                {form.slides.length} kayıt
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 p-5 sm:p-6">
            <AnimatePresence initial={false}>
              {form.slides.length > 0 ? (
                form.slides.map((slide, index) => {
                  const selected = index === selectedIndex;
                  return (
                    <motion.div
                      key={`${slide.src || 'empty'}-${index}`}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      className={`overflow-hidden rounded-[1.75rem] border transition-all ${
                        selected
                          ? 'border-[color:var(--accent)] bg-[color:var(--surface-muted)] shadow-[0_14px_35px_rgba(0,0,0,0.08)]'
                          : 'border-[color:var(--line)] bg-[color:var(--surface-muted)] hover:border-[color:var(--accent)]/40 hover:bg-[color:var(--surface)]'
                      }`}
                    >
                      <div className="grid gap-4 p-4 lg:grid-cols-[220px_minmax(0,1fr)]">
                        <button
                          type="button"
                          onClick={() => setSelectedIndex(index)}
                          className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border border-dashed border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text-muted)] transition hover:border-[color:var(--accent)]/40 hover:bg-[color:var(--surface-muted)]"
                        >
                          {slide.src ? (
                            <img src={slide.src} alt={slide.alt || `Slider ${index + 1}`} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex flex-col items-center gap-2 px-4 text-center">
                              <ImageIcon className="h-7 w-7" />
                              <span className="text-xs uppercase tracking-[0.18em]">Görsel yok</span>
                            </div>
                          )}
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent px-3 py-2 text-left text-white">
                            <p className="text-[0.65rem] uppercase tracking-[0.24em] text-white/70">
                              {slide.caption || String(index + 1).padStart(2, '0')}
                            </p>
                            <p className="truncate text-xs font-semibold uppercase tracking-[0.18em]">
                              {slide.title || 'Başlıksız'}
                            </p>
                          </div>
                        </button>

                        <div className="flex min-w-0 flex-col gap-4">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0 space-y-1">
                              <button
                                type="button"
                                onClick={() => setSelectedIndex(index)}
                                className="block w-full text-left"
                              >
                                <p className="truncate text-sm font-semibold text-[color:var(--text)]">{slide.title || 'BAŞLIKSIZ SAHNE'}</p>
                                <p className="truncate text-xs text-[color:var(--text-muted)]">
                                  {slide.description || 'Açıklama eklenmemiş'}
                                </p>
                              </button>
                              <div className="flex flex-wrap items-center gap-2 text-[0.65rem] uppercase tracking-[0.22em] text-[color:var(--text-muted)]">
                                <span>Sıra {index + 1}</span>
                                <span>•</span>
                                <span>{slide.caption || '--'}</span>
                                <span>•</span>
                                <span>{slide.src ? 'Dolu' : 'Boş'}</span>
                              </div>
                            </div>

                            <Badge className={slide.src ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text-muted)]'}>
                              {slide.src ? 'Hazır' : 'Eksik'}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              className="border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                              onClick={() => triggerSlideUpload(index)}
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              Medya değiştir
                            </Button>
                            <Button
                              type="button"
                              size="icon"
                              variant="outline"
                              className="border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                              onClick={() => moveSlide(index, 'up')}
                              disabled={index === 0}
                            >
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              size="icon"
                              variant="outline"
                              className="border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                              onClick={() => moveSlide(index, 'down')}
                              disabled={index === form.slides.length - 1}
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              size="icon"
                              variant="outline"
                              className="border-[color:var(--line)] bg-[color:var(--surface)] text-rose-600 hover:text-rose-700"
                              onClick={() => removeSlide(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="rounded-[1.75rem] border border-dashed border-[color:var(--line)] bg-[color:var(--surface-muted)] p-8 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--accent)]">
                    <ImageIcon className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-semibold text-[color:var(--text)]">Slide boş</h3>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-[color:var(--text-muted)]">
                    İlk görseli ekleyerek yeni slider hero akışını oluşturun.
                  </p>
                  <Button className="mt-6 bg-[color:var(--accent)] text-[color:var(--text-inverse)] hover:bg-[color:var(--accent-soft)]" onClick={addSlide}>
                    <Plus className="mr-2 h-4 w-4" />
                    İlk görseli ekle
                  </Button>
                </div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border border-[color:var(--line)] bg-[color:var(--surface)] shadow-[var(--shadow)]">
            <CardHeader className="border-b border-[color:var(--line)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-lg text-[color:var(--text)]">Canlı Önizleme</CardTitle>
                  <CardDescription className="text-[color:var(--text-muted)]">
                    Seçili görsel frontend’de nasıl görünecek, burada kontrol edin.
                  </CardDescription>
                </div>
                <Badge className="border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text-muted)]">
                  <Eye className="mr-2 h-3 w-3" />
                  Önizleme
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-5 sm:p-6">
              {selectedSlide ? (
                <div className="overflow-hidden rounded-[1.75rem] border border-[color:var(--line)] bg-[color:var(--surface-muted)]">
                  <div className="relative aspect-[16/10] min-h-[260px] w-full overflow-hidden bg-black">
                    <img
                      src={selectedSlide.src || FALLBACK_SLIDES[0].src}
                      alt={selectedSlide.alt}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30" />
                    <div className="relative z-10 flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-white">
                      <span className="text-[0.65rem] uppercase tracking-[0.45em] text-white/70">Slider Hero</span>
                      <h3 className="max-w-[90%] text-3xl font-semibold uppercase tracking-[0.16em] sm:text-4xl">
                        {selectedSlide.title}
                      </h3>
                      <p className="max-w-[80%] text-xs uppercase tracking-[0.3em] text-white/70">
                        {selectedSlide.description || 'AÇIKLAMA YOK'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[320px] items-center justify-center rounded-[1.75rem] border border-dashed border-[color:var(--line)] bg-[color:var(--surface-muted)] text-center text-[color:var(--text-muted)]">
                  <div className="space-y-3 px-6">
                    <ImageIcon className="mx-auto h-10 w-10" />
                    <p className="text-sm">Önizleme için bir slide seçin.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border border-[color:var(--line)] bg-[color:var(--surface)] shadow-[var(--shadow)]">
            <CardHeader className="border-b border-[color:var(--line)]">
              <CardTitle className="text-lg text-[color:var(--text)]">Hero Ayarları</CardTitle>
              <CardDescription className="text-[color:var(--text-muted)]">
                Üst başlık, CTA ve seçili slide detayları.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 p-5 sm:p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--text-muted)]">Başlık</p>
                  <Input
                    value={form.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    placeholder="GALERİ"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--text-muted)]">Buton Metni</p>
                  <Input
                    value={form.buttonText}
                    onChange={(e) => updateField('buttonText', e.target.value)}
                    placeholder="TÜM GALERİYİ GÖR"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--text-muted)]">Buton Hedefi</p>
                  <Input
                    value={form.buttonHref}
                    onChange={(e) => updateField('buttonHref', e.target.value)}
                    placeholder="/galeri"
                  />
                </div>
              </div>

              <Separator className="bg-[color:var(--line)]" />

              {selectedSlide ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[color:var(--text)]">Seçili görsel</p>
                      <p className="text-xs text-[color:var(--text-muted)]">
                        {selectedIndex + 1}. görseli sürükle-bırak ile değiştirin.
                      </p>
                    </div>
                    <Badge className={selectedSlide.src ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text-muted)]'}>
                      {selectedSlide.src ? 'Hazır' : 'Boş'}
                    </Badge>
                  </div>

                  <AdminImageDropzone
                    accept="image/*"
                    aspectClassName="aspect-[16/10]"
                    buttonLabel="Görsel seç"
                    description="Sürükleyip bırakın ya da tıklayıp yükleyin."
                    emptySubtitle="Bu slaytın görselini değiştirmek için dosya seçin."
                    emptyTitle="Görsel yükle"
                    onFileSelect={(file) => uploadSlideImage(selectedIndex, file)}
                    previewAlt={selectedSlide.alt}
                    previewType="image"
                    previewUrl={selectedSlide.src}
                  />

                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--text-muted)]">Alt Metin</p>
                      <Input
                        value={selectedSlide.alt}
                        onChange={(e) => updateSlide(selectedIndex, 'alt', e.target.value)}
                        placeholder="Slider görseli alt metni"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--text-muted)]">Caption</p>
                      <Input
                        value={selectedSlide.caption ?? ''}
                        onChange={(e) => updateSlide(selectedIndex, 'caption', e.target.value)}
                        placeholder="01"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--text-muted)]">Başlık</p>
                      <Input
                        value={selectedSlide.title ?? ''}
                        onChange={(e) => updateSlide(selectedIndex, 'title', e.target.value)}
                        placeholder="Residence Lobby"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--text-muted)]">Açıklama</p>
                      <Textarea
                        value={selectedSlide.description ?? ''}
                        onChange={(e) => updateSlide(selectedIndex, 'description', e.target.value)}
                        placeholder="Kısa proje açıklaması"
                        rows={4}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-[1.5rem] border border-dashed border-[color:var(--line)] bg-[color:var(--surface-muted)] p-6 text-center text-[color:var(--text-muted)]">
                  <p className="text-sm">Düzenlemek için soldan bir slide seçin.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border border-[color:var(--line)] bg-[color:var(--surface)] shadow-[var(--shadow)]">
            <CardHeader className="border-b border-[color:var(--line)]">
              <CardTitle className="text-lg text-[color:var(--text)]">API Kontrolleri</CardTitle>
              <CardDescription className="text-[color:var(--text-muted)]">
                Slider veri akışı ve upload hattını buradan takip edin.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 p-5 sm:p-6">
              <div className="grid gap-3">
                <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[color:var(--text)]">Gallery API</p>
                      <p className="text-xs leading-6 text-[color:var(--text-muted)]">Başlık, CTA ve slider görselleri bu uç noktada saklanır.</p>
                    </div>
                    <Badge className={contentMeta.className}>
                      <ContentStatusIcon className="mr-2 h-3 w-3" />
                      {contentMeta.label}
                    </Badge>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button asChild size="sm" variant="outline" className="border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]">
                      <Link href="/api/gallery" target="_blank" rel="noreferrer">
                        <Eye className="mr-2 h-4 w-4" />
                        JSON
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[color:var(--text)]">Upload servisi</p>
                      <p className="text-xs leading-6 text-[color:var(--text-muted)]">Görselleri yüklemek ve değiştirmek için kullanılır.</p>
                    </div>
                    <Badge className={uploadMeta.className}>
                      <UploadStatusIcon className="mr-2 h-3 w-3" />
                      {uploadMeta.label}
                    </Badge>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button asChild size="sm" variant="outline" className="border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]">
                      <Link href="/api/upload" target="_blank" rel="noreferrer">
                        <Database className="mr-2 h-4 w-4" />
                        JSON
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[color:var(--text)]">Durum</p>
                      <p className="text-xs leading-6 text-[color:var(--text-muted)]">Kayıt işlemini bekliyor musunuz? Kaydet düğmesini kullanın.</p>
                    </div>
                    <Badge className="border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text-muted)]">
                      {isDirty ? 'Düzenlendi' : 'Temiz'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
