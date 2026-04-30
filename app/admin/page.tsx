/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Activity,
  ArrowUpRight,
  Briefcase,
  ChevronRight,
  CircleCheck,
  FolderKanban,
  Image as ImageIcon,
  LayoutDashboard,
  MessageSquare,
  Plus,
  ShieldCheck,
  Sparkles,
  Server,
  SunMoon,
  Users,
  Zap,
  Search,
  FileText,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type Project = {
  _id: string;
  title: string;
  category?: string;
  coverImage?: string;
  status?: string;
  updatedAt?: string;
};

type DashboardStats = {
  appointments: number;
  projects: number;
  team: number;
  studios: number;
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { ease: 'easeOut', duration: 0.45 } },
} as const;

const formatRelativeDate = (value?: string) => {
  if (!value) return 'Güncellenme tarihi yok';
  return new Date(value).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    appointments: 0,
    projects: 0,
    team: 0,
    studios: 12,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

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
    const fetchDashboardData = async () => {
      try {
        const [projRes, teamRes, appRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/admin/team'),
          fetch('/api/admin/appointments'),
        ]);

        const projects = await projRes.json();
        const team = await teamRes.json();
        const appointments = await appRes.json();

        setStats({
          projects: Array.isArray(projects) ? projects.length : 0,
          team: Array.isArray(team) ? team.length : 0,
          appointments: Array.isArray(appointments) ? appointments.length : 0,
          studios: 12,
        });

        setRecentProjects(Array.isArray(projects) ? projects.slice(0, 4) : []);
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const filteredProjects = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    if (!term) return recentProjects;

    return recentProjects.filter((project) => {
      const haystack = [project.title, project.category, project.status]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(term);
    });
  }, [recentProjects, searchQuery]);

  const metricCards = [
    {
      label: 'Randevu Talebi',
      value: isLoading ? '--' : stats.appointments,
      note: 'CRM akışına bağlanmış talepler',
      icon: MessageSquare,
      href: '/admin/crm',
      accent: 'from-amber-400/25 to-amber-400/5',
    },
    {
      label: 'Toplam Proje',
      value: isLoading ? '--' : stats.projects,
      note: 'Aktif ve arşivlenmiş proje toplamı',
      icon: FolderKanban,
      href: '/admin/projects',
      accent: 'from-sky-400/25 to-sky-400/5',
    },
    {
      label: 'Ekip Üyesi',
      value: isLoading ? '--' : stats.team,
      note: 'Panelde aktif yönetim kadrosu',
      icon: Users,
      href: '/admin/team',
      accent: 'from-emerald-400/25 to-emerald-400/5',
    },
    {
      label: 'Birim / Departman',
      value: stats.studios,
      note: 'Stüdyo ve departman katmanları',
      icon: LayoutDashboard,
      href: '/admin/studios/mimarlik',
      accent: 'from-violet-400/20 to-violet-400/5',
    },
  ] as const;

  const activityItems = [
    {
      title: 'Yönetici paneli oturumu açık',
      time: 'Az önce',
      icon: CircleCheck,
    },
    {
      title: 'Tema uyumluluğu etkin',
      time: theme === 'light' ? 'Aydınlık mod' : 'Karanlık mod',
      icon: SunMoon,
    },
    {
      title: 'Yeni içerik akışı hazır',
      time: 'Bugün',
      icon: Sparkles,
    },
  ];

  return (
    <div className="admin-dashboard-shell relative space-y-6 pb-8 [--dash-text:#f8fafc] [--dash-muted:rgba(226,232,240,0.76)] [--dash-faint:rgba(148,163,184,0.96)] [--dash-border:rgba(255,255,255,0.1)] [--dash-surface:rgba(255,255,255,0.04)] [--dash-surface-strong:rgba(255,255,255,0.08)] [--dash-surface-hover:rgba(255,255,255,0.08)] [--dash-panel:rgba(0,0,0,0.2)]">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-28 top-0 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute left-0 top-1/4 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="admin-dashboard-content relative space-y-6"
      >
        <motion.section
          variants={itemVariants}
          className="rounded-[2rem] border border-[color:var(--dash-border)] bg-[color:var(--dash-surface)] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.28)] backdrop-blur-sm sm:p-7"
        >
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl space-y-4">
              <Badge
                variant="secondary"
                className="border border-[color:var(--dash-border)] bg-[color:var(--dash-surface-strong)] text-[color:var(--dash-muted)]"
              >
                <Sparkles className="mr-2 h-3 w-3" />
                CANLI DASHBOARD
              </Badge>
              <div className="space-y-3">
                <h1 className="text-3xl font-semibold tracking-tight text-[color:var(--dash-text)] sm:text-4xl">
                  Sistem Özetiniz
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-[color:var(--dash-muted)]">
                  Yönetim katmanınızı tek bakışta izleyin. Randevular, projeler, ekip ve departmanlar
                  shadcn/ui bileşenleriyle yeniden düzenlendi; tema değiştiğinde tüm yüzeyler ve metinler
                  uyumlu şekilde güncellenir.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[480px]">
              <div className="rounded-2xl border border-[color:var(--dash-border)] bg-[color:var(--dash-panel)] p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-emerald-400/10 p-3 text-emerald-300">
                    <Server className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[color:var(--dash-faint)]">
                      Sistem Sağlığı
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[color:var(--dash-text)]">
                      Sunucu ve SSL aktif
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-[color:var(--dash-border)] bg-[color:var(--dash-panel)] p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-amber-400/10 p-3 text-amber-200">
                    <SunMoon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[color:var(--dash-faint)]">
                      Aktif Tema
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[color:var(--dash-text)]">
                      {theme === 'light' ? 'Aydınlık mod' : 'Karanlık mod'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-[color:var(--dash-border)] bg-[color:var(--dash-panel)] p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-sky-400/10 p-3 text-sky-200">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[color:var(--dash-faint)]">
                      Çalışma Durumu
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[color:var(--dash-text)]">
                      Yönetim paneli çevrimiçi
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-[color:var(--dash-border)] bg-[color:var(--dash-panel)] p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-violet-400/10 p-3 text-violet-200">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[color:var(--dash-faint)]">
                      Build
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[color:var(--dash-text)]">
                      V3.0 core ready
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Button
              asChild
              className="rounded-full bg-amber-400 text-zinc-950 hover:bg-amber-300"
            >
              <Link href="/admin/crm">
                <MessageSquare className="mr-2 h-4 w-4" />
                Randevuları Aç
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-full border-[color:var(--dash-border)] bg-[color:var(--dash-surface)] text-[color:var(--dash-text)] hover:bg-[color:var(--dash-surface-hover)]"
            >
              <Link href="/admin/projects">
                <FolderKanban className="mr-2 h-4 w-4" />
                Projelere Git
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-full border-[color:var(--dash-border)] bg-[color:var(--dash-surface)] text-[color:var(--dash-text)] hover:bg-[color:var(--dash-surface-hover)]"
            >
              <Link href="/admin/settings">
                <ShieldCheck className="mr-2 h-4 w-4" />
                Sistem Ayarları
              </Link>
            </Button>
          </div>
        </motion.section>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metricCards.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div key={item.label} variants={itemVariants}>
                <Card className="border border-[color:var(--dash-border)] bg-[color:var(--dash-surface)] shadow-[0_24px_80px_rgba(0,0,0,0.22)] transition-transform duration-200 hover:-translate-y-0.5">
                  <CardContent className="flex items-start gap-4 p-5">
                    <div className={`rounded-2xl border border-[color:var(--dash-border)] bg-gradient-to-br ${item.accent} p-3 text-[color:var(--dash-text)]`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[color:var(--dash-faint)]">
                            {item.label}
                          </p>
                          <p className="mt-1 text-2xl font-semibold text-[color:var(--dash-text)]">
                            {item.value}
                          </p>
                        </div>
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-full text-[color:var(--dash-muted)] hover:bg-[color:var(--dash-surface-hover)] hover:text-[color:var(--dash-text)]"
                        >
                          <Link href={item.href} aria-label={`${item.label} bölümüne git`}>
                            <ArrowUpRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                      <p className="mt-2 text-xs leading-5 text-[color:var(--dash-muted)]">
                        {item.note}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.8fr)]">
          <motion.section variants={itemVariants}>
            <Card className="h-full border border-[color:var(--dash-border)] bg-[color:var(--dash-surface)] shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
              <CardHeader className="space-y-4 border-b border-[color:var(--dash-border)]">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <CardTitle className="text-lg tracking-tight !text-[color:var(--dash-text)]">
                      Son Yayınlanan Projeler
                    </CardTitle>
                    <CardDescription className="mt-1 !text-[color:var(--dash-muted)]">
                      Son eklenen içerikleri ve kategori dağılımını yönetin.
                    </CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className="w-fit border-[color:var(--dash-border)] bg-[color:var(--dash-surface-strong)] text-[color:var(--dash-muted)]"
                  >
                    {filteredProjects.length} kayıt
                  </Badge>
                </div>

                <div className="relative max-w-xl">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--dash-faint)]" />
                  <Input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Proje, kategori veya durum ara..."
                    className="h-12 rounded-2xl border border-[color:var(--dash-border)] bg-[color:var(--dash-surface)] pl-11 text-[color:var(--dash-text)] placeholder:text-[color:var(--dash-faint)]"
                  />
                </div>
              </CardHeader>

              <CardContent className="space-y-3 p-4 sm:p-5">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-24 animate-pulse rounded-[1.25rem] border border-[color:var(--dash-border)] bg-[color:var(--dash-panel)]"
                    />
                  ))
                ) : filteredProjects.length > 0 ? (
                  filteredProjects.map((project) => (
                    <div
                      key={project._id}
                      className="group flex flex-col gap-4 rounded-[1.25rem] border border-[color:var(--dash-border)] bg-[color:var(--dash-panel)] p-4 transition-colors hover:bg-[color:var(--dash-surface-hover)] sm:flex-row sm:items-center"
                    >
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[color:var(--dash-border)] bg-[color:var(--dash-surface-strong)]">
                        {project.coverImage ? (
                          <img
                            src={project.coverImage}
                            alt={project.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="h-5 w-5 text-[color:var(--dash-faint)]" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-base font-semibold text-[color:var(--dash-text)]">
                            {project.title}
                          </h3>
                          <Badge
                            variant="outline"
                            className="border-[color:var(--dash-border)] bg-[color:var(--dash-surface-strong)] text-[color:var(--dash-muted)]"
                          >
                            {project.category || 'Kategori yok'}
                          </Badge>
                        </div>
                        <p className="text-sm text-[color:var(--dash-muted)]">
                          {project.status || 'Yayında'} • {formatRelativeDate(project.updatedAt)}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="rounded-full border-[color:var(--dash-border)] bg-[color:var(--dash-surface)] text-[color:var(--dash-text)] hover:bg-[color:var(--dash-surface-hover)]"
                        >
                          <Link href="/admin/projects">
                            <Briefcase className="mr-2 h-4 w-4" />
                            Yönet
                          </Link>
                        </Button>
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-full text-[color:var(--dash-muted)] hover:bg-[color:var(--dash-surface-hover)] hover:text-[color:var(--dash-text)]"
                        >
                          <Link href="/admin/projects" aria-label="Projeyi aç">
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[1.25rem] border border-dashed border-[color:var(--dash-border)] bg-[color:var(--dash-panel)] p-8 text-center">
                    <p className="text-sm font-medium text-[color:var(--dash-text)]">Sonuç bulunamadı</p>
                    <p className="mt-2 text-sm leading-7 text-[color:var(--dash-muted)]">
                      Arama terimini temizleyin veya projeleri doğrudan proje yönetim ekranından kontrol edin.
                    </p>
                    <Button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="mt-4 rounded-full bg-amber-400 text-zinc-950 hover:bg-amber-300"
                    >
                      Aramayı Temizle
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.section>

          <div className="space-y-6">
            <motion.section variants={itemVariants}>
              <Card className="border border-[color:var(--dash-border)] bg-[color:var(--dash-surface)] shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
                <CardHeader className="border-b border-[color:var(--dash-border)]">
                  <CardTitle className="text-lg tracking-tight !text-[color:var(--dash-text)]">
                    Hızlı İşlemler
                  </CardTitle>
                  <CardDescription className="!text-[color:var(--dash-muted)]">
                    En sık kullanılan yönetim noktalarına doğrudan erişim.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 p-4 sm:grid-cols-2">
                  {[
                    { label: 'Yeni Proje', href: '/admin/projects', icon: Plus },
                    { label: 'Ekip Üyesi', href: '/admin/team', icon: Users },
                    { label: 'Slider', href: '/admin/content/slider', icon: LayoutDashboard },
                    { label: 'SEO Ayarları', href: '/admin/settings', icon: FileText },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.label}
                        asChild
                        variant="outline"
                        className="h-auto justify-start rounded-2xl border-[color:var(--dash-border)] bg-[color:var(--dash-surface)] px-4 py-4 text-left text-[color:var(--dash-text)] hover:bg-[color:var(--dash-surface-hover)]"
                      >
                        <Link href={item.href}>
                          <Icon className="mr-3 h-4 w-4 shrink-0" />
                          <span className="text-sm font-medium">{item.label}</span>
                        </Link>
                      </Button>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.section>

            <motion.section variants={itemVariants}>
              <Card className="border border-[color:var(--dash-border)] bg-[color:var(--dash-surface)] shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
                <CardHeader className="border-b border-[color:var(--dash-border)]">
                  <CardTitle className="text-lg tracking-tight !text-[color:var(--dash-text)]">
                    Sistem Günlüğü
                  </CardTitle>
                  <CardDescription className="!text-[color:var(--dash-muted)]">
                    Son yönetim faaliyetlerinin kısa özeti.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-4 sm:p-5">
                  {activityItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.title}
                        className="flex items-start gap-4 rounded-2xl border border-[color:var(--dash-border)] bg-[color:var(--dash-panel)] p-4"
                      >
                        <div className="rounded-2xl bg-amber-400/10 p-3 text-amber-200">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-[color:var(--dash-text)]">{item.title}</p>
                          <p className="mt-1 text-xs text-[color:var(--dash-muted)]">{item.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.section>

            <motion.section variants={itemVariants}>
              <Card className="border border-[color:var(--dash-border)] bg-[color:var(--dash-surface)] shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
                <CardHeader className="border-b border-[color:var(--dash-border)]">
                  <CardTitle className="text-lg tracking-tight !text-[color:var(--dash-text)]">
                    Yönetim Notu
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-4 sm:p-5">
                  <div className="rounded-2xl border border-[color:var(--dash-border)] bg-[color:var(--dash-panel)] p-4">
                    <p className="text-sm font-medium text-[color:var(--dash-text)]">
                      Tema uyumlu görünüm
                    </p>
                    <p className="mt-2 text-sm leading-7 text-[color:var(--dash-muted)]">
                      Aydınlık ve karanlık modlar, yönetim yüzeyinde ayrı renk sertlikleriyle işlendi.
                      Özet kartlar, işlem butonları ve listeler mod değişiminde aynı okunabilirliği korur.
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-[color:var(--dash-border)] bg-[color:var(--dash-panel)] p-4">
                      <p className="text-[0.65rem] uppercase tracking-[0.24em] text-[color:var(--dash-faint)]">
                        Son senkron
                      </p>
                      <p className="mt-2 text-sm font-medium text-[color:var(--dash-text)]">Canlı API</p>
                    </div>
                    <div className="rounded-2xl border border-[color:var(--dash-border)] bg-[color:var(--dash-panel)] p-4">
                      <p className="text-[0.65rem] uppercase tracking-[0.24em] text-[color:var(--dash-faint)]">
                        Kısayol
                      </p>
                      <p className="mt-2 text-sm font-medium text-[color:var(--dash-text)]">CRM + Proje Yönetimi</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.section>
          </div>
        </div>
      </motion.div>

      <style jsx global>{`
        [data-theme='light'] .admin-dashboard-shell {
          --dash-text: #0f172a;
          --dash-muted: #475569;
          --dash-faint: #64748b;
          --dash-border: rgba(15, 23, 42, 0.08);
          --dash-surface: rgba(255, 255, 255, 0.82);
          --dash-surface-strong: rgba(255, 255, 255, 0.95);
          --dash-surface-hover: rgba(15, 23, 42, 0.04);
          --dash-panel: rgba(15, 23, 42, 0.05);
        }
      `}</style>
    </div>
  );
}
