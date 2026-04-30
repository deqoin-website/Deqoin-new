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
  FileText,
  Filter,
  FolderKanban,
  Image as ImageIcon,
  Layers3,
  LayoutGrid,
  Loader2,
  Package2,
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

type TabKey = 'genel' | 'hero' | 'surec' | 'odak' | 'kategoriler' | 'urunler' | 'projeler';

type DepartmentProcess = { title: string; desc: string };
type DepartmentFocus = { title: string; icon: string; desc: string };
type DepartmentCategory = { label: string; value: string };
type DepartmentProduct = {
  title: string;
  image: string;
  category: string;
  desc: string;
  price: string;
  link: string;
};

type DepartmentForm = {
  slug: string;
  title: string;
  sideLabel: string;
  description: string;
  image: string;
  mediaType: 'image' | 'video';
  heroBlur: number;
  heroOverlay: number;
  sliderImages: string[];
  process: DepartmentProcess[];
  focusAreas: DepartmentFocus[];
  categories: DepartmentCategory[];
  products: DepartmentProduct[];
};

type ProjectRecord = {
  _id: string;
  title: string;
  label?: string;
  client?: string;
  year?: string;
  area?: string;
  coverImage?: string;
  categories?: string[];
  publishTargets?: {
    designStudio?: boolean;
    materialStudio?: boolean;
    executionStudio?: boolean;
  };
  updatedAt?: string;
  createdAt?: string;
};

type ProbeStatus = 'idle' | 'loading' | 'ok' | 'error';

const DESIGN_SLUGS = [
  'mimarlik',
  'ic-mimarlik',
  'restorasyon',
  'peyzaj-mimarligi',
  'insaat-muhendisligi',
  'elektrik-elektronik-muhendisligi',
];

const MATERIAL_SLUGS = ['mobilya', 'aydinlatma', 'italyan-sivalar', 'sanatsal-calismalar', 'tugla-ve-tas'];
const EXECUTION_SLUGS = ['insaat-ekipleri', 'siva-ve-alci-ekipleri', 'boya-ekipleri', 'duvar-sanatcilari', 'ressamlar', 'heykeltiraslar'];

const TAB_ITEMS: Array<{ key: TabKey; label: string; icon: typeof LayoutGrid; description: string }> = [
  { key: 'genel', label: 'Genel', icon: LayoutGrid, description: 'Künyeyi ve ana görseli düzenle' },
  { key: 'hero', label: 'Hero', icon: ImageIcon, description: 'Blurları ve slider görsellerini ayarla' },
  { key: 'surec', label: 'Süreç', icon: Wrench, description: 'İş akışı adımlarını yönetin' },
  { key: 'odak', label: 'Odak', icon: Target, description: 'Odak alanları ve ikonlar' },
  { key: 'kategoriler', label: 'Kategoriler', icon: Filter, description: 'Kategori etiketlerini düzenle' },
  { key: 'urunler', label: 'Ürünler', icon: Package2, description: 'Departman ürünlerini yönetin' },
  { key: 'projeler', label: 'Projeler', icon: FolderKanban, description: 'Bu stüdyoya bağlı projeler' },
];

const makeDepartmentSeed = (slug: string): DepartmentForm => ({
  slug,
  title: slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
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
  products: [],
});

const cloneDepartment = (value: DepartmentForm) => JSON.parse(JSON.stringify(value)) as DepartmentForm;

const getProjectTarget = (slug: string) => {
  if (DESIGN_SLUGS.includes(slug)) return 'designStudio';
  if (MATERIAL_SLUGS.includes(slug)) return 'materialStudio';
  if (EXECUTION_SLUGS.includes(slug)) return 'executionStudio';
  return 'designStudio';
};

