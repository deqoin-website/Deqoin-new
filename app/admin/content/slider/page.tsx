'use client';

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowDown,
  ArrowUp,
  BadgeCheck,
  CheckCircle2,
  Database,
  Eye,
  FileText,
  Image as ImageIcon,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Sparkles,
  Trash2,
  Upload,
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

type TabKey = 'genel' | 'medya' | 'efektler';
type ApiStatus = 'idle' | 'loading' | 'ok' | 'error';

type SlideItem = {
  _id: string;
  title: string;
  subtitle?: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  blur: number;
  overlay: number;
  order: number;
  active: boolean;
  _temporary?: boolean;
};

const TAB_ITEMS: Array<{ key: TabKey; label: string; description: string; icon: typeof FileText }> = [
  { key: 'genel', label: 'Genel', description: 'Başlık, alt başlık ve durum', icon: FileText },
  { key: 'medya', label: 'Medya', description: 'Slider görseli veya video yükle', icon: ImageIcon },
  { key: 'efektler', label: 'Efektler', description: 'Blur ve overlay ayarları', icon: Sparkles },
];

const cloneSlides = (value: SlideItem[]) => JSON.parse(JSON.stringify(value)) as SlideItem[];

const isVideoUrl = (value?: string) => /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(value || '');

const probeMeta = (status: ApiStatus) => {
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
};

const normalizeSlide = (slide: any, index: number): SlideItem => {
  const mediaType = slide?.mediaType === 'video' || isVideoUrl(slide?.mediaUrl) ? 'video' : 'image';
  return {
    _id: String(slide?._id || slide?.id || `slide-${index}`),
    title: slide?.title || 'BAŞLIKSIZ SAHNE',
    subtitle: slide?.subtitle || '',
    mediaUrl: slide?.mediaUrl || '',
    mediaType,
    blur: Number.isFinite(Number(slide?.blur)) ? Number(slide.blur) : 0,
    overlay: Number.isFinite(Number(slide?.overlay)) ? Number(slide.overlay) : 30,
    order: Number.isFinite(Number(slide?.order)) ? Number(slide.order) : index,
    active: slide?.active !== false,
    _temporary: Boolean(slide?._temporary),
  };
};

const normalizeSlides = (data: any) =>
  (Array.isArray(data) ? data : []).map(normalizeSlide).sort((a, b) => a.order - b.order);

const normalizeOrder = (slides: SlideItem[]) => slides.map((slide, index) => ({ ...slide, order: index }));

