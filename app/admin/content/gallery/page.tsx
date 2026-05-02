'use client';

import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  Database,
  Eye,
  FolderKanban,
  Image as ImageIcon,
  Loader2,
  RefreshCw,
  Save,
  Search,
  Sparkles,
  Upload,
} from 'lucide-react';

import { useNotification } from '@/components/admin/AdminNotificationProvider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { getGalleryDepartmentOptions, normalizeGalleryProject } from '@/lib/gallery-shared';
import { projectsData, type ProjectDetail } from '@/data/projects';

type ApiStatus = 'idle' | 'loading' | 'ok' | 'error';

type PageForm = {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaHref: string;
};

type ProjectDraft = {
  _id?: string;
  title: string;
  label: string;
  department: string;
  coverImage: string;
  client: string;
  year: string;
  area: string;
  description: string;
  vision: string;
  techDetails: string;
  story: string;
  gallery: string[];
};

type ProjectSource = ProjectDetail & {
  _id?: string;
};

type GalleryPageContent = {
  page?: string;
  sections?: Array<{
    id?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    content?: {
      ctaText?: string;
      ctaHref?: string;
    };
  }>;
};

const DEFAULT_FORM: PageForm = {
  title: 'GALERİ',
  subtitle: 'TÜM ÇALIŞMALARIMIZ & PORTFOLYO',
  description: 'Filtrelenebilir proje havuzu, hızlı detay incelemesi ve güçlü görsel kart deneyimi.',
  ctaText: 'Tüm Galeriyi Gör',
  ctaHref: '/galeri',
};

const DEPARTMENT_OPTIONS = getGalleryDepartmentOptions();

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

function normalizePageContent(payload: GalleryPageContent | null): PageForm {
  const hero = payload?.sections?.find((section) => section.id === 'hero') || payload?.sections?.[0];
  return {
    title: textOrFallback(hero?.title, DEFAULT_FORM.title),
    subtitle: textOrFallback(hero?.subtitle, DEFAULT_FORM.subtitle),
    description: textOrFallback(hero?.description, DEFAULT_FORM.description),
    ctaText: textOrFallback(hero?.content?.ctaText, DEFAULT_FORM.ctaText),
    ctaHref: textOrFallback(hero?.content?.ctaHref, DEFAULT_FORM.ctaHref),
  };
}

function draftFromProject(project: ProjectSource): ProjectDraft {
  return {
    _id: (project as any)._id,
    title: project.title || '',
    label: project.label || '',
    department: project.department || 'MİMARİ TASARIM',
    coverImage: project.coverImage || '',
    client: project.client || '',
    year: project.year || '',
    area: project.area || '',
    description: project.description || '',
    vision: project.vision || '',
    techDetails: project.techDetails || '',
    story: project.story || '',
    gallery: Array.isArray(project.gallery) ? [...project.gallery] : [],
  };
}

