"use client";

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowDown,
  ArrowUp,
  BadgeCheck,
  CheckCircle2,
  CloudUpload,
  Eye,
  FolderKanban,
  Image as ImageIcon,
  Loader2,
  PanelRightOpen,
  Plus,
  RefreshCw,
  Save,
  Sparkles,
  Target,
  Trash2,
  Wrench,
} from 'lucide-react';

import { useNotification } from '@/components/admin/AdminNotificationProvider';
import { AdminImageDropzone } from '@/components/admin/AdminImageDropzone';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { SLIDER_IMAGE_URLS } from '@/lib/slider-images';
import { materialProducts, materyalKategorileri, resolveMaterialCategorySlug } from '@/data/materyal-urunleri';

type TabKey = 'genel' | 'hero' | 'surec' | 'odak' | 'kategoriler' | 'urunler';

type ProductStockStatus = 'available' | 'limited' | 'made-to-order';
type ProductCtaVariant = 'request-sample' | 'get-info' | 'request-quote';

type ProductField = { label: string; value: string };
type CropState = { x: number; y: number; zoom: number };

type ProductState = {
  slug: string;
  categorySlug: string;
  brandName: string;
  title: string;
  shortInfo: string;
  sku: string;
  description: string;
  heroImage: string;
  heroCrop: CropState;
  gallery: string[];
  galleryCrops: CropState[];
  details: ProductField[];
  technicalDetails: ProductField[];
  applicationAreas: string[];
  techTags: string[];
  stockStatus: ProductStockStatus;
  stockLabel: string;
  ctaVariant: ProductCtaVariant;
  ctaLabel: string;
  filterValues: {
    'renk-tonu': string[];
    'yuzey-tipi': string[];
    'kullanim-alani': string[];
  };
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
  products: ProductState[];
};

type ProbeStatus = 'idle' | 'loading' | 'ok' | 'error';

const STOCK_STATUS_OPTIONS: Array<{ value: ProductStockStatus; label: string }> = [
  { value: 'available', label: 'Stokta' },
  { value: 'limited', label: 'Sınırlı stok' },
  { value: 'made-to-order', label: 'Siparişe özel' },
];

const CTA_VARIANT_OPTIONS: Array<{ value: ProductCtaVariant; label: string }> = [
  { value: 'request-sample', label: 'Numune İste' },
  { value: 'get-info', label: 'Bilgi Al' },
  { value: 'request-quote', label: 'Teklif Al' },
];

const TAB_ITEMS: Array<{ key: TabKey; label: string; description: string; icon: any }> = [
  { key: 'genel', label: 'Genel', description: 'Künye ve kapak görseli', icon: Wrench },
  { key: 'hero', label: 'Hero', description: 'Slider ve katman ayarları', icon: ImageIcon },
  { key: 'surec', label: 'Süreç', description: 'Malzeme hikayesi ve adımlar', icon: Wrench },
  { key: 'odak', label: 'Odak', description: 'Öne çıkan materyal özellikleri', icon: Target },
  { key: 'kategoriler', label: 'Kategoriler', description: 'Etiket ve filtre setleri', icon: FolderKanban },
  { key: 'urunler', label: 'Ürünler', description: 'Katalog ürünlerini yönet', icon: ImageIcon },
];

const cloneDepartment = (value: DepartmentState) => JSON.parse(JSON.stringify(value)) as DepartmentState;

const createEmptyProduct = (categorySlug: string): ProductState => ({
  slug: '',
  categorySlug,
  brandName: 'deqoin',
  title: '',
  shortInfo: '',
  sku: '',
  description: '',
  heroImage: SLIDER_IMAGE_URLS.material,
  heroCrop: { x: 50, y: 50, zoom: 1 },
  gallery: [SLIDER_IMAGE_URLS.material],
  galleryCrops: [{ x: 50, y: 50, zoom: 1 }],
  details: [
    { label: 'Ebat', value: '' },
    { label: 'Kalınlık', value: '' },
  ],
  technicalDetails: [
    { label: 'Menşei', value: '' },
    { label: 'Yüzey', value: '' },
  ],
  applicationAreas: [],
  techTags: [],
  stockStatus: 'available',
  stockLabel: 'Stokta',
  ctaVariant: 'request-sample',
  ctaLabel: 'Numune İste',
  filterValues: {
    'renk-tonu': [],
    'yuzey-tipi': [],
    'kullanim-alani': [],
  },
});

const joinLines = (items: string[]) => items.filter(Boolean).join('\n');

const normalizeTextLines = (value: string) =>
  value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);

const ensureUniqueGallery = (items: string[]) =>
  Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));

const normalizeCrop = (value?: Partial<CropState>): CropState => ({
  x: Math.min(100, Math.max(0, Number(value?.x ?? 50))),
  y: Math.min(100, Math.max(0, Number(value?.y ?? 50))),
  zoom: Math.min(2, Math.max(1, Number(value?.zoom ?? 1))),
});

const alignGalleryCrops = (gallery: string[], crops?: CropState[]) => {
  const next = gallery.map((_, index) => normalizeCrop(crops?.[index]));
  return next.length > 0 ? next : [normalizeCrop()];
};