const formatDate = (value?: string) => {
  if (!value) return 'Tarih yok';
  return new Date(value).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
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
      label: 'Kontrol ediliyor',
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

export default function DepartmentManagerPage() {
  const { showToast, confirm: premiumConfirm } = useNotification();
  const params = useParams();
  const rawType = params?.type;
  const slug = Array.isArray(rawType) ? rawType[0] : rawType || 'mimarlik';
  const projectTarget = useMemo(() => getProjectTarget(slug), [slug]);

  const [activeTab, setActiveTab] = useState<TabKey>('genel');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [department, setDepartment] = useState<DepartmentForm>(() => makeDepartmentSeed(slug));
  const [initialDepartment, setInitialDepartment] = useState<DepartmentForm>(() => makeDepartmentSeed(slug));
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [isProjectsLoading, setIsProjectsLoading] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [apiStatus, setApiStatus] = useState<{
    department: ProbeStatus;
    projects: ProbeStatus;
    upload: ProbeStatus;
    updatedAt?: string;
  }>({
    department: 'loading',
    projects: 'loading',
    upload: 'idle',
  });

  const loadDepartment = useCallback(async () => {
    setLoading(true);
    setApiStatus((prev) => ({ ...prev, department: 'loading' }));

    try {
      const res = await fetch(`/api/admin/departments/${slug}`, { cache: 'no-store' });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data || data.error) {
        throw new Error(data?.error || 'Department fetch failed');
      }

      const nextDepartment: DepartmentForm = {
        slug: data.slug || slug,
        title: data.title || makeDepartmentSeed(slug).title,
        sideLabel: data.sideLabel || 'Studio Yönetimi',
        description: data.description || '',
        image: data.image || '',
        mediaType: data.mediaType === 'video' ? 'video' : 'image',
        heroBlur: Number(data.heroBlur || 0),
        heroOverlay: Number(data.heroOverlay || 30),
        sliderImages: Array.isArray(data.sliderImages) ? data.sliderImages.filter(Boolean) : [],
        process: Array.isArray(data.process)
          ? data.process.map((item: any) => ({ title: item?.title || '', desc: item?.desc || '' }))
          : [],
        focusAreas: Array.isArray(data.focusAreas)
          ? data.focusAreas.map((item: any) => ({
              title: item?.title || '',
              icon: item?.icon || '',
              desc: item?.desc || '',
            }))
          : [],
        categories: Array.isArray(data.categories) && data.categories.length > 0
          ? data.categories.map((item: any) => ({ label: item?.label || '', value: item?.value || '' }))
          : [{ label: 'TÜM PROJELER', value: 'ALL' }],
        products: Array.isArray(data.products)
          ? data.products.map((item: any) => ({
              title: item?.title || '',
              image: item?.image || '',
              category: item?.category || '',
              desc: item?.desc || '',
              price: item?.price || '',
              link: item?.link || '',
            }))
          : [],
      };

      setDepartment(nextDepartment);
      setInitialDepartment(cloneDepartment(nextDepartment));
      setApiStatus((prev) => ({ ...prev, department: 'ok', updatedAt: new Date().toISOString() }));
    } catch (error) {
      console.error('Department load error:', error);
      const fallback = makeDepartmentSeed(slug);
      setDepartment(fallback);
      setInitialDepartment(cloneDepartment(fallback));
      setApiStatus((prev) => ({
        ...prev,
        department: 'error',
        updatedAt: new Date().toISOString(),
      }));
      showToast('Departman verisi yüklenemedi.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast, slug]);

  const loadProjects = useCallback(async () => {
    setIsProjectsLoading(true);
    setApiStatus((prev) => ({ ...prev, projects: 'loading' }));

    try {
      const res = await fetch(`/api/projects?target=${projectTarget}`, { cache: 'no-store' });
      const data = await res.json().catch(() => []);
      if (!res.ok) {
        throw new Error(data?.error || 'Project list failed');
      }
      setProjects(Array.isArray(data) ? data : []);
      setApiStatus((prev) => ({ ...prev, projects: 'ok', updatedAt: new Date().toISOString() }));
    } catch (error) {
      console.error('Project list error:', error);
      setProjects([]);
      setApiStatus((prev) => ({ ...prev, projects: 'error', updatedAt: new Date().toISOString() }));
      showToast('Stüdyo projeleri yüklenemedi.', 'error');
    } finally {
      setIsProjectsLoading(false);
    }
  }, [projectTarget, showToast]);

  useEffect(() => {
    loadDepartment();
    loadProjects();
  }, [loadDepartment, loadProjects]);

  useEffect(() => {
    const syncTheme = () => {
      const domTheme =
        document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      setTheme(domTheme);
    };

    syncTheme();
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => observer.disconnect();
  }, []);

  const mutateDepartment = (updater: (draft: DepartmentForm) => void) => {
    setDepartment((prev) => {
      const next = cloneDepartment(prev);
      updater(next);
      return next;
    });
    setIsDirty(true);
  };

  const updateProjectList = (updater: (draft: ProjectRecord[]) => void) => {
    setProjects((prev) => {
      const next = [...prev];
      updater(next);
      return next;
    });
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', file.name);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => null);
      throw new Error(errorBody?.details || errorBody?.error || 'Upload failed');
    }

    const blob = await res.json();
    const uploadedUrl = blob?.url || blob?.downloadUrl;
    if (!uploadedUrl) {
      throw new Error('Upload URL missing');
    }

    setApiStatus((prev) => ({ ...prev, upload: 'ok', updatedAt: new Date().toISOString() }));
    return uploadedUrl as string;
  };

  const handleDepartmentSave = async () => {
    setIsSaving(true);
    try {
      const payload = { ...department, slug };
      const res = await fetch(`/api/admin/departments/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const saved = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(saved?.error || 'Department save failed');
      }

      const nextDepartment = {
        ...department,
        slug: saved?.slug || slug,
      };
      setDepartment(nextDepartment);
      setInitialDepartment(cloneDepartment(nextDepartment));
      setIsDirty(false);
      setApiStatus((prev) => ({ ...prev, department: 'ok', updatedAt: new Date().toISOString() }));
      showToast('Departman ayarları kaydedildi.', 'success');
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, target: 'image' | 'slider' | 'product', index?: number) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const uploadedUrl = await uploadFile(file);
      if (target === 'image') {
        mutateDepartment((draft) => {
          draft.image = uploadedUrl;
          draft.mediaType = file.type.startsWith('video/') ? 'video' : 'image';
        });
      } else if (target === 'slider') {
        mutateDepartment((draft) => {
          if (typeof index === 'number') {
            draft.sliderImages[index] = uploadedUrl;
          } else {
            draft.sliderImages.push(uploadedUrl);
          }
        });
      } else if (typeof index === 'number') {
        mutateDepartment((draft) => {
          draft.products[index].image = uploadedUrl;
        });
      }
      showToast('Görsel yüklendi.', 'success');
    } catch (error) {
      console.error('Upload error:', error);
      showToast(error instanceof Error ? error.message : 'Yükleme başarısız.', 'error');
    } finally {
      event.target.value = '';
    }
  };

  const addProcess = () => {
    mutateDepartment((draft) => {
      draft.process.push({ title: 'Yeni Adım', desc: 'Açıklama' });
    });
  };

  const addFocus = () => {
    mutateDepartment((draft) => {
      draft.focusAreas.push({ title: 'Yeni Odak', icon: 'sparkles', desc: 'Açıklama' });
    });
  };

  const addCategory = () => {
    mutateDepartment((draft) => {
      draft.categories.push({ label: 'Yeni Kategori', value: 'NEW' });
    });
  };

  const addProduct = () => {
    mutateDepartment((draft) => {
      draft.products.push({ title: '', image: '', category: '', desc: '', price: '', link: '' });
    });
  };

  const deleteProject = async (id: string) => {
    const ok = await premiumConfirm({
      title: 'PROJEYİ ÇIKAR',
      message: 'Bu projeyi havuzdan silmek istediğinize emin misiniz?',
      confirmText: 'SİL',
      cancelText: 'VAZGEÇ',
      isDanger: true,
    });

    if (!ok) return;

    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        throw new Error('Delete failed');
      }
      await loadProjects();
      showToast('Proje havuzdan silindi.', 'success');
    } catch (error) {
      console.error('Project delete error:', error);
      showToast('Proje silinemedi.', 'error');
    }
  };

  const stats = useMemo(() => {
    const activeTargets = {
      designStudio: projects.filter((project) => project.publishTargets?.designStudio).length,
      materialStudio: projects.filter((project) => project.publishTargets?.materialStudio).length,
      executionStudio: projects.filter((project) => project.publishTargets?.executionStudio).length,
    };

    return {
      process: department.process.length,
      focus: department.focusAreas.length,
      categories: department.categories.length,
      products: department.products.length,
      projects: projects.length,
      activeTargets,
    };
  }, [department, projects]);

  const currentProjectItems = useMemo(
    () =>
      projects.map((project) => ({
        ...project,
        updatedLabel: formatDate(project.updatedAt || project.createdAt),
      })),
    [projects],
  );

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-[color:var(--accent)]">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const apiCards = [
    {
      title: 'Departman API',
      href: `/api/admin/departments/${slug}`,
      status: apiStatus.department,
      note: 'Genel içerik, hero ve editör sekmeleri buradan yüklenir.',
    },
    {
      title: 'Stüdyo projeleri',
      href: `/api/projects?target=${projectTarget}`,
      status: apiStatus.projects,
      note: 'Bu departmana bağlı portfolyo kayıtları.',
    },
    {
      title: 'Görsel yükleme',
      href: '/api/upload',
      status: apiStatus.upload,
      note: 'Kapak, slider ve ürün görselleri için aktif.',
    },
  ];

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
              MİMARİ STÜDYO
            </Badge>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-[color:var(--text)] sm:text-4xl">
                {department.title}
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-[color:var(--text-muted)]">
                Ana giriş, süreç adımları, odak alanları, kategoriler, ürünler ve bağlı projeler tek
                bir stüdyo kabuğunda toplanır. Düzenleme akışı mobil, tablet ve farklı yüksekliklerde
                taşma yapmayacak şekilde hazırlandı.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text-muted)]">
                Slug: {slug}
              </Badge>
              <Badge variant="outline" className="border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text-muted)]">
                Hedef: {projectTarget}
              </Badge>
              <Badge variant="outline" className="border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text-muted)]">
                Tema: {theme === 'light' ? 'Aydınlık' : 'Karanlık'}
              </Badge>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[470px]">
            <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[color:var(--text-muted)]">Proje</p>
              <p className="mt-1 text-2xl font-semibold text-[color:var(--text)]">{stats.projects}</p>
              <p className="mt-2 text-xs text-[color:var(--text-muted)]">Bağlı portfolyo kayıtları</p>
            </div>
            <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[color:var(--text-muted)]">Yayın</p>
              <p className="mt-1 text-2xl font-semibold text-[color:var(--text)]">{stats.activeTargets.designStudio + stats.activeTargets.materialStudio + stats.activeTargets.executionStudio}</p>
              <p className="mt-2 text-xs text-[color:var(--text-muted)]">Toplam yayın kanalına dağıtım</p>
            </div>
            <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[color:var(--text-muted)]">İçerik</p>
              <p className="mt-1 text-2xl font-semibold text-[color:var(--text)]">{stats.process + stats.focus + stats.categories + stats.products}</p>
              <p className="mt-2 text-xs text-[color:var(--text-muted)]">Sekmelerde düzenlenen toplam öğe</p>
            </div>
            <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[color:var(--text-muted)]">API</p>
              <p className="mt-1 text-2xl font-semibold text-[color:var(--text)]">
                {apiStatus.department === 'ok' && apiStatus.projects === 'ok' ? 'Hazır' : 'Kontrol'}
              </p>
              <p className="mt-2 text-xs text-[color:var(--text-muted)]">Departman ve proje uçları takip ediliyor</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-[color:var(--line)] px-5 py-4 sm:px-6">
          {TAB_ITEMS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <Button
                key={tab.key}
                type="button"
                variant={active ? 'default' : 'outline'}
                className={
                  active
                    ? 'bg-[color:var(--accent)] text-[color:var(--text-inverse)] hover:bg-[color:var(--accent-soft)]'
                    : 'border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)] hover:bg-[color:var(--surface)]'
                }
                onClick={() => setActiveTab(tab.key)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {tab.label}
              </Button>
            );
          })}
        </div>
      </motion.section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_360px]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
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
                    onClick={handleDepartmentSave}
                    disabled={isSaving || !isDirty}
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
                      <CardTitle className="text-base text-[color:var(--text)]">Hero Görseli</CardTitle>
                      <CardDescription className="text-[color:var(--text-muted)]">
                        Ana kapak görselini sürükle-bırak ile değiştirin.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <label
                        className="group relative flex aspect-[4/3] cursor-pointer items-center justify-center overflow-hidden rounded-[1.5rem] border-2 border-dashed border-[color:var(--line)] bg-[color:var(--surface)]"
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={async (event) => {
                          event.preventDefault();
                          const file = event.dataTransfer.files[0];
                          if (!file) return;
                          try {
                            const url = await uploadFile(file);
                            mutateDepartment((draft) => {
                              draft.image = url;
                              draft.mediaType = file.type.startsWith('video/') ? 'video' : 'image';
                            });
                            showToast('Ana görsel güncellendi.', 'success');
                          } catch (error) {
                            showToast(error instanceof Error ? error.message : 'Yükleme başarısız.', 'error');
                          }
                        }}
                      >
                        {department.image ? (
                          <img src={department.image} alt={department.title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex flex-col items-center gap-3 p-6 text-center text-[color:var(--text-muted)]">
                            <div className="rounded-2xl bg-[color:var(--accent)]/10 p-4 text-[color:var(--accent)]">
                              <Upload className="h-7 w-7" />
                            </div>
                            <p className="text-sm font-medium text-[color:var(--text)]">Görsel yüklemek için tıklayın</p>
                            <p className="text-xs">Önerilen oran 4:3 veya yatay 16:9</p>
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
                              mutateDepartment((draft) => {
                                draft.image = url;
                                draft.mediaType = file.type.startsWith('video/') ? 'video' : 'image';
                              });
                              showToast('Ana görsel yüklendi.', 'success');
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
                        rows={8}
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
                    <div className="space-y-2">
                      <label className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">Medya Tipi</label>
                      <select
                        value={department.mediaType}
                        onChange={(event) =>
                          mutateDepartment((draft) => {
                            draft.mediaType = event.target.value === 'video' ? 'video' : 'image';
                          })
                        }
                        className="h-12 rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] px-4 text-sm text-[color:var(--text)] outline-none"
                      >
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                      </select>
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
                        <CardDescription className="text-[color:var(--text-muted)]">
                          Koyu katman ve blur değerleri.
                        </CardDescription>
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
                        <CardDescription className="text-[color:var(--text-muted)]">
                          Mevcut hero görsel havuzu.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="rounded-[1.25rem] border border-[color:var(--line)] bg-[color:var(--surface)] p-4 text-sm text-[color:var(--text-muted)]">
                          {department.sliderImages.length} slider görseli yüklü.
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                          onClick={() => document.getElementById('dept-slider-upload')?.click()}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Slider Görseli Ekle
                        </Button>
                        <input
                          id="dept-slider-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (event) => {
                            const file = event.target.files?.[0];
                            if (!file) return;
                            try {
                              const url = await uploadFile(file);
                              mutateDepartment((draft) => {
                                draft.sliderImages.push(url);
                              });
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
                    {department.sliderImages.length > 0 ? (
                      department.sliderImages.map((image, index) => (
                        <div key={`${image}-${index}`} className="overflow-hidden rounded-[1.5rem] border border-[color:var(--line)] bg-[color:var(--surface-muted)]">
                          <div className="aspect-[16/10] bg-black/10">
                            <img src={image} alt={`Slider ${index + 1}`} className="h-full w-full object-cover" />
                          </div>
                          <div className="flex items-center justify-between gap-3 p-4">
                            <div>
                              <p className="text-sm font-medium text-[color:var(--text)]">Slide {index + 1}</p>
                              <p className="text-xs text-[color:var(--text-muted)]">Hero rotasyon görseli</p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-10 w-10 border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                                onClick={() => document.getElementById(`dept-slider-replace-${index}`)?.click()}
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
                                id={`dept-slider-replace-${index}`}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (event) => {
                                  const file = event.target.files?.[0];
                                  if (!file) return;
                                  try {
                                    const url = await uploadFile(file);
                                    mutateDepartment((draft) => {
                                      draft.sliderImages[index] = url;
                                    });
                                    showToast('Slider görseli güncellendi.', 'success');
                                  } catch (error) {
                                    showToast(error instanceof Error ? error.message : 'Yükleme başarısız.', 'error');
                                  } finally {
                                    event.target.value = '';
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-[1.5rem] border border-dashed border-[color:var(--line)] bg-[color:var(--surface-muted)] p-8 text-center text-sm text-[color:var(--text-muted)]">
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
                      <p className="text-sm text-[color:var(--text-muted)]">Adım ekleyin, sıralayın, silin.</p>
                    </div>
                    <Button type="button" className="bg-[color:var(--accent)] text-[color:var(--text-inverse)] hover:bg-[color:var(--accent-soft)]" onClick={addProcess}>
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
                            onChange={(event) =>
                              mutateDepartment((draft) => {
                                draft.process[index].title = event.target.value;
                              })
                            }
                            className="h-11 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                            placeholder="Adım başlığı"
                          />
                          <Textarea
                            value={item.desc}
                            onChange={(event) =>
                              mutateDepartment((draft) => {
                                draft.process[index].desc = event.target.value;
                              })
                            }
                            className="min-h-24 rounded-[1.25rem] border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                            placeholder="Açıklama"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-11 w-11 border-rose-500/20 bg-rose-500/10 text-rose-700 hover:bg-rose-500 hover:text-white dark:text-rose-300"
                            onClick={() =>
                              mutateDepartment((draft) => {
                                draft.process.splice(index, 1);
                              })
                            }
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
                      <p className="text-sm text-[color:var(--text-muted)]">İkon, başlık ve açıklama alanları.</p>
                    </div>
                    <Button type="button" className="bg-[color:var(--accent)] text-[color:var(--text-inverse)] hover:bg-[color:var(--accent-soft)]" onClick={addFocus}>
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
                              onChange={(event) =>
                                mutateDepartment((draft) => {
                                  draft.focusAreas[index].icon = event.target.value;
                                })
                              }
                              className="h-11 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                              placeholder="Icon adı"
                            />
                            <Input
                              value={item.title}
                              onChange={(event) =>
                                mutateDepartment((draft) => {
                                  draft.focusAreas[index].title = event.target.value;
                                })
                              }
                              className="h-11 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                              placeholder="Başlık"
                            />
                          </div>
                          <Textarea
                            value={item.desc}
                            onChange={(event) =>
                              mutateDepartment((draft) => {
                                draft.focusAreas[index].desc = event.target.value;
                              })
                            }
                            className="min-h-24 rounded-[1.25rem] border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                            placeholder="Açıklama"
                          />
                          <div className="flex justify-end">
                            <Button
                              type="button"
                              variant="outline"
                              className="border-rose-500/20 bg-rose-500/10 text-rose-700 hover:bg-rose-500 hover:text-white dark:text-rose-300"
                              onClick={() =>
                                mutateDepartment((draft) => {
                                  draft.focusAreas.splice(index, 1);
                                })
                              }
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
                      <p className="text-sm text-[color:var(--text-muted)]">Departman görünürlüğü için kategori etiketleri.</p>
                    </div>
                    <Button type="button" className="bg-[color:var(--accent)] text-[color:var(--text-inverse)] hover:bg-[color:var(--accent-soft)]" onClick={addCategory}>
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
                            onChange={(event) =>
                              mutateDepartment((draft) => {
                                draft.categories[index].label = event.target.value;
                              })
                            }
                            className="h-11 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                            placeholder="Etiket"
                          />
                          <Input
                            value={item.value}
                            onChange={(event) =>
                              mutateDepartment((draft) => {
                                draft.categories[index].value = event.target.value;
                              })
                            }
                            className="h-11 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                            placeholder="Değer"
                          />
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text-muted)]">
                              {item.value || 'VALUE'}
                            </Badge>
                            <Button
                              type="button"
                              variant="outline"
                              className="border-rose-500/20 bg-rose-500/10 text-rose-700 hover:bg-rose-500 hover:text-white dark:text-rose-300"
                              onClick={() =>
                                mutateDepartment((draft) => {
                                  draft.categories.splice(index, 1);
                                })
                              }
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
                        Henüz kategori eklenmedi.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'urunler' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-base font-semibold text-[color:var(--text)]">Ürün Kataloğu</h3>
                      <p className="text-sm text-[color:var(--text-muted)]">Görsel, fiyat ve bağlantı yönetimi.</p>
                    </div>
                    <Button type="button" className="bg-[color:var(--accent)] text-[color:var(--text-inverse)] hover:bg-[color:var(--accent-soft)]" onClick={addProduct}>
                      <Plus className="mr-2 h-4 w-4" />
                      Ürün Ekle
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {department.products.map((item, index) => (
                      <Card key={`${item.title}-${index}`} className="border border-[color:var(--line)] bg-[color:var(--surface-muted)] shadow-none">
                        <CardContent className="grid gap-4 p-4 xl:grid-cols-[220px_minmax(0,1fr)]">
                          <label
                            className="group flex aspect-[4/3] cursor-pointer items-center justify-center overflow-hidden rounded-[1.5rem] border-2 border-dashed border-[color:var(--line)] bg-[color:var(--surface)]"
                            onClick={() => document.getElementById(`dept-product-upload-${index}`)?.click()}
                          >
                            {item.image ? (
                              <img src={item.image} alt={item.title || 'Product'} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex flex-col items-center gap-2 p-6 text-center text-[color:var(--text-muted)]">
                                <Upload className="h-6 w-6 text-[color:var(--accent)]" />
                                <p className="text-sm font-medium text-[color:var(--text)]">Ürün görseli</p>
                              </div>
                            )}
                            <input
                              id={`dept-product-upload-${index}`}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(event) => handleImageUpload(event, 'product', index)}
                            />
                          </label>
                          <div className="space-y-4">
                            <div className="grid gap-4 lg:grid-cols-2">
                              <Input
                                value={item.title}
                                onChange={(event) =>
                                  mutateDepartment((draft) => {
                                    draft.products[index].title = event.target.value;
                                  })
                                }
                                className="h-11 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                                placeholder="Ürün adı"
                              />
                              <Input
                                value={item.category}
                                onChange={(event) =>
                                  mutateDepartment((draft) => {
                                    draft.products[index].category = event.target.value;
                                  })
                                }
                                className="h-11 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                                placeholder="Kategori"
                              />
                            </div>
                            <Textarea
                              value={item.desc}
                              onChange={(event) =>
                                mutateDepartment((draft) => {
                                  draft.products[index].desc = event.target.value;
                                })
                              }
                              className="min-h-24 rounded-[1.25rem] border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                              placeholder="Kısa açıklama"
                            />
                            <div className="grid gap-4 lg:grid-cols-2">
                              <Input
                                value={item.price}
                                onChange={(event) =>
                                  mutateDepartment((draft) => {
                                    draft.products[index].price = event.target.value;
                                  })
                                }
                                className="h-11 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                                placeholder="Fiyat"
                              />
                              <Input
                                value={item.link}
                                onChange={(event) =>
                                  mutateDepartment((draft) => {
                                    draft.products[index].link = event.target.value;
                                  })
                                }
                                className="h-11 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                                placeholder="Bağlantı"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end xl:col-span-2">
                            <Button
                              type="button"
                              variant="outline"
                              className="border-rose-500/20 bg-rose-500/10 text-rose-700 hover:bg-rose-500 hover:text-white dark:text-rose-300"
                              onClick={() =>
                                mutateDepartment((draft) => {
                                  draft.products.splice(index, 1);
                                })
                              }
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Sil
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {department.products.length === 0 && (
                      <div className="rounded-[1.5rem] border border-dashed border-[color:var(--line)] bg-[color:var(--surface-muted)] p-8 text-center text-sm text-[color:var(--text-muted)]">
                        Henüz ürün eklenmedi.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'projeler' && (
                <div className="space-y-5">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-[color:var(--text)]">Stüdyo Projeleri</h3>
                      <p className="text-sm text-[color:var(--text-muted)]">
                        Bu departmana dağıtılmış projeler. Düzenleme için proje havuzuna gidin.
                      </p>
                    </div>
                    <Button asChild className="bg-[color:var(--accent)] text-[color:var(--text-inverse)] hover:bg-[color:var(--accent-soft)]">
                      <Link href="/admin/projects">
                        <FolderKanban className="mr-2 h-4 w-4" />
                        Proje Havuzunu Aç
                      </Link>
                    </Button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                    {isProjectsLoading ? (
                      Array.from({ length: 6 }).map((_, index) => (
                        <div
                          key={index}
                          className="h-[18rem] animate-pulse rounded-[1.5rem] border border-[color:var(--line)] bg-[color:var(--surface-muted)]"
                        />
                      ))
                    ) : currentProjectItems.length > 0 ? (
                      currentProjectItems.map((project) => (
                        <Card
                          key={project._id}
                          className="overflow-hidden border border-[color:var(--line)] bg-[color:var(--surface-muted)] shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
                        >
                          <div className="aspect-[16/10] bg-[color:var(--surface)]">
                            {project.coverImage ? (
                              <img src={project.coverImage} alt={project.title} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full items-center justify-center text-[color:var(--text-muted)]">
                                <ImageIcon className="h-8 w-8" />
                              </div>
                            )}
                          </div>
                          <CardContent className="space-y-4 p-4">
                            <div className="space-y-1">
                              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[color:var(--text-muted)]">{project.label || 'Project'}</p>
                              <h4 className="text-lg font-semibold text-[color:var(--text)]">{project.title}</h4>
                              <p className="text-sm text-[color:var(--text-muted)]">
                                {project.client || 'Müşteri yok'} • {project.year || 'Yıl yok'} • {project.area || 'Alan yok'}
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {(project.categories || []).slice(0, 3).map((category) => (
                                <Badge
                                  key={category}
                                  variant="outline"
                                  className="border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text-muted)]"
                                >
                                  {category}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center justify-between pt-1">
                              <Badge
                                variant="outline"
                                className="border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text-muted)]"
                              >
                                {project.updatedAt ? formatDate(project.updatedAt) : 'Yeni'}
                              </Badge>
                              <Button
                                type="button"
                                variant="outline"
                                className="border-rose-500/20 bg-rose-500/10 text-rose-700 hover:bg-rose-500 hover:text-white dark:text-rose-300"
                                onClick={() => deleteProject(project._id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Çıkar
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="rounded-[1.5rem] border border-dashed border-[color:var(--line)] bg-[color:var(--surface-muted)] p-8 text-center text-sm text-[color:var(--text-muted)] md:col-span-2 2xl:col-span-3">
                        Bu departman için henüz proje bağlantısı yok.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
          <Card className="border border-[color:var(--line)] bg-[color:var(--surface)] shadow-[var(--shadow)]">
            <CardHeader className="border-b border-[color:var(--line)]">
              <CardTitle className="text-lg text-[color:var(--text)]">API Bağlantıları</CardTitle>
              <CardDescription className="text-[color:var(--text-muted)]">
                Bu ekranın kullandığı ana uçlar.
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
              <Button
                type="button"
                variant="outline"
                className="w-full border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                onClick={loadProjects}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Uçları Yenile
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-[color:var(--line)] bg-[color:var(--surface)] shadow-[var(--shadow)]">
            <CardHeader className="border-b border-[color:var(--line)]">
              <CardTitle className="text-lg text-[color:var(--text)]">Hızlı Bilgiler</CardTitle>
              <CardDescription className="text-[color:var(--text-muted)]">
                Bu paneldeki içerik yoğunluğu.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 p-5 sm:p-6">
              {[
                { label: 'Süreç', value: stats.process },
                { label: 'Odak', value: stats.focus },
                { label: 'Kategori', value: stats.categories },
                { label: 'Ürün', value: stats.products },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] px-4 py-3">
                  <span className="text-sm text-[color:var(--text-muted)]">{item.label}</span>
                  <span className="text-sm font-semibold text-[color:var(--text)]">{item.value}</span>
                </div>
              ))}
              <Separator className="bg-[color:var(--line)]" />
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text-muted)]">
                  {stats.activeTargets.designStudio} Design
                </Badge>
                <Badge variant="outline" className="border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text-muted)]">
                  {stats.activeTargets.materialStudio} Material
                </Badge>
                <Badge variant="outline" className="border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text-muted)]">
                  {stats.activeTargets.executionStudio} Execution
                </Badge>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
              onClick={handleCancel}
              disabled={!isDirty}
            >
              VAZGEÇ
            </Button>
            <Button
              type="button"
              className="flex-1 bg-[color:var(--accent)] text-[color:var(--text-inverse)] hover:bg-[color:var(--accent-soft)]"
              onClick={handleDepartmentSave}
              disabled={isSaving || !isDirty}
            >
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CloudUpload className="mr-2 h-4 w-4" />}
              KAYDET
            </Button>
          </div>

          <Card className="border border-[color:var(--line)] bg-[color:var(--surface)] shadow-[var(--shadow)]">
            <CardHeader className="border-b border-[color:var(--line)]">
              <CardTitle className="text-lg text-[color:var(--text)]">Geri Dönüş</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-5 sm:p-6">
              <Button asChild variant="outline" className="w-full border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)]">
                <Link href="/admin/content/services/mimari">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Mimari Genel Ayarları
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