export default function GalleryContentAdminPage() {
  const { showToast } = useNotification();
  const [pageForm, setPageForm] = useState<PageForm>(DEFAULT_FORM);
  const [initialPageForm, setInitialPageForm] = useState<PageForm>(DEFAULT_FORM);
  const [projects, setProjects] = useState<ProjectSource[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>('');
  const [draft, setDraft] = useState<ProjectDraft | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingPage, setIsSavingPage] = useState(false);
  const [isSavingProject, setIsSavingProject] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pageStatus, setPageStatus] = useState<ApiStatus>('loading');
  const [projectsStatus, setProjectsStatus] = useState<ApiStatus>('loading');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const pageMeta = probeMeta(pageStatus);
  const projectMeta = probeMeta(projectsStatus);
  const PageStatusIcon = pageMeta.icon;
  const ProjectStatusIcon = projectMeta.icon;

  const syncTheme = useCallback(() => {
    setTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
  }, []);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setPageStatus('loading');
    setProjectsStatus('loading');

    try {
      const [pageRes, projectsRes] = await Promise.all([
        fetch('/api/content?page=galeri', { cache: 'no-store' }),
        fetch('/api/projects', { cache: 'no-store' }),
      ]);

      const pageData = await pageRes.json().catch(() => null);
      const projectData = await projectsRes.json().catch(() => null);

      setPageForm(normalizePageContent(pageRes.ok ? pageData : null));
      setInitialPageForm(clone(normalizePageContent(pageRes.ok ? pageData : null)));
      setPageStatus(pageRes.ok ? 'ok' : 'error');

      const normalizedProjects = Array.isArray(projectData)
        ? projectData.map((item: any) => ({ ...normalizeGalleryProject(item), _id: item?._id }))
        : [];

      const projectList = normalizedProjects.length > 0 ? normalizedProjects : projectsData.map((item) => normalizeGalleryProject(item));
      setProjects(projectList);
      setProjectsStatus(projectsRes.ok ? 'ok' : 'error');

      const first = projectList[0];
      if (first) {
        setSelectedSlug(first.slug);
        setDraft(draftFromProject(first));
      }
    } catch (error) {
      console.error('Gallery admin fetch error:', error);
      const fallbackProjects = projectsData.map((item) => normalizeGalleryProject(item));
      setPageForm(DEFAULT_FORM);
      setInitialPageForm(clone(DEFAULT_FORM));
      setProjects(fallbackProjects);
      setSelectedSlug(fallbackProjects[0]?.slug || '');
      setDraft(fallbackProjects[0] ? draftFromProject(fallbackProjects[0]) : null);
      setPageStatus('error');
      setProjectsStatus('error');
      showToast('Galeri verileri alınamadı, varsayılan içerik yüklendi.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    syncTheme();
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, [syncTheme]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  useEffect(() => {
    const current = projects.find((item) => item.slug === selectedSlug) || projects[0] || null;
    if (!current) {
      setDraft(null);
      return;
    }

    if (!selectedSlug) {
      setSelectedSlug(current.slug);
    }

    setDraft((prev) => {
      if (prev && prev._id === (current as any)._id) {
        return prev;
      }
      return draftFromProject(current);
    });
  }, [projects, selectedSlug]);

  const filteredProjects = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    if (!term) return projects;

    return projects.filter((project) => {
      const haystack = [
        project.title,
        project.label,
        project.department,
        project.client,
        project.year,
        project.area,
        project.description,
        project.vision,
        project.techDetails,
        project.story,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [projects, searchQuery]);

  const selectedProject = useMemo(
    () => projects.find((project) => project.slug === selectedSlug) || projects[0] || null,
    [projects, selectedSlug],
  );

  const updateDraft = (field: keyof ProjectDraft, value: string) => {
    setDraft((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const savePageContent = async () => {
    setIsSavingPage(true);
    try {
      const payload = {
        page: 'galeri',
        title: pageForm.title.trim() || DEFAULT_FORM.title,
        sections: [
          {
            id: 'hero',
            type: 'hero',
            title: pageForm.title.trim() || DEFAULT_FORM.title,
            subtitle: pageForm.subtitle.trim() || DEFAULT_FORM.subtitle,
            description: pageForm.description.trim() || DEFAULT_FORM.description,
            content: {
              ctaText: pageForm.ctaText.trim() || DEFAULT_FORM.ctaText,
              ctaHref: pageForm.ctaHref.trim() || DEFAULT_FORM.ctaHref,
            },
          },
        ],
      };

      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Page content save failed');
      }

      const refreshed = await res.json().catch(() => null);
      setPageForm(normalizePageContent(refreshed));
      setInitialPageForm(clone(normalizePageContent(refreshed)));
      setPageStatus('ok');
      showToast('Galeri sayfası içeriği kaydedildi.', 'success');
    } catch (error) {
      console.error(error);
      setPageStatus('error');
      showToast('Galeri sayfası kaydedilemedi.', 'error');
    } finally {
      setIsSavingPage(false);
    }
  };

  const uploadFile = async (file: File) => {
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

    const uploaded = payload?.url || payload?.downloadUrl;
    if (!uploaded) {
      throw new Error('Upload URL missing');
    }

    return uploaded as string;
  };

  const saveProject = async () => {
    if (!selectedProject?._id || !draft) return;

    setIsSavingProject(true);
    try {
      const res = await fetch(`/api/projects/${selectedProject._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: draft.title,
          label: draft.label,
          department: draft.department,
          coverImage: draft.coverImage,
          client: draft.client,
          year: draft.year,
          area: draft.area,
          description: draft.description,
          vision: draft.vision,
          techDetails: draft.techDetails,
          story: draft.story,
          gallery: draft.gallery.map((url) => ({ url, imageAlt: '', caption: '' })),
        }),
      });

      if (!res.ok) {
        throw new Error('Project save failed');
      }

      const saved = normalizeGalleryProject(await res.json());
      setProjects((prev) => prev.map((project) => (project.slug === saved.slug ? saved : project)));
      setSelectedSlug(saved.slug);
      setDraft(draftFromProject(saved));
      setProjectsStatus('ok');
      showToast('Proje kartı güncellendi.', 'success');
    } catch (error) {
      console.error(error);
      setProjectsStatus('error');
      showToast('Proje güncellenemedi.', 'error');
    } finally {
      setIsSavingProject(false);
    }
  };

  const handleCoverUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !draft) return;

    try {
      const url = await uploadFile(file);
      setDraft((prev) => (prev ? { ...prev, coverImage: url } : prev));
      showToast('Kapak görseli yüklendi.', 'success');
    } catch (error) {
      showToast('Kapak görseli yüklenemedi.', 'error');
    } finally {
      event.target.value = '';
    }
  };

  const handleGalleryUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length || !draft) return;

    try {
      const urls = await Promise.all(files.map((file) => uploadFile(file)));
      setDraft((prev) => (prev ? { ...prev, gallery: [...prev.gallery, ...urls] } : prev));
      showToast('Galeri görselleri eklendi.', 'success');
    } catch (error) {
      showToast('Galeri görselleri eklenemedi.', 'error');
    } finally {
      event.target.value = '';
    }
  };

  const removeGalleryImage = (index: number) => {
    setDraft((prev) =>
      prev ? { ...prev, gallery: prev.gallery.filter((_, current) => current !== index) } : prev,
    );
  };

  const resetPage = () => {
    setPageForm(clone(initialPageForm));
    showToast('Galeri sayfası değişiklikleri geri alındı.', 'info');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[45vh] items-center justify-center text-[color:var(--accent)]">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="overflow-hidden rounded-[2rem] border border-[color:var(--line)] bg-[color:var(--surface)] shadow-[var(--shadow)]">
        <div className="flex flex-col gap-6 p-5 sm:p-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="min-w-0 max-w-3xl space-y-4">
            <Badge className="border border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text-muted)]">
              <Sparkles className="mr-2 h-3 w-3" />
              GALERİ KONTROL MERKEZİ
            </Badge>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-[color:var(--text)] sm:text-4xl">
                Galeri sayfası ve detay modalı yönetimi
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-[color:var(--text-muted)]">
                Galeri giriş metnini, kartların arkasındaki proje verisini ve detay modalında görünen
                içerikleri tek akışta düzenleyin. Aynı veri, public /galeri sayfasına ve proje detayına
                doğrudan yansır.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text-muted)]">
                {projects.length} proje
              </Badge>
              <Badge variant="outline" className="border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text-muted)]">
                Tema: {theme === 'light' ? 'Aydınlık' : 'Karanlık'}
              </Badge>
              <Badge variant="outline" className="border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text-muted)]">
                CTA: {pageForm.ctaHref}
              </Badge>
            </div>
          </div>

          <div className="grid w-full gap-3 sm:grid-cols-2 xl:max-w-[520px] xl:flex-none">
            <div className="min-w-0 rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[color:var(--text-muted)]">Page API</p>
              <p className="mt-1 text-2xl font-semibold text-[color:var(--text)]">/api/content?page=galeri</p>
              <p className="mt-2 text-xs text-[color:var(--text-muted)]">Galeri üst metni ve CTA bu uçta saklanır.</p>
            </div>
            <div className="min-w-0 rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[color:var(--text-muted)]">Project API</p>
              <p className="mt-1 text-2xl font-semibold text-[color:var(--text)]">/api/projects</p>
              <p className="mt-2 text-xs text-[color:var(--text-muted)]">Kart ve modal içeriği doğrudan proje kaydından gelir.</p>
            </div>
            <div className="min-w-0 rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[color:var(--text-muted)]">Page status</p>
              <p className="mt-1 text-2xl font-semibold text-[color:var(--text)]">{pageMeta.label}</p>
              <p className="mt-2 text-xs text-[color:var(--text-muted)]">Açılışta ve kayıtta kontrol edilir.</p>
            </div>
            <div className="min-w-0 rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[color:var(--text-muted)]">Project status</p>
              <p className="mt-1 text-2xl font-semibold text-[color:var(--text)]">{projectMeta.label}</p>
              <p className="mt-2 text-xs text-[color:var(--text-muted)]">Liste ve tekil kayıt bağlantısı burada.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-[color:var(--line)] px-5 py-4 sm:px-6">
          <Button
            type="button"
            className="bg-[color:var(--accent)] text-[color:var(--text-inverse)] hover:bg-[color:var(--accent-soft)]"
            onClick={savePageContent}
            disabled={isSavingPage}
          >
            {isSavingPage ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {isSavingPage ? 'SAYFA KAYDEDİLİYOR...' : 'GALERİ SAYFASINI KAYDET'}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)]"
            onClick={resetPage}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Geri al
          </Button>
          <Button asChild variant="outline" className="border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)]">
            <Link href="/admin/content/home/gallery">
              <ImageIcon className="mr-2 h-4 w-4" />
              Ana Sayfa Slider
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)]">
            <Link href="/admin/projects">
              <FolderKanban className="mr-2 h-4 w-4" />
              Tam Proje Havuzu
            </Link>
          </Button>
        </div>
      </div>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <Card className="border border-[color:var(--line)] bg-[color:var(--surface)] shadow-[var(--shadow)]">
          <CardHeader className="space-y-4 border-b border-[color:var(--line)]">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <CardTitle className="text-lg text-[color:var(--text)]">Galeri Hero İçeriği</CardTitle>
                <CardDescription className="text-[color:var(--text-muted)]">
                  Başlık, alt metin ve CTA metni public /galeri sayfasına yansır.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-5 sm:p-6">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--text-muted)]">Başlık</p>
                <Input value={pageForm.title} onChange={(e) => setPageForm({ ...pageForm, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--text-muted)]">CTA Metni</p>
                <Input value={pageForm.ctaText} onChange={(e) => setPageForm({ ...pageForm, ctaText: e.target.value })} />
              </div>
              <div className="space-y-2 lg:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--text-muted)]">Alt Başlık</p>
                <Input value={pageForm.subtitle} onChange={(e) => setPageForm({ ...pageForm, subtitle: e.target.value })} />
              </div>
              <div className="space-y-2 lg:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--text-muted)]">Açıklama</p>
                <Textarea
                  value={pageForm.description}
                  onChange={(e) => setPageForm({ ...pageForm, description: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="space-y-2 lg:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--text-muted)]">CTA Hedefi</p>
                <Input value={pageForm.ctaHref} onChange={(e) => setPageForm({ ...pageForm, ctaHref: e.target.value })} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[color:var(--line)] bg-[color:var(--surface)] shadow-[var(--shadow)]">
          <CardHeader className="border-b border-[color:var(--line)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="text-lg text-[color:var(--text)]">Canlı Önizleme</CardTitle>
                <CardDescription className="text-[color:var(--text-muted)]">
                  Public sayfanın üst bloğu ve CTA yerleşimi.
                </CardDescription>
              </div>
              <Badge className="border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text-muted)]">
                <Eye className="mr-2 h-3 w-3" />
                Önizleme
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-5 sm:p-6">
            <div className="rounded-[1.75rem] border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-5">
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[color:var(--text-muted)]">
                {pageForm.title}
              </p>
              <h3 className="mt-2 text-3xl font-semibold tracking-tight text-[color:var(--text)]">
                {pageForm.subtitle}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[color:var(--text-muted)]">
                {pageForm.description}
              </p>
              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--text)]">
                {pageForm.ctaText}
                <ChevronRight className="h-3 w-3" />
              </div>
            </div>

            <Separator className="bg-[color:var(--line)]" />

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--text-muted)]">Açılış düzeni</p>
                <p className="mt-1 text-sm text-[color:var(--text)]">Hero + filtreler + hızlı detay modalı</p>
              </div>
              <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--text-muted)]">Bağlantı</p>
                <p className="mt-1 text-sm text-[color:var(--text)]">Public sayfa ve kartlar aynı kaynaktan beslenir</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
        <Card className="min-w-0 border border-[color:var(--line)] bg-[color:var(--surface)] shadow-[var(--shadow)]">
          <CardHeader className="space-y-4 border-b border-[color:var(--line)]">
            <div>
              <CardTitle className="text-lg text-[color:var(--text)]">Galeri Proje Listesi</CardTitle>
              <CardDescription className="text-[color:var(--text-muted)]">
                Kartı seçin ve modal içeriğini panelden düzenleyin.
              </CardDescription>
            </div>

            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--text-muted)]" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Başlık, müşteri, yıl ara..."
                className="h-12 rounded-2xl border-[color:var(--line)] bg-[color:var(--surface-muted)] pl-11 text-[color:var(--text)] placeholder:text-[color:var(--text-muted)]"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-3 p-5 sm:p-6">
            {filteredProjects.map((project) => {
              const active = project.slug === selectedSlug;
              return (
                <button
                  key={project.slug}
                  type="button"
                  onClick={() => {
                    setSelectedSlug(project.slug);
                    setDraft(draftFromProject(project));
                  }}
                  className={`w-full rounded-[1.5rem] border p-3 text-left transition-colors ${
                    active
                      ? 'border-[color:var(--accent)] bg-[color:var(--accent)]/10'
                      : 'border-[color:var(--line)] bg-[color:var(--surface-muted)] hover:bg-[color:var(--surface)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)]">
                      {project.coverImage ? (
                        <Image src={project.coverImage} alt={project.title} fill className="object-cover" sizes="64px" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[color:var(--text-muted)]">
                          <ImageIcon className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[color:var(--text)]">{project.title}</p>
                      <p className="truncate text-xs text-[color:var(--text-muted)]">{project.client || 'Müşteri yok'}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge className="border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text-muted)]">
                          {project.department}
                        </Badge>
                        <Badge className="border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text-muted)]">
                          {project.year}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        <Card className="min-w-0 border border-[color:var(--line)] bg-[color:var(--surface)] shadow-[var(--shadow)]">
          <CardHeader className="space-y-4 border-b border-[color:var(--line)]">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <CardTitle className="text-lg text-[color:var(--text)]">Detay Modal İçeriği</CardTitle>
                <CardDescription className="text-[color:var(--text-muted)]">
                  Seçili proje kartının modal ve detay sayfası burada yönetilir.
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge className={pageMeta.className}>
                  <PageStatusIcon className="mr-2 h-3 w-3" />
                  {pageMeta.label}
                </Badge>
                <Badge className={projectMeta.className}>
                  <ProjectStatusIcon className="mr-2 h-3 w-3" />
                  {projectMeta.label}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 p-5 sm:p-6">
            {draft ? (
              <>
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--text-muted)]">Başlık</p>
                    <Input value={draft.title} onChange={(e) => updateDraft('title', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--text-muted)]">Etiket</p>
                    <Input value={draft.label} onChange={(e) => updateDraft('label', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--text-muted)]">Departman</p>
                    <select
                      value={draft.department}
                      onChange={(e) => updateDraft('department', e.target.value)}
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
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--text-muted)]">Müşteri</p>
                    <Input value={draft.client} onChange={(e) => updateDraft('client', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--text-muted)]">Yıl</p>
                    <Input value={draft.year} onChange={(e) => updateDraft('year', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--text-muted)]">Alan</p>
                    <Input value={draft.area} onChange={(e) => updateDraft('area', e.target.value)} />
                  </div>
                </div>

                <div className="grid gap-4 xl:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
                  <div className="min-w-0 space-y-4">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--text-muted)]">Kapak Görseli</p>
                      <div className="overflow-hidden rounded-[1.5rem] border border-[color:var(--line)] bg-[color:var(--surface-muted)]">
                        <div className="relative aspect-[16/10]">
                          {draft.coverImage ? (
                            <Image src={draft.coverImage} alt={draft.title} fill className="object-cover" sizes="360px" />
                          ) : (
                            <div className="flex h-full items-center justify-center text-[color:var(--text-muted)]">
                              <ImageIcon className="h-7 w-7" />
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 border-t border-[color:var(--line)] p-3">
                          <Button type="button" variant="outline" className="flex-1 border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]" onClick={() => coverInputRef.current?.click()}>
                            <Upload className="mr-2 h-4 w-4" />
                            Kapak Değiştir
                          </Button>
                          <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--text-muted)]">Galeri Görselleri</p>
                      <div className="flex flex-wrap gap-2 rounded-[1.5rem] border border-dashed border-[color:var(--line)] bg-[color:var(--surface-muted)] p-3">
                        <Button type="button" variant="outline" className="border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text)]" onClick={() => galleryInputRef.current?.click()}>
                          <Upload className="mr-2 h-4 w-4" />
                          Görsel Ekle
                        </Button>
                        <input ref={galleryInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} />
                      </div>
                      <div className="grid gap-3">
                        {draft.gallery.length > 0 ? (
                          draft.gallery.map((image, index) => (
                            <div key={`${image}-${index}`} className="flex items-center gap-3 rounded-[1.25rem] border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-3">
                              <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl border border-[color:var(--line)] bg-[color:var(--surface)]">
                                <Image src={image} alt={`${draft.title} ${index + 1}`} fill className="object-cover" sizes="80px" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-[color:var(--text)]">{image}</p>
                                <p className="text-xs text-[color:var(--text-muted)]">Detay modalında görünecek görsel</p>
                              </div>
                              <Button type="button" size="sm" variant="outline" className="border-rose-500/20 bg-rose-500/10 text-rose-700 hover:bg-rose-500 hover:text-white dark:text-rose-300" onClick={() => removeGalleryImage(index)}>
                                Kaldır
                              </Button>
                            </div>
                          ))
                        ) : (
                          <div className="rounded-[1.25rem] border border-dashed border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4 text-sm text-[color:var(--text-muted)]">
                            Henüz galeri görseli yok.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="min-w-0 space-y-4">
                    <div className="grid gap-4 lg:grid-cols-2">
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--text-muted)]">Açıklama</p>
                        <Textarea value={draft.description} onChange={(e) => updateDraft('description', e.target.value)} rows={4} />
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--text-muted)]">Vizyon</p>
                        <Textarea value={draft.vision} onChange={(e) => updateDraft('vision', e.target.value)} rows={4} />
                      </div>
                      <div className="space-y-2 lg:col-span-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--text-muted)]">Teknik Detay</p>
                        <Textarea value={draft.techDetails} onChange={(e) => updateDraft('techDetails', e.target.value)} rows={4} />
                      </div>
                      <div className="space-y-2 lg:col-span-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--text-muted)]">Hikaye</p>
                        <Textarea value={draft.story} onChange={(e) => updateDraft('story', e.target.value)} rows={5} />
                      </div>
                    </div>

                    <Card className="border border-[color:var(--line)] bg-[color:var(--surface-muted)] shadow-none">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-base text-[color:var(--text)]">Detay Kartı Önizleme</CardTitle>
                        <CardDescription className="text-[color:var(--text-muted)]">
                          Kaydetmeden önce modalda hangi metinlerin görüneceğini kontrol edin.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="overflow-hidden rounded-[1.5rem] border border-[color:var(--line)] bg-[color:var(--surface)]">
                          <div className="relative aspect-[16/9]">
                            <Image src={draft.coverImage || '/images/projects/gallery_1.png'} alt={draft.title || 'Önizleme'} fill className="object-cover" sizes="600px" />
                          </div>
                          <div className="space-y-2 p-4">
                            <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[color:var(--text-muted)]">{draft.department}</p>
                            <h3 className="text-xl font-semibold text-[color:var(--text)]">{draft.title || 'Başlıksız proje'}</h3>
                            <p className="text-sm leading-6 text-[color:var(--text-muted)]">{draft.description || 'Açıklama eklenmedi.'}</p>
                            <div className="flex flex-wrap gap-2">
                              <Badge className="border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text-muted)]">
                                {draft.client || 'Müşteri yok'}
                              </Badge>
                              <Badge className="border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text-muted)]">
                                {draft.year || 'Yıl yok'}
                              </Badge>
                              <Badge className="border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text-muted)]">
                                {draft.area || 'Alan yok'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Separator className="bg-[color:var(--line)]" />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2 text-sm text-[color:var(--text-muted)]">
                    <Database className="h-4 w-4" />
                    <span>
                      {selectedProject?.slug} üzerinden kayıt güncellenir ve public modal içeriğine yansır.
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" className="border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)]">
                      <Link href={`/galeri/${selectedProject?.slug}`} target="_blank" rel="noreferrer">
                        Public Detay
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      className="bg-[color:var(--accent)] text-[color:var(--text-inverse)] hover:bg-[color:var(--accent-soft)]"
                      onClick={saveProject}
                      disabled={isSavingProject}
                    >
                      {isSavingProject ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                      {isSavingProject ? 'KAYDEDİLİYOR...' : 'PROJE MODALI KAYDET'}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-[color:var(--line)] bg-[color:var(--surface-muted)] p-8 text-center">
                <p className="text-sm text-[color:var(--text-muted)]">Düzenlenecek proje bulunamadı.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
