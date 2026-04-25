'use client';

import { useEffect, useState, type ChangeEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Loader2,
  Plus,
  Save,
  Trash2,
  Upload,
} from 'lucide-react';

import { AdminSaveBar } from '@/components/admin/AdminSaveBar';
import { useNotification } from '@/components/admin/AdminNotificationProvider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

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

const DEFAULT_FORM: SliderForm = {
  title: 'GALERİ',
  buttonText: 'TÜM GALERİYİ GÖR',
  buttonHref: '/galeri',
  slides: [],
};

const FALLBACK_SLIDES: SliderImage[] = [
  { src: '/images/projects/gallery_1.png', alt: 'DEQOIN slider görseli 1', caption: '01', title: 'Residence Lobby', description: 'Minimal yüzeyler, dengeli ışık ve sakin bir giriş atmosferi.' },
  { src: '/images/projects/gallery_2.png', alt: 'DEQOIN slider görseli 2', caption: '02', title: 'Material Study', description: 'Doğal dokular, net detaylar ve kontrollü kontrast.' },
  { src: '/images/slider/mimari_slide.png', alt: 'DEQOIN slider görseli 3', caption: '03', title: 'Architectural Frame', description: 'Mekanı tanımlayan sade çizgiler ve güçlü oranlar.' },
  { src: '/images/slider/tasarim_slide.png', alt: 'DEQOIN slider görseli 4', caption: '04', title: 'Design Detail', description: 'Yüzey geçişleri ve dingin bir kompozisyon dili.' },
  { src: '/images/slider/uygulama_slide.png', alt: 'DEQOIN slider görseli 5', caption: '05', title: 'Execution Layer', description: 'Uygulama kalitesi, temiz bitişler ve net sonuçlar.' },
];

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function textOrFallback(value: unknown, fallback: string) {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
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
  const candidate = payload?.gallery ?? payload?.content?.gallery ?? payload?.slider ?? payload;
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
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const fetchSlider = async () => {
      try {
        const res = await fetch('/api/gallery', { cache: 'no-store' });
        if (!res.ok) throw new Error('fetch failed');
        const data = await res.json();
        const next = normalizeSliderPayload(data);
        setForm(next);
        setInitialForm(clone(next));
      } catch (error) {
        const next = { ...DEFAULT_FORM, slides: FALLBACK_SLIDES };
        setForm(next);
        setInitialForm(clone(next));
        showToast('Slider verisi alınamadı. Varsayılan değerler kullanıldı.', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSlider();
  }, [showToast]);

  const markDirty = () => setIsDirty(true);

  const updateField = (field: keyof Omit<SliderForm, 'slides'>, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
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
    markDirty();
  };

  const updateSlide = (index: number, field: keyof SliderImage, value: string) => {
    setForm((prev) => {
      const next = [...prev.slides];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, slides: next };
    });
    markDirty();
  };

  const removeSlide = (index: number) => {
    setForm((prev) => ({
      ...prev,
      slides: prev.slides.filter((_, itemIndex) => itemIndex !== index),
    }));
    markDirty();
  };

  const moveSlide = (index: number, direction: 'up' | 'down') => {
    setForm((prev) => {
      const next = [...prev.slides];
      const target = direction === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...prev, slides: next };
    });
    markDirty();
  };

  const uploadSlideImage = async (index: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', file.name);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error('Upload failed');

    const blob = await res.json();
    const uploadedUrl = blob?.url || blob?.downloadUrl;
    if (!uploadedUrl) throw new Error('Upload URL missing');

    updateSlide(index, 'src', uploadedUrl);
    if (!form.slides[index]?.alt) {
      updateSlide(index, 'alt', `Slider görseli ${index + 1}`);
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
    }
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
      setIsDirty(false);
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
    setIsDirty(false);
    showToast('Değişiklikler geri alındı.', 'info');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-zinc-200">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <Badge variant="outline" className="w-fit border-white/10 text-zinc-200">
              ANA SAYFA SLIDER HERO
            </Badge>
            <div className="space-y-2">
              <h1
                className="text-3xl font-semibold tracking-[0.12em] text-white sm:text-4xl"
                style={{ fontFamily: 'var(--font-smooch), sans-serif' }}
              >
                GÖRSEL SLIDER YÖNETİMİ
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-zinc-400">
                Başlık, CTA ve sıralı görselleri buradan yönet. Aynı veri sözleşmesi mobil full-screen slider ve masaüstü sinematik hero ile paylaşılır.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {isDirty && (
              <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                SIFIRLA
              </Button>
            )}
            <Button onClick={saveContent} disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {isSaving ? 'KAYDEDİLİYOR...' : 'DEĞİŞİKLİKLERİ KAYDET'}
            </Button>
          </div>
        </div>
      </div>

      <AdminSaveBar isVisible={isDirty} onSave={saveContent} onCancel={handleCancel} isSaving={isSaving} />

      <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        <Card className="border-white/10 bg-white/5">
          <CardHeader className="space-y-2">
            <CardTitle
              className="text-base tracking-[0.18em] text-white"
              style={{ fontFamily: 'var(--font-smooch), sans-serif' }}
            >
              METİN AYARLARI
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Başlık ve buton bilgilerini minimal olarak düzenle.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <label className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-zinc-300">Başlık</label>
              <input
                value={form.title}
                onChange={(e) => updateField('title', e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-white/25"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-zinc-300">Buton Metni</label>
              <input
                value={form.buttonText}
                onChange={(e) => updateField('buttonText', e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-white/25"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-zinc-300">Buton Hedefi</label>
              <input
                value={form.buttonHref}
                onChange={(e) => updateField('buttonHref', e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-white/25"
              />
            </div>

            <Separator className="bg-white/10" />

            <div className="rounded-2xl border border-white/10 bg-zinc-950/50 p-4 text-sm text-zinc-300">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                <span>{String(form.slides.length).padStart(2, '0')} görsel kayıtlı</span>
              </div>
              <p className="mt-2 text-xs leading-6 text-zinc-500">
                Mobilde tam ekran, masaüstünde geniş tek slider hero olarak gösterilir.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div className="space-y-2">
              <CardTitle
                className="text-base tracking-[0.18em] text-white"
                style={{ fontFamily: 'var(--font-smooch), sans-serif' }}
              >
                SLIDE SIRASI
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Görselleri ekle, sırala ve başlıkla bütünleştir.
              </CardDescription>
            </div>
            <Button onClick={addSlide} className="shrink-0">
              <Plus className="mr-2 h-4 w-4" />
              Görsel Ekle
            </Button>
          </CardHeader>

          <CardContent className="space-y-4">
            <AnimatePresence initial={false}>
              {form.slides.length > 0 ? (
                form.slides.map((slide, index) => (
                  <motion.div
                    key={`${slide.src || 'empty'}-${index}`}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    className="overflow-hidden rounded-[24px] border border-white/10 bg-zinc-950/50"
                  >
                    <div className="grid gap-4 p-4 lg:grid-cols-[220px_minmax(0,1fr)]">
                      <button
                        type="button"
                        onClick={() => document.getElementById(`slider-upload-${index}`)?.click()}
                        className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border border-dashed border-white/15 bg-white/5 text-zinc-300 transition hover:border-white/25 hover:bg-white/10"
                      >
                        {slide.src ? (
                          <img src={slide.src} alt={slide.alt || `Slider ${index + 1}`} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <ImageIcon className="h-7 w-7" />
                            <span className="text-xs uppercase tracking-[0.18em]">Görsel yükle</span>
                          </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 text-xs uppercase tracking-[0.2em] text-white opacity-0 transition hover:bg-black/25 hover:opacity-100">
                          <Upload className="mr-2 h-4 w-4" />
                          Değiştir
                        </div>
                      </button>
                      <input
                        id={`slider-upload-${index}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleSlideUpload(index, e)}
                      />

                      <div className="flex flex-col gap-4">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <input
                            value={slide.src}
                            onChange={(e) => updateSlide(index, 'src', e.target.value)}
                            placeholder="Görsel URL'si"
                            className="w-full rounded-2xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-white/25"
                          />
                          <input
                            value={slide.caption ?? ''}
                            onChange={(e) => updateSlide(index, 'caption', e.target.value)}
                            placeholder="Numara / kısa not"
                            className="w-full rounded-2xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-white/25"
                          />
                        </div>
                        <input
                          value={slide.alt}
                          onChange={(e) => updateSlide(index, 'alt', e.target.value)}
                          placeholder="Alt metni"
                          className="w-full rounded-2xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-white/25"
                        />
                        <input
                          value={slide.title ?? ''}
                          onChange={(e) => updateSlide(index, 'title', e.target.value)}
                          placeholder="Proje İsmi"
                          className="w-full rounded-2xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-white/25"
                        />
                        <textarea
                          value={slide.description ?? ''}
                          onChange={(e) => updateSlide(index, 'description', e.target.value)}
                          placeholder="Kısa açıklama"
                          rows={3}
                          className="w-full rounded-2xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-white/25"
                        />

                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="icon" onClick={() => moveSlide(index, 'up')} disabled={index === 0}>
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => moveSlide(index, 'down')}
                            disabled={index === form.slides.length - 1}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => removeSlide(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="rounded-[24px] border border-dashed border-white/10 bg-zinc-950/50 p-10 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5">
                    <ImageIcon className="h-6 w-6 text-zinc-300" />
                  </div>
                  <h3
                    className="text-base tracking-[0.16em] text-white"
                    style={{ fontFamily: 'var(--font-smooch), sans-serif' }}
                  >
                    SLIDE BOŞ
                  </h3>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-zinc-400">
                    İlk görseli ekleyerek yeni slider hero akışını oluştur.
                  </p>
                  <Button className="mt-6" onClick={addSlide}>
                    <Plus className="mr-2 h-4 w-4" />
                    İlk görseli ekle
                  </Button>
                </div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
