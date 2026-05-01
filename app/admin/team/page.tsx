'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import {
  AlertCircle,
  ArrowDownUp,
  CheckCircle2,
  CircleAlert,
  CloudUpload,
  Edit3,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Sparkles,
  Trash2,
  Upload,
  Users,
  X,
} from 'lucide-react';

import { useNotification } from '@/components/admin/AdminNotificationProvider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

type TeamCategoryKey =
  | 'mimarlik'
  | 'ic-mimarlik'
  | 'restorasyon'
  | 'peyzaj'
  | 'insaat-muhendisligi'
  | 'elektrik-elektronik-muhendisligi'
  | 'plan-proje'
  | 'uygulama'
  | 'malzeme';

type TeamMember = {
  _id: string;
  name: string;
  role: string;
  category: TeamCategoryKey;
  image?: string;
  bio?: string;
  order?: number;
  socials?: {
    linkedin?: string;
    instagram?: string;
  };
  createdAt?: string;
  updatedAt?: string;
};

type ApiCheckState = {
  team: ApiProbeState;
  migration: ApiProbeState;
  upload: ApiProbeState;
  lastChecked?: string;
};

type ApiProbeState = 'idle' | 'loading' | 'ok' | 'error';

type TeamFormState = {
  name: string;
  role: string;
  category: TeamCategoryKey;
  image: string;
  bio: string;
  order: number;
  socials: {
    linkedin: string;
    instagram: string;
  };
};

const TEAM_CATEGORIES: Array<{ key: TeamCategoryKey | 'all'; title: string; description: string }> = [
  { key: 'all', title: 'Hepsi', description: 'Tüm ekip üyeleri' },
  { key: 'mimarlik', title: 'Mimarlık', description: 'Proje ve konsept geliştirme' },
  { key: 'ic-mimarlik', title: 'İç Mimarlık', description: 'İç mekan tasarım ekibi' },
  { key: 'restorasyon', title: 'Restorasyon', description: 'Koruma ve onarım uzmanlığı' },
  { key: 'peyzaj', title: 'Peyzaj', description: 'Dış mekan ve çevre tasarımı' },
  { key: 'insaat-muhendisligi', title: 'İnşaat Müh.', description: 'Yapısal çözüm ekibi' },
  { key: 'elektrik-elektronik-muhendisligi', title: 'Elektrik / Elektronik', description: 'Teknik altyapı ekibi' },
  { key: 'plan-proje', title: 'Plan / Proje', description: 'Planlama ve proje koordinasyonu' },
  { key: 'uygulama', title: 'Uygulama', description: 'Sahadaki uygulama ekibi' },
  { key: 'malzeme', title: 'Malzeme', description: 'Materyal ve ürün seçimi' },
];

const TEAM_CATEGORY_OPTIONS = TEAM_CATEGORIES.filter((item) => item.key !== 'all') as Array<{
  key: TeamCategoryKey;
  title: string;
  description: string;
}>;

const emptyFormState: TeamFormState = {
  name: '',
  role: '',
  category: 'mimarlik',
  image: '',
  bio: '',
  order: 99,
  socials: {
    linkedin: '',
    instagram: '',
  },
};

const apiProbeLabel: Record<ApiProbeState, string> = {
  idle: 'Hazır',
  loading: 'Kontrol ediliyor',
  ok: 'Çalışıyor',
  error: 'Hata',
};

const apiProbeTone: Record<ApiProbeState, string> = {
  idle: 'border-white/10 bg-white/5 text-zinc-200',
  loading: 'border-amber-500/20 bg-amber-500/10 text-amber-200',
  ok: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200',
  error: 'border-rose-500/20 bg-rose-500/10 text-rose-200',
};

const statusIcon = (status: ApiProbeState) => {
  if (status === 'ok') return CheckCircle2;
  if (status === 'error') return CircleAlert;
  if (status === 'loading') return Loader2;
  return AlertCircle;
};

const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'Tarih yok';