const cropStyle = (crop: CropState) => ({
  objectPosition: `${crop.x}% ${crop.y}%`,
  transform: `scale(${crop.zoom})`,
  transformOrigin: 'center',
});

const parseLines = (value: string) =>
  normalizeTextLines(value);

const parsePairs = (value: string): ProductField[] =>
  value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, ...rest] = line.split(":");
      return {
        label: (label || "").trim(),
        value: rest.join(":").trim(),
      };
    })
    .filter((item) => item.label);

const serializePairs = (items: ProductField[]) =>
  items.map((item) => `${item.label}: ${item.value}`).join("\n");

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeProduct = (value: any, categorySlug: string): ProductState => {
  const seed = materialProducts.find((item) => item.slug === value?.slug && item.categorySlug === resolveMaterialCategorySlug(categorySlug))
    || materialProducts.find((item) => item.categorySlug === resolveMaterialCategorySlug(categorySlug))
    || createEmptyProduct(resolveMaterialCategorySlug(categorySlug));

  return {
    slug: value?.slug || seed.slug || slugify(value?.title || "urun"),
    categorySlug: value?.categorySlug || resolveMaterialCategorySlug(categorySlug),
    brandName: value?.brandName || seed.brandName || "",
    title: value?.title || seed.title || "",
    shortInfo: value?.shortInfo || seed.shortInfo || "",
    sku: value?.sku || seed.sku || "",
    description: value?.description || seed.description || "",
    heroImage: value?.heroImage || value?.image || seed.heroImage || SLIDER_IMAGE_URLS.material,
    heroCrop: normalizeCrop(value?.heroCrop || seed.heroCrop),
    gallery: Array.isArray(value?.gallery) && value.gallery.length > 0 ? value.gallery.filter(Boolean) : seed.gallery || [seed.heroImage],
    galleryCrops: alignGalleryCrops(
      Array.isArray(value?.gallery) && value.gallery.length > 0 ? value.gallery.filter(Boolean) : seed.gallery || [seed.heroImage],
      Array.isArray(value?.galleryCrops) ? value.galleryCrops : undefined,
    ),
    details: Array.isArray(value?.details) && value.details.length > 0 ? value.details : seed.details,
    technicalDetails:
      Array.isArray(value?.technicalDetails) && value.technicalDetails.length > 0
        ? value.technicalDetails
        : seed.technicalDetails,
    applicationAreas:
      Array.isArray(value?.applicationAreas) && value.applicationAreas.length > 0
        ? value.applicationAreas
        : seed.applicationAreas,
    techTags: Array.isArray(value?.techTags) && value.techTags.length > 0 ? value.techTags : seed.techTags,
    stockStatus: value?.stockStatus || seed.stockStatus || 'available',
    stockLabel: value?.stockLabel || seed.stockLabel || 'Stokta',
    ctaVariant: value?.ctaVariant || seed.ctaVariant || 'request-sample',
    ctaLabel: value?.ctaLabel || seed.ctaLabel || 'Numune İste',
    filterValues: {
      'renk-tonu': Array.isArray(value?.filterValues?.['renk-tonu']) ? value.filterValues['renk-tonu'] : seed.filterValues['renk-tonu'],
      'yuzey-tipi': Array.isArray(value?.filterValues?.['yuzey-tipi']) ? value.filterValues['yuzey-tipi'] : seed.filterValues['yuzey-tipi'],
      'kullanim-alani': Array.isArray(value?.filterValues?.['kullanim-alani']) ? value.filterValues['kullanim-alani'] : seed.filterValues['kullanim-alani'],
    },
  };
};

const createEmptyDepartmentProducts = (categorySlug: string) => {
  const resolved = resolveMaterialCategorySlug(categorySlug);
  return materialProducts.filter((item) => item.categorySlug === resolved).map((item) => normalizeProduct(item, resolved));
};

