/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Aperture,
  Activity,
  ArrowUpRight,
  Briefcase,
  CalendarClock,
  CheckCircle2,
  CircleAlert,
  BarChart3,
  FolderKanban,
  Image as ImageIcon,
  LayoutDashboard,
  Loader2,
  MessageSquare,
  Search,
  Server,
  Settings2,
  Sparkles,
  TrendingUp,
  Users,
  Workflow,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

type ProjectRecord = {
  _id: string;
  title: string;
  label?: string;
  department?: string;
  categories?: string[];
  coverImage?: string;
  status?: string;
  updatedAt?: string;
  createdAt?: string;
};

type AppointmentRecord = {
  _id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  city: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  interestedDepartment: string;
  projectDetails?: string;
};

type TeamMemberRecord = {
  _id: string;
  name: string;
  role?: string;
  category?: string;
  updatedAt?: string;
  createdAt?: string;
};

type SlideRecord = {
  _id: string;
  title: string;
  active?: boolean;
  mediaType?: string;
  updatedAt?: string;
  createdAt?: string;
};

type StudioCardRecord = {
  _id: string;
  studioType: string;
  title?: string;
  order?: number;
  updatedAt?: string;
  createdAt?: string;
};

type SettingsRecord = {
  studioName?: string;
  maintenanceMode?: boolean;
  contactEmail?: string;
  phone?: string;
  whatsapp?: string;
  updatedAt?: string;
  createdAt?: string;
};

type ApiStatus = 'loading' | 'ok' | 'error';

type SourceCard = {
  label: string;
  href: string;
  value: string;
  note: string;
  status: ApiStatus;
  updatedAt?: string;
};

type DashboardData = {
  projects: ProjectRecord[];
  appointments: AppointmentRecord[];
  team: TeamMemberRecord[];
  slides: SlideRecord[];
  services: StudioCardRecord[];
  settings: SettingsRecord;
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { ease: 'easeOut', duration: 0.4 } },
} as const;

const formatDate = (value?: string) => {
  if (!value) return 'Veri yok';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Veri yok';

  return date.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatDateTime = (value?: string) => {
  if (!value) return 'Veri yok';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Veri yok';

  return date.toLocaleString('tr-TR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getLatestTimestamp = (items: Array<{ createdAt?: string; updatedAt?: string }>) => {
  return items.reduce<string | undefined>((latest, item) => {
    const candidate = item.updatedAt || item.createdAt;
    if (!candidate) return latest;
    if (!latest) return candidate;
    return new Date(candidate).getTime() > new Date(latest).getTime() ? candidate : latest;
  }, undefined);
};

const toArray = <T,>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);

const getDayKey = (value?: string) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-CA', { timeZone: 'Europe/Istanbul' });
};

const formatTrendLabel = (value: string) => {
  const date = new Date(`${value}T00:00:00+03:00`);
  return date.toLocaleDateString('tr-TR', { weekday: 'short', day: '2-digit' });
};

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { cache: 'no-store' });
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error((payload && typeof payload === 'object' && 'error' in payload && String(payload.error)) || `Request failed: ${url}`);
  }

  return payload as T;
}

function StatusDot({ status }: { status: ApiStatus }) {
  if (status === 'ok') {
    return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
  }

  if (status === 'error') {
    return <CircleAlert className="h-4 w-4 text-rose-400" />;
  }

  return <Loader2 className="h-4 w-4 animate-spin text-amber-400" />;
}

