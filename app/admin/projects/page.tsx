/* eslint-disable @next/next/no-img-element */
'use client';

import {
  ChangeEvent,
  DragEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  CloudUpload,
  Edit3,
  Filter,
  FolderKanban,
  Globe2,
  Image as ImageIcon,
  LayoutGrid,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Settings2,
  Sparkles,
  Trash2,
  Upload,
  X,
} from 'lucide-react';

import { useNotification } from '@/components/admin/AdminNotificationProvider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

type PublishTargets = {
  designStudio: boolean;
  materialStudio: boolean;
  executionStudio: boolean;
};

type GalleryItem = {
  url: string;
  imageAlt: string;
  caption: string;
};

type ProjectRecord = {
  _id: string;
  slug?: string;
  title: string;
  label: string;
  department?: string;
  categories?: string[];
  publishTargets?: PublishTargets;
  coverImage?: string;
  description?: string;
  client?: string;
  year?: string;
  area?: string;
  vision?: string;
  techDetails?: string;
  story?: string;
  seoMeta?: {
    title?: string;
    description?: string;
    keywords?: string;
  };
  gallery?: GalleryItem[];
  createdAt?: string;
  updatedAt?: string;
};

type FormState = {
  title: string;
  label: string;
  department: string;
  categories: string[];
  publishTargets: PublishTargets;
  coverImage: string;
  description: string;
  client: string;
  year: string;
  area: string;
  vision: string;
  techDetails: string;
  story: string;
  seoMeta: {
    title: string;
    description: string;
    keywords: string;
  };
  gallery: GalleryItem[];
};

type ProbeStatus = 'idle' | 'loading' | 'ok' | 'error';

const CATEGORY_OPTIONS = [
  'Lüks Konut',
  'Ticari Yapı',
  'Karma Kullanım',
  'Kurumsal Alan',
  'Butik Otel',
  'Kültür Yapısı',
];

const TARGET_OPTIONS: Array<{ key: keyof PublishTargets; label: string }> = [
  { key: 'designStudio', label: 'Mimari Stüdyo' },
  { key: 'materialStudio', label: 'Materyal Stüdyo' },
  { key: 'executionStudio', label: 'Uygulama Birimi' },
];

const DEPARTMENT_OPTIONS = [
  'MİMARİ TASARIM',
  'MATERYAL STÜDYO',
  'UYGULAMA HİZMETLERİ',
  'MÜHENDİSLİK',
];

const emptyFormState: FormState = {
  title: '',
  label: '',
  department: 'MİMARİ TASARIM',
  categories: [],
  publishTargets: {
    designStudio: true,
    materialStudio: false,
    executionStudio: false,
  },
  coverImage: '',
  description: '',
  client: '',
  year: '',
  area: '',
  vision: '',
  techDetails: '',
  story: '',
  seoMeta: {
    title: '',
    description: '',
    keywords: '',
  },
  gallery: [],
};

const containerVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.08, duration: 0.35 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { ease: 'easeOut', duration: 0.35 } },
} as const;