const makeSeed = (slug: string): DepartmentState => {
  const matched = materyalKategorileri.find((item) => item.slug === slug);

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
    products: createEmptyDepartmentProducts(slug),
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
    products: Array.isArray(value?.products) && value.products.length > 0
      ? value.products.map((item: any) => normalizeProduct(item, slug))
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
  const [selectedProductIndex, setSelectedProductIndex] = useState(0);
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState(0);
  const [draggedGalleryIndex, setDraggedGalleryIndex] = useState<number | null>(null);
  const [productDraft, setProductDraft] = useState<ProductState>(() => createEmptyProduct(slug));
  const [isProductDrawerOpen, setIsProductDrawerOpen] = useState(false);

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
    const nextProduct = department.products[selectedProductIndex] || department.products[0] || createEmptyProduct(slug);
    setProductDraft(JSON.parse(JSON.stringify(nextProduct)) as ProductState);
  }, [department.products, selectedProductIndex, slug]);

  useEffect(() => {
    setSelectedGalleryIndex((prev) => Math.min(prev, Math.max(0, productDraft.gallery.length - 1)));
  }, [productDraft.gallery.length]);

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
      showToast('Materyal kartı kaydedildi.', 'success');
    } catch (error) {
      console.error('Department save error:', error);
      showToast(error instanceof Error ? error.message : 'Kayıt başarısız.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const persistProducts = async (nextProducts: ProductState[]) => {
    const nextDepartment = cloneDepartment(department);
    nextDepartment.products = nextProducts;
    setDepartment(nextDepartment);
    setIsDirty(true);
    await saveDepartment(nextDepartment);
  };

  const addProduct = async () => {
    const nextIndex = department.products.length;
    setSelectedProductIndex(nextIndex);
    setProductDraft(createEmptyProduct(slug));
    setIsProductDrawerOpen(true);
  };

  const deleteProduct = async (index: number) => {
    const nextProducts = department.products.filter((_, current) => current !== index);
    const nextIndex = Math.max(0, index - 1);
    setSelectedProductIndex(nextIndex);
    setIsProductDrawerOpen(false);
    await persistProducts(nextProducts);
  };

  const openProductDrawer = (index: number) => {
    setSelectedProductIndex(index);
    setProductDraft(JSON.parse(JSON.stringify(department.products[index])) as ProductState);
    setSelectedGalleryIndex(0);
    setIsProductDrawerOpen(true);
  };

  const moveGalleryImage = (direction: 'up' | 'down', index: number) => {
    setProductDraft((draft) => {
      const next = [...draft.gallery];
      const nextCrops = [...draft.galleryCrops];
      const target = direction === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= next.length) return draft;
      [next[index], next[target]] = [next[target], next[index]];
      [nextCrops[index], nextCrops[target]] = [nextCrops[target], nextCrops[index]];
      return {
        ...draft,
        gallery: next,
        galleryCrops: nextCrops,
        heroImage: next[0] || draft.heroImage,
        heroCrop: nextCrops[0] || draft.heroCrop,
      };
    });
  };

  const removeGalleryImage = (index: number) => {
    setProductDraft((draft) => {
      const next = draft.gallery.filter((_, current) => current !== index);
      const nextCrops = draft.galleryCrops.filter((_, current) => current !== index);
      const nextGallery = next.length > 0 ? next : [draft.heroImage];
      const nextGalleryCrops = next.length > 0 ? nextCrops.length > 0 ? nextCrops : [normalizeCrop()] : [normalizeCrop()];
      return {
        ...draft,
        gallery: nextGallery,
        galleryCrops: alignGalleryCrops(nextGallery, nextGalleryCrops),
        heroImage: nextGallery[0],
        heroCrop: nextGalleryCrops[0] || draft.heroCrop,
      };
    });
  };

  const appendGalleryImage = async (file: File) => {
    const url = await uploadFile(file);
    setProductDraft((draft) => {
      const nextGallery = ensureUniqueGallery([...draft.gallery, url]);
      const nextCrops = alignGalleryCrops(nextGallery, draft.galleryCrops);
      return {
        ...draft,
        heroImage: draft.heroImage || url,
        gallery: nextGallery,
        galleryCrops: nextCrops,
        heroCrop: nextCrops[0] || draft.heroCrop,
      };
    });
    setSelectedGalleryIndex((prev) => Math.min(prev + 1, Math.max(0, productDraft.gallery.length)));
  };

  const reorderGallery = (fromIndex: number, toIndex: number) => {
    setProductDraft((draft) => {
      if (fromIndex === toIndex) return draft;
      if (fromIndex < 0 || fromIndex >= draft.gallery.length) return draft;
      if (toIndex < 0 || toIndex >= draft.gallery.length) return draft;

      const nextGallery = [...draft.gallery];
      const nextCrops = [...draft.galleryCrops];
      const [movedImage] = nextGallery.splice(fromIndex, 1);
      const [movedCrop] = nextCrops.splice(fromIndex, 1);
      nextGallery.splice(toIndex, 0, movedImage);
      nextCrops.splice(toIndex, 0, movedCrop || normalizeCrop());

      const nextSelected = selectedGalleryIndex === fromIndex
        ? toIndex
        : selectedGalleryIndex === toIndex
          ? fromIndex
          : selectedGalleryIndex;

      setSelectedGalleryIndex(nextSelected);

      return {
        ...draft,
        gallery: nextGallery,
        galleryCrops: nextCrops,
        heroImage: nextGallery[0] || draft.heroImage,
        heroCrop: nextCrops[0] || draft.heroCrop,
      };
    });
  };

  const updateCrop = (target: 'hero' | 'gallery', updater: (crop: CropState) => CropState) => {
    setProductDraft((draft) => {
      if (target === 'hero') {
        return { ...draft, heroCrop: updater(draft.heroCrop) };
      }

      const nextCrops = draft.galleryCrops.map((crop, index) =>
        index === selectedGalleryIndex ? updater(crop) : crop,
      );

      return {
        ...draft,
        galleryCrops: nextCrops,
        heroCrop: selectedGalleryIndex === 0 ? nextCrops[0] || draft.heroCrop : draft.heroCrop,
      };
    });
  };

  const saveProductDraft = async () => {
    const nextHeroImage = productDraft.gallery[0] || productDraft.heroImage || SLIDER_IMAGE_URLS.material;
    const nextGallery = ensureUniqueGallery([nextHeroImage, ...productDraft.gallery]);
    const nextGalleryCrops = alignGalleryCrops(nextGallery, productDraft.galleryCrops);
    const nextProduct: ProductState = {
      ...productDraft,
      slug: slugify(productDraft.slug || productDraft.title || `urun-${department.products.length + 1}`),
      categorySlug: slug,
      brandName: productDraft.brandName || 'deqoin',
      heroImage: nextGallery[0] || nextHeroImage,
      heroCrop: nextGalleryCrops[0] || normalizeCrop(productDraft.heroCrop),
      gallery: nextGallery,
      galleryCrops: nextGalleryCrops,
      details: productDraft.details.filter((item) => item.label || item.value),
      technicalDetails: productDraft.technicalDetails.filter((item) => item.label || item.value),
      applicationAreas: productDraft.applicationAreas,
      techTags: productDraft.techTags,
      filterValues: productDraft.filterValues,
      stockStatus: productDraft.stockStatus,
      stockLabel: productDraft.stockLabel,
      ctaVariant: productDraft.ctaVariant,
      ctaLabel: productDraft.ctaLabel,
    };

    const nextProducts = [...department.products];
    if (department.products[selectedProductIndex]) {
      nextProducts[selectedProductIndex] = nextProduct;
    } else {
      nextProducts.push(nextProduct);
      setSelectedProductIndex(nextProducts.length - 1);
    }

    setProductDraft(JSON.parse(JSON.stringify(nextProduct)) as ProductState);
    await persistProducts(nextProducts);
    showToast('Ürün kaydedildi.', 'success');
    setIsProductDrawerOpen(false);
  };

  const handleCancel = () => {
    setDepartment(cloneDepartment(initialDepartment));
    setIsDirty(false);
    showToast('Değişiklikler geri alındı.', 'info');
  };

  const currentHero = department.image;
  const updatedLabel = apiStatus.updatedAt ? formatDate(apiStatus.updatedAt) : 'Henüz yok';
  const activeProduct = department.products[selectedProductIndex] || null;

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
              MATERYAL DETAYLI EDİTÖR
            </Badge>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-[color:var(--text)] sm:text-4xl">
                {department.title}
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-[color:var(--text-muted)]">
                Bu kartın yayın katmanlarını tek ekranda düzenleyin. Hero, süreç, odak ve kategori
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
              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[color:var(--text-muted)]">Odak</p>
              <p className="mt-1 text-2xl font-semibold text-[color:var(--text)]">{department.focusAreas.length}</p>
              <p className="mt-2 text-xs text-[color:var(--text-muted)]">Odak alanı</p>
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

            {activeTab === 'kategoriler' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-semibold text-[color:var(--text)]">Kategoriler</h3>
                    <p className="text-sm text-[color:var(--text-muted)]">Materyal kart etiketleri.</p>
                  </div>
                  <Button
                    type="button"
                    className="bg-[color:var(--accent)] text-[color:var(--text-inverse)] hover:bg-[color:var(--accent-soft)]"
                    onClick={() => mutateDepartment((draft) => draft.categories.push({ label: 'Yeni Kategori', value: 'NEW' }))}
                  >
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

            {activeTab === 'urunler' && (
              <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
                <Card className="border border-[color:var(--line)] bg-[color:var(--surface-muted)] shadow-none">
                  <CardHeader className="border-b border-[color:var(--line)]">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <CardTitle className="text-base text-[color:var(--text)]">Ürün Listesi</CardTitle>
                        <CardDescription className="text-[color:var(--text-muted)]">
                          Kategoriye bağlı katalog ürünleri
                        </CardDescription>
                      </div>
                      <Button
                        type="button"
                        className="bg-[color:var(--accent)] text-[color:var(--text-inverse)] hover:bg-[color:var(--accent-soft)]"
                        onClick={addProduct}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Yeni
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 p-4">
                    {department.products.length > 0 ? (
                      department.products.map((item, index) => {
                        const active = index === selectedProductIndex;
                        return (
                          <button
                            key={`${item.slug || item.title}-${index}`}
                            type="button"
                            onClick={() => openProductDrawer(index)}
                            className={`w-full rounded-[1.25rem] border p-4 text-left transition-colors ${
                              active
                                ? 'border-[color:var(--accent)] bg-[color:var(--surface)]'
                                : 'border-[color:var(--line)] bg-[color:var(--surface)] hover:bg-[color:var(--surface-muted)]'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="space-y-1">
                                <p className="text-sm font-semibold text-[color:var(--text)]">{item.title || 'İsimsiz ürün'}</p>
                                <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--text-muted)]">
                                  {item.brandName || 'Markasız'} / {item.sku || 'SKU yok'}
                                </p>
                              </div>
                              <Badge variant="outline" className="border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text-muted)]">
                                {item.stockLabel}
                              </Badge>
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <div className="rounded-[1.5rem] border border-dashed border-[color:var(--line)] bg-[color:var(--surface)] p-6 text-center text-sm text-[color:var(--text-muted)]">
                        Henüz ürün yok.
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <Card className="overflow-hidden border border-[color:var(--line)] bg-[color:var(--surface)] shadow-[var(--shadow)]">
                    <CardHeader className="border-b border-[color:var(--line)]">
                      <CardTitle className="text-base text-[color:var(--text)]">Seçili Ürün</CardTitle>
                      <CardDescription className="text-[color:var(--text-muted)]">
                        Detaylar ayrı drawer içinde açılır. Buradan hızlı özet ve aksiyon görün.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 p-5 sm:p-6">
                      {activeProduct ? (
                        <>
                          <div className="overflow-hidden rounded-[1.5rem] border border-[color:var(--line)] bg-[color:var(--surface-muted)]">
                            <img
                              src={activeProduct.heroImage}
                              alt={activeProduct.title}
                              className="h-56 w-full object-cover"
                            />
                          </div>
                          <div className="space-y-2">
                            <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--text-muted)]">
                              {activeProduct.brandName || 'deqoin'} / {activeProduct.sku || 'SKU yok'}
                            </p>
                            <h3 className="text-2xl font-semibold tracking-tight text-[color:var(--text)]">
                              {activeProduct.title || 'İsimsiz ürün'}
                            </h3>
                            <p className="text-sm leading-7 text-[color:var(--text-muted)]">
                              {activeProduct.shortInfo || 'Kısa bilgi tanımlanmamış.'}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {activeProduct.techTags.slice(0, 4).map((tag) => (
                              <Badge key={tag} variant="outline" className="border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text-muted)]">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="grid gap-2 sm:grid-cols-1">
                            <Badge className="justify-center border border-[color:var(--line)] bg-[color:var(--surface-muted)] px-3 py-2 text-[color:var(--text-muted)]">
                              {activeProduct.stockLabel}
                            </Badge>
                          </div>
                          <div className="grid gap-3 sm:grid-cols-2">
                            <Button
                              type="button"
                              className="bg-[color:var(--accent)] text-[color:var(--text-inverse)] hover:bg-[color:var(--accent-soft)]"
                              onClick={() => openProductDrawer(selectedProductIndex)}
                            >
                              <PanelRightOpen className="mr-2 h-4 w-4" />
                              Ürünü Düzenle
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              className="border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)]"
                              onClick={addProduct}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Yeni Ürün
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className="space-y-4">
                          <div className="rounded-[1.5rem] border border-dashed border-[color:var(--line)] bg-[color:var(--surface-muted)] p-8 text-center">
                            <p className="text-sm text-[color:var(--text-muted)]">Henüz seçili ürün yok.</p>
                            <p className="mt-2 text-xs leading-5 text-[color:var(--text-muted)]">
                              Bir ürün seçin veya yeni bir ürün oluşturun. Form drawer içinde açılacak.
                            </p>
                          </div>
                          <Button
                            type="button"
                            className="w-full bg-[color:var(--accent)] text-[color:var(--text-inverse)] hover:bg-[color:var(--accent-soft)]"
                            onClick={addProduct}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Ürün Oluştur
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border border-[color:var(--line)] bg-[color:var(--surface-muted)] shadow-none">
                    <CardHeader className="border-b border-[color:var(--line)]">
                      <CardTitle className="text-base text-[color:var(--text)]">Hızlı Not</CardTitle>
                      <CardDescription className="text-[color:var(--text-muted)]">
                        Ürün düzenleme formu drawer içinde açılır. Görsel yükleme, galeri sıralama ve teknik alanlar tek yerde yönetilir.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-5 text-sm leading-7 text-[color:var(--text-muted)] sm:p-6">
                      {department.products.length > 0
                        ? 'Liste solda kalır, detay formu sağdan kayan drawer ile açılır. Bu yapı katalog yönetimini hızlı ve daha az dağınık hale getirir.'
                        : 'İlk ürünü oluşturduktan sonra detay formu drawer üzerinden düzenleyebilirsiniz.'}
                    </CardContent>
                  </Card>
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

      <Dialog open={isProductDrawerOpen} onOpenChange={setIsProductDrawerOpen} placement="right">
        <DialogContent className="h-full max-h-none w-full max-w-[1180px] rounded-none rounded-l-[1.75rem] border-l border-white/10 bg-[color:var(--surface)]">
          <DialogHeader className="px-6 py-5">
            <div className="flex flex-wrap items-center gap-3">
              <DialogTitle className="text-xl tracking-[0.14em]">
                {selectedProductIndex < department.products.length ? 'Ürün Düzenleyici' : 'Yeni Ürün'}
              </DialogTitle>
              <Badge variant="outline" className="border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text-muted)]">
                {productDraft.brandName || 'deqoin'} / {productDraft.sku || 'SKU yok'}
              </Badge>
            </div>
            <DialogDescription>
              Ürün görselini, galeri sırasını ve teknik bilgileri drawer içinde tek akışta düzenleyin. Stok sayısı kullanılmaz; sadece durum ve açıklama alanları vardır.
            </DialogDescription>
          </DialogHeader>

          <DialogBody className="max-h-none px-6 py-6">
            <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
              <div className="space-y-6">
                <Card className="border border-[color:var(--line)] bg-[color:var(--surface-muted)] shadow-none">
                  <CardHeader className="border-b border-[color:var(--line)]">
                    <CardTitle className="text-base text-[color:var(--text)]">Ana Görsel</CardTitle>
                    <CardDescription className="text-[color:var(--text-muted)]">
                      Ürün kartında öne çıkacak hero görsel ve kırpma ayarı.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 p-4">
                    <AdminImageDropzone
                      aspectClassName="aspect-[4/3]"
                      accept="image/*"
                      buttonLabel="Görsel yükle"
                      description="Hero görseli ekleyin veya değiştirin."
                      emptySubtitle="Ana görseli sürükleyin ya da seçin."
                      emptyTitle="Ana görsel yok"
                      previewAlt={productDraft.title || 'Ürün görseli'}
                      previewUrl={productDraft.heroImage}
                      previewStyle={cropStyle(productDraft.heroCrop)}
                      title="Hero Görsel"
                      onFileSelect={async (file) => {
                        const url = await uploadFile(file);
                        setProductDraft((draft) => ({
                          ...draft,
                          heroImage: url,
                          gallery: ensureUniqueGallery([url, ...draft.gallery.filter(Boolean)]),
                          galleryCrops: alignGalleryCrops([url, ...draft.gallery.filter(Boolean)], draft.galleryCrops),
                          heroCrop: normalizeCrop(),
                        }));
                      }}
                    />
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="space-y-2">
                        <label className="text-[0.65rem] font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">
                          Kırpma X
                        </label>
                        <Input
                          type="range"
                          min={0}
                          max={100}
                          value={productDraft.heroCrop.x}
                          onChange={(event) =>
                            updateCrop('hero', (crop) => ({
                              ...crop,
                              x: Number(event.target.value),
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[0.65rem] font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">
                          Kırpma Y
                        </label>
                        <Input
                          type="range"
                          min={0}
                          max={100}
                          value={productDraft.heroCrop.y}
                          onChange={(event) =>
                            updateCrop('hero', (crop) => ({
                              ...crop,
                              y: Number(event.target.value),
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[0.65rem] font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">
                          Zoom
                        </label>
                        <Input
                          type="range"
                          min={1}
                          max={2}
                          step={0.01}
                          value={productDraft.heroCrop.zoom}
                          onChange={(event) =>
                            updateCrop('hero', (crop) => ({
                              ...crop,
                              zoom: Number(event.target.value),
                            }))
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-[color:var(--line)] bg-[color:var(--surface-muted)] shadow-none">
                  <CardHeader className="border-b border-[color:var(--line)]">
                    <CardTitle className="text-base text-[color:var(--text)]">Galeri</CardTitle>
                    <CardDescription className="text-[color:var(--text-muted)]">
                      Sürükle-bırak ile sıralayın, kapak seçin ve seçili görseli kırpın.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 p-4">
                    {productDraft.gallery.length > 0 ? (
                      productDraft.gallery.map((image, index) => (
                        <div
                          key={`${image}-${index}`}
                          draggable
                          onDragStart={() => setDraggedGalleryIndex(index)}
                          onDragOver={(event) => event.preventDefault()}
                          onDrop={(event) => {
                            event.preventDefault();
                            if (draggedGalleryIndex === null) return;
                            reorderGallery(draggedGalleryIndex, index);
                            setDraggedGalleryIndex(null);
                          }}
                          onDragEnd={() => setDraggedGalleryIndex(null)}
                          className={`overflow-hidden rounded-[1.25rem] border bg-[color:var(--surface)] transition-colors ${
                            selectedGalleryIndex === index
                              ? 'border-[color:var(--accent)]'
                              : 'border-[color:var(--line)]'
                          }`}
                        >
                          <div className="relative aspect-[4/3] overflow-hidden">
                            <img
                              src={image}
                              alt={`${productDraft.title || 'Ürün'} görsel ${index + 1}`}
                              className="h-full w-full object-cover"
                              style={cropStyle(productDraft.galleryCrops[index] || normalizeCrop())}
                            />
                            {index === 0 && (
                              <div className="absolute left-3 top-3 rounded-full border border-[color:var(--accent)]/20 bg-[color:var(--surface)]/90 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-[color:var(--accent)]">
                                Ana görsel
                              </div>
                            )}
                            <button
                              type="button"
                              className="absolute inset-0"
                              onClick={() => setSelectedGalleryIndex(index)}
                              aria-label={`Görsel ${index + 1} seç`}
                            />
                          </div>
                          <div className="flex flex-wrap items-center justify-between gap-2 p-3">
                            <div className="space-y-1">
                              <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--text-muted)]">Görsel {index + 1}</p>
                              {selectedGalleryIndex === index && (
                                <p className="text-[0.65rem] font-medium uppercase tracking-[0.24em] text-[color:var(--accent)]">
                                  Seçili
                                </p>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-9 border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)]"
                                onClick={() =>
                                  setProductDraft((draft) => {
                                    const nextGallery = ensureUniqueGallery([image, ...draft.gallery.filter((_, current) => current !== index)]);
                                    const nextCrops = alignGalleryCrops(nextGallery, draft.galleryCrops);
                                    const selectedCrop = draft.galleryCrops[index] || normalizeCrop();
                                    return {
                                      ...draft,
                                      heroImage: image,
                                      heroCrop: selectedCrop,
                                      gallery: nextGallery,
                                      galleryCrops: nextCrops,
                                    };
                                  })
                                }
                              >
                                Kapak Yap
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)]"
                                onClick={() => moveGalleryImage('up', index)}
                                disabled={index === 0}
                              >
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)]"
                                onClick={() => moveGalleryImage('down', index)}
                                disabled={index === productDraft.gallery.length - 1}
                              >
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 border-rose-500/20 bg-rose-500/10 text-rose-700 hover:bg-rose-500 hover:text-white dark:text-rose-300"
                                onClick={() => removeGalleryImage(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-[1.25rem] border border-dashed border-[color:var(--line)] bg-[color:var(--surface)] p-6 text-center text-sm text-[color:var(--text-muted)]">
                        Henüz galeri görseli yok.
                      </div>
                    )}

                    <AdminImageDropzone
                      aspectClassName="aspect-[16/10]"
                      accept="image/*"
                      buttonLabel="Galeri görseli ekle"
                      description="Yeni görsel yükleyin. Sıra aşağıda listede tutulur."
                      emptySubtitle="Galeriye yeni görsel yükleyin."
                      emptyTitle="Yeni galeri görseli"
                      title="Galeri Görseli Ekle"
                      onFileSelect={appendGalleryImage}
                    />

                    {productDraft.gallery.length > 0 && (
                      <div className="rounded-[1.25rem] border border-[color:var(--line)] bg-[color:var(--surface)] p-4">
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-[color:var(--text)]">Seçili Görsel Kırpma</p>
                            <p className="text-xs text-[color:var(--text-muted)]">
                              Görsel {selectedGalleryIndex + 1} için odak ve zoom ayarı.
                            </p>
                          </div>
                          <Badge variant="outline" className="border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text-muted)]">
                            {selectedGalleryIndex === 0 ? 'Kapak' : 'Galeri'}
                          </Badge>
                        </div>

                        <div className="space-y-3">
                          <div className="space-y-2">
                            <label className="text-[0.65rem] font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">X</label>
                            <Input
                              type="range"
                              min={0}
                              max={100}
                              value={productDraft.galleryCrops[selectedGalleryIndex]?.x ?? 50}
                              onChange={(event) =>
                                updateCrop('gallery', (crop) => ({
                                  ...crop,
                                  x: Number(event.target.value),
                                }))
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[0.65rem] font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">Y</label>
                            <Input
                              type="range"
                              min={0}
                              max={100}
                              value={productDraft.galleryCrops[selectedGalleryIndex]?.y ?? 50}
                              onChange={(event) =>
                                updateCrop('gallery', (crop) => ({
                                  ...crop,
                                  y: Number(event.target.value),
                                }))
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[0.65rem] font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">Zoom</label>
                            <Input
                              type="range"
                              min={1}
                              max={2}
                              step={0.01}
                              value={productDraft.galleryCrops[selectedGalleryIndex]?.zoom ?? 1}
                              onChange={(event) =>
                                updateCrop('gallery', (crop) => ({
                                  ...crop,
                                  zoom: Number(event.target.value),
                                }))
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="border border-[color:var(--line)] bg-[color:var(--surface-muted)] shadow-none">
                  <CardHeader className="border-b border-[color:var(--line)]">
                    <CardTitle className="text-base text-[color:var(--text)]">Temel Bilgiler</CardTitle>
                    <CardDescription className="text-[color:var(--text-muted)]">
                      Katalog kartında ve PDP’de görünen çekirdek alanlar.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 p-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">Marka</label>
                        <Input
                          value={productDraft.brandName}
                          onChange={(event) => setProductDraft((draft) => ({ ...draft, brandName: event.target.value }))}
                          className="h-11 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                          placeholder="deqoin"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">SKU</label>
                        <Input
                          value={productDraft.sku}
                          onChange={(event) => setProductDraft((draft) => ({ ...draft, sku: event.target.value }))}
                          className="h-11 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                          placeholder="AYD-117"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">Başlık</label>
                        <Input
                          value={productDraft.title}
                          onChange={(event) => setProductDraft((draft) => ({ ...draft, title: event.target.value }))}
                          className="h-11 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                          placeholder="Hokasu Lineer"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">Slug</label>
                        <Input
                          value={productDraft.slug}
                          onChange={(event) => setProductDraft((draft) => ({ ...draft, slug: event.target.value }))}
                          className="h-11 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                          placeholder="hokasu-lineer"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">Kısa Bilgi</label>
                        <Input
                          value={productDraft.shortInfo}
                          onChange={(event) => setProductDraft((draft) => ({ ...draft, shortInfo: event.target.value }))}
                          className="h-11 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                          placeholder="Lineer çözüm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">Kategori</label>
                        <Input
                          value={productDraft.categorySlug}
                          onChange={(event) => setProductDraft((draft) => ({ ...draft, categorySlug: event.target.value }))}
                          className="h-11 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                          placeholder={slug}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">Stok Durumu</label>
                        <Select
                          value={productDraft.stockStatus}
                          onChange={(event) =>
                            setProductDraft((draft) => ({
                              ...draft,
                              stockStatus: event.target.value as ProductStockStatus,
                            }))
                          }
                        >
                          {STOCK_STATUS_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">Stok Etiketi</label>
                        <Input
                          value={productDraft.stockLabel}
                          onChange={(event) => setProductDraft((draft) => ({ ...draft, stockLabel: event.target.value }))}
                          className="h-11 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                          placeholder="Stokta"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">CTA Tipi</label>
                        <Select
                          value={productDraft.ctaVariant}
                          onChange={(event) =>
                            setProductDraft((draft) => ({
                              ...draft,
                              ctaVariant: event.target.value as ProductCtaVariant,
                            }))
                          }
                        >
                          {CTA_VARIANT_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">CTA Etiketi</label>
                        <Input
                          value={productDraft.ctaLabel}
                          onChange={(event) => setProductDraft((draft) => ({ ...draft, ctaLabel: event.target.value }))}
                          className="h-11 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                          placeholder="Numune İste"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">Açıklama</label>
                      <Textarea
                        value={productDraft.description}
                        onChange={(event) => setProductDraft((draft) => ({ ...draft, description: event.target.value }))}
                        rows={6}
                        className="min-h-40 rounded-[1.5rem] border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                        placeholder="Ürünün ne olduğunu ve nerede kullanıldığını doğrudan yazın."
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="grid gap-6 xl:grid-cols-2">
                  <Card className="border border-[color:var(--line)] bg-[color:var(--surface-muted)] shadow-none">
                    <CardHeader className="border-b border-[color:var(--line)]">
                      <CardTitle className="text-base text-[color:var(--text)]">Özellikler</CardTitle>
                      <CardDescription className="text-[color:var(--text-muted)]">
                        Her satır `Etiket: Değer` formatında olmalı.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 p-4">
                      <div className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">Temel Özellikler</label>
                        <Textarea
                          value={serializePairs(productDraft.details)}
                          onChange={(event) => setProductDraft((draft) => ({ ...draft, details: parsePairs(event.target.value) }))}
                          rows={8}
                          className="min-h-36 rounded-[1.5rem] border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                          placeholder={'Ebat: 120 x 60 cm\nKalınlık: 18 mm\nMenşei: İtalya'}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">Teknik Detaylar</label>
                        <Textarea
                          value={serializePairs(productDraft.technicalDetails)}
                          onChange={(event) => setProductDraft((draft) => ({ ...draft, technicalDetails: parsePairs(event.target.value) }))}
                          rows={8}
                          className="min-h-36 rounded-[1.5rem] border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                          placeholder={'CRI: 90+\nKurulum: Gömme / yüzeye\nBakım: Nemli bez ile'}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-[color:var(--line)] bg-[color:var(--surface-muted)] shadow-none">
                    <CardHeader className="border-b border-[color:var(--line)]">
                      <CardTitle className="text-base text-[color:var(--text)]">Etiketler ve Filtreler</CardTitle>
                      <CardDescription className="text-[color:var(--text-muted)]">
                        Liste görünümü ve filtre sistemi için kısa değerler.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 p-4">
                      <div className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">Teknik Etiketler</label>
                        <Textarea
                          value={joinLines(productDraft.techTags)}
                          onChange={(event) => setProductDraft((draft) => ({ ...draft, techTags: parseLines(event.target.value) }))}
                          rows={4}
                          className="min-h-28 rounded-[1.5rem] border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                          placeholder={'Lineer\n3000K\nDim'}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">Kullanım Alanları</label>
                        <Textarea
                          value={joinLines(productDraft.applicationAreas)}
                          onChange={(event) => setProductDraft((draft) => ({ ...draft, applicationAreas: parseLines(event.target.value) }))}
                          rows={4}
                          className="min-h-28 rounded-[1.5rem] border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                          placeholder={'Koridor\nMutfak\nGaleri duvarı'}
                        />
                      </div>

                      <div className="grid gap-4">
                        {([
                          ['renk-tonu', 'Renk Tonu'],
                          ['yuzey-tipi', 'Yüzey Tipi'],
                          ['kullanim-alani', 'Kullanım Alanı'],
                        ] as const).map(([key, label]) => (
                          <div key={key} className="space-y-2">
                            <label className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">{label}</label>
                            <Textarea
                              value={joinLines(productDraft.filterValues[key])}
                              onChange={(event) =>
                                setProductDraft((draft) => ({
                                  ...draft,
                                  filterValues: {
                                    ...draft.filterValues,
                                    [key]: parseLines(event.target.value),
                                  },
                                }))
                              }
                              rows={3}
                              className="min-h-24 rounded-[1.5rem] border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                              placeholder="Açık ton, nötr"
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex flex-col gap-3 border-t border-[color:var(--line)] pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-[color:var(--text-muted)]">
                    {selectedProductIndex < department.products.length
                      ? 'Mevcut ürün güncellenecek.'
                      : 'Yeni ürün kaydedildiğinde katalog listesine eklenecek.'}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {selectedProductIndex < department.products.length && (
                      <Button
                        type="button"
                        variant="outline"
                        className="border-rose-500/20 bg-rose-500/10 text-rose-700 hover:bg-rose-500 hover:text-white dark:text-rose-300"
                        onClick={async () => {
                          if (window.confirm('Bu ürünü silmek istiyor musunuz?')) {
                            await deleteProduct(selectedProductIndex);
                          }
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Sil
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      className="border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)]"
                      onClick={() => setIsProductDrawerOpen(false)}
                    >
                      Vazgeç
                    </Button>
                    <Button
                      type="button"
                      className="bg-[color:var(--accent)] text-[color:var(--text-inverse)] hover:bg-[color:var(--accent-soft)]"
                      onClick={saveProductDraft}
                      disabled={isSaving}
                    >
                      {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                      Kaydet
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </DialogBody>
        </DialogContent>
      </Dialog>
    </div>
  );
}