export default function AdminDashboard() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState<DashboardData>({
    projects: [],
    appointments: [],
    team: [],
    slides: [],
    services: [],
    settings: {},
  });
  const [sourceCards, setSourceCards] = useState<Record<string, SourceCard>>({});

  useEffect(() => {
    const syncTheme = () => {
      const nextTheme =
        document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      setTheme(nextTheme);
    };

    syncTheme();

    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    window.addEventListener('storage', syncTheme);

    return () => {
      observer.disconnect();
      window.removeEventListener('storage', syncTheme);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadDashboard = async () => {
      setIsLoading(true);

      const endpoints = [
        { key: 'projects', label: 'Projeler', href: '/admin/projects', url: '/api/projects' },
        {
          key: 'appointments',
          label: 'Randevular',
          href: '/admin/crm',
          url: '/api/admin/appointments',
        },
        { key: 'team', label: 'Ekip', href: '/admin/team', url: '/api/admin/team' },
        { key: 'slides', label: 'Slider', href: '/admin/content/slider', url: '/api/admin/slides' },
        {
          key: 'services',
          label: 'Ana sayfa servisleri',
          href: '/admin/content/home/services',
          url: '/api/admin/content/home/services',
        },
        {
          key: 'settings',
          label: 'Sistem ayarları',
          href: '/admin/settings',
          url: '/api/settings',
        },
        { key: 'users', label: 'Kullanıcılar', href: '/admin/users', url: '/api/admin/users' },
        {
          key: 'departments',
          label: 'Departmanlar',
          href: '/admin/content/workflow',
          url: '/api/admin/departments',
        },
      ] as const;

      const settled = await Promise.allSettled(
        endpoints.map(async (endpoint) => {
          const payload = await fetchJson<unknown>(endpoint.url);
          return { endpoint, payload };
        }),
      );

      if (cancelled) return;

      const nextData: DashboardData = {
        projects: [],
        appointments: [],
        team: [],
        slides: [],
        services: [],
        settings: {},
      };

      const nextSourceCards: Record<string, SourceCard> = {};

      settled.forEach((result, index) => {
        const endpoint = endpoints[index];

        if (result.status === 'fulfilled') {
          const payload = result.value.payload;

          if (endpoint.key === 'projects') {
            nextData.projects = toArray<ProjectRecord>(payload);
            nextSourceCards[endpoint.key] = {
              label: endpoint.label,
              href: endpoint.href,
              value: `${nextData.projects.length.toLocaleString('tr-TR')} kayıt`,
              note: nextData.projects.length
                ? `Son güncelleme ${formatDate(getLatestTimestamp(nextData.projects))}`
                : 'Henüz proje yok',
              status: 'ok',
              updatedAt: getLatestTimestamp(nextData.projects),
            };
          }

          if (endpoint.key === 'appointments') {
            nextData.appointments = toArray<AppointmentRecord>(payload);
            const newCount = nextData.appointments.filter((item) => item.status === 'Yeni').length;
            const openCount = nextData.appointments.filter((item) => item.status !== 'Arşivlendi').length;
            nextSourceCards[endpoint.key] = {
              label: endpoint.label,
              href: endpoint.href,
              value: `${newCount.toLocaleString('tr-TR')} yeni`,
              note: `${openCount.toLocaleString('tr-TR')} açık talep`,
              status: 'ok',
              updatedAt: getLatestTimestamp(nextData.appointments),
            };
          }

          if (endpoint.key === 'team') {
            nextData.team = toArray<TeamMemberRecord>(payload);
            nextSourceCards[endpoint.key] = {
              label: endpoint.label,
              href: endpoint.href,
              value: `${nextData.team.length.toLocaleString('tr-TR')} kişi`,
              note: nextData.team.length ? 'Aktif yönetim kadrosu' : 'Ekip listesi boş',
              status: 'ok',
              updatedAt: getLatestTimestamp(nextData.team),
            };
          }

          if (endpoint.key === 'slides') {
            nextData.slides = toArray<SlideRecord>(payload);
            const activeSlides = nextData.slides.filter((item) => item.active !== false).length;
            nextSourceCards[endpoint.key] = {
              label: endpoint.label,
              href: endpoint.href,
              value: `${activeSlides.toLocaleString('tr-TR')} aktif`,
              note: `${nextData.slides.length.toLocaleString('tr-TR')} toplam öğe`,
              status: 'ok',
              updatedAt: getLatestTimestamp(nextData.slides),
            };
          }

          if (endpoint.key === 'services') {
            nextData.services = toArray<StudioCardRecord>(payload);
            nextSourceCards[endpoint.key] = {
              label: endpoint.label,
              href: endpoint.href,
              value: `${nextData.services.length.toLocaleString('tr-TR')} kart`,
              note: 'Ana sayfa servis blokları',
              status: 'ok',
              updatedAt: getLatestTimestamp(nextData.services),
            };
          }

          if (endpoint.key === 'settings') {
            nextData.settings = (payload as SettingsRecord) || {};
            const maintenanceText = nextData.settings.maintenanceMode ? 'Bakım açık' : 'Bakım kapalı';
            nextSourceCards[endpoint.key] = {
              label: endpoint.label,
              href: endpoint.href,
              value: maintenanceText,
              note: nextData.settings.contactEmail || 'İletişim e-postası tanımsız',
              status: 'ok',
              updatedAt: nextData.settings.updatedAt,
            };
          }

          if (endpoint.key === 'users') {
            const users = toArray<{ updatedAt?: string; createdAt?: string }>(payload);
            nextSourceCards[endpoint.key] = {
              label: endpoint.label,
              href: endpoint.href,
              value: `${users.length.toLocaleString('tr-TR')} kullanıcı`,
              note: 'Yetki ve oturum listesi',
              status: 'ok',
              updatedAt: getLatestTimestamp(users),
            };
          }

          if (endpoint.key === 'departments') {
            const departments = toArray<{ updatedAt?: string; createdAt?: string }>(payload);
            nextSourceCards[endpoint.key] = {
              label: endpoint.label,
              href: endpoint.href,
              value: `${departments.length.toLocaleString('tr-TR')} birim`,
              note: 'Departman ve akış tanımları',
              status: 'ok',
              updatedAt: getLatestTimestamp(departments),
            };
          }
        } else {
          nextSourceCards[endpoint.key] = {
            label: endpoint.label,
            href: endpoint.href,
            value: 'Bağlantı yok',
            note: result.reason instanceof Error ? result.reason.message : 'Beklenmeyen hata',
            status: 'error',
          };
        }
      });

      setData(nextData);
      setSourceCards(nextSourceCards);
      setIsLoading(false);
    };

    void loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  const newAppointmentsCount = data.appointments.filter((item) => item.status === 'Yeni').length;
  const openAppointmentsCount = data.appointments.filter((item) => item.status !== 'Arşivlendi').length;
  const activeSlidesCount = data.slides.filter((item) => item.active !== false).length;
  const recentProjects = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    const sorted = [...data.projects].sort((a, b) => {
      const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime();
      return bTime - aTime;
    });

    if (!term) return sorted.slice(0, 5);

    return sorted
      .filter((project) => {
        const haystack = [
          project.title,
          project.label,
          project.department,
          ...(project.categories || []),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return haystack.includes(term);
      })
      .slice(0, 5);
  }, [data.projects, searchQuery]);

  const recentAppointments = useMemo(() => {
    return [...data.appointments]
      .sort((a, b) => {
        const aTime = new Date(a.createdAt || a.updatedAt || 0).getTime();
        const bTime = new Date(b.createdAt || b.updatedAt || 0).getTime();
        return bTime - aTime;
      })
      .slice(0, 5);
  }, [data.appointments]);

  const trendSeries = useMemo(() => {
    const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Istanbul' });

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      const key = formatter.format(date);

      const appointments = data.appointments.filter((item) => getDayKey(item.createdAt) === key).length;
      const projects = data.projects.filter((item) => getDayKey(item.updatedAt || item.createdAt) === key).length;

      return {
        key,
        label: formatTrendLabel(key),
        appointments,
        projects,
      };
    });
  }, [data.appointments, data.projects]);

  const trendPeak = Math.max(
    1,
    ...trendSeries.map((item) => Math.max(item.appointments, item.projects)),
  );

  const latestProject = data.projects[0];
  const latestAppointment = data.appointments[0];
  const successCount = Object.values(sourceCards).filter((item) => item.status === 'ok').length;
  const totalSources = Object.keys(sourceCards).length || 1;
  const lastSyncAt = getLatestTimestamp([
    ...(data.projects || []),
    ...(data.appointments || []),
    ...(data.team || []),
    ...(data.slides || []),
    ...(data.services || []),
    data.settings,
  ]);

  const heroBadges = [
    {
      label: theme === 'light' ? 'Aydınlık tema' : 'Karanlık tema',
      variant: 'outline' as const,
    },
    {
      label: data.settings.maintenanceMode ? 'Bakım modu açık' : 'Bakım modu kapalı',
      variant: data.settings.maintenanceMode ? 'secondary' as const : 'outline' as const,
    },
    {
      label: `${successCount}/${totalSources} API aktif`,
      variant: 'secondary' as const,
    },
  ];

  const statCards = [
    {
      label: 'Yeni randevular',
      value: isLoading ? '--' : newAppointmentsCount.toLocaleString('tr-TR'),
      note: 'İlk cevap bekleyen talepler',
      icon: MessageSquare,
      href: '/admin/crm',
      accent: 'from-amber-400/25 to-amber-400/5',
    },
    {
      label: 'Açık talepler',
      value: isLoading ? '--' : openAppointmentsCount.toLocaleString('tr-TR'),
      note: 'Arşive alınmamış tüm başvurular',
      icon: CalendarClock,
      href: '/admin/crm',
      accent: 'from-sky-400/25 to-sky-400/5',
    },
    {
      label: 'Proje havuzu',
      value: isLoading ? '--' : data.projects.length.toLocaleString('tr-TR'),
      note: 'Yayınlanan ve arşivdeki projeler',
      icon: FolderKanban,
      href: '/admin/projects',
      accent: 'from-emerald-400/25 to-emerald-400/5',
    },
    {
      label: 'Aktif slider',
      value: isLoading ? '--' : activeSlidesCount.toLocaleString('tr-TR'),
      note: 'Ana sayfa vitrin öğeleri',
      icon: Sparkles,
      href: '/admin/content/slider',
      accent: 'from-violet-400/25 to-violet-400/5',
    },
    {
      label: 'Ekip üyeleri',
      value: isLoading ? '--' : data.team.length.toLocaleString('tr-TR'),
      note: 'Aktif yönetim kadrosu',
      icon: Users,
      href: '/admin/team',
      accent: 'from-rose-400/25 to-rose-400/5',
    },
    {
      label: 'Servis kartları',
      value: isLoading ? '--' : data.services.length.toLocaleString('tr-TR'),
      note: 'Ana sayfa hizmet blokları',
      icon: LayoutDashboard,
      href: '/admin/content/home/services',
      accent: 'from-cyan-400/25 to-cyan-400/5',
    },
  ] as const;

  const quickActions = [
    { label: 'CRM Aç', href: '/admin/crm', icon: MessageSquare },
    { label: 'Yeni Proje', href: '/admin/projects', icon: FolderKanban },
    { label: 'Tüm Projeler', href: '/admin/projects', icon: FolderKanban },
    { label: 'Slider Düzenle', href: '/admin/content/slider', icon: ImageIcon },
    { label: 'Ana Sayfa Medya', href: '/admin/content/home/gallery', icon: ImageIcon },
    { label: 'Genel Ayarlar', href: '/admin/settings', icon: Settings2 },
    { label: 'Ekip Yönetimi', href: '/admin/team', icon: Users },
    { label: 'Kullanıcılar', href: '/admin/users', icon: Users },
    { label: 'Workflow', href: '/admin/content/workflow', icon: Workflow },
    { label: 'İçerik Paneli', href: '/admin/content/home', icon: LayoutDashboard },
    { label: 'Galeri', href: '/admin/content/gallery', icon: FolderKanban },
    { label: 'Journal', href: '/admin/content/journal', icon: LayoutDashboard },
    { label: 'Servis Kartları', href: '/admin/content/home/services', icon: LayoutDashboard },
    { label: 'Hakkımızda', href: '/admin/content/corporate', icon: Briefcase },
    { label: 'Stüdyo Ayarları', href: '/admin/content/services/mimari', icon: Aperture },
  ] as const;

  const apiCards = [
    sourceCards.projects,
    sourceCards.appointments,
    sourceCards.team,
    sourceCards.slides,
    sourceCards.services,
    sourceCards.settings,
    sourceCards.users,
    sourceCards.departments,
  ].filter(Boolean) as SourceCard[];

  return (
    <div className="admin-dashboard-shell relative min-h-[100dvh] overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.12),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.1),_transparent_26%),linear-gradient(180deg,_rgba(2,6,23,1),_rgba(15,23,42,1))] px-4 py-5 text-zinc-100 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-80">
        <div className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="mx-auto flex w-full max-w-7xl flex-col gap-6"
      >
        <motion.section
          variants={itemVariants}
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:p-7 xl:p-8"
        >
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),transparent_40%,rgba(255,255,255,0.02))]" />

          <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)] xl:items-start">
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {heroBadges.map((badge) => (
                  <Badge
                    key={badge.label}
                    variant={badge.variant}
                    className="border-white/10 bg-white/5 text-[0.64rem] tracking-[0.24em] text-zinc-200"
                  >
                    {badge.label}
                  </Badge>
                ))}
              </div>

              <div className="space-y-3">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.4em] text-amber-200/80">
                  DEQOIN ADMIN DASHBOARD
                </p>
                <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Hızlı İşlemler
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
                  Randevu, proje, ekip ve içerik akışını tek bakışta görün.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {quickActions.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.label}
                      asChild
                      variant="outline"
                      className="h-auto justify-start rounded-2xl border-white/10 bg-white/[0.04] px-4 py-4 text-left text-white hover:bg-white/10 hover:text-white"
                    >
                      <Link href={item.href}>
                        <Icon className="mr-3 h-4 w-4 shrink-0" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </Link>
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[0.62rem] uppercase tracking-[0.32em] text-zinc-400">
                      Son Senkron
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {lastSyncAt ? formatDateTime(lastSyncAt) : 'Veri bekleniyor'}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-amber-400/10 p-3 text-amber-200">
                    <Activity className="h-5 w-5" />
                  </div>
                </div>
                <Separator className="my-4 bg-white/10" />
                <p className="text-sm leading-6 text-zinc-300">
                  Son güncelleme projeler, talepler, ekip ve içerik kaynakları arasında
                  senkronize edildi.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[0.62rem] uppercase tracking-[0.32em] text-zinc-400">
                      Aktif API Bağlantıları
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {successCount}/{totalSources}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-emerald-400/10 p-3 text-emerald-300">
                    <Server className="h-5 w-5" />
                  </div>
                </div>
                <Separator className="my-4 bg-white/10" />
                <p className="text-sm leading-6 text-zinc-300">
                  Paneli besleyen endpoint’lerin canlı durumunu gösterir.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                <p className="text-[0.62rem] uppercase tracking-[0.32em] text-zinc-400">
                  Son Proje
                </p>
                <p className="mt-2 truncate text-lg font-semibold text-white">
                  {latestProject?.title || 'Proje yok'}
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  {latestProject?.label || 'Etiket yok'} • {formatDate(latestProject?.updatedAt || latestProject?.createdAt)}
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                <p className="text-[0.62rem] uppercase tracking-[0.32em] text-zinc-400">
                  Son Talep
                </p>
                <p className="mt-2 truncate text-lg font-semibold text-white">
                  {latestAppointment ? `${latestAppointment.name} ${latestAppointment.surname}` : 'Talep yok'}
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  {latestAppointment?.interestedDepartment || 'Birim yok'} • {formatDateTime(latestAppointment?.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {statCards.map((item) => {
            const Icon = item.icon;

            return (
              <motion.div key={item.label} variants={itemVariants}>
                <Card className="h-full border border-white/10 bg-white/[0.04] shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl">
                  <CardContent className="flex h-full items-start gap-4 p-5">
                    <div
                      className={`rounded-2xl border border-white/10 bg-gradient-to-br ${item.accent} p-3 text-white`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[0.62rem] uppercase tracking-[0.32em] text-zinc-400">
                            {item.label}
                          </p>
                          <p className="mt-1 text-2xl font-semibold text-white">{item.value}</p>
                        </div>
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-full text-zinc-300 hover:bg-white/10 hover:text-white"
                        >
                          <Link href={item.href} aria-label={`${item.label} bölümüne git`}>
                            <ArrowUpRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                      <p className="mt-2 text-xs leading-5 text-zinc-400">{item.note}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.section variants={itemVariants}>
          <Card className="border border-white/10 bg-white/[0.04] shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl">
            <CardHeader className="border-b border-white/10">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg tracking-tight text-white">
                    <BarChart3 className="h-5 w-5 text-amber-300" />
                    Son 7 Gün Aktivite
                  </CardTitle>
                  <CardDescription className="mt-1 text-zinc-400">
                    Randevu ve proje güncellemelerinin günlük dağılımı.
                  </CardDescription>
                </div>
                <Badge variant="outline" className="w-fit border-white/10 bg-white/5 text-zinc-200">
                  <TrendingUp className="mr-2 h-3 w-3" />
                  Trend görünümü
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="grid gap-6 p-4 sm:p-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    Randevu
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-sky-400" />
                    Proje
                  </span>
                </div>

                <div className="grid gap-2 sm:grid-cols-7">
                  {trendSeries.map((point) => {
                    const appointmentHeight = Math.max(10, (point.appointments / trendPeak) * 100);
                    const projectHeight = Math.max(10, (point.projects / trendPeak) * 100);

                    return (
                      <div
                        key={point.key}
                        className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-black/20 p-3"
                      >
                        <div className="flex h-48 w-full items-end gap-1.5 rounded-[1.1rem] border border-white/10 bg-white/[0.03] px-2 pb-2 pt-4">
                          <div className="flex h-full flex-1 items-end justify-center">
                            <div
                              className="w-full rounded-full bg-amber-400/80"
                              style={{ height: `${appointmentHeight}%` }}
                              title={`Randevu: ${point.appointments}`}
                            />
                          </div>
                          <div className="flex h-full flex-1 items-end justify-center">
                            <div
                              className="w-full rounded-full bg-sky-400/80"
                              style={{ height: `${projectHeight}%` }}
                              title={`Proje: ${point.projects}`}
                            />
                          </div>
                        </div>

                        <div className="text-center">
                          <p className="text-[0.62rem] uppercase tracking-[0.24em] text-zinc-400">
                            {point.label}
                          </p>
                          <p className="mt-1 text-xs text-zinc-200">
                            {point.appointments} / {point.projects}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-3">
                <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                  <p className="text-[0.62rem] uppercase tracking-[0.3em] text-zinc-500">Toplam Yeni Randevu</p>
                  <p className="mt-2 text-3xl font-semibold text-white">
                    {newAppointmentsCount.toLocaleString('tr-TR')}
                  </p>
                  <p className="mt-2 text-sm text-zinc-400">En kritik takip edilmesi gereken talep havuzu.</p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                  <p className="text-[0.62rem] uppercase tracking-[0.3em] text-zinc-500">Aktif İçerik Kaynakları</p>
                  <p className="mt-2 text-3xl font-semibold text-white">
                    {Object.values(sourceCards).filter((item) => item.status === 'ok').length.toLocaleString('tr-TR')}
                  </p>
                  <p className="mt-2 text-sm text-zinc-400">Paneli besleyen API uçları sağlıklı durumda.</p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                  <p className="text-[0.62rem] uppercase tracking-[0.3em] text-zinc-500">Son Senkron</p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {lastSyncAt ? formatDateTime(lastSyncAt) : 'Veri yok'}
                  </p>
                  <p className="mt-2 text-sm text-zinc-400">Tüm kaynaklardan gelen son güncelleme.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.85fr)]">
          <div className="space-y-6">
            <motion.section variants={itemVariants}>
              <Card className="border border-white/10 bg-white/[0.04] shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl">
                <CardHeader className="space-y-4 border-b border-white/10">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <CardTitle className="text-lg tracking-tight text-white">
                        Son Yayınlanan Projeler
                      </CardTitle>
                      <CardDescription className="mt-1 text-zinc-400">
                        En güncel içeriklere hızlı erişim. Projeleri isim, etiket ya da departmana
                        göre daraltabilirsiniz.
                      </CardDescription>
                    </div>
                    <Badge
                      variant="outline"
                      className="w-fit border-white/10 bg-white/5 text-zinc-200"
                    >
                      {recentProjects.length.toLocaleString('tr-TR')} kayıt
                    </Badge>
                  </div>

                  <div className="relative max-w-xl">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                    <Input
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Proje, etiket veya kategori ara..."
                      className="h-12 rounded-2xl border-white/10 bg-white/[0.04] pl-11 text-white placeholder:text-zinc-500"
                    />
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 p-4 sm:p-5">
                  {isLoading ? (
                    Array.from({ length: 4 }).map((_, index) => (
                      <div
                        key={index}
                        className="h-24 animate-pulse rounded-[1.25rem] border border-white/10 bg-white/[0.03]"
                      />
                    ))
                  ) : recentProjects.length > 0 ? (
                    recentProjects.map((project) => (
                      <div
                        key={project._id}
                        className="group flex flex-col gap-4 rounded-[1.25rem] border border-white/10 bg-black/20 p-4 transition-colors hover:bg-white/[0.05] sm:flex-row sm:items-center"
                      >
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
                          {project.coverImage ? (
                            <img
                              src={project.coverImage}
                              alt={project.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="h-5 w-5 text-zinc-500" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="truncate text-base font-semibold text-white">
                              {project.title}
                            </h3>
                            <Badge variant="outline" className="border-white/10 bg-white/5 text-zinc-200">
                              {project.label || 'Etiket yok'}
                            </Badge>
                          </div>
                          <p className="text-sm text-zinc-400">
                            {project.department || 'Departman yok'} • {formatDate(project.updatedAt || project.createdAt)}
                          </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="rounded-full border-white/10 bg-white/[0.04] text-white hover:bg-white/10 hover:text-white"
                          >
                            <Link href="/admin/projects">
                              <FolderKanban className="mr-2 h-4 w-4" />
                              Yönet
                            </Link>
                          </Button>
                          <Button
                            asChild
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 rounded-full text-zinc-400 hover:bg-white/10 hover:text-white"
                          >
                            <Link href="/admin/projects" aria-label="Projeyi aç">
                              <ArrowUpRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[1.25rem] border border-dashed border-white/15 bg-black/20 p-8 text-center">
                      <p className="text-sm font-medium text-white">Sonuç bulunamadı</p>
                      <p className="mt-2 text-sm leading-7 text-zinc-400">
                        Arama terimini temizleyin ya da proje havuzunu doğrudan açın.
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

            <motion.section variants={itemVariants}>
              <Card className="border border-white/10 bg-white/[0.04] shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl">
                <CardHeader className="border-b border-white/10">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardTitle className="text-lg tracking-tight text-white">
                        Bekleyen ve Son Randevular
                      </CardTitle>
                      <CardDescription className="mt-1 text-zinc-400">
                        CRM akışının en kritik verisi. Yeni talepler ve son başvurular burada.
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="border-white/10 bg-white/5 text-zinc-200">
                      {newAppointmentsCount.toLocaleString('tr-TR')} yeni
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 p-4 sm:p-5">
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                      <div
                        key={index}
                        className="h-24 animate-pulse rounded-[1.25rem] border border-white/10 bg-white/[0.03]"
                      />
                    ))
                  ) : recentAppointments.length > 0 ? (
                    recentAppointments.map((appointment) => (
                      <div
                        key={appointment._id}
                        className="flex flex-col gap-4 rounded-[1.25rem] border border-white/10 bg-black/20 p-4 lg:flex-row lg:items-center lg:justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-semibold text-white">
                              {appointment.name} {appointment.surname}
                            </h3>
                            <Badge variant="outline" className="border-white/10 bg-white/5 text-zinc-200">
                              {appointment.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-zinc-400">
                            {appointment.interestedDepartment} • {appointment.city || 'Şehir belirtilmemiş'}
                          </p>
                          <p className="text-sm text-zinc-400">{appointment.email}</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="border-white/10 bg-white/5 text-zinc-200"
                          >
                            {formatDateTime(appointment.createdAt)}
                          </Badge>
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="rounded-full border-white/10 bg-white/[0.04] text-white hover:bg-white/10 hover:text-white"
                          >
                            <Link href="/admin/crm">
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Aç
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[1.25rem] border border-dashed border-white/15 bg-black/20 p-8 text-center">
                      <p className="text-sm font-medium text-white">Randevu bulunamadı</p>
                      <p className="mt-2 text-sm leading-7 text-zinc-400">
                        CRM akışında gösterilecek veri yok.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.section>
          </div>

          <div className="space-y-6">
            <motion.section variants={itemVariants}>
              <Card className="border border-white/10 bg-white/[0.04] shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl">
                <CardHeader className="border-b border-white/10">
                  <CardTitle className="text-lg tracking-tight text-white">API Bağlantı Kontrolü</CardTitle>
                  <CardDescription className="mt-1 text-zinc-400">
                    Dashboard yüklenirken kritik endpoint’ler kontrol edildi. Sorun varsa satır bazında görünür.
                  </CardDescription>
                </CardHeader>

                <CardContent className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-1">
                  {apiCards.length > 0 ? (
                    apiCards.map((card) => (
                      <div
                        key={card.label}
                        className="rounded-2xl border border-white/10 bg-black/20 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <StatusDot status={card.status} />
                              <p className="truncate text-sm font-medium text-white">{card.label}</p>
                            </div>
                            <p className="mt-2 text-sm text-zinc-400">{card.note}</p>
                          </div>
                          <Button
                            asChild
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full text-zinc-400 hover:bg-white/10 hover:text-white"
                          >
                            <Link href={card.href} aria-label={`${card.label} bölümüne git`}>
                              <ArrowUpRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-3">
                          <Badge variant="outline" className="border-white/10 bg-white/5 text-zinc-200">
                            {card.value}
                          </Badge>
                          <span className="text-[0.68rem] uppercase tracking-[0.24em] text-zinc-500">
                            {card.updatedAt ? formatDateTime(card.updatedAt) : 'Son güncelleme yok'}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-white/15 bg-black/20 p-6 text-sm text-zinc-400">
                      API durumu henüz yüklenmedi.
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.section>

            <motion.section variants={itemVariants}>
              <Card className="border border-white/10 bg-white/[0.04] shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl">
                <CardHeader className="border-b border-white/10">
                  <CardTitle className="text-lg tracking-tight text-white">Yönetim Özeti</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4 p-4 sm:p-5">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-sm font-medium text-white">Öne çıkarılan veri</p>
                    <p className="mt-2 text-sm leading-7 text-zinc-400">
                      Yeni talepler, açık randevular ve ana sayfa içerik kaynakları doğrudan erişim
                      istediğin ekranlara bağlanıyor. Mobilde de bloklar üst üste okuyabileceğin
                      şekilde dizildi.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-[0.62rem] uppercase tracking-[0.24em] text-zinc-500">
                        Son Randevu
                      </p>
                      <p className="mt-2 text-sm font-medium text-white">
                        {latestAppointment ? `${latestAppointment.name} ${latestAppointment.surname}` : 'Veri yok'}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-[0.62rem] uppercase tracking-[0.24em] text-zinc-500">
                        Son Proje
                      </p>
                      <p className="mt-2 text-sm font-medium text-white">
                        {latestProject?.title || 'Veri yok'}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-[0.62rem] uppercase tracking-[0.24em] text-zinc-500">
                        Sistem E-postası
                      </p>
                      <p className="mt-2 text-sm font-medium text-white">
                        {data.settings.contactEmail || 'Tanımsız'}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-[0.62rem] uppercase tracking-[0.24em] text-zinc-500">
                        Tema
                      </p>
                      <p className="mt-2 text-sm font-medium text-white">
                        {theme === 'light' ? 'Aydınlık' : 'Karanlık'}
                      </p>
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
          background: radial-gradient(circle at top left, rgba(245, 158, 11, 0.12), transparent 28%),
            radial-gradient(circle at bottom right, rgba(56, 189, 248, 0.1), transparent 26%),
            linear-gradient(180deg, rgba(248, 250, 252, 1), rgba(226, 232, 240, 1));
          color: #0f172a;
        }

        [data-theme='light'] .admin-dashboard-shell .text-white {
          color: #0f172a;
        }

        [data-theme='light'] .admin-dashboard-shell .text-zinc-100,
        [data-theme='light'] .admin-dashboard-shell .text-zinc-200,
        [data-theme='light'] .admin-dashboard-shell .text-zinc-300,
        [data-theme='light'] .admin-dashboard-shell .text-zinc-400,
        [data-theme='light'] .admin-dashboard-shell .text-zinc-500 {
          color: inherit;
        }
      `}</style>
    </div>
  );
}
