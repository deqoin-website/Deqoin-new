'use client';

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useRef, useState, type ComponentType } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowDown,
  ArrowUp,
  BadgeCheck,
  CheckCircle2,
  Eye,
  Hammer,
  Image as ImageIcon,
  Layers,
  Loader2,
  PenTool,
  Plus,
  RefreshCw,
  Save,
  Sparkles,
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
import { resolveStudioCardImage } from '@/lib/image-resolvers';

type ApiStatus = 'idle' | 'loading' | 'ok' | 'error';

type StudioCard = {
  studioType: 'design' | 'material' | 'execution';
  title: string;
  description: string;
  icon: string;
  image: string;
  blur: number;
  overlay: number;
  order: number;
};

const DEFAULT_CARDS: StudioCard[] = [
  {
    studioType: 'design',
    title: 'Design Studio',
    description: 'Mimari Tasarım',
    icon: 'PenTool',
    image: '/images/workflow/design-studio-home.png',
    blur: 0,
    overlay: 30,
    order: 0,
  },
  {
    studioType: 'material',
    title: 'Material Studio',
    description: 'Ürün ve Malzeme',
    icon: 'Layers',
    image: '/images/workflow/material-studio-home.png',
    blur: 0,
    overlay: 30,
    order: 1,
  },
  {
    studioType: 'execution',
    title: 'Execution Studio',
    description: 'Uygulama Hizmetleri',
    icon: 'Hammer',
    image: '/images/workflow/execution-studio-home.png',
    blur: 0,
    overlay: 30,
    order: 2,
  },
];

const cloneCards = (value: StudioCard[]) => JSON.parse(JSON.stringify(value)) as StudioCard[];

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  PenTool,
  Layers,
  Hammer,
};

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

function normalizeCards(input: any): StudioCard[] {
  const cards = Array.isArray(input) ? input : [];
  const lookup = new Map<string, StudioCard>();

  cards.forEach((card: any, index: number) => {
    const studioType = card?.studioType as StudioCard['studioType'] | undefined;
    if (!studioType) return;

    lookup.set(studioType, {
      studioType,
      title: typeof card.title === 'string' && card.title.trim() ? card.title.trim() : DEFAULT_CARDS[index]?.title || '',
      description: typeof card.description === 'string' && card.description.trim() ? card.description.trim() : DEFAULT_CARDS[index]?.description || '',
      icon: typeof card.icon === 'string' && card.icon.trim() ? card.icon.trim() : DEFAULT_CARDS[index]?.icon || 'PenTool',
      image: typeof card.image === 'string' && card.image.trim() ? card.image.trim() : DEFAULT_CARDS[index]?.image || '',
      blur: Number.isFinite(Number(card.blur)) ? Number(card.blur) : DEFAULT_CARDS[index]?.blur || 0,
      overlay: Number.isFinite(Number(card.overlay)) ? Number(card.overlay) : DEFAULT_CARDS[index]?.overlay || 30,
      order: Number.isFinite(Number(card.order)) ? Number(card.order) : index,
    });
  });

  return DEFAULT_CARDS.map((fallback) => lookup.get(fallback.studioType) ?? fallback).sort((a, b) => a.order - b.order);
}