const formatDate = (value?: string) => {
  if (!value) return 'Tarih yok';
  return new Date(value).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const getTargetLabel = (key: keyof PublishTargets) => {
  if (key === 'designStudio') return 'DESIGN';
  if (key === 'materialStudio') return 'MAT.';
  return 'EXEC.';
};

const getStatusMeta = (status: ProbeStatus) => {
  if (status === 'ok') {
    return {
      className:
        'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
      icon: CheckCircle2,
      label: 'Çalışıyor',
    };
  }

  if (status === 'error') {
    return {
      className: 'border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300',
      icon: CircleAlert,
      label: 'Hata',
    };
  }

  if (status === 'loading') {
    return {
      className: 'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300',
      icon: Loader2,
      label: 'Kontrol ediliyor',
    };
  }

  return {
    className: 'border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text-muted)]',
    icon: BadgeCheck,
    label: 'Hazır',
  };
};

export default function AdminProjects() {
  const { showToast, confirm: premiumConfirm } = useNotification();
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOverCover, setDragOverCover] = useState(false);
  const [dragOverGallery, setDragOverGallery] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [targetFilter, setTargetFilter] = useState<'all' | keyof PublishTargets>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [formData, setFormData] = useState<FormState>(emptyFormState);
  const [apiProbe, setApiProbe] = useState<{
    list: ProbeStatus;
    detail: ProbeStatus;
    lastChecked?: string;
    message: string;
  }>({
    list: 'loading',
    detail: 'idle',
    message: 'İlk veri denemesi hazırlanıyor',
  });

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    setApiProbe((prev) => ({
      ...prev,
      list: 'loading',
      detail: 'loading',
      message: 'Proje havuzu API üzerinden okunuyor',
    }));

    try {
      const res = await fetch('/api/projects', { cache: 'no-store' });
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];

      if (!res.ok) {
        throw new Error(data?.error || 'Proje listesi alınamadı');
      }

      setProjects(list);

      let detailStatus: ProbeStatus = 'idle';
      if (list[0]?._id) {
        const detailRes = await fetch(`/api/projects/${list[0]._id}`, { cache: 'no-store' });
        detailStatus = detailRes.ok ? 'ok' : 'error';
      }

      setApiProbe({
        list: 'ok',
        detail: detailStatus,
        lastChecked: new Date().toISOString(),
        message: `${list.length} proje listelendi`,
      });
    } catch (error) {
      console.error('Project load error:', error);
      setProjects([]);
      setApiProbe({
        list: 'error',
        detail: 'error',
        lastChecked: new Date().toISOString(),
        message: error instanceof Error ? error.message : 'API yanıt vermedi',
      });
      showToast('Proje havuzu yüklenemedi.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  useEffect(() => {
    const syncTheme = () => {
      const domTheme =
        document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      setTheme(domTheme);
    };

    syncTheme();

    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    window.addEventListener('storage', syncTheme);

    return () => {
      observer.disconnect();
      window.removeEventListener('storage', syncTheme);
    };
  }, []);

  useEffect(() => {
    if (!isModalOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isModalOpen]);

  const uploadAsset = async (file: File) => {
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

    return uploadedUrl as string;
  };

  const persistProjectDraft = async (nextForm: FormState) => {
    if (!editingProject?._id) return;

    const res = await fetch(`/api/projects/${editingProject._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nextForm),
    });

    if (!res.ok) {
      throw new Error('Project draft save failed');
    }

    const saved = await res.json();
    setEditingProject(saved);
  };

  const resetForm = () => {
    setFormData(emptyFormState);
    setEditingProject(null);
    setDragOverCover(false);
    setDragOverGallery(false);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (project: ProjectRecord) => {
    setEditingProject(project);
    setFormData({
      title: project.title || '',
      label: project.label || '',
      department: project.department || 'MİMARİ TASARIM',
      categories: project.categories || [],
      publishTargets: project.publishTargets || {
        designStudio: true,
        materialStudio: false,
        executionStudio: false,
      },
      coverImage: project.coverImage || '',
      description: project.description || '',
      client: project.client || '',
      year: project.year || '',
      area: project.area || '',
      vision: project.vision || '',
      techDetails: project.techDetails || '',
      story: project.story || '',
      seoMeta: project.seoMeta || {
        title: '',
        description: '',
        keywords: '',
      },
      gallery:
        project.gallery?.map((item) =>
          typeof item === 'string' ? { url: item, imageAlt: '', caption: '' } : item,
        ) || [],
    });
    setIsModalOpen(true);
  };

  const toggleCategory = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((item) => item !== category)
        : [...prev.categories, category],
    }));
  };

  const togglePublishTarget = (target: keyof PublishTargets) => {
    setFormData((prev) => ({
      ...prev,
      publishTargets: {
        ...prev.publishTargets,
        [target]: !prev.publishTargets[target],
      },
    }));
  };

  const updateGalleryItem = (index: number, field: keyof GalleryItem, value: string) => {
    setFormData((prev) => {
      const gallery = [...prev.gallery];
      gallery[index] = { ...gallery[index], [field]: value };
      return { ...prev, gallery };
    });
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>, isCover = false) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const uploadedUrl = await uploadAsset(file);

      const nextState = isCover
        ? { ...formData, coverImage: uploadedUrl }
        : {
            ...formData,
            gallery: [...formData.gallery, { url: uploadedUrl, imageAlt: '', caption: '' }],
          };

      setFormData(nextState);

      if (editingProject?._id) {
        await persistProjectDraft(nextState);
      }

      showToast(isCover ? 'Kapak görseli yüklendi.' : 'Görsel galeriye eklendi.', 'success');
    } catch (error) {
      console.error('Upload error:', error);
      showToast(error instanceof Error ? error.message : 'Yükleme başarısız.', 'error');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleDropCover = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOverCover(false);
    const file = event.dataTransfer.files[0];
    if (!file) return;
    try {
      setUploading(true);
      const uploadedUrl = await uploadAsset(file);
      const nextState = { ...formData, coverImage: uploadedUrl };
      setFormData(nextState);
      if (editingProject?._id) {
        await persistProjectDraft(nextState);
      }
    } catch (error) {
      console.error('Cover drop error:', error);
      showToast('Kapak görseli yüklenemedi.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDropGallery = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOverGallery(false);
    const files = Array.from(event.dataTransfer.files);
    if (!files.length) return;

    try {
      setUploading(true);
      const uploads = await Promise.all(files.map((file) => uploadAsset(file)));
      const nextGallery = [
        ...formData.gallery,
        ...uploads.map((url) => ({ url, imageAlt: '', caption: '' })),
      ];
      const nextState = { ...formData, gallery: nextGallery };
      setFormData(nextState);
      if (editingProject?._id) {
        await persistProjectDraft(nextState);
      }
      showToast('Galeri güncellendi.', 'success');
    } catch (error) {
      console.error('Gallery drop error:', error);
      showToast('Galeri görselleri yüklenemedi.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleProjectSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.title.trim() || !formData.label.trim() || !formData.coverImage.trim()) {
      showToast('Başlık, etiket ve kapak görseli zorunlu.', 'error');
      return;
    }

    setIsSubmitting(true);
    const url = editingProject ? `/api/projects/${editingProject._id}` : '/api/projects';
    const method = editingProject ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => null);
        throw new Error(errorBody?.error || 'Project save failed');
      }

      setIsModalOpen(false);
      resetForm();
      await loadProjects();
      showToast(editingProject ? 'Proje güncellendi.' : 'Yeni proje oluşturuldu.', 'success');
    } catch (error) {
      console.error('Project submit error:', error);
      showToast(error instanceof Error ? error.message : 'Proje kaydedilemedi.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProjectDelete = async (id: string) => {
    const ok = await premiumConfirm({
      title: 'PROJEYİ SİL',
      message: 'Bu projeyi havuzdan tamamen silmek istediğinize emin misiniz?',
      confirmText: 'SİL',
      cancelText: 'VAZGEÇ',
      isDanger: true,
    });

    if (!ok) return;

    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        throw new Error('Delete request failed');
      }

      await loadProjects();
      showToast('Proje silindi.', 'success');
    } catch (error) {
      console.error('Delete error:', error);
      showToast('Silme işlemi başarısız.', 'error');
    }
  };

  const runMigration = async () => {
    setIsMigrating(true);
    try {
      const res = await fetch('/api/admin/migrate/projects');
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(body?.error || 'Migration failed');
      }
      await loadProjects();
      showToast(body?.message || 'Varsayılan projeler aktarıldı.', 'success');
    } catch (error) {
      console.error('Migration error:', error);
      showToast(error instanceof Error ? error.message : 'Aktarım sırasında hata oluştu.', 'error');
    } finally {
      setIsMigrating(false);
    }
  };

  const filteredProjects = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();

    const sorted = projects
      .filter((project) => {
        const haystack = [
          project.title,
          project.label,
          project.department,
          project.client,
          project.year,
          project.area,
          ...(project.categories || []),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        const matchesTerm = !term || haystack.includes(term);
        const matchesTarget =
          targetFilter === 'all' ? true : Boolean(project.publishTargets?.[targetFilter]);
        return matchesTerm && matchesTarget;
      })
      .sort((a, b) => {
        if (sortBy === 'title') {
          return (a.title || '').localeCompare(b.title || '', 'tr');
        }

        const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime();
        const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime();
        return sortBy === 'newest' ? bTime - aTime : aTime - bTime;
      });

    return sorted;
  }, [projects, searchQuery, sortBy, targetFilter]);

  const metrics = useMemo(() => {
    const activeTargets = {
      designStudio: projects.filter((project) => project.publishTargets?.designStudio).length,
      materialStudio: projects.filter((project) => project.publishTargets?.materialStudio).length,
      executionStudio: projects.filter((project) => project.publishTargets?.executionStudio).length,
    };

    const uniqueCategories = new Set(
      projects.flatMap((project) => project.categories || []).filter(Boolean),
    );

    const galleryCount = projects.filter((project) => (project.gallery?.length || 0) > 0).length;
    const publishedCount = projects.filter((project) =>
      Object.values(project.publishTargets || {}).some(Boolean),
    ).length;

    return {
      activeTargets,
      uniqueCategories: uniqueCategories.size,
      galleryCount,
      publishedCount,
    };
  }, [projects]);

  const apiItems = [
    {
      title: 'Projeler listesi',
      href: '/api/projects',
      note: 'İlk yüklemede canlı olarak doğrulandı',
      status: apiProbe.list,
    },
    {
      title: 'Tekil proje okuma',
      href: '/api/projects/:id',
      note: 'İlk kayıt varsa detay ucu da kontrol edildi',
      status: apiProbe.detail,
    },
    {
      title: 'Görsel yükleme',
      href: '/api/upload',
      note: 'Formdaki kapak ve galeri alanları bu uçtan besleniyor',
      status: 'idle' as ProbeStatus,
    },
    {
      title: 'Projeleri aktarma',
      href: '/api/admin/migrate/projects',
      note: 'Boş havuzu doldurmak için migration aksiyonu',
      status: 'idle' as ProbeStatus,
    },
  ];

  const projectCount = projects.length;
  const themeLabel = theme === 'light' ? 'Aydınlık mod' : 'Karanlık mod';
  const lastCheckedLabel = apiProbe.lastChecked ? formatDate(apiProbe.lastChecked) : 'Henüz yok';

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  return (
    <div className="admin-projects-shell relative space-y-6 pb-8 [--proj-border:color-mix(in_oklab,var(--line)_88%,transparent)] [--proj-panel:color-mix(in_oklab,var(--surface)_90%,transparent)] [--proj-panel-soft:color-mix(in_oklab,var(--surface-muted)_88%,transparent)]">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-[color:var(--accent)]/10 blur-3xl" />
        <div className="absolute right-0 top-28 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="admin-projects-content relative space-y-6"
      >
        <motion.section
          variants={itemVariants}
          className="overflow-hidden rounded-[2rem] border border-[color:var(--proj-border)] bg-[color:var(--proj-panel)] p-5 shadow-[var(--shadow)] backdrop-blur-sm sm:p-7"
        >
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl space-y-4">
              <Badge
                variant="secondary"
                className="border border-[color:var(--proj-border)] bg-[color:var(--proj-panel-soft)] text-[color:var(--text-muted)]"
              >
                <FolderKanban className="mr-2 h-3 w-3" />
                TÜM PROJELER (HAVUZ)
              </Badge>
              <div className="space-y-3">
                <h1 className="text-3xl font-semibold tracking-tight text-[color:var(--text)] sm:text-4xl">
                  Proje havuzunu tek ekranda yönetin
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-[color:var(--text-muted)]">
                  Tüm projeler burada listelenir, filtrelenir, düzenlenir ve gerektiğinde yeniden
                  aktarılır. Arayüz shadcn/ui katmanlarıyla responsive olarak kuruldu; mobil,
                  tablet ve düşük yükseklikli desktop görünümünde taşma yapmadan çalışır.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[500px]">
              <div className="rounded-2xl border border-[color:var(--proj-border)] bg-[color:var(--proj-panel-soft)] p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-[color:var(--accent)]/10 p-3 text-[color:var(--accent)]">
                    <LayoutGrid className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[color:var(--text-muted)]">
                      Proje sayısı
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[color:var(--text)]">{projectCount}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[color:var(--proj-border)] bg-[color:var(--proj-panel-soft)] p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-500">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[color:var(--text-muted)]">
                      Tema durumu
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[color:var(--text)]">{themeLabel}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[color:var(--proj-border)] bg-[color:var(--proj-panel-soft)] p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-sky-500/10 p-3 text-sky-500">
                    <BadgeCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[color:var(--text-muted)]">
                      Yayınlanmış
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[color:var(--text)]">
                      {metrics.publishedCount}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[color:var(--proj-border)] bg-[color:var(--proj-panel-soft)] p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-violet-500/10 p-3 text-violet-500">
                    <Globe2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[color:var(--text-muted)]">
                      Kategori
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[color:var(--text)]">
                      {metrics.uniqueCategories}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_360px]">
          <motion.div variants={itemVariants}>
            <Card className="border border-[color:var(--proj-border)] bg-[color:var(--proj-panel)] shadow-[var(--shadow)]">
              <CardHeader className="space-y-4 border-b border-[color:var(--proj-border)]">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                  <div>
                    <CardTitle className="text-lg tracking-tight text-[color:var(--text)]">
                      Proje Listesi
                    </CardTitle>
                    <CardDescription className="mt-1 text-[color:var(--text-muted)]">
                      Arayın, filtreleyin, düzenleyin. En güncel kayıtlar üstte görünür.
                    </CardDescription>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)] hover:bg-[color:var(--surface-muted)]"
                      onClick={loadProjects}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Yenile
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      className="bg-[color:var(--accent)] text-[color:var(--text-inverse)] hover:bg-[color:var(--accent-soft)]"
                      onClick={openCreateModal}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Yeni Proje
                    </Button>
                  </div>
                </div>

                <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--text-muted)]" />
                    <Input
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Başlık, müşteri, yıl, kategori ara..."
                      className="h-12 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface-muted)] pl-11 text-[color:var(--text)] placeholder:text-[color:var(--text-muted)]"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex h-12 items-center rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] px-3">
                      <Filter className="h-4 w-4 text-[color:var(--text-muted)]" />
                    </div>
                    <select
                      value={sortBy}
                      onChange={(event) =>
                        setSortBy(event.target.value as 'newest' | 'oldest' | 'title')
                      }
                      className="h-12 rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] px-4 text-sm text-[color:var(--text)] outline-none"
                    >
                      <option value="newest">En yeni</option>
                      <option value="oldest">En eski</option>
                      <option value="title">Başlığa göre</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={targetFilter === 'all' ? 'default' : 'outline'}
                    className={
                      targetFilter === 'all'
                        ? 'bg-[color:var(--accent)] text-[color:var(--text-inverse)] hover:bg-[color:var(--accent-soft)]'
                        : 'border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)] hover:bg-[color:var(--surface)]'
                    }
                    onClick={() => setTargetFilter('all')}
                  >
                    Tümü
                  </Button>
                  {TARGET_OPTIONS.map((option) => (
                    <Button
                      key={option.key}
                      type="button"
                      size="sm"
                      variant={targetFilter === option.key ? 'default' : 'outline'}
                      className={
                        targetFilter === option.key
                          ? 'bg-[color:var(--accent)] text-[color:var(--text-inverse)] hover:bg-[color:var(--accent-soft)]'
                          : 'border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)] hover:bg-[color:var(--surface)]'
                      }
                      onClick={() => setTargetFilter(option.key)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </CardHeader>

              <CardContent className="space-y-6 p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-2 text-sm text-[color:var(--text-muted)]">
                  <span>{filteredProjects.length} proje gösteriliyor</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{metrics.galleryCount} projede galeri var</span>
                  <span className="hidden sm:inline">•</span>
                  <span>Son kontrol: {lastCheckedLabel}</span>
                </div>

                {isLoading ? (
                  <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div
                        key={index}
                        className="h-[26rem] animate-pulse rounded-[1.5rem] border border-[color:var(--line)] bg-[color:var(--surface-muted)]"
                      />
                    ))}
                  </div>
                ) : filteredProjects.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                    {filteredProjects.map((project) => (
                      <motion.article
                        layout
                        key={project._id}
                        className="group overflow-hidden rounded-[1.5rem] border border-[color:var(--line)] bg-[color:var(--surface)] shadow-[0_18px_50px_rgba(0,0,0,0.12)] transition-transform duration-200 hover:-translate-y-1"
                      >
                        <button
                          type="button"
                          className="block w-full text-left"
                          onClick={() => openEditModal(project)}
                        >
                          <div className="relative aspect-[16/10] overflow-hidden bg-[color:var(--surface-muted)]">
                            {project.coverImage ? (
                              <img
                                src={project.coverImage}
                                alt={project.title}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-[color:var(--text-muted)]">
                                <ImageIcon className="h-8 w-8" />
                              </div>
                            )}

                            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                            <div className="absolute inset-x-0 bottom-0 p-4">
                              <div className="mb-3 flex flex-wrap gap-2">
                                {project.department ? (
                                  <Badge className="border border-white/10 bg-white/10 text-white backdrop-blur-sm">
                                    {project.department}
                                  </Badge>
                                ) : null}
                                {TARGET_OPTIONS.filter((option) =>
                                  project.publishTargets?.[option.key],
                                ).map((option) => (
                                  <Badge
                                    key={option.key}
                                    className="border border-white/10 bg-white/15 text-white backdrop-blur-sm"
                                  >
                                    {getTargetLabel(option.key)}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex items-end justify-between gap-3">
                                <div>
                                  <p className="text-[0.65rem] uppercase tracking-[0.3em] text-white/70">
                                    {project.label || 'PROJE'}
                                  </p>
                                  <h3 className="mt-1 text-lg font-semibold text-white">
                                    {project.title}
                                  </h3>
                                </div>
                                <Badge className="border border-white/10 bg-white/12 text-white backdrop-blur-sm">
                                  {project.year || 'Yıl yok'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </button>

                        <div className="space-y-4 p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[color:var(--text-muted)]">
                                {project.client || 'Müşteri bilgisi yok'}
                              </p>
                              <p className="text-sm font-semibold text-[color:var(--text)]">
                                {project.area || 'Alan bilgisi yok'}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className="border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text-muted)]"
                            >
                              {formatDate(project.updatedAt || project.createdAt)}
                            </Badge>
                          </div>

                          <p
                            className="text-sm leading-6 text-[color:var(--text-muted)]"
                            style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {project.description || 'Bu proje için açıklama girilmemiş.'}
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {(project.categories || []).slice(0, 4).map((category) => (
                              <Badge
                                key={category}
                                variant="outline"
                                className="border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text-muted)]"
                              >
                                {category}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex gap-2 pt-1">
                            <Button
                              type="button"
                              variant="outline"
                              className="flex-1 border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)] hover:bg-[color:var(--surface)]"
                              onClick={() => openEditModal(project)}
                            >
                              <Edit3 className="mr-2 h-4 w-4" />
                              Düzenle
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              className="border-rose-500/20 bg-rose-500/10 text-rose-700 hover:bg-rose-500 hover:text-white dark:text-rose-300"
                              onClick={() => handleProjectDelete(project._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.article>
                    ))}
                  </div>
                ) : projects.length > 0 ? (
                  <div className="rounded-[1.5rem] border border-dashed border-[color:var(--line)] bg-[color:var(--surface-muted)] p-8 text-center">
                    <p className="text-sm font-medium text-[color:var(--text)]">Sonuç bulunamadı</p>
                    <p className="mt-2 text-sm leading-7 text-[color:var(--text-muted)]">
                      Arama veya filtreyi temizleyerek tüm proje havuzunu görün.
                    </p>
                    <div className="mt-5">
                      <Button
                        type="button"
                        variant="outline"
                        className="border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                        onClick={() => {
                          setSearchQuery('');
                          setTargetFilter('all');
                          setSortBy('newest');
                        }}
                      >
                        Filtreleri Sıfırla
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-[1.75rem] border border-dashed border-[color:var(--line)] bg-[color:var(--surface-muted)] p-8 text-center sm:p-10">
                    <FolderKanban className="mx-auto h-10 w-10 text-[color:var(--accent)]" />
                    <p className="mt-4 text-lg font-semibold text-[color:var(--text)]">
                      Proje havuzu boş
                    </p>
                    <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[color:var(--text-muted)]">
                      Şu anda düzenlenebilir proje yok. Mevcut projeleri aktararak havuzu
                      doldurabilirsiniz ya da doğrudan yeni proje oluşturabilirsiniz.
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                      <Button
                        type="button"
                        className="bg-[color:var(--accent)] text-[color:var(--text-inverse)] hover:bg-[color:var(--accent-soft)]"
                        onClick={runMigration}
                        disabled={isMigrating}
                      >
                        {isMigrating ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <CloudUpload className="mr-2 h-4 w-4" />
                        )}
                        {isMigrating ? 'Aktarılıyor...' : 'Varsayılan Projeleri Aktar'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                        onClick={openCreateModal}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Yeni Proje Oluştur
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <div className="space-y-6 xl:sticky xl:top-6 xl:self-start">
            <motion.div variants={itemVariants}>
              <Card className="border border-[color:var(--proj-border)] bg-[color:var(--proj-panel)] shadow-[var(--shadow)]">
                <CardHeader className="border-b border-[color:var(--proj-border)]">
                  <CardTitle className="text-lg text-[color:var(--text)]">API Bağlantıları</CardTitle>
                  <CardDescription className="text-[color:var(--text-muted)]">
                    Uçlar aynı sayfadan yönetiliyor ve başlangıçta canlı okunuyor.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 p-5 sm:p-6">
                  <div className="flex items-center justify-between rounded-2xl border border-[color:var(--proj-border)] bg-[color:var(--proj-panel-soft)] p-4">
                    <div>
                      <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[color:var(--text-muted)]">
                        Son probe
                      </p>
                      <p className="mt-1 text-sm font-semibold text-[color:var(--text)]">
                        {lastCheckedLabel}
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                      onClick={loadProjects}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Yenile
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {apiItems.map((item) => {
                      const meta = getStatusMeta(item.status);
                      const StatusIcon = meta.icon;
                      return (
                        <div
                          key={item.href}
                          className="rounded-2xl border border-[color:var(--proj-border)] bg-[color:var(--proj-panel-soft)] p-4"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-[color:var(--text)]">{item.title}</p>
                                <Badge
                                  className={`border ${meta.className} px-2 py-0.5 text-[0.65rem] uppercase tracking-[0.24em]`}
                                >
                                  <StatusIcon
                                    className={`mr-1 h-3 w-3 ${meta.status === 'loading' ? 'animate-spin' : ''}`}
                                  />
                                  {meta.label}
                                </Badge>
                              </div>
                              <p className="text-xs leading-5 text-[color:var(--text-muted)]">
                                {item.note}
                              </p>
                            </div>
                            <ChevronRight className="mt-1 h-4 w-4 text-[color:var(--text-muted)]" />
                          </div>
                          <p className="mt-3 text-[0.65rem] uppercase tracking-[0.24em] text-[color:var(--text-muted)]">
                            {item.href}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="border border-[color:var(--proj-border)] bg-[color:var(--proj-panel)] shadow-[var(--shadow)]">
                <CardHeader className="border-b border-[color:var(--proj-border)]">
                  <CardTitle className="text-lg text-[color:var(--text)]">Hızlı İş Akışı</CardTitle>
                  <CardDescription className="text-[color:var(--text-muted)]">
                    Editörün en sık kullanılan akışları.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-5 sm:p-6">
                  <div className="rounded-2xl border border-[color:var(--proj-border)] bg-[color:var(--proj-panel-soft)] p-4">
                    <p className="text-sm font-medium text-[color:var(--text)]">1. Listeyi yenile</p>
                    <p className="mt-2 text-sm leading-7 text-[color:var(--text-muted)]">
                      Proje listesi ve tekil kayıt ucu yüklemede kontrol ediliyor. Buradan manuel
                      tazeleme yapabilirsiniz.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-[color:var(--proj-border)] bg-[color:var(--proj-panel-soft)] p-4">
                    <p className="text-sm font-medium text-[color:var(--text)]">2. Proje düzenle</p>
                    <p className="mt-2 text-sm leading-7 text-[color:var(--text-muted)]">
                      Kartın üstüne tıklayın veya düzenle butonunu kullanın. Kapak, galeri ve SEO
                      alanları tek formda yönetilir.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-[color:var(--proj-border)] bg-[color:var(--proj-panel-soft)] p-4">
                    <p className="text-sm font-medium text-[color:var(--text)]">3. Migration</p>
                    <p className="mt-2 text-sm leading-7 text-[color:var(--text-muted)]">
                      Havuz boşsa varsayılan projeleri tek tıkla aktarabilirsiniz.
                    </p>
                  </div>
                  <Separator className="bg-[color:var(--line)]" />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                      onClick={openCreateModal}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Yeni kayıt
                    </Button>
                    <Button
                      type="button"
                      className="bg-[color:var(--accent)] text-[color:var(--text-inverse)] hover:bg-[color:var(--accent-soft)]"
                      onClick={runMigration}
                      disabled={isMigrating}
                    >
                      {isMigrating ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="mr-2 h-4 w-4" />
                      )}
                      Havuzu Doldur
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-2 backdrop-blur-md sm:p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ type: 'spring', damping: 24, stiffness: 220 }}
              className="relative mt-2 flex max-h-[calc(100dvh-1rem)] w-full max-w-6xl overflow-hidden rounded-[2rem] border border-[color:var(--line)] bg-[color:var(--surface)] shadow-[0_35px_100px_rgba(0,0,0,0.45)] sm:mt-0 sm:max-h-[calc(100dvh-2rem)]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex w-full flex-col">
                <div className="flex items-start justify-between gap-4 border-b border-[color:var(--line)] bg-[color:var(--surface-muted)] px-5 py-4 sm:px-6">
                  <div className="space-y-1">
                    <p className="text-[0.65rem] uppercase tracking-[0.32em] text-[color:var(--text-muted)]">
                      Proje Editörü
                    </p>
                    <h2 className="text-xl font-semibold tracking-tight text-[color:var(--text)]">
                      {editingProject ? editingProject.title : 'Yeni Proje Oluştur'}
                    </h2>
                    <p className="text-sm text-[color:var(--text-muted)]">
                      Kapak, galeri, dağıtım ve SEO alanları tek ekranda.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text-muted)]"
                    >
                      {themeLabel}
                    </Badge>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)] hover:bg-[color:var(--surface-muted)]"
                      onClick={closeModal}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <form onSubmit={handleProjectSubmit} className="flex min-h-0 flex-1 flex-col">
                  <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6 lg:px-8">
                    <div className="space-y-6">
                      <Card className="border border-[color:var(--line)] bg-[color:var(--surface)] shadow-none">
                        <CardHeader className="pb-4">
                          <CardTitle className="text-base text-[color:var(--text)]">
                            Temel Bilgiler
                          </CardTitle>
                          <CardDescription className="text-[color:var(--text-muted)]">
                            Kimlik, müşteri ve özet alanları.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4 lg:grid-cols-2">
                          <div className="space-y-2">
                            <label className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">
                              Proje Adı
                            </label>
                            <Input
                              value={formData.title}
                              onChange={(event) => setFormData({ ...formData, title: event.target.value })}
                              placeholder="Skyline Villa"
                              className="h-12 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)] placeholder:text-[color:var(--text-muted)]"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">
                              Etiket
                            </label>
                            <Input
                              value={formData.label}
                              onChange={(event) => setFormData({ ...formData, label: event.target.value })}
                              placeholder="KONUT / OTEL / TİCARİ"
                              className="h-12 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)] placeholder:text-[color:var(--text-muted)]"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">
                              Departman
                            </label>
                            <select
                              value={formData.department}
                              onChange={(event) =>
                                setFormData({ ...formData, department: event.target.value })
                              }
                              className="h-12 w-full rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] px-4 text-sm text-[color:var(--text)] outline-none"
                            >
                              {DEPARTMENT_OPTIONS.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">
                              Müşteri
                            </label>
                            <Input
                              value={formData.client}
                              onChange={(event) => setFormData({ ...formData, client: event.target.value })}
                              placeholder="Özel Müşteri / Bodrum"
                              className="h-12 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)] placeholder:text-[color:var(--text-muted)]"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">
                                Yıl
                              </label>
                              <Input
                                value={formData.year}
                                onChange={(event) => setFormData({ ...formData, year: event.target.value })}
                                placeholder="2025"
                                className="h-12 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)] placeholder:text-[color:var(--text-muted)]"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">
                                Alan
                              </label>
                              <Input
                                value={formData.area}
                                onChange={(event) => setFormData({ ...formData, area: event.target.value })}
                                placeholder="650 m²"
                                className="h-12 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)] placeholder:text-[color:var(--text-muted)]"
                              />
                            </div>
                          </div>
                          <div className="lg:col-span-2 space-y-2">
                            <label className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">
                              Özet
                            </label>
                            <Textarea
                              value={formData.description}
                              onChange={(event) =>
                                setFormData({ ...formData, description: event.target.value })
                              }
                              placeholder="Projenin kısa tanımı..."
                              rows={4}
                              className="min-h-28 rounded-[1.25rem] border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)] placeholder:text-[color:var(--text-muted)]"
                            />
                          </div>
                        </CardContent>
                      </Card>

                      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
                        <Card className="border border-[color:var(--line)] bg-[color:var(--surface)] shadow-none">
                          <CardHeader className="pb-4">
                            <CardTitle className="text-base text-[color:var(--text)]">
                              Kapak Görseli
                            </CardTitle>
                            <CardDescription className="text-[color:var(--text-muted)]">
                              Sürükle-bırak yapabilir veya dosya seçebilirsiniz.
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div
                              className={`group relative flex aspect-[16/10] cursor-pointer items-center justify-center overflow-hidden rounded-[1.5rem] border-2 border-dashed ${
                                dragOverCover
                                  ? 'border-[color:var(--accent)] bg-[color:var(--surface-muted)]'
                                  : 'border-[color:var(--line)] bg-[color:var(--surface-muted)]'
                              }`}
                              onClick={() => coverInputRef.current?.click()}
                              onDragOver={(event) => {
                                event.preventDefault();
                                setDragOverCover(true);
                              }}
                              onDragLeave={() => setDragOverCover(false)}
                              onDrop={handleDropCover}
                            >
                              {formData.coverImage ? (
                                <img
                                  src={formData.coverImage}
                                  alt="Kapak önizleme"
                                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                />
                              ) : (
                                <div className="flex flex-col items-center gap-3 p-6 text-center">
                                  <div className="rounded-2xl bg-[color:var(--accent)]/10 p-4 text-[color:var(--accent)]">
                                    {uploading ? (
                                      <Loader2 className="h-7 w-7 animate-spin" />
                                    ) : (
                                      <Upload className="h-7 w-7" />
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-[color:var(--text)]">
                                      Dosyayı bırakın veya tıklayın
                                    </p>
                                    <p className="mt-1 text-xs text-[color:var(--text-muted)]">
                                      Önerilen oran 16:10
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                            <input
                              ref={coverInputRef}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(event) => handleImageUpload(event, true)}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)]"
                              onClick={() => coverInputRef.current?.click()}
                            >
                              <ImageIcon className="mr-2 h-4 w-4" />
                              Kapak seç
                            </Button>
                          </CardContent>
                        </Card>

                        <Card className="border border-[color:var(--line)] bg-[color:var(--surface)] shadow-none">
                          <CardHeader className="pb-4">
                            <CardTitle className="text-base text-[color:var(--text)]">
                              Galeri ve Detaylar
                            </CardTitle>
                            <CardDescription className="text-[color:var(--text-muted)]">
                              Galeri öğelerini alt metinleriyle birlikte yönetin.
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div
                              className={`rounded-[1.5rem] border-2 border-dashed p-4 ${
                                dragOverGallery
                                  ? 'border-[color:var(--accent)] bg-[color:var(--surface-muted)]'
                                  : 'border-[color:var(--line)] bg-[color:var(--surface-muted)]'
                              }`}
                              onDragOver={(event) => {
                                event.preventDefault();
                                setDragOverGallery(true);
                              }}
                              onDragLeave={() => setDragOverGallery(false)}
                              onDrop={handleDropGallery}
                            >
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                  <p className="text-sm font-medium text-[color:var(--text)]">
                                    Galeri ekleyin
                                  </p>
                                  <p className="text-xs text-[color:var(--text-muted)]">
                                    Birden fazla görsel bırakabilirsiniz.
                                  </p>
                                </div>
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]"
                                  onClick={() => galleryInputRef.current?.click()}
                                >
                                  <Plus className="mr-2 h-4 w-4" />
                                  Görsel Ekle
                                </Button>
                              </div>
                              <input
                                ref={galleryInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={(event) => handleImageUpload(event, false)}
                              />
                            </div>

                            <div className="grid gap-3">
                              {formData.gallery.length > 0 ? (
                                formData.gallery.map((item, index) => (
                                  <div
                                    key={`${item.url}-${index}`}
                                    className="flex gap-3 rounded-[1.25rem] border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-3"
                                  >
                                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-[color:var(--line)] bg-[color:var(--surface)]">
                                      <img
                                        src={item.url}
                                        alt={item.imageAlt || 'Galeri görseli'}
                                        className="h-full w-full object-cover"
                                      />
                                    </div>
                                    <div className="min-w-0 flex-1 space-y-2">
                                      <Input
                                        value={item.imageAlt}
                                        onChange={(event) =>
                                          updateGalleryItem(index, 'imageAlt', event.target.value)
                                        }
                                        placeholder="SEO alt metni"
                                        className="h-10 rounded-xl border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)] placeholder:text-[color:var(--text-muted)]"
                                      />
                                      <Input
                                        value={item.caption}
                                        onChange={(event) =>
                                          updateGalleryItem(index, 'caption', event.target.value)
                                        }
                                        placeholder="Altyazı"
                                        className="h-10 rounded-xl border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)] placeholder:text-[color:var(--text-muted)]"
                                      />
                                    </div>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      className="h-10 w-10 border-rose-500/20 bg-rose-500/10 text-rose-700 hover:bg-rose-500 hover:text-white dark:text-rose-300"
                                      onClick={() =>
                                        setFormData((prev) => ({
                                          ...prev,
                                          gallery: prev.gallery.filter((_, current) => current !== index),
                                        }))
                                      }
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))
                              ) : (
                                <div className="rounded-[1.25rem] border border-dashed border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4 text-sm text-[color:var(--text-muted)]">
                                  Henüz galeri yok. Buradan ekleyebilirsiniz.
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                        <Card className="border border-[color:var(--line)] bg-[color:var(--surface)] shadow-none">
                          <CardHeader className="pb-4">
                            <CardTitle className="text-base text-[color:var(--text)]">
                              Yayın ve Kategori
                            </CardTitle>
                            <CardDescription className="text-[color:var(--text-muted)]">
                              Hangi alanlarda yayınlanacağını belirleyin.
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-5">
                            <div className="grid gap-3">
                              {TARGET_OPTIONS.map((option) => {
                                const active = formData.publishTargets[option.key];
                                return (
                                  <button
                                    key={option.key}
                                    type="button"
                                    onClick={() => togglePublishTarget(option.key)}
                                    className={`flex items-center justify-between rounded-[1.25rem] border px-4 py-4 text-left transition-colors ${
                                      active
                                        ? 'border-[color:var(--accent)] bg-[color:var(--accent)]/10'
                                        : 'border-[color:var(--line)] bg-[color:var(--surface-muted)] hover:bg-[color:var(--surface)]'
                                    }`}
                                  >
                                    <div>
                                      <p className="text-sm font-medium text-[color:var(--text)]">
                                        {option.label}
                                      </p>
                                      <p className="mt-1 text-xs text-[color:var(--text-muted)]">
                                        Bu proje bu kanalda görünür.
                                      </p>
                                    </div>
                                    <Badge
                                      className={`border ${
                                        active
                                          ? 'border-[color:var(--accent)] bg-[color:var(--accent)] text-[color:var(--text-inverse)]'
                                          : 'border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text-muted)]'
                                      }`}
                                    >
                                      {active ? 'Aktif' : 'Pasif'}
                                    </Badge>
                                  </button>
                                );
                              })}
                            </div>

                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <p className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">
                                  Kategoriler
                                </p>
                                <span className="text-xs text-[color:var(--text-muted)]">
                                  {formData.categories.length} seçili
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {CATEGORY_OPTIONS.map((category) => {
                                  const active = formData.categories.includes(category);
                                  return (
                                    <button
                                      key={category}
                                      type="button"
                                      onClick={() => toggleCategory(category)}
                                      className={`rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
                                        active
                                          ? 'border-[color:var(--accent)] bg-[color:var(--accent)] text-[color:var(--text-inverse)]'
                                          : 'border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)] hover:bg-[color:var(--surface)]'
                                      }`}
                                    >
                                      {category}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border border-[color:var(--line)] bg-[color:var(--surface)] shadow-none">
                          <CardHeader className="pb-4">
                            <CardTitle className="text-base text-[color:var(--text)]">SEO ve Anlatım</CardTitle>
                            <CardDescription className="text-[color:var(--text-muted)]">
                              Katalog ve arama motoru metinlerini düzenleyin.
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">
                                Hikaye
                              </label>
                              <Textarea
                                value={formData.story}
                                onChange={(event) => setFormData({ ...formData, story: event.target.value })}
                                rows={4}
                                className="min-h-28 rounded-[1.25rem] border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)] placeholder:text-[color:var(--text-muted)]"
                                placeholder="Projenin yaratım süreci..."
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">
                                Vizyon
                              </label>
                              <Textarea
                                value={formData.vision}
                                onChange={(event) => setFormData({ ...formData, vision: event.target.value })}
                                rows={4}
                                className="min-h-28 rounded-[1.25rem] border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)] placeholder:text-[color:var(--text-muted)]"
                                placeholder="Tasarım vizyonu..."
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">
                                Teknik Detaylar
                              </label>
                              <Textarea
                                value={formData.techDetails}
                                onChange={(event) =>
                                  setFormData({ ...formData, techDetails: event.target.value })
                                }
                                rows={4}
                                className="min-h-28 rounded-[1.25rem] border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)] placeholder:text-[color:var(--text-muted)]"
                                placeholder="Malzeme ve teknik detaylar..."
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">
                                SEO Başlığı
                              </label>
                              <Input
                                value={formData.seoMeta.title}
                                onChange={(event) =>
                                  setFormData({
                                    ...formData,
                                    seoMeta: { ...formData.seoMeta, title: event.target.value },
                                  })
                                }
                                className="h-12 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)] placeholder:text-[color:var(--text-muted)]"
                                placeholder="Sayfa başlığı"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">
                                SEO Açıklama
                              </label>
                              <Textarea
                                value={formData.seoMeta.description}
                                onChange={(event) =>
                                  setFormData({
                                    ...formData,
                                    seoMeta: { ...formData.seoMeta, description: event.target.value },
                                  })
                                }
                                rows={3}
                                className="min-h-24 rounded-[1.25rem] border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)] placeholder:text-[color:var(--text-muted)]"
                                placeholder="Meta description"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">
                                SEO Anahtar Kelimeler
                              </label>
                              <Input
                                value={formData.seoMeta.keywords}
                                onChange={(event) =>
                                  setFormData({
                                    ...formData,
                                    seoMeta: { ...formData.seoMeta, keywords: event.target.value },
                                  })
                                }
                                className="h-12 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)] placeholder:text-[color:var(--text-muted)]"
                                placeholder="villa, mimari, lüks konut"
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>

                  <div className="sticky bottom-0 border-t border-[color:var(--line)] bg-[color:var(--surface)] px-5 py-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm text-[color:var(--text-muted)]">
                        {editingProject ? 'Mevcut proje üzerinde çalışıyorsunuz.' : 'Yeni proje kaydı oluşturulacak.'}
                      </p>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <Button
                          type="button"
                          variant="outline"
                          className="border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)]"
                          onClick={closeModal}
                        >
                          Vazgeç
                        </Button>
                        <Button
                          type="submit"
                          className="bg-[color:var(--accent)] text-[color:var(--text-inverse)] hover:bg-[color:var(--accent-soft)]"
                          disabled={isSubmitting || uploading}
                        >
                          {isSubmitting ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Settings2 className="mr-2 h-4 w-4" />
                          )}
                          {isSubmitting
                            ? 'Kaydediliyor...'
                            : editingProject
                              ? 'Değişiklikleri Kaydet'
                              : 'Projeyi Yayınla'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
