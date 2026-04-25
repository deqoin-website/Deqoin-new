'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Image as ImageIcon, Loader2, Plus, Save, Trash2, Upload } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AdminSaveBar } from '@/components/admin/AdminSaveBar';
import { useNotification } from '@/components/admin/AdminNotificationProvider';

type GalleryItem = {
  src: string;
  alt: string;
  caption?: string;
};

type GalleryForm = {
  title: string;
  buttonText: string;
  buttonHref: string;
  images: GalleryItem[];
};

const DEFAULT_FORM: GalleryForm = {
  title: 'GALERİ',
  buttonText: 'TÜM GALERİYİ GÖR',
  buttonHref: '/galeri',
  images: [],
};

const FALLBACK_IMAGES: GalleryItem[] = [
  { src: '/images/projects/gallery_1.png', alt: 'DEQOIN galeri görseli 1', caption: '01' },
  { src: '/images/projects/gallery_2.png', alt: 'DEQOIN galeri görseli 2', caption: '02' },
  { src: '/images/slider/mimari_slide.png', alt: 'DEQOIN galeri görseli 3', caption: '03' },
  { src: '/images/slider/tasarim_slide.png', alt: 'DEQOIN galeri görseli 4', caption: '04' },
  { src: '/images/slider/uygulama_slide.png', alt: 'DEQOIN galeri görseli 5', caption: '05' },
];

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function textOrFallback(value: unknown, fallback: string) {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function normalizeGallery(payload: any): GalleryForm {
  const candidate = payload?.gallery ?? payload?.content?.gallery ?? payload;
  const currentImages = Array.isArray(candidate?.images) ? candidate.images : Array.isArray(candidate?.gallery) ? candidate.gallery : [];

  const images = currentImages
    .map((item: any, index: number) => {
      if (typeof item === 'string') {
        const src = item.trim();
        if (!src) return null;
        return {
          src,
          alt: candidate?.title ? `${candidate.title} görseli ${index + 1}` : `GALERİ görseli ${index + 1}`,
          caption: String(index + 1).padStart(2, '0'),
        };
      }

      if (item && typeof item === 'object') {
        const src = String(item.src ?? item.url ?? item.image ?? '').trim();
        if (!src) return null;
        return {
          src,
          alt: textOrFallback(item.alt ?? item.imageAlt, `${candidate?.title ?? 'GALERİ'} görseli ${index + 1}`),
          caption: item.caption ?? String(index + 1).padStart(2, '0'),
        };
      }

      return null;
    })
    .filter(Boolean) as GalleryItem[];

  return {
    title: textOrFallback(candidate?.title, DEFAULT_FORM.title),
    buttonText: textOrFallback(candidate?.buttonText, DEFAULT_FORM.buttonText),
    buttonHref: textOrFallback(candidate?.buttonHref, DEFAULT_FORM.buttonHref),
    images: images.length > 0 ? images : FALLBACK_IMAGES,
  };
}

export default function HomeGalleryAdminPage() {
  const { showToast } = useNotification();
  const [form, setForm] = useState<GalleryForm>(DEFAULT_FORM);
  const [initialForm, setInitialForm] = useState<GalleryForm>(DEFAULT_FORM);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch('/api/gallery', { cache: 'no-store' });
        if (!res.ok) throw new Error('fetch failed');
        const data = await res.json();
        const next = normalizeGallery(data);
        setForm(next);
        setInitialForm(clone(next));
      } catch (error) {
        const next = { ...DEFAULT_FORM, images: FALLBACK_IMAGES };
        setForm(next);
        setInitialForm(clone(next));
        showToast('Galeri verisi alınamadı. Varsayılan değerler kullanıldı.', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGallery();
  }, [showToast]);

  const imageCountLabel = useMemo(() => String(form.images.length).padStart(2, '0'), [form.images.length]);

  const markDirty = () => setIsDirty(true);

  const updateField = (field: keyof Omit<GalleryForm, 'images'>, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    markDirty();
  };

  const addImage = () => {
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, { src: '', alt: '', caption: String(prev.images.length + 1).padStart(2, '0') }],
    }));
    markDirty();
  };

  const updateImage = (index: number, field: keyof GalleryItem, value: string) => {
    setForm((prev) => {
      const next = [...prev.images];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, images: next };
    });
    markDirty();
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, itemIndex) => itemIndex !== index) }));
    markDirty();
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    setForm((prev) => {
      const next = [...prev.images];
      const target = direction === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...prev, images: next };
    });
    markDirty();
  };

  const uploadImage = async (index: number, file: File) => {
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

    updateImage(index, 'src', uploadedUrl);
    if (!form.images[index]?.alt) {
      updateImage(index, 'alt', `Galeri görseli ${index + 1}`);
    }
  };

  const handleImageUpload = async (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await uploadImage(index, file);
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
        images: form.images.map((item) => ({
          src: item.src.trim(),
          alt: item.alt.trim() || item.src.trim() || form.title,
          caption: item.caption?.trim() || '',
        })).filter((item) => Boolean(item.src)),
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
      const next = normalizeGallery(refreshed);
      setForm(next);
      setInitialForm(clone(next));
      setIsDirty(false);
      showToast('Galeri içeriği kaydedildi.', 'success');
    } catch (error) {
      console.error(error);
      showToast('Galeri kaydedilemedi.', 'error');
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
    return <div className="loader-wrap"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur-sm lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <Badge variant="outline" className="w-fit border-white/10 text-zinc-200">ANA SAYFA GALERİ</Badge>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-[0.12em] text-white sm:text-4xl" style={{ fontFamily: 'var(--font-smooch), sans-serif' }}>
              GALERİ YÖNETİMİ
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-zinc-400">
              Başlık, buton metni, hedef bağlantı ve sıralı görselleri buradan yönet. Eski karmaşık alanlar kaldırıldı.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {isDirty && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              SIFIRLA
            </button>
          )}
          <button
            type="button"
            onClick={saveContent}
            disabled={isSaving}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isSaving ? 'KAYDEDİLİYOR...' : 'DEĞİŞİKLİKLERİ KAYDET'}
          </button>
        </div>
      </div>

      <AdminSaveBar
        isVisible={isDirty}
        onSave={saveContent}
        onCancel={handleCancel}
        isSaving={isSaving}
      />

      <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="text-base tracking-[0.18em]" style={{ fontFamily: 'var(--font-smooch), sans-serif' }}>
              METİN AYARLARI
            </CardTitle>
            <CardDescription>Minimal veri girişi. Başlık ve CTA bilgileri.</CardDescription>
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
                <span>{imageCountLabel} görsel kayıtlı</span>
              </div>
              <p className="mt-2 text-xs leading-6 text-zinc-500">
                Görseller ana sayfada full-screen mobil slider ve orantılı masaüstü grid olarak gösterilir.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base tracking-[0.18em]" style={{ fontFamily: 'var(--font-smooch), sans-serif' }}>
                GÖRSEL SIRASI
              </CardTitle>
              <CardDescription>Görselleri ekle, sırala, düzenle.</CardDescription>
            </div>
            <button
              type="button"
              onClick={addImage}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
            >
              <Plus className="h-4 w-4" />
              Görsel Ekle
            </button>
          </CardHeader>
          <CardContent className="space-y-4">
            <AnimatePresence initial={false}>
              {form.images.length > 0 ? (
                form.images.map((image, index) => (
                  <motion.div
                    key={`${image.src || 'empty'}-${index}`}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    className="overflow-hidden rounded-[24px] border border-white/10 bg-zinc-950/50"
                  >
                    <div className="grid gap-4 p-4 lg:grid-cols-[220px_minmax(0,1fr)]">
                      <button
                        type="button"
                        onClick={() => document.getElementById(`gallery-upload-${index}`)?.click()}
                        className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border border-dashed border-white/15 bg-white/5 text-zinc-300 transition hover:border-white/25 hover:bg-white/10"
                      >
                        {image.src ? (
                          <img src={image.src} alt={image.alt || `Galeri ${index + 1}`} className="h-full w-full object-cover" />
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
                        id={`gallery-upload-${index}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(index, e)}
                      />

                      <div className="flex flex-col gap-4">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <input
                            value={image.src}
                            onChange={(e) => updateImage(index, 'src', e.target.value)}
                            placeholder="Görsel URL'si"
                            className="w-full rounded-2xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-white/25"
                          />
                          <input
                            value={image.caption ?? ''}
                            onChange={(e) => updateImage(index, 'caption', e.target.value)}
                            placeholder="Numara / kısa not"
                            className="w-full rounded-2xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-white/25"
                          />
                        </div>
                        <input
                          value={image.alt}
                          onChange={(e) => updateImage(index, 'alt', e.target.value)}
                          placeholder="Alt metni"
                          className="w-full rounded-2xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-white/25"
                        />
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => moveImage(index, 'up')}
                            disabled={index === 0}
                            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <ChevronUp className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveImage(index, 'down')}
                            disabled={index === form.images.length - 1}
                            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <ChevronDown className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-red-300 transition hover:bg-white/10 hover:text-red-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
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
                  <h3 className="text-base tracking-[0.16em] text-white" style={{ fontFamily: 'var(--font-smooch), sans-serif' }}>
                    GALERİ BOŞ
                  </h3>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-zinc-400">
                    İlk görseli ekleyerek yeni galeri akışını oluştur.
                  </p>
                  <button
                    type="button"
                    onClick={addImage}
                    className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
                  >
                    <Plus className="h-4 w-4" />
                    İlk görseli ekle
                  </button>
                </div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