export default function TeamManagementPage() {
  const { showToast, confirm } = useNotification();
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<TeamCategoryKey | 'all'>('all');
  const [apiChecks, setApiChecks] = useState<ApiCheckState>({
    team: 'loading',
    migration: 'idle',
    upload: 'idle',
  });
  const [formData, setFormData] = useState<TeamFormState>(emptyFormState);

  const fetchMembers = useCallback(async () => {
    const response = await fetch('/api/admin/team', { cache: 'no-store' });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error || 'Ekip listesi alınamadı');
    }

    return Array.isArray(data) ? (data as TeamMember[]) : [];
  }, []);

  const runApiChecks = useCallback(async () => {
    setApiChecks((prev) => ({
      ...prev,
      team: 'loading',
      migration: 'loading',
      upload: 'loading',
    }));

    const results = await Promise.allSettled([
      fetch('/api/admin/team', { cache: 'no-store' }),
      fetch('/api/admin/migrate/team', { cache: 'no-store' }),
      fetch('/api/upload', { cache: 'no-store' }),
    ]);

    const [teamResult, migrationResult, uploadResult] = results;

    setApiChecks({
      team: teamResult.status === 'fulfilled' && teamResult.value.ok ? 'ok' : 'error',
      migration: migrationResult.status === 'fulfilled' && migrationResult.value.ok ? 'ok' : 'error',
      upload: uploadResult.status === 'fulfilled' && uploadResult.value.ok ? 'ok' : 'error',
      lastChecked: new Date().toLocaleString('tr-TR'),
    });
  }, []);

  const loadDashboard = useCallback(async () => {
    setLoading(true);

    try {
      const [teamMembers] = await Promise.all([fetchMembers(), runApiChecks()]);
      setMembers(teamMembers);
    } catch (error) {
      console.error(error);
      showToast(error instanceof Error ? error.message : 'Ekip verileri yüklenemedi', 'error');
    } finally {
      setLoading(false);
    }
  }, [fetchMembers, runApiChecks, showToast]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const resetForm = useCallback(() => {
    setFormData(emptyFormState);
    setEditingMember(null);
  }, []);

  const openCreateModal = useCallback(() => {
    resetForm();
    setIsModalOpen(true);
  }, [resetForm]);

  const openEditModal = useCallback((member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      category: member.category,
      image: member.image || '',
      bio: member.bio || '',
      order: member.order ?? 99,
      socials: {
        linkedin: member.socials?.linkedin || '',
        instagram: member.socials?.instagram || '',
      },
    });
    setIsModalOpen(true);
  }, []);

  const handleUpload = useCallback(async (file: File) => {
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('filename', file.name);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Görsel yüklenemedi');
      }

      if (!data?.url) {
        throw new Error('Upload API geçerli bir URL döndürmedi');
      }

      setFormData((prev) => ({ ...prev, image: data.url }));
      showToast('Görsel başarıyla yüklendi', 'success');
    } catch (error) {
      console.error(error);
      showToast(error instanceof Error ? error.message : 'Görsel yüklenemedi', 'error');
    } finally {
      setIsUploading(false);
    }
  }, [showToast]);

  const handleSave = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsSaving(true);

      try {
        const endpoint = editingMember ? `/api/admin/team/${editingMember._id}` : '/api/admin/team';
        const method = editingMember ? 'PUT' : 'POST';

        const response = await fetch(endpoint, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error || 'Üye kaydedilemedi');
        }

        setMembers((prev) => {
          if (editingMember) {
            return prev.map((member) => (member._id === editingMember._id ? data : member));
          }

          return [data, ...prev];
        });

        showToast(editingMember ? 'Üye güncellendi' : 'Yeni üye oluşturuldu', 'success');
        setIsModalOpen(false);
        resetForm();
        await runApiChecks();
      } catch (error) {
        console.error(error);
        showToast(error instanceof Error ? error.message : 'Kayıt işlemi başarısız', 'error');
      } finally {
        setIsSaving(false);
      }
    },
    [editingMember, formData, resetForm, runApiChecks, showToast],
  );

  const handleDelete = useCallback(
    async (member: TeamMember) => {
      const accepted = await confirm({
        title: 'Üyeyi sil',
        message: `${member.name} kaydını silmek istiyor musunuz? Bu işlem geri alınamaz.`,
        confirmText: 'SİL',
        cancelText: 'VAZGEÇ',
        isDanger: true,
      });

      if (!accepted) return;

      try {
        const response = await fetch(`/api/admin/team/${member._id}`, { method: 'DELETE' });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || 'Silme işlemi başarısız');
        }

        setMembers((prev) => prev.filter((item) => item._id !== member._id));
        showToast('Üye silindi', 'success');
        await runApiChecks();
      } catch (error) {
        console.error(error);
        showToast(error instanceof Error ? error.message : 'Silme işlemi başarısız', 'error');
      }
    },
    [confirm, runApiChecks, showToast],
  );

  const runMigration = useCallback(async () => {
    const accepted = await confirm({
      title: 'Varsayılan ekip aktarımı',
      message: 'Veritabanında ekip üyesi yoksa varsayılan kayıtlar içeri aktarılacak. Devam edilsin mi?',
      confirmText: 'AKTAR',
      cancelText: 'İPTAL',
    });

    if (!accepted) return;

    setIsMigrating(true);

    try {
      const response = await fetch('/api/admin/migrate/team', { method: 'POST' });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Migration başarısız');
      }

      showToast(data?.message || 'Varsayılan ekip aktarıldı', 'success');
      await loadDashboard();
    } catch (error) {
      console.error(error);
      showToast(error instanceof Error ? error.message : 'Migration başarısız', 'error');
    } finally {
      setIsMigrating(false);
    }
  }, [confirm, loadDashboard, showToast]);

  const filteredMembers = useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase();

    return members.filter((member) => {
      const matchesFilter = activeFilter === 'all' || member.category === activeFilter;
      const matchesSearch =
        !normalized ||
        member.name.toLowerCase().includes(normalized) ||
        member.role.toLowerCase().includes(normalized) ||
        (member.bio || '').toLowerCase().includes(normalized);

      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, members, searchQuery]);

  const stats = useMemo(() => {
    const categoriesCount = new Set(members.map((member) => member.category)).size;
    const missingImageCount = members.filter((member) => !member.image).length;
    return {
      total: members.length,
      categories: categoriesCount,
      missingImages: missingImageCount,
    };
  }, [members]);

  const getCategoryTitle = useCallback((category: TeamCategoryKey) => {
    return TEAM_CATEGORIES.find((item) => item.key === category)?.title || category;
  }, []);

  const renderProbe = (label: string, state: ApiProbeState, description: string) => {
    const Icon = statusIcon(state);

    return (
      <div className={`rounded-2xl border p-4 ${apiProbeTone[state]}`}>
        <div className="flex items-center gap-3">
          <div className="rounded-full border border-current/20 bg-black/10 p-2">
            <Icon className={state === 'loading' ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.24em]">{label}</p>
            <p className="mt-1 text-sm font-medium">{apiProbeLabel[state]}</p>
          </div>
        </div>
        <p className="mt-3 text-xs leading-5 opacity-80">{description}</p>
      </div>
    );
  };

  return (
    <div className="relative min-h-full overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(166,137,102,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_30%)]" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
          <Card className="border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))]">
            <CardHeader className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-3">
                  <Badge variant="outline" className="border-amber-400/25 bg-amber-400/10 text-amber-200">
                    ekip yönetimi
                  </Badge>
                  <div className="space-y-2">
                    <CardTitle className="text-3xl font-semibold tracking-[0.12em] text-zinc-50 sm:text-4xl">
                      DEQOIN TEAM STUDIO
                    </CardTitle>
                    <CardDescription className="max-w-2xl text-base text-zinc-300">
                      Ekip üyelerini departman bazında yönetin, görsel ve sosyal bağlantıları güncelleyin, API uçlarını tek panelde doğrulayın.
                    </CardDescription>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={loadDashboard} className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Yenile
                  </Button>
                  <Button onClick={openCreateModal} className="bg-amber-500 text-zinc-950 hover:bg-amber-400">
                    <Plus className="mr-2 h-4 w-4" />
                    Yeni Üye
                  </Button>
                </div>
              </div>

              <Separator className="bg-white/10" />

              <div className="grid gap-3 sm:grid-cols-3">
                <Card className="border-white/10 bg-white/5">
                  <CardContent className="p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">Toplam Üye</p>
                    <p className="mt-3 text-3xl font-semibold text-zinc-50">{stats.total}</p>
                  </CardContent>
                </Card>
                <Card className="border-white/10 bg-white/5">
                  <CardContent className="p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">Aktif Departman</p>
                    <p className="mt-3 text-3xl font-semibold text-zinc-50">{stats.categories}</p>
                  </CardContent>
                </Card>
                <Card className="border-white/10 bg-white/5">
                  <CardContent className="p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">Eksik Görsel</p>
                    <p className="mt-3 text-3xl font-semibold text-zinc-50">{stats.missingImages}</p>
                  </CardContent>
                </Card>
              </div>
            </CardHeader>
          </Card>

          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg tracking-[0.08em]">API Sağlık Kontrolü</CardTitle>
                  <CardDescription>Liste, migration ve upload uçlarının son durumu.</CardDescription>
                </div>
                <Sparkles className="h-5 w-5 text-amber-200" />
              </div>
            </CardHeader>
            <CardContent className="grid gap-3">
              {renderProbe('Team list', apiChecks.team, 'GET /api/admin/team ile listeleme ve sıralama testi')}
              {renderProbe('Migration', apiChecks.migration, 'GET /api/admin/migrate/team ile varsayılan kayıt akışı testi')}
              {renderProbe('Upload', apiChecks.upload, 'GET /api/upload ile medya yükleme servis testi')}
              <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">Son kontrol</p>
                <p className="mt-2 text-sm text-zinc-200">{apiChecks.lastChecked || 'Henüz kontrol edilmedi'}</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
          <Card className="border-white/10 bg-white/5">
            <CardHeader className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg tracking-[0.08em]">Arama ve Filtre</CardTitle>
                  <CardDescription>İsim, rol veya biyografi içinde arayın.</CardDescription>
                </div>
                <Search className="h-5 w-5 text-zinc-400" />
              </div>

              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <Input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="İsim, rol veya biyografi ara"
                  className="h-12 rounded-2xl pl-11"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3">
                {TEAM_CATEGORIES.map((category) => (
                  <button
                    key={category.key}
                    type="button"
                    onClick={() => setActiveFilter(category.key)}
                    className={`rounded-2xl border px-3 py-3 text-left transition-all ${
                      activeFilter === category.key
                        ? 'border-amber-400/30 bg-amber-400/10 text-amber-100'
                        : 'border-white/10 bg-white/5 text-zinc-200 hover:border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-medium">{category.title}</span>
                      {category.key === 'all' ? <ArrowDownUp className="h-4 w-4 opacity-70" /> : <Users className="h-4 w-4 opacity-70" />}
                    </div>
                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-zinc-400">{category.description}</p>
                  </button>
                ))}
              </div>
            </CardHeader>
          </Card>

          <Card className="border-white/10 bg-white/5">
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg tracking-[0.08em]">Ekip Listesi</CardTitle>
                  <CardDescription>
                    {filteredMembers.length} kayıt gösteriliyor
                    {activeFilter !== 'all' ? `, filtre: ${getCategoryTitle(activeFilter)}` : ''}
                  </CardDescription>
                </div>
                <Badge variant="secondary">{members.length} kayıt</Badge>
              </div>
              <Separator className="bg-white/10" />
            </CardHeader>

            <CardContent>
              {loading ? (
                <div className="flex min-h-[360px] items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-amber-200" />
                </div>
              ) : filteredMembers.length === 0 ? (
                <div className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-black/10 px-6 text-center">
                  {members.length === 0 ? (
                    <>
                      <Users className="h-10 w-10 text-amber-200/70" />
                      <p className="mt-4 text-lg font-medium text-zinc-100">Veritabanı boş</p>
                      <p className="mt-2 max-w-md text-sm leading-6 text-zinc-400">
                        Henüz ekip üyesi yok. İsterseniz varsayılan kayıtları aktarabilir veya yeni üyeleri manuel oluşturabilirsiniz.
                      </p>
                      <div className="mt-6 flex flex-wrap justify-center gap-3">
                        <Button
                          variant="outline"
                          onClick={runMigration}
                          disabled={isMigrating}
                          className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
                        >
                          {isMigrating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CloudUpload className="mr-2 h-4 w-4" />}
                          Varsayılan Ekip Aktar
                        </Button>
                        <Button onClick={openCreateModal} className="bg-amber-500 text-zinc-950 hover:bg-amber-400">
                          <Plus className="mr-2 h-4 w-4" />
                          Yeni Üye Oluştur
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <Search className="h-10 w-10 text-zinc-500" />
                      <p className="mt-4 text-lg font-medium text-zinc-100">Eşleşen kayıt yok</p>
                      <p className="mt-2 text-sm leading-6 text-zinc-400">
                        Arama terimini değiştirin veya farklı bir departman filtresi seçin.
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  <AnimatePresence mode="popLayout">
                    {filteredMembers.map((member) => (
                      <motion.article
                        key={member._id}
                        layout
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.25 }}
                      >
                        <Card className="h-full overflow-hidden border-white/10 bg-black/10">
                          <div className="relative aspect-[4/3] overflow-hidden border-b border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))]">
                            {member.image ? (
                              <Image
                                src={member.image}
                                alt={member.name}
                                fill
                                className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                                sizes="(max-width: 768px) 100vw, 50vw"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <Users className="h-12 w-12 text-white/20" />
                              </div>
                            )}

                            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                              <Badge variant="secondary">{getCategoryTitle(member.category)}</Badge>
                              <Badge variant="outline" className="border-white/10 bg-black/40 text-zinc-100">
                                Sıra #{member.order ?? 99}
                              </Badge>
                            </div>
                          </div>

                          <CardContent className="space-y-4 p-5">
                            <div className="space-y-2">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="text-lg font-semibold tracking-[0.04em] text-zinc-50">{member.name}</p>
                                  <p className="mt-1 text-sm text-zinc-400">{member.role}</p>
                                </div>
                                <div className="rounded-full border border-white/10 bg-white/5 p-2 text-zinc-300">
                                  <Shield className="h-4 w-4" />
                                </div>
                              </div>

                              <p className="line-clamp-3 min-h-[3.5rem] text-sm leading-6 text-zinc-300">
                                {member.bio || 'Bu üye için biyografi eklenmemiş.'}
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs text-zinc-400">
                              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                                <p className="uppercase tracking-[0.22em]">LinkedIn</p>
                                <p className="mt-2 truncate text-zinc-200">{member.socials?.linkedin || 'Boş'}</p>
                              </div>
                              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                                <p className="uppercase tracking-[0.22em]">Instagram</p>
                                <p className="mt-2 truncate text-zinc-200">{member.socials?.instagram || 'Boş'}</p>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400">
                              <span>Oluşturma: {formatDate(member.createdAt)}</span>
                              <span>Güncelleme: {formatDate(member.updatedAt)}</span>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                onClick={() => openEditModal(member)}
                                className="flex-1 border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
                              >
                                <Edit3 className="mr-2 h-4 w-4" />
                                Düzenle
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => handleDelete(member)}
                                className="border-rose-500/20 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.article>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(16,16,16,0.96),rgba(10,10,10,0.98))] shadow-[0_30px_120px_rgba(0,0,0,0.65)]"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-5 sm:px-8">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-amber-200">Ekip Formu</p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-[0.08em] text-zinc-50">
                    {editingMember ? 'Üyeyi Düzenle' : 'Yeni Üye Ekle'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="rounded-full border border-white/10 bg-white/5 p-2 text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Kapat"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="grid gap-6 p-6 sm:p-8 xl:grid-cols-[300px_1fr]">
                <div className="space-y-4">
                  <Card className="border-white/10 bg-white/5">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-base tracking-[0.08em]">Profil Görseli</CardTitle>
                      <CardDescription>PNG veya JPEG yükleyin. Görsel değişince kart önizlemesi güncellenir.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        className="group relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-3xl border border-dashed border-white/15 bg-black/20 transition-colors hover:border-amber-400/40 hover:bg-white/5"
                      >
                        {formData.image ? (
                          <Image src={formData.image} alt="Üye önizleme" fill className="h-full w-full object-cover" sizes="320px" />
                        ) : (
                          <div className="flex flex-col items-center gap-3 text-zinc-400">
                            <Upload className="h-7 w-7 transition-transform group-hover:scale-110" />
                            <span className="text-sm">Görsel yükle</span>
                          </div>
                        )}
                      </button>
                      <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (file) {
                            void handleUpload(file);
                          }
                          event.currentTarget.value = '';
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => imageInputRef.current?.click()}
                        disabled={isUploading}
                        className="w-full border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
                      >
                        {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CloudUpload className="mr-2 h-4 w-4" />}
                        {isUploading ? 'Yükleniyor' : 'Görsel Seç'}
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-white/10 bg-white/5">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-base tracking-[0.08em]">Hızlı Bilgi</CardTitle>
                      <CardDescription>Bu form doğrudan /api/admin/team ile konuşur.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-zinc-300">
                      <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/10 p-3">
                        <span>Form modu</span>
                        <span className="text-zinc-100">{editingMember ? 'PUT /api/admin/team/[id]' : 'POST /api/admin/team'}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/10 p-3">
                        <span>Upload</span>
                        <span className="text-zinc-100">POST /api/upload</span>
                      </div>
                      <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/10 p-3">
                        <span>Son test</span>
                        <span className="text-zinc-100">{apiChecks.lastChecked || 'Bekleniyor'}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-white/10 bg-white/5">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base tracking-[0.08em]">Ekip Detayları</CardTitle>
                    <CardDescription>İsim, rol, departman, sıralama ve sosyal bağlantılar.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid gap-5 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">Ad Soyad</label>
                        <Input
                          required
                          value={formData.name}
                          onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                          placeholder="Örn. Alp Yılmaz"
                          className="h-12 rounded-2xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">Ünvan / Rol</label>
                        <Input
                          required
                          value={formData.role}
                          onChange={(event) => setFormData((prev) => ({ ...prev, role: event.target.value }))}
                          placeholder="Örn. Kurucu Mimar"
                          className="h-12 rounded-2xl"
                        />
                      </div>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">Departman</label>
                        <Select
                          value={formData.category}
                          onChange={(event) =>
                            setFormData((prev) => ({ ...prev, category: event.target.value as TeamCategoryKey }))
                          }
                          className="h-12 rounded-2xl"
                        >
                          {TEAM_CATEGORY_OPTIONS.map((category) => (
                            <option key={category.key} value={category.key}>
                              {category.title}
                            </option>
                          ))}
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">Sıralama</label>
                        <Input
                          type="number"
                          value={formData.order}
                          onChange={(event) =>
                            setFormData((prev) => ({
                              ...prev,
                              order: Number.isNaN(event.target.valueAsNumber) ? 99 : event.target.valueAsNumber,
                            }))
                          }
                          className="h-12 rounded-2xl"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">
                        Biyografi / Hakkında
                      </label>
                      <Textarea
                        rows={5}
                        value={formData.bio}
                        onChange={(event) => setFormData((prev) => ({ ...prev, bio: event.target.value }))}
                        placeholder="Ekip üyesinin uzmanlık alanını ve yaklaşımını kısa bir metinle yazın."
                        className="rounded-2xl"
                      />
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">LinkedIn</label>
                        <Input
                          type="url"
                          value={formData.socials.linkedin}
                          onChange={(event) =>
                            setFormData((prev) => ({
                              ...prev,
                              socials: { ...prev.socials, linkedin: event.target.value },
                            }))
                          }
                          placeholder="https://linkedin.com/in/..."
                          className="h-12 rounded-2xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">Instagram</label>
                        <Input
                          type="url"
                          value={formData.socials.instagram}
                          onChange={(event) =>
                            setFormData((prev) => ({
                              ...prev,
                              socials: { ...prev.socials, instagram: event.target.value },
                            }))
                          }
                          placeholder="https://instagram.com/..."
                          className="h-12 rounded-2xl"
                        />
                      </div>
                    </div>

                    <Separator className="bg-white/10" />

                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsModalOpen(false);
                          resetForm();
                        }}
                        className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
                      >
                        İptal
                      </Button>
                      <Button type="submit" disabled={isSaving || isUploading} className="bg-amber-500 text-zinc-950 hover:bg-amber-400">
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                        {isSaving ? 'Kaydediliyor' : 'Kaydet'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