const createTemporarySlide = (order: number): SlideItem => ({
  _id: `tmp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  title: 'YENİ SAHNE',
  subtitle: 'ALT BAŞLIK',
  mediaUrl: SLIDER_IMAGE_URLS.mimari,
  mediaType: 'image',
  blur: 0,
  overlay: 30,
  order,
  active: true,
  _temporary: true,
});

export default function SliderConfigPage() {
  const { showToast, confirm: premiumConfirm } = useNotification();
  const [tab, setTab] = useState<TabKey>('genel');
  const [slides, setSlides] = useState<SlideItem[]>([]);
  const [initialSlides, setInitialSlides] = useState<SlideItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [apiStatus, setApiStatus] = useState({
    content: 'loading' as ApiStatus,
    publicFeed: 'loading' as ApiStatus,
    upload: 'loading' as ApiStatus,
    updatedAt: '',
  });

  const selectedSlide = slides.find((slide) => slide._id === selectedId) || slides[0] || null;
  const totalSlides = slides.length;
  const activeSlides = slides.filter((slide) => slide.active).length;
  const videoSlides = slides.filter((slide) => slide.mediaType === 'video').length;
  const updatedLabel = apiStatus.updatedAt ? new Date(apiStatus.updatedAt).toLocaleDateString('tr-TR') : 'Henüz yok';
  const contentMeta = probeMeta(apiStatus.content);
  const publicFeedMeta = probeMeta(apiStatus.publicFeed);
  const uploadMeta = probeMeta(apiStatus.upload);
  const ContentStatusIcon = contentMeta.icon;
  const PublicFeedStatusIcon = publicFeedMeta.icon;
  const UploadStatusIcon = uploadMeta.icon;

  const fetchSlides = useCallback(async () => {
    setIsLoading(true);
    setApiStatus((prev) => ({ ...prev, content: 'loading' }));

    try {
      const res = await fetch('/api/admin/slides', { cache: 'no-store' });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error || 'Slide load failed');
      }

      const nextSlides = normalizeSlides(data);
      setSlides(nextSlides);
      setInitialSlides(cloneSlides(nextSlides));
      setSelectedId(nextSlides[0]?._id || null);
      setApiStatus((prev) => ({
        ...prev,
        content: 'ok',
        updatedAt: new Date().toISOString(),
      }));
      setIsDirty(false);
    } catch (error) {
      console.error('Slider content load error:', error);
      setSlides([]);
      setInitialSlides([]);
      setSelectedId(null);
      setApiStatus((prev) => ({
        ...prev,
        content: 'error',
        updatedAt: new Date().toISOString(),
      }));
      showToast('Slider sahneleri yüklenemedi.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  const probePublicFeed = useCallback(async () => {
    setApiStatus((prev) => ({ ...prev, publicFeed: 'loading' }));

    try {
      const res = await fetch('/api/slides', { cache: 'no-store' });
      if (!res.ok) {
        throw new Error('Public slider feed failed');
      }

      setApiStatus((prev) => ({
        ...prev,
        publicFeed: 'ok',
        updatedAt: new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Public slider probe error:', error);
      setApiStatus((prev) => ({
        ...prev,
        publicFeed: 'error',
        updatedAt: new Date().toISOString(),
      }));
    }
  }, []);

  const probeUploadService = useCallback(async () => {
    setApiStatus((prev) => ({ ...prev, upload: 'loading' }));

    try {
      const res = await fetch('/api/upload', { method: 'GET', cache: 'no-store' });
      if (!res.ok) {
        throw new Error('Upload health check failed');
      }

      setApiStatus((prev) => ({
        ...prev,
        upload: 'ok',
        updatedAt: new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Upload probe error:', error);
      setApiStatus((prev) => ({
        ...prev,
        upload: 'error',
        updatedAt: new Date().toISOString(),
      }));
    }
  }, []);

  useEffect(() => {
    fetchSlides();
    probePublicFeed();
    probeUploadService();
  }, [fetchSlides, probePublicFeed, probeUploadService]);

  useEffect(() => {
    if (slides.length === 0) {
      setSelectedId(null);
      return;
    }

    if (!selectedId || !slides.some((slide) => slide._id === selectedId)) {
      setSelectedId(slides[0]._id);
    }
  }, [slides, selectedId]);

  const mutateSlides = (updater: (draft: SlideItem[]) => void) => {
    setSlides((prev) => {
      const next = cloneSlides(prev);
      updater(next);
      return normalizeOrder(next);
    });
    setIsDirty(true);
  };

  const updateSlide = (id: string, patch: Partial<SlideItem>) => {
    mutateSlides((draft) => {
      const target = draft.find((slide) => slide._id === id);
      if (!target) return;
      Object.assign(target, patch);
    });
  };

  const addSlide = () => {
    const nextSlide = createTemporarySlide(slides.length);
    mutateSlides((draft) => {
      draft.push(nextSlide);
    });
    setSelectedId(nextSlide._id);
  };

  const moveSlide = (id: string, direction: -1 | 1) => {
    mutateSlides((draft) => {
      const index = draft.findIndex((slide) => slide._id === id);
      if (index < 0) return;
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= draft.length) return;
      const [item] = draft.splice(index, 1);
      draft.splice(nextIndex, 0, item);
    });
  };

  const removeSlide = async (slide: SlideItem) => {
    const ok = await premiumConfirm({
      title: 'SAHNEYİ SİL',
      message: 'Bu slider sahnesini silmek istediğinize emin misiniz?',
      confirmText: 'SİL',
      cancelText: 'VAZGEÇ',
      isDanger: true,
    });
    if (!ok) return;

    if (slide._temporary) {
      const nextSelection = slides.find((item) => item._id !== slide._id)?._id || null;
      mutateSlides((draft) => {
        const index = draft.findIndex((item) => item._id === slide._id);
        if (index >= 0) draft.splice(index, 1);
      });
      setSelectedId((prev) => (prev === slide._id ? nextSelection : prev));
      return;
    }

    try {
      const res = await fetch(`/api/admin/slides/${slide._id}`, { method: 'DELETE' });
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(payload?.error || 'Slide delete failed');
      }

      showToast('Sahne silindi.', 'success');
      await fetchSlides();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Silme işlemi başarısız.', 'error');
    }
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

      setApiStatus((prev) => ({
        ...prev,
        upload: 'ok',
        updatedAt: new Date().toISOString(),
      }));
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

  const handleMediaSelect = async (file: File) => {
    if (!selectedSlide) return;

    try {
      const url = await uploadFile(file);
      updateSlide(selectedSlide._id, {
        mediaUrl: url,
        mediaType: file.type.startsWith('video/') ? 'video' : 'image',
      });
      showToast('Medya yüklendi.', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Yükleme başarısız.', 'error');
    }
  };

  const saveSlides = async () => {
    setIsSaving(true);

    try {
      const orderedSlides = normalizeOrder(slides);

      for (const slide of orderedSlides) {
        const payload = {
          title: slide.title,
          subtitle: slide.subtitle,
          mediaUrl: slide.mediaUrl,
          mediaType: slide.mediaType,
          blur: slide.blur,
          overlay: slide.overlay,
          order: slide.order,
          active: slide.active,
        };

        const isTemporary = slide._temporary || String(slide._id).startsWith('tmp-');
        const endpoint = isTemporary ? '/api/admin/slides' : `/api/admin/slides/${slide._id}`;
        const method = isTemporary ? 'POST' : 'PUT';

        const res = await fetch(endpoint, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const result = await res.json().catch(() => null);
        if (!res.ok) {
          throw new Error(result?.error || 'Slide save failed');
        }
      }

      setIsDirty(false);
      showToast('Slider sahneleri kaydedildi.', 'success');
      await fetchSlides();
    } catch (error) {
      console.error('Slider save error:', error);
      showToast(error instanceof Error ? error.message : 'Kayıt sırasında bir hata oluştu.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setSlides(cloneSlides(initialSlides));
    setSelectedId(initialSlides[0]?._id || null);
    setIsDirty(false);
    showToast('Değişiklikler geri alındı.', 'info');
  };

  const runMigration = async () => {
    setIsSaving(true);

    try {
      const res = await fetch('/api/admin/migrate/slides', { method: 'GET' });
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(payload?.error || 'Migration failed');
      }

      showToast('Varsayılan slider sahneleri aktarıldı.', 'success');
      await fetchSlides();
      await probePublicFeed();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Aktarım sırasında bir hata oluştu.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

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
              SİNEMATİK MEDYA & SLIDER
            </Badge>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-[color:var(--text)] sm:text-4xl">
                Slider sahnelerini yönetin
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-[color:var(--text-muted)]">
                Hero sahneleri, görseller, videolar, efektler ve yayın durumu tek ekrandan düzenlenir.
                Kontroller light/dark tema ile uyumlu, mobilde de tek sütunda çalışır.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text-muted)]">
                Toplam {totalSlides} sahne
              </Badge>
              <Badge variant="outline" className="border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text-muted)]">
                Aktif {activeSlides}
              </Badge>
              <Badge variant="outline" className="border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text-muted)]">
                Video {videoSlides}
              </Badge>
              <Badge variant="outline" className="border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text-muted)]">
                Son kontrol: {updatedLabel}
              </Badge>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[470px]">
            <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[color:var(--text-muted)]">Admin API</p>
              <p className="mt-1 text-2xl font-semibold text-[color:var(--text)]">/api/admin/slides</p>
              <p className="mt-2 text-xs text-[color:var(--text-muted)]">Sahneler bu uç noktadan okunur ve kaydedilir.</p>
            </div>
            <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[color:var(--text-muted)]">Public Feed</p>
              <p className="mt-1 text-2xl font-semibold text-[color:var(--text)]">/api/slides</p>
              <p className="mt-2 text-xs text-[color:var(--text-muted)]">Aktif sahneler frontend slider’ında gösterilir.</p>
            </div>
            <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[color:var(--text-muted)]">Upload</p>
              <p className="mt-1 text-2xl font-semibold text-[color:var(--text)]">{uploadMeta.label}</p>
              <p className="mt-2 text-xs text-[color:var(--text-muted)]">Görsel ve video yüklemeleri için kullanılır.</p>
            </div>
            <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[color:var(--text-muted)]">Kayıt Durumu</p>
              <p className="mt-1 text-2xl font-semibold text-[color:var(--text)]">{isDirty ? 'Düzenlendi' : 'Temiz'}</p>
              <p className="mt-2 text-xs text-[color:var(--text-muted)]">Kaydetmeden çıkarsanız değişiklikler korunmaz.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-[color:var(--line)] px-5 py-4 sm:px-6">
          {TAB_ITEMS.map((item) => (
            <Button
              key={item.key}
              type="button"
              variant={tab === item.key ? 'default' : 'outline'}
              className={
                tab === item.key
                  ? 'bg-[color:var(--accent)] text-[color:var(--text-inverse)] hover:bg-[color:var(--accent-soft)]'
                  : 'border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)] hover:bg-[color:var(--surface)]'
              }
              onClick={() => setTab(item.key)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </div>
      </motion.section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(340px,420px)]">
        <Card className="border border-[color:var(--line)] bg-[color:var(--surface)] shadow-[var(--shadow)]">
          <CardHeader className="space-y-4 border-b border-[color:var(--line)]">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <CardTitle className="text-lg text-[color:var(--text)]">Sahne listesi</CardTitle>
                <CardDescription className="text-[color:var(--text-muted)]">
                  Sıralamayı, yayını ve içeriği buradan yönetin.
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)]"
                  onClick={addSlide}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Yeni sahne
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)]"
                  onClick={handleCancel}
                  disabled={!isDirty}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Geri al
                </Button>
                <Button
                  type="button"
                  className="bg-[color:var(--accent)] text-[color:var(--text-inverse)] hover:bg-[color:var(--accent-soft)]"
                  onClick={saveSlides}
                  disabled={isSaving || !isDirty}
                >
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Kaydet
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-[color:var(--text-muted)]">
              <Badge className={contentMeta.className}>
                <ContentStatusIcon className="mr-2 h-3 w-3" />
                {contentMeta.label}
              </Badge>
              <Badge className={publicFeedMeta.className}>
                <PublicFeedStatusIcon className="mr-2 h-3 w-3" />
                Public
              </Badge>
              <Badge className={uploadMeta.className}>
                <UploadStatusIcon className="mr-2 h-3 w-3" />
                Upload
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 p-5 sm:p-6">
            {slides.length > 0 ? (
              <div className="grid gap-3">
                {slides.map((slide, index) => {
                  const selected = slide._id === selectedId;
                  return (
                    <button
                      key={slide._id}
                      type="button"
                      className={`group flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all ${
                        selected
                          ? 'border-[color:var(--accent)] bg-[color:var(--surface-muted)] shadow-[0_10px_30px_rgba(0,0,0,0.08)]'
                          : 'border-[color:var(--line)] bg-[color:var(--surface-muted)] hover:border-[color:var(--accent)]/40 hover:bg-[color:var(--surface)]'
                      }`}
                      onClick={() => setSelectedId(slide._id)}
                    >
                      <div className="flex h-16 w-24 shrink-0 overflow-hidden rounded-xl border border-[color:var(--line)] bg-[color:var(--surface)]">
                        {slide.mediaType === 'video' ? (
                          <video className="h-full w-full object-cover" muted playsInline>
                            <source src={slide.mediaUrl} />
                          </video>
                        ) : (
                          <img src={slide.mediaUrl || SLIDER_IMAGE_URLS.mimari} alt={slide.title} className="h-full w-full object-cover" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-[color:var(--text)]">{slide.title}</p>
                            <p className="truncate text-xs text-[color:var(--text-muted)]">{slide.subtitle || 'Alt başlık yok'}</p>
                          </div>
                          <Badge className={slide.active ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text-muted)]'}>
                            {slide.active ? 'Aktif' : 'Pasif'}
                          </Badge>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-2 text-[0.65rem] uppercase tracking-[0.22em] text-[color:var(--text-muted)]">
                          <span>Sıra {index + 1}</span>
                          <span>•</span>
                          <span>{slide.mediaType}</span>
                          <span>•</span>
                          <span>{slide._temporary ? 'Taslak' : 'Kayıtlı'}</span>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-1">
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-9 w-9 rounded-full text-[color:var(--text-muted)] hover:bg-[color:var(--surface)] hover:text-[color:var(--text)]"
                          onClick={(event) => {
                            event.stopPropagation();
                            moveSlide(slide._id, -1);
                          }}
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-9 w-9 rounded-full text-[color:var(--text-muted)] hover:bg-[color:var(--surface)] hover:text-[color:var(--text)]"
                          onClick={(event) => {
                            event.stopPropagation();
                            moveSlide(slide._id, 1);
                          }}
                          disabled={index === slides.length - 1}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-9 w-9 rounded-full text-rose-500 hover:bg-rose-500/10 hover:text-rose-600"
                          onClick={(event) => {
                            event.stopPropagation();
                            removeSlide(slide);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-[2rem] border border-dashed border-[color:var(--line)] bg-[color:var(--surface-muted)] p-6">
                <div className="space-y-3 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--accent)]">
                    <ImageIcon className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold text-[color:var(--text)]">Henüz sahne yok</h3>
                    <p className="text-sm leading-6 text-[color:var(--text-muted)]">
                      Başlamak için varsayılan slider sahnelerini içeri aktarabilir veya yeni bir sahne oluşturabilirsiniz.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Button
                      type="button"
                      className="bg-[color:var(--accent)] text-[color:var(--text-inverse)] hover:bg-[color:var(--accent-soft)]"
                      onClick={runMigration}
                      disabled={isSaving}
                    >
                      {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
                      Varsayılanları aktar
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                      onClick={addSlide}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Boş sahne ekle
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border border-[color:var(--line)] bg-[color:var(--surface)] shadow-[var(--shadow)]">
            <CardHeader className="border-b border-[color:var(--line)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-lg text-[color:var(--text)]">Canlı Önizleme</CardTitle>
                  <CardDescription className="text-[color:var(--text-muted)]">
                    Seçili sahne frontend’de nasıl görünecek, burada kontrol edin.
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
                    {selectedSlide.mediaType === 'video' ? (
                      <video key={selectedSlide.mediaUrl} className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline>
                        <source src={selectedSlide.mediaUrl} />
                      </video>
                    ) : (
                      <img
                        src={selectedSlide.mediaUrl || SLIDER_IMAGE_URLS.mimari}
                        alt={selectedSlide.title}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    )}
                    <div
                      className="absolute inset-0"
                      style={{ background: `rgba(0,0,0,${Math.min(Math.max(selectedSlide.overlay, 0), 100) / 100})` }}
                    />
                    <div
                      className="absolute inset-0"
                      style={{ backdropFilter: `blur(${Math.min(Math.max(selectedSlide.blur, 0), 50)}px)` }}
                    />
                    <div className="relative z-10 flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-white">
                      <span className="text-[0.65rem] uppercase tracking-[0.45em] text-white/70">Sinematik Slider</span>
                      <h3 className="max-w-[90%] text-3xl font-semibold uppercase tracking-[0.16em] sm:text-4xl">
                        {selectedSlide.title}
                      </h3>
                      <p className="max-w-[80%] text-xs uppercase tracking-[0.3em] text-white/70">
                        {selectedSlide.subtitle || 'ALT BAŞLIK YOK'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[320px] items-center justify-center rounded-[1.75rem] border border-dashed border-[color:var(--line)] bg-[color:var(--surface-muted)] text-center text-[color:var(--text-muted)]">
                  <div className="space-y-3 px-6">
                    <ImageIcon className="mx-auto h-10 w-10" />
                    <p className="text-sm">Önizleme için bir sahne seçin.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border border-[color:var(--line)] bg-[color:var(--surface)] shadow-[var(--shadow)]">
            <CardHeader className="border-b border-[color:var(--line)]">
              <CardTitle className="text-lg text-[color:var(--text)]">
                {selectedSlide ? selectedSlide.title : 'Sahne ayarları'}
              </CardTitle>
              <CardDescription className="text-[color:var(--text-muted)]">
                {TAB_ITEMS.find((item) => item.key === tab)?.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5 p-5 sm:p-6">
              {selectedSlide ? (
                <>
                  <div className="flex flex-wrap gap-2">
                    {TAB_ITEMS.map((item) => (
                      <Button
                        key={item.key}
                        type="button"
                        variant={tab === item.key ? 'default' : 'outline'}
                        size="sm"
                        className={
                          tab === item.key
                            ? 'bg-[color:var(--accent)] text-[color:var(--text-inverse)] hover:bg-[color:var(--accent-soft)]'
                            : 'border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)] hover:bg-[color:var(--surface)]'
                        }
                        onClick={() => setTab(item.key)}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.label}
                      </Button>
                    ))}
                  </div>

                  <Separator className="bg-[color:var(--line)]" />

                  <AnimatePresence mode="wait">
                    {tab === 'genel' && (
                      <motion.div
                        key="genel"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="space-y-4"
                      >
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--text-muted)]">Başlık</p>
                            <Input
                              value={selectedSlide.title}
                              onChange={(event) => updateSlide(selectedSlide._id, { title: event.target.value })}
                              placeholder="Örn: DESIGN STUDIO"
                            />
                          </div>

                          <div className="space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--text-muted)]">Alt başlık</p>
                            <Textarea
                              value={selectedSlide.subtitle}
                              onChange={(event) => updateSlide(selectedSlide._id, { subtitle: event.target.value })}
                              placeholder="Örn: TASARIMIN GELECEĞİ"
                              rows={4}
                            />
                          </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <Button
                            type="button"
                            variant="outline"
                            className="border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)]"
                            onClick={() => updateSlide(selectedSlide._id, { active: !selectedSlide.active })}
                          >
                            {selectedSlide.active ? 'Pasife al' : 'Aktifleştir'}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            className="border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)]"
                            onClick={() => moveSlide(selectedSlide._id, -1)}
                          >
                            <ArrowUp className="mr-2 h-4 w-4" />
                            Yukarı taşı
                          </Button>
                        </div>
                      </motion.div>
                    )}

                    {tab === 'medya' && (
                      <motion.div
                        key="medya"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="space-y-4"
                      >
                        <div className="space-y-2">
                          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--text-muted)]">Medya bağlantısı</p>
                          <Input
                            value={selectedSlide.mediaUrl}
                            onChange={(event) => updateSlide(selectedSlide._id, {
                              mediaUrl: event.target.value,
                              mediaType: isVideoUrl(event.target.value) ? 'video' : 'image',
                            })}
                            placeholder="https://... veya /local/path.png"
                          />
                          <p className="text-xs leading-6 text-[color:var(--text-muted)]">
                            Video için MP4, WebM, MOV veya M4V ekleyebilirsiniz. Görsel yüklemek için sürükle-bırak alanını kullanın.
                          </p>
                        </div>

                        <AdminImageDropzone
                          accept="image/*,video/*"
                          aspectClassName="aspect-[16/10]"
                          buttonLabel="Dosya seç"
                          description="Görseli sürükleyip bırakın veya tıklayıp yükleyin."
                          emptySubtitle="Slider sahnesi için görsel ya da video seçin."
                          emptyTitle="Medya yükle"
                          onFileSelect={handleMediaSelect}
                          previewAlt={selectedSlide.title}
                          previewType="auto"
                          previewUrl={selectedSlide.mediaUrl}
                        />
                      </motion.div>
                    )}

                    {tab === 'efektler' && (
                      <motion.div
                        key="efektler"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="space-y-5"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between gap-3 text-sm">
                            <span className="font-medium text-[color:var(--text)]">Blur</span>
                            <strong className="text-[color:var(--accent)]">{selectedSlide.blur}px</strong>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="40"
                            value={selectedSlide.blur}
                            onChange={(event) => updateSlide(selectedSlide._id, { blur: Number(event.target.value) })}
                            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[color:var(--surface-muted)] accent-[color:var(--accent)]"
                          />
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between gap-3 text-sm">
                            <span className="font-medium text-[color:var(--text)]">Overlay</span>
                            <strong className="text-[color:var(--accent)]">%{selectedSlide.overlay}</strong>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="90"
                            value={selectedSlide.overlay}
                            onChange={(event) => updateSlide(selectedSlide._id, { overlay: Number(event.target.value) })}
                            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[color:var(--surface-muted)] accent-[color:var(--accent)]"
                          />
                        </div>

                        <div className="rounded-[1.5rem] border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4 text-sm text-[color:var(--text-muted)]">
                          Bu ayarlar anlık önizlemede ve public slider’da kullanılacak.
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <div className="rounded-[1.5rem] border border-dashed border-[color:var(--line)] bg-[color:var(--surface-muted)] p-6 text-center text-[color:var(--text-muted)]">
                  <p className="text-sm">Düzenlemek için soldan bir sahne seçin.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border border-[color:var(--line)] bg-[color:var(--surface)] shadow-[var(--shadow)]">
            <CardHeader className="border-b border-[color:var(--line)]">
              <CardTitle className="text-lg text-[color:var(--text)]">API Kontrolleri</CardTitle>
              <CardDescription className="text-[color:var(--text-muted)]">
                Slider veri akışını ve upload hattını buradan takip edin.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 p-5 sm:p-6">
              <div className="grid gap-3">
                <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[color:var(--text)]">Admin slides API</p>
                      <p className="text-xs leading-6 text-[color:var(--text-muted)]">Sahne listesi, oluşturma, güncelleme ve silme.</p>
                    </div>
                    <Badge className={contentMeta.className}>
                      <ContentStatusIcon className="mr-2 h-3 w-3" />
                      {contentMeta.label}
                    </Badge>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button asChild size="sm" variant="outline" className="border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]">
                      <Link href="/api/admin/slides" target="_blank" rel="noreferrer">
                        <Eye className="mr-2 h-4 w-4" />
                        JSON
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[color:var(--text)]">Public slider feed</p>
                      <p className="text-xs leading-6 text-[color:var(--text-muted)]">Aktif sahneler frontend tarafına buradan gider.</p>
                    </div>
                    <Badge className={publicFeedMeta.className}>
                      <PublicFeedStatusIcon className="mr-2 h-3 w-3" />
                      {publicFeedMeta.label}
                    </Badge>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button asChild size="sm" variant="outline" className="border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]">
                      <Link href="/api/slides" target="_blank" rel="noreferrer">
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
                      <p className="text-xs leading-6 text-[color:var(--text-muted)]">Medya yükleme hattı ve dosya kontrolü.</p>
                    </div>
                    <Badge className={uploadMeta.className}>
                      <UploadStatusIcon className="mr-2 h-3 w-3" />
                      {uploadMeta.label}
                    </Badge>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button asChild size="sm" variant="outline" className="border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]">
                      <Link href="/api/upload" target="_blank" rel="noreferrer">
                        <Upload className="mr-2 h-4 w-4" />
                        JSON
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[color:var(--text)]">Varsayılan slider seed</p>
                      <p className="text-xs leading-6 text-[color:var(--text-muted)]">Veritabanı boşsa başlangıç sahnelerini ekler.</p>
                    </div>
                    <Badge className="border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text-muted)]">
                      <Database className="mr-2 h-3 w-3" />
                      Aktarım
                    </Badge>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      className="bg-[color:var(--accent)] text-[color:var(--text-inverse)] hover:bg-[color:var(--accent-soft)]"
                      onClick={runMigration}
                      disabled={isSaving}
                    >
                      {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
                      Varsayılanları aktar
                    </Button>
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