export default function HomeServicesAdmin() {
  const { showToast } = useNotification();
  const [cards, setCards] = useState<StudioCard[]>(DEFAULT_CARDS);
  const [initialCards, setInitialCards] = useState<StudioCard[]>(DEFAULT_CARDS);
  const [selectedType, setSelectedType] = useState<StudioCard['studioType']>('design');
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [apiStatus, setApiStatus] = useState({
    content: 'loading' as ApiStatus,
    upload: 'loading' as ApiStatus,
    updatedAt: '',
  });
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const uploadTargetRef = useRef<StudioCard['studioType'] | null>(null);

  const contentMeta = probeMeta(apiStatus.content);
  const uploadMeta = probeMeta(apiStatus.upload);
  const ContentStatusIcon = contentMeta.icon;
  const UploadStatusIcon = uploadMeta.icon;
  const selectedCard = cards.find((card) => card.studioType === selectedType) || cards[0] || null;
  const updatedLabel = apiStatus.updatedAt ? new Date(apiStatus.updatedAt).toLocaleDateString('tr-TR') : 'Henüz yok';

  const syncTheme = useCallback(() => {
    setTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
  }, []);

  const fetchCards = useCallback(async () => {
    setIsLoading(true);
    setApiStatus((prev) => ({ ...prev, content: 'loading' }));

    try {
      const res = await fetch('/api/admin/content/home/services', { cache: 'no-store' });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error || 'Kartlar yüklenemedi');
      }

      const next = normalizeCards(data);
      setCards(next);
      setInitialCards(cloneCards(next));
      setSelectedType(next[0]?.studioType || 'design');
      setApiStatus((prev) => ({
        ...prev,
        content: 'ok',
        updatedAt: new Date().toISOString(),
      }));
      setIsDirty(false);
    } catch (error) {
      console.error(error);
      const fallback = cloneCards(DEFAULT_CARDS);
      setCards(fallback);
      setInitialCards(cloneCards(fallback));
      setSelectedType('design');
      setApiStatus((prev) => ({
        ...prev,
        content: 'error',
        updatedAt: new Date().toISOString(),
      }));
      showToast('Kartlar yüklenemedi.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  const probeUpload = useCallback(async () => {
    setApiStatus((prev) => ({ ...prev, upload: 'loading' }));

    try {
      const res = await fetch('/api/upload', { method: 'GET', cache: 'no-store' });
      if (!res.ok) {
        throw new Error('Upload health failed');
      }

      setApiStatus((prev) => ({
        ...prev,
        upload: 'ok',
        updatedAt: new Date().toISOString(),
      }));
    } catch (error) {
      console.error(error);
      setApiStatus((prev) => ({
        ...prev,
        upload: 'error',
        updatedAt: new Date().toISOString(),
      }));
    }
  }, []);

  useEffect(() => {
    fetchCards();
    probeUpload();
  }, [fetchCards, probeUpload]);

  useEffect(() => {
    syncTheme();
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, [syncTheme]);

  useEffect(() => {
    if (!cards.some((card) => card.studioType === selectedType)) {
      setSelectedType(cards[0]?.studioType || 'design');
    }
  }, [cards, selectedType]);

  const mutateCards = (updater: (draft: StudioCard[]) => void) => {
    setCards((prev) => {
      const next = cloneCards(prev);
      updater(next);
      return next.sort((a, b) => a.order - b.order);
    });
    setIsDirty(true);
  };

  const updateCard = (studioType: StudioCard['studioType'], patch: Partial<StudioCard>) => {
    mutateCards((draft) => {
      const target = draft.find((card) => card.studioType === studioType);
      if (!target) return;
      Object.assign(target, patch);
    });
  };

  const moveCard = (studioType: StudioCard['studioType'], direction: -1 | 1) => {
    mutateCards((draft) => {
      const index = draft.findIndex((card) => card.studioType === studioType);
      if (index < 0) return;
      const target = index + direction;
      if (target < 0 || target >= draft.length) return;
      const [item] = draft.splice(index, 1);
      draft.splice(target, 0, item);
      draft.forEach((card, order) => {
        card.order = order;
      });
    });
  };

  const uploadCardImage = async (studioType: StudioCard['studioType'], file: File) => {
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

      updateCard(studioType, { image: uploadedUrl });
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

  const triggerUpload = (studioType: StudioCard['studioType']) => {
    uploadTargetRef.current = studioType;
    setSelectedType(studioType);
    uploadInputRef.current?.click();
  };

  const handleUploadChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const target = uploadTargetRef.current || selectedType;
    try {
      await uploadCardImage(target, file);
      showToast('Görsel yüklendi.', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Görsel yüklenemedi.', 'error');
    } finally {
      event.target.value = '';
      uploadTargetRef.current = null;
    }
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const payload = cards.map((card, index) => ({
        ...card,
        title: card.title.trim(),
        description: card.description.trim(),
        icon: card.icon.trim(),
        image: card.image.trim(),
        blur: Number(card.blur) || 0,
        overlay: Number(card.overlay) || 30,
        order: index,
      }));

      const res = await fetch('/api/admin/content/home/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error || 'Kayıt sırasında hata oluştu.');
      }

      const next = normalizeCards(data);
      setCards(next);
      setInitialCards(cloneCards(next));
      setSelectedType(next[0]?.studioType || 'design');
      setIsDirty(false);
      setApiStatus((prev) => ({
        ...prev,
        content: 'ok',
        updatedAt: new Date().toISOString(),
      }));
      showToast('Kartlar başarıyla güncellendi!', 'success');
    } catch (error) {
      console.error(error);
      showToast(error instanceof Error ? error.message : 'Kartlar güncellenemedi.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setCards(cloneCards(initialCards));
    setSelectedType(initialCards[0]?.studioType || 'design');
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
        onChange={handleUploadChange}
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
              ANA SAYFA STÜDYO KARTLARI
            </Badge>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-[color:var(--text)] sm:text-4xl">
                Design, Material ve Execution kartlarını yönetin
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-[color:var(--text-muted)]">
                Ana sayfadaki stüdyo seçim kartlarını tek ekrandan düzenleyin. Görsel değişimi, blur/overlay ve sıra yönetimi responsive bir arayüzle çalışır.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text-muted)]">
                {cards.length} kart
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
              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[color:var(--text-muted)]">Admin API</p>
              <p className="mt-1 text-2xl font-semibold text-[color:var(--text)]">/api/admin/content/home/services</p>
              <p className="mt-2 text-xs text-[color:var(--text-muted)]">Kartlar bu uç noktadan okunur ve kaydedilir.</p>
            </div>
            <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[color:var(--text-muted)]">Upload</p>
              <p className="mt-1 text-2xl font-semibold text-[color:var(--text)]">{uploadMeta.label}</p>
              <p className="mt-2 text-xs text-[color:var(--text-muted)]">Kapak görselleri bu hat üzerinden değiştirilir.</p>
            </div>
            <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[color:var(--text-muted)]">Seçili</p>
              <p className="mt-1 text-2xl font-semibold text-[color:var(--text)]">{selectedCard?.title || 'Yok'}</p>
              <p className="mt-2 text-xs text-[color:var(--text-muted)]">Düzenlenen stüdyo kartı.</p>
            </div>
            <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[color:var(--text-muted)]">Kayıt</p>
              <p className="mt-1 text-2xl font-semibold text-[color:var(--text)]">{isDirty ? 'Düzenlendi' : 'Temiz'}</p>
              <p className="mt-2 text-xs text-[color:var(--text-muted)]">Kaydetmeden çıkarsanız değişiklikler korunmaz.</p>
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
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {isSaving ? 'KAYDEDİLİYOR...' : 'DEĞİŞİKLİKLERİ KAYDET'}
          </Button>
        </div>
      </motion.section>

      <AdminSaveBar isVisible={isDirty} onSave={handleSave} onCancel={handleCancel} isSaving={isSaving} />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <Card className="border border-[color:var(--line)] bg-[color:var(--surface)] shadow-[var(--shadow)]">
          <CardHeader className="space-y-4 border-b border-[color:var(--line)]">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <CardTitle className="text-lg text-[color:var(--text)]">Kart Listesi</CardTitle>
                <CardDescription className="text-[color:var(--text-muted)]">
                  Ana sayfada yer alan üç kartı sıralayın ve görsellerini değiştirin.
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)]"
                  onClick={fetchCards}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Yenile
                </Button>
              </div>
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
            </div>
          </CardHeader>

          <CardContent className="space-y-4 p-5 sm:p-6">
            <AnimatePresence initial={false}>
              {cards.map((card, index) => {
                const active = card.studioType === selectedType;
                const Icon = iconMap[card.icon] || PenTool;
                return (
                  <motion.div
                    key={card.studioType}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    className={`overflow-hidden rounded-[1.75rem] border transition-all ${
                      active
                        ? 'border-[color:var(--accent)] bg-[color:var(--surface-muted)] shadow-[0_14px_35px_rgba(0,0,0,0.08)]'
                        : 'border-[color:var(--line)] bg-[color:var(--surface-muted)] hover:border-[color:var(--accent)]/40 hover:bg-[color:var(--surface)]'
                    }`}
                  >
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 border-b border-[color:var(--line)] px-4 py-3 text-left"
                      onClick={() => setSelectedType(card.studioType)}
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--accent)]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-[color:var(--text)]">{card.title}</p>
                        <p className="truncate text-xs text-[color:var(--text-muted)]">{card.description}</p>
                      </div>
                      <Badge className="border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text-muted)]">
                        Sıra {index + 1}
                      </Badge>
                    </button>

                    <div className="grid gap-4 p-4 lg:grid-cols-[220px_minmax(0,1fr)]">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedType(card.studioType);
                          triggerUpload(card.studioType);
                        }}
                        className="relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-2xl border border-dashed border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text-muted)] transition hover:border-[color:var(--accent)]/40 hover:bg-[color:var(--surface-muted)]"
                      >
                        <img
                          src={resolveStudioCardImage(card.image, card.studioType) || DEFAULT_CARDS[index]?.image}
                          alt={card.title}
                          className="h-full w-full object-cover"
                          style={{ filter: `blur(${card.blur || 0}px)` }}
                        />
                        <div
                          className="absolute inset-0"
                          style={{ background: `rgba(0,0,0,${Math.min(Math.max(card.overlay, 0), 100) / 100})` }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 text-xs uppercase tracking-[0.2em] text-white opacity-0 transition hover:bg-black/25 hover:opacity-100">
                          <Upload className="mr-2 h-4 w-4" />
                          Görseli değiştir
                        </div>
                      </button>

                      <div className="flex min-w-0 flex-col gap-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge className="border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text-muted)]">
                                {card.studioType.toUpperCase()}
                              </Badge>
                              <Badge className={active ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text-muted)]'}>
                                {active ? 'Seçili' : 'Pasif'}
                              </Badge>
                            </div>
                            <p className="text-sm leading-6 text-[color:var(--text-muted)]">
                              Kartın ana başlığı, alt metni, görseli ve efektleri burada düzenlenir.
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            className="border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                            onClick={() => {
                              setSelectedType(card.studioType);
                              triggerUpload(card.studioType);
                            }}
                          >
                            <ImageIcon className="mr-2 h-4 w-4" />
                            Medya değiştir
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            className="border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                            onClick={() => moveCard(card.studioType, -1)}
                            disabled={index === 0}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            className="border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                            onClick={() => moveCard(card.studioType, 1)}
                            disabled={index === cards.length - 1}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
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
                    Seçili kartın ana sayfada nasıl görüneceğini burada kontrol edin.
                  </CardDescription>
                </div>
                <Badge className="border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text-muted)]">
                  <Eye className="mr-2 h-3 w-3" />
                  Önizleme
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-5 sm:p-6">
              {selectedCard ? (
                <div className="overflow-hidden rounded-[1.75rem] border border-[color:var(--line)] bg-[color:var(--surface-muted)]">
                  <div className="relative aspect-[16/10] min-h-[260px] w-full overflow-hidden bg-black">
                    <img
                      src={resolveStudioCardImage(selectedCard.image, selectedCard.studioType) || selectedCard.image}
                      alt={selectedCard.title}
                      className="absolute inset-0 h-full w-full object-cover"
                      style={{ filter: `blur(${selectedCard.blur || 0}px)` }}
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: `rgba(0,0,0,${Math.min(Math.max(selectedCard.overlay, 0), 100) / 100})` }}
                    />
                    <div className="relative z-10 flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-white">
                      <span className="text-[0.65rem] uppercase tracking-[0.45em] text-white/70">
                        {selectedCard.studioType.toUpperCase()}
                      </span>
                      <h3 className="max-w-[90%] text-3xl font-semibold uppercase tracking-[0.16em] sm:text-4xl">
                        {selectedCard.title}
                      </h3>
                      <p className="max-w-[80%] text-xs uppercase tracking-[0.3em] text-white/70">
                        {selectedCard.description}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[320px] items-center justify-center rounded-[1.75rem] border border-dashed border-[color:var(--line)] bg-[color:var(--surface-muted)] text-center text-[color:var(--text-muted)]">
                  <div className="space-y-3 px-6">
                    <ImageIcon className="mx-auto h-10 w-10" />
                    <p className="text-sm">Önizleme için bir kart seçin.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border border-[color:var(--line)] bg-[color:var(--surface)] shadow-[var(--shadow)]">
            <CardHeader className="border-b border-[color:var(--line)]">
              <CardTitle className="text-lg text-[color:var(--text)]">
                {selectedCard ? selectedCard.title : 'Kart ayarları'}
              </CardTitle>
              <CardDescription className="text-[color:var(--text-muted)]">
                Başlık, alt metin ve görsel efektlerini düzenleyin.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5 p-5 sm:p-6">
              {selectedCard ? (
                <>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--text-muted)]">Başlık</p>
                      <Input
                        value={selectedCard.title}
                        onChange={(event) => updateCard(selectedCard.studioType, { title: event.target.value })}
                        placeholder="Kart başlığı"
                      />
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--text-muted)]">Alt Metin</p>
                      <Textarea
                        value={selectedCard.description}
                        onChange={(event) => updateCard(selectedCard.studioType, { description: event.target.value })}
                        placeholder="Kart açıklaması"
                        rows={3}
                      />
                    </div>
                  </div>

                  <Separator className="bg-[color:var(--line)]" />

                  <div className="space-y-4">
                    <AdminImageDropzone
                      accept="image/*"
                      aspectClassName="aspect-[16/10]"
                      buttonLabel="Görsel seç"
                      description="Bu kartın kapak görselini sürükleyip bırakın veya tıklayıp yükleyin."
                      emptySubtitle="Bu kartın ana görselini değiştirmek için dosya seçin."
                      emptyTitle="Kapak görseli"
                      onFileSelect={(file) => uploadCardImage(selectedCard.studioType, file)}
                      previewAlt={selectedCard.title}
                      previewType="image"
                      previewUrl={resolveStudioCardImage(selectedCard.image, selectedCard.studioType)}
                    />

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--text-muted)]">Blur</p>
                        <Input
                          type="number"
                          min={0}
                          max={20}
                          value={selectedCard.blur}
                          onChange={(event) => updateCard(selectedCard.studioType, { blur: Number(event.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--text-muted)]">Overlay</p>
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          value={selectedCard.overlay}
                          onChange={(event) => updateCard(selectedCard.studioType, { overlay: Number(event.target.value) })}
                        />
                      </div>
                    </div>

                    <div className="rounded-[1.5rem] border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4 text-sm text-[color:var(--text-muted)]">
                      {selectedCard.studioType.toUpperCase()} kartı için kapak, görünüm ve sıra ayarları burada yapılır.
                    </div>
                  </div>
                </>
              ) : (
                <div className="rounded-[1.5rem] border border-dashed border-[color:var(--line)] bg-[color:var(--surface-muted)] p-6 text-center text-[color:var(--text-muted)]">
                  <p className="text-sm">Düzenlemek için soldan bir kart seçin.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border border-[color:var(--line)] bg-[color:var(--surface)] shadow-[var(--shadow)]">
            <CardHeader className="border-b border-[color:var(--line)]">
              <CardTitle className="text-lg text-[color:var(--text)]">API Kontrolleri</CardTitle>
              <CardDescription className="text-[color:var(--text-muted)]">
                Content ve upload akışını buradan takip edin.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 p-5 sm:p-6">
              <div className="grid gap-3">
                <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[color:var(--text)]">Home services API</p>
                      <p className="text-xs leading-6 text-[color:var(--text-muted)]">Üç stüdyo kartı buradan okunur ve yazılır.</p>
                    </div>
                    <Badge className={contentMeta.className}>
                      <ContentStatusIcon className="mr-2 h-3 w-3" />
                      {contentMeta.label}
                    </Badge>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button asChild size="sm" variant="outline" className="border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]">
                      <Link href="/api/admin/content/home/services" target="_blank" rel="noreferrer">
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
                      <p className="text-xs leading-6 text-[color:var(--text-muted)]">Kart görselleri için kullanılır.</p>
                    </div>
                    <Badge className={uploadMeta.className}>
                      <UploadStatusIcon className="mr-2 h-3 w-3" />
                      {uploadMeta.label}
                    </Badge>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button asChild size="sm" variant="outline" className="border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]">
                      <Link href="/api/upload" target="_blank" rel="noreferrer">
                        <Eye className="mr-2 h-4 w-4" />
                        JSON
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[color:var(--text)]">Durum</p>
                      <p className="text-xs leading-6 text-[color:var(--text-muted)]">
                        Değişiklikler kaydedilmeden çıkılırsa kaybolur.
                      </p>
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
