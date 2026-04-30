'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Archive,
  Download,
  FileText,
  Filter,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Printer,
  Search,
  Sparkles,
  Users,
  X,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type Appointment = {
  _id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  city: string;
  status: string;
  createdAt: string;
  interestedDepartment: string;
  projectDetails?: string;
};

const STATUS_FILTERS = ['Hepsi', 'Yeni', 'İncelendi', 'İletişime Geçildi', 'Arşivlendi'] as const;
const SCOPE_FILTERS = [
  { key: 'daily', label: 'Günlük' },
  { key: 'weekly', label: 'Haftalık' },
  { key: 'monthly', label: 'Aylık' },
  { key: 'all', label: 'Genel' },
] as const;

const STATUS_STYLES: Record<string, string> = {
  Yeni: 'border-amber-400/25 bg-amber-400/10 text-amber-100',
  İncelendi: 'border-sky-400/25 bg-sky-400/10 text-sky-100',
  'İletişime Geçildi': 'border-emerald-400/25 bg-emerald-400/10 text-emerald-100',
  Arşivlendi: 'border-white/10 bg-white/5 text-zinc-300',
};

const formatDate = (value: string, withTime = false) => {
  const date = new Date(value);
  return withTime
    ? date.toLocaleString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : date.toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
};

const matchesQuery = (lead: Appointment, query: string) => {
  if (!query.trim()) return true;
  const text = [
    lead.name,
    lead.surname,
    lead.email,
    lead.phone,
    lead.city,
    lead.interestedDepartment,
    lead.projectDetails,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return text.includes(query.toLowerCase());
};

const getScopeTitle = (scope: (typeof SCOPE_FILTERS)[number]['key'], filter: string) => {
  if (scope === 'daily') return 'GÜNLÜK RANDEVU RAPORU';
  if (scope === 'weekly') return 'HAFTALIK RANDEVU RAPORU';
  if (scope === 'monthly') return 'AYLIK RANDEVU RAPORU';
  return filter === 'Hepsi'
    ? 'GENEL RANDEVU LİSTESİ'
    : `GENEL RANDEVU LİSTESİ • ${filter.toLocaleUpperCase('tr-TR')}`;
};

function ReportHeader({
  title,
  documentNumber,
  subtitle,
}: {
  title: string;
  documentNumber: string;
  subtitle: string;
}) {
  return (
    <header className="grid gap-4 border-b border-zinc-200 pb-5 md:grid-cols-[1fr_auto] md:items-end">
      <div>
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-zinc-500">
          Deqoin Design Studio
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-600">{subtitle}</p>
      </div>
      <div className="space-y-1 text-right text-[0.72rem] leading-5 text-zinc-500">
        <p>
          <span className="font-semibold text-zinc-900">Doküman No:</span> {documentNumber}
        </p>
        <p>
          <span className="font-semibold text-zinc-900">Rapor Tarihi:</span>{' '}
          {new Date().toLocaleDateString('tr-TR')}
        </p>
      </div>
    </header>
  );
}

function SingleLeadReport({
  lead,
  documentNumber,
}: {
  lead: Appointment;
  documentNumber: string;
}) {
  return (
    <div className="space-y-6">
      <ReportHeader
        title="MÜŞTERİ TALEP BİLGİ FORMU"
        subtitle="CRM / Randevu Yönetimi"
        documentNumber={documentNumber}
      />

      <div className="flex flex-wrap gap-2">
        <Badge className={STATUS_STYLES[lead.status] ?? STATUS_STYLES.Arşivlendi}>
          {lead.status}
        </Badge>
        <Badge variant="outline" className="border-zinc-200 bg-zinc-50 text-zinc-600">
          {lead.interestedDepartment}
        </Badge>
        <Badge variant="outline" className="border-zinc-200 bg-zinc-50 text-zinc-600">
          {lead.city || 'Şehir belirtilmemiş'}
        </Badge>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-zinc-500">
            Ad Soyad
          </p>
          <p className="mt-2 text-lg font-semibold text-zinc-950">
            {lead.name} {lead.surname}
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-zinc-500">
            Telefon
          </p>
          <p className="mt-2 text-lg font-semibold text-zinc-950">{lead.phone}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-zinc-500">
            E-posta
          </p>
          <p className="mt-2 text-lg font-semibold text-zinc-950 break-all">{lead.email}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-zinc-500">
            Talep Tarihi
          </p>
          <p className="mt-2 text-lg font-semibold text-zinc-950">{formatDate(lead.createdAt, true)}</p>
        </div>
      </div>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-zinc-500">
          Mesaj / Proje Detayı
        </h3>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-sm leading-7 text-zinc-700 whitespace-pre-wrap">
          {lead.projectDetails || 'Bir açıklama eklenmemiş.'}
        </div>
      </section>

      <footer className="flex items-center justify-between border-t border-zinc-200 pt-4 text-[0.7rem] uppercase tracking-[0.24em] text-zinc-400">
        <span>Deqoin Design Studio</span>
        <span>CRM Randevu Yönetimi</span>
      </footer>
    </div>
  );
}

function BulkLeadReport({
  leads,
  documentNumber,
  title,
}: {
  leads: Appointment[];
  documentNumber: string;
  title: string;
}) {
  const newCount = leads.filter((lead) => lead.status === 'Yeni').length;
  const engagedCount = leads.filter(
    (lead) => lead.status !== 'Yeni' && lead.status !== 'Arşivlendi',
  ).length;

  return (
    <div className="space-y-6">
      <ReportHeader
        title={title}
        subtitle="Toplu randevu özet raporu"
        documentNumber={documentNumber}
      />

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-center">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-zinc-500">
            Toplam Kayıt
          </p>
          <p className="mt-2 text-3xl font-semibold text-zinc-950">{leads.length}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-center">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-zinc-500">
            Yeni Talepler
          </p>
          <p className="mt-2 text-3xl font-semibold text-zinc-950">{newCount}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-center">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-zinc-500">
            İşlemde / Görüşülen
          </p>
          <p className="mt-2 text-3xl font-semibold text-zinc-950">{engagedCount}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200">
        <table className="w-full border-collapse text-left text-[0.78rem]">
          <thead className="bg-zinc-950 text-white">
            <tr>
              <th className="px-4 py-3 font-semibold uppercase tracking-[0.18em]">Tarih</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-[0.18em]">Müşteri</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-[0.18em]">İletişim</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-[0.18em]">Birim</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-[0.18em]">Durum</th>
            </tr>
          </thead>
          <tbody>
            {leads.length > 0 ? (
              leads.map((lead) => (
                <tr key={lead._id} className="border-t border-zinc-200">
                  <td className="px-4 py-3 align-top">
                    <div className="font-semibold text-zinc-950">{formatDate(lead.createdAt)}</div>
                    <div className="text-[0.72rem] text-zinc-500">
                      {new Date(lead.createdAt).toLocaleTimeString('tr-TR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="font-semibold text-zinc-950">
                      {lead.name} {lead.surname}
                    </div>
                    <div className="text-[0.72rem] text-zinc-500">{lead.city || '-'}</div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="font-medium text-zinc-900">{lead.phone}</div>
                    <div className="text-[0.72rem] text-zinc-500 break-all">{lead.email}</div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-zinc-600">
                      {lead.interestedDepartment}
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-zinc-900">
                      {lead.status}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-14 text-center text-sm text-zinc-500">
                  Seçili zaman aralığında veya kriterlerde herhangi bir randevu kaydı bulunmamaktadır.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <footer className="flex items-center justify-between border-t border-zinc-200 pt-4 text-[0.7rem] uppercase tracking-[0.24em] text-zinc-400">
        <span>Deqoin Design Studio</span>
        <span>CRM Randevu Yönetimi</span>
      </footer>
    </div>
  );
}

export default function CRMPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Appointment | null>(null);
  const [filter, setFilter] = useState<(typeof STATUS_FILTERS)[number]>('Hepsi');
  const [query, setQuery] = useState('');
  const [activeScope, setActiveScope] = useState<(typeof SCOPE_FILTERS)[number]['key']>('all');
  const [previewMode, setPreviewMode] = useState<null | 'single' | 'bulk'>(null);
  const [libLoaded, setLibLoaded] = useState(false);
  const [documentNumber] = useState(() => `DQ-${Math.floor(1000 + Math.random() * 9000)}`);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await fetch('/api/admin/appointments');
      const data = await res.json();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setSelectedLead((current) => (current && current._id === id ? { ...current, status: newStatus } : current));
        fetchAppointments();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const openPreview = (mode: 'single' | 'bulk') => {
    if (mode === 'single' && !selectedLead) return;
    setPreviewMode(mode);
  };

  const closePreview = () => setPreviewMode(null);

  const handleDownloadPDF = async () => {
    if (!libLoaded) return;

    const element = document.querySelector('.preview-paper');
    if (!element) return;

    const reportTitle = getScopeTitle(activeScope, filter);
    const fileLabel =
      previewMode === 'bulk'
        ? reportTitle
        : selectedLead
          ? `Musteri_${selectedLead.name}_${selectedLead.surname}`
          : reportTitle;

    try {
      // @ts-ignore
      await html2pdf()
        .set({
          margin: 10,
          filename: `${fileLabel.replace(/\s+/g, '_')}.pdf`,
          image: { type: 'jpeg', quality: 1 },
          html2canvas: { scale: 3, useCORS: true, letterRendering: true, logging: false },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', precision: 32 },
        })
        .from(element)
        .save();
    } catch (error) {
      console.error('PDF Download Error:', error);
    }
  };

  const stats = {
    total: appointments.length,
    new: appointments.filter((lead) => lead.status === 'Yeni').length,
    engaged: appointments.filter((lead) => lead.status === 'İletişime Geçildi').length,
    archived: appointments.filter((lead) => lead.status === 'Arşivlendi').length,
  };

  const visibleLeads = appointments.filter((lead) => filter === 'Hepsi' || lead.status === filter).filter((lead) => matchesQuery(lead, query));

  useEffect(() => {
    if (selectedLead && !visibleLeads.some((lead) => lead._id === selectedLead._id)) {
      setSelectedLead(null);
    }
  }, [selectedLead, visibleLeads]);

  const reportLeads = visibleLeads.filter((lead) => {
    const createdAt = new Date(lead.createdAt);
    const now = new Date();
    const start = new Date();

    if (activeScope === 'daily') {
      start.setHours(0, 0, 0, 0);
      return createdAt >= start;
    }

    if (activeScope === 'weekly') {
      start.setDate(now.getDate() - 7);
      return createdAt >= start;
    }

    if (activeScope === 'monthly') {
      start.setDate(now.getDate() - 30);
      return createdAt >= start;
    }

    return true;
  });

  const reportTitle = getScopeTitle(activeScope, filter);
  const isPreviewOpen = previewMode !== null;
  const isBulkPreview = previewMode === 'bulk';

  return (
    <div className="relative space-y-6 pb-8 text-white">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-32 top-0 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute left-0 top-1/3 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.28)] backdrop-blur-sm sm:p-7"
      >
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl space-y-4">
            <Badge variant="secondary" className="border-white/10 bg-white/5 text-zinc-200">
              <Sparkles className="mr-2 h-3 w-3" />
              CANLI CRM
            </Badge>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Randevu CRM
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
                Kayıtları tek ekranda takip edin, durumu hızlıca güncelleyin ve raporları cihazdan bağımsız şekilde indirin. Düzen, mobilde ve farklı ekran yüksekliklerinde kırılmadan çalışacak şekilde yeniden kuruldu.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[460px]">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-amber-400/10 p-3 text-amber-200">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[0.65rem] uppercase tracking-[0.28em] text-zinc-500">
                    Toplam Talep
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-white">{stats.total}</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-sky-400/10 p-3 text-sky-200">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[0.65rem] uppercase tracking-[0.28em] text-zinc-500">
                    Yeni Randevular
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-white">{stats.new}</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-400/10 p-3 text-emerald-200">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[0.65rem] uppercase tracking-[0.28em] text-zinc-500">
                    İşleme Alınan
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-white">{stats.engaged}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Toplam kayıt', value: stats.total, icon: Users, hint: 'Tüm randevular' },
          { label: 'Yeni', value: stats.new, icon: Calendar, hint: 'Bekleyen talepler' },
          { label: 'İletişimde', value: stats.engaged, icon: MessageCircle, hint: 'Takip edilen kayıtlar' },
          { label: 'Arşiv', value: stats.archived, icon: Archive, hint: 'Kapanan talepler' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Card
              key={item.label}
              className="border-white/10 bg-white/[0.04] shadow-[0_24px_80px_rgba(0,0,0,0.22)] transition-transform duration-200 hover:-translate-y-0.5"
            >
              <CardContent className="flex items-center gap-4 p-5">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-amber-200">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[0.65rem] uppercase tracking-[0.28em] text-zinc-500">
                    {item.label}
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-white">{item.value}</p>
                  <p className="mt-1 text-xs text-zinc-500">{item.hint}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-white/10 bg-white/[0.04] shadow-[0_24px_80px_rgba(0,0,0,0.2)]">
        <CardContent className="space-y-4 p-5 sm:p-6">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="İsim, mail, telefon, şehir veya proje ara..."
                className="h-12 rounded-2xl border border-white/10 bg-white/[0.03] pl-11 text-white placeholder:text-zinc-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {SCOPE_FILTERS.map((scope) => {
                const active = activeScope === scope.key;
                return (
                  <Button
                    key={scope.key}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveScope(scope.key)}
                    className={[
                      'shrink-0 rounded-full border transition-colors',
                      active
                        ? 'border-amber-400/40 bg-amber-400 text-zinc-950 hover:bg-amber-300'
                        : 'border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/10 hover:text-white',
                    ].join(' ')}
                  >
                    {scope.label}
                  </Button>
                );
              })}

              <Button
                type="button"
                onClick={() => openPreview('bulk')}
                className="shrink-0 rounded-full bg-amber-400 text-zinc-950 hover:bg-amber-300"
              >
                <FileText className="mr-2 h-4 w-4" />
                Rapor Önizle
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-2 text-xs text-zinc-400">
              <Filter className="h-3.5 w-3.5" />
              Durum
            </div>
            {STATUS_FILTERS.map((status) => {
              const active = filter === status;
              return (
                <Button
                  key={status}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFilter(status)}
                  className={[
                    'shrink-0 rounded-full border transition-colors',
                    active
                      ? 'border-white/5 bg-white text-zinc-950 hover:bg-zinc-100'
                      : 'border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/10 hover:text-white',
                  ].join(' ')}
                >
                  {status}
                </Button>
              );
            })}
            {(filter !== 'Hepsi' || query.trim()) && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFilter('Hepsi');
                  setQuery('');
                }}
                className="shrink-0 rounded-full text-zinc-400 hover:bg-white/5 hover:text-white"
              >
                Temizle
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.85fr)]">
        <Card className="border-white/10 bg-white/[0.04] shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
          <CardHeader className="space-y-2 border-b border-white/10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-lg tracking-tight text-white">Kayıt Kuyruğu</CardTitle>
                <CardDescription className="mt-1 text-zinc-400">
                  {visibleLeads.length} sonuç {query.trim() ? 'bulundu' : 'listelendi'}.
                </CardDescription>
              </div>
              <Badge variant="outline" className="border-white/10 bg-white/5 text-zinc-200">
                Canlı Liste
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-3 p-4 sm:p-5">
            {loading ? (
              <div className="flex min-h-[320px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-amber-200" />
              </div>
            ) : visibleLeads.length > 0 ? (
              visibleLeads.map((lead, index) => {
                const isSelected = selectedLead?._id === lead._id;
                return (
                  <motion.article
                    key={lead._id}
                    role="button"
                    tabIndex={0}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    onClick={() => setSelectedLead(lead)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setSelectedLead(lead);
                      }
                    }}
                    className={[
                      'rounded-[1.4rem] border p-4 text-left transition duration-200',
                      isSelected
                        ? 'border-amber-400/40 bg-white/[0.06] shadow-[0_18px_50px_rgba(0,0,0,0.18)]'
                        : 'border-white/10 bg-black/20 hover:border-white/20 hover:bg-white/[0.05]',
                    ].join(' ')}
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className="border-white/10 bg-white/5 text-zinc-300">
                            <Clock className="mr-2 h-3 w-3" />
                            {formatDate(lead.createdAt)}
                          </Badge>
                          <Badge className={STATUS_STYLES[lead.status] ?? STATUS_STYLES.Arşivlendi}>
                            {lead.status}
                          </Badge>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {lead.name} {lead.surname}
                          </h3>
                          <p className="mt-1 text-sm text-zinc-400">{lead.interestedDepartment}</p>
                        </div>

                        <div className="grid gap-2 sm:grid-cols-3">
                          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                            <p className="text-[0.62rem] uppercase tracking-[0.24em] text-zinc-500">
                              Telefon
                            </p>
                            <p className="mt-2 flex items-center gap-2 text-sm text-zinc-200">
                              <Phone className="h-3.5 w-3.5 text-zinc-500" />
                              {lead.phone}
                            </p>
                          </div>
                          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                            <p className="text-[0.62rem] uppercase tracking-[0.24em] text-zinc-500">
                              E-posta
                            </p>
                            <p className="mt-2 flex items-center gap-2 text-sm text-zinc-200">
                              <Mail className="h-3.5 w-3.5 text-zinc-500" />
                              <span className="truncate">{lead.email}</span>
                            </p>
                          </div>
                          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                            <p className="text-[0.62rem] uppercase tracking-[0.24em] text-zinc-500">
                              Şehir
                            </p>
                            <p className="mt-2 flex items-center gap-2 text-sm text-zinc-200">
                              <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                              {lead.city || 'Belirtilmemiş'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-col gap-3 lg:items-end">
                        <div className="flex gap-2">
                          <Button
                            asChild
                            variant="outline"
                            size="icon"
                            className="h-11 w-11 rounded-full border-white/10 bg-white/[0.03] text-white hover:bg-emerald-400 hover:text-zinc-950"
                          >
                            <a
                              href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              aria-label="WhatsApp ile mesaj gönder"
                              onClick={(event) => event.stopPropagation()}
                            >
                              <MessageCircle className="h-4 w-4" />
                            </a>
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-11 w-11 rounded-full border-white/10 bg-white/[0.03] text-white hover:bg-white/10"
                            onClick={(event) => {
                              event.stopPropagation();
                              setSelectedLead(lead);
                            }}
                            aria-label="Randevu detayını aç"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                        <span className="text-xs text-zinc-500">{lead.city || 'Şehir belirtilmemiş'}</span>
                      </div>
                    </div>
                  </motion.article>
                );
              })
            ) : (
              <div className="flex min-h-[320px] items-center justify-center rounded-[1.4rem] border border-dashed border-white/10 bg-black/20 p-8 text-center">
                <div className="max-w-sm space-y-3">
                  <AlertCircle className="mx-auto h-10 w-10 text-amber-200" />
                  <p className="text-lg font-medium text-white">Eşleşen kayıt bulunamadı</p>
                  <p className="text-sm leading-7 text-zinc-400">
                    Arama veya durum filtresini değiştirin. İsterseniz filtreleri tek tıkla sıfırlayabilirsiniz.
                  </p>
                  <Button
                    type="button"
                    onClick={() => {
                      setFilter('Hepsi');
                      setQuery('');
                    }}
                    className="rounded-full bg-amber-400 text-zinc-950 hover:bg-amber-300"
                  >
                    Filtreleri Sıfırla
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.04] shadow-[0_24px_80px_rgba(0,0,0,0.22)] xl:sticky xl:top-6 xl:self-start">
          <CardHeader className="space-y-3 border-b border-white/10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-lg tracking-tight text-white">
                  {selectedLead ? 'Seçili Kayıt' : 'Detay Paneli'}
                </CardTitle>
                <CardDescription className="mt-1 text-zinc-400">
                  {selectedLead
                    ? 'Kayıt bilgileri, iletişim ve durum işlemleri burada.'
                    : 'Listeden bir randevu seçin ya da toplu raporu önizleyin.'}
                </CardDescription>
              </div>
              {selectedLead ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedLead(null)}
                  className="h-10 w-10 rounded-full text-zinc-400 hover:bg-white/5 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              ) : (
                <Badge variant="outline" className="border-white/10 bg-white/5 text-zinc-200">
                  Hazır
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-5 p-4 sm:p-6">
            {selectedLead ? (
              <div className="space-y-5">
                <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-3">
                      <Badge variant="outline" className="border-white/10 bg-white/5 text-zinc-300">
                        {selectedLead.interestedDepartment}
                      </Badge>
                      <div>
                        <h3 className="text-2xl font-semibold tracking-tight text-white">
                          {selectedLead.name} {selectedLead.surname}
                        </h3>
                        <p className="mt-1 text-sm text-zinc-400">{formatDate(selectedLead.createdAt, true)}</p>
                      </div>
                    </div>
                    <Badge className={STATUS_STYLES[selectedLead.status] ?? STATUS_STYLES.Arşivlendi}>
                      {selectedLead.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Button
                    asChild
                    className="rounded-2xl bg-emerald-400 text-zinc-950 hover:bg-emerald-300"
                  >
                    <a
                      href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      WhatsApp
                    </a>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-2xl border-white/10 bg-white/[0.03] text-white hover:bg-white/10"
                    onClick={() => openPreview('single')}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Önizle
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-2xl border-white/10 bg-white/[0.03] text-white hover:bg-white/10"
                    onClick={() => window.print()}
                  >
                    <Printer className="mr-2 h-4 w-4" />
                    Yazdır
                  </Button>
                  <Button
                    type="button"
                    onClick={() => openPreview('bulk')}
                    className="rounded-2xl bg-amber-400 text-zinc-950 hover:bg-amber-300"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Toplu Rapor
                  </Button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-[0.62rem] uppercase tracking-[0.24em] text-zinc-500">Telefon</p>
                    <p className="mt-2 flex items-center gap-2 text-sm text-zinc-200">
                      <Phone className="h-3.5 w-3.5 text-zinc-500" />
                      {selectedLead.phone}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-[0.62rem] uppercase tracking-[0.24em] text-zinc-500">E-posta</p>
                    <p className="mt-2 flex items-center gap-2 text-sm text-zinc-200">
                      <Mail className="h-3.5 w-3.5 text-zinc-500" />
                      <span className="truncate">{selectedLead.email}</span>
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-[0.62rem] uppercase tracking-[0.24em] text-zinc-500">Şehir</p>
                    <p className="mt-2 flex items-center gap-2 text-sm text-zinc-200">
                      <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                      {selectedLead.city || 'Belirtilmemiş'}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-[0.62rem] uppercase tracking-[0.24em] text-zinc-500">Tarih</p>
                    <p className="mt-2 flex items-center gap-2 text-sm text-zinc-200">
                      <Clock className="h-3.5 w-3.5 text-zinc-500" />
                      {formatDate(selectedLead.createdAt, true)}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                    Durum Güncelle
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {['Yeni', 'İncelendi', 'İletişime Geçildi', 'Arşivlendi'].map((status) => {
                      const active = selectedLead.status === status;
                      return (
                        <Button
                          key={status}
                          type="button"
                          variant="outline"
                          onClick={() => handleStatusChange(selectedLead._id, status)}
                          className={[
                            'h-auto rounded-2xl px-3 py-3 text-sm transition-colors',
                            active
                              ? 'border-amber-400/40 bg-amber-400 text-zinc-950 hover:bg-amber-300'
                              : 'border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/10 hover:text-white',
                          ].join(' ')}
                        >
                          {status}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                    Mesaj / Proje Detayı
                  </p>
                  <div className="max-h-72 overflow-y-auto rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-7 text-zinc-300 whitespace-pre-wrap">
                    {selectedLead.projectDetails || 'Bir açıklama eklenmemiş.'}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl bg-amber-400/10 p-3 text-amber-200">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-white">Çalışma alanı hazır</p>
                      <p className="text-sm leading-7 text-zinc-400">
                        Kayıt seçtiğinizde ayrıntılar burada açılır. Mobilde bu panel listeden sonra akışa devam eder, dar ekranlarda taşma yapmaz.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-[0.62rem] uppercase tracking-[0.24em] text-zinc-500">Görünür Kayıt</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{visibleLeads.length}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-[0.62rem] uppercase tracking-[0.24em] text-zinc-500">Rapor Kapsamı</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{reportLeads.length}</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-5">
                  <p className="text-sm font-medium text-white">Hızlı işlem</p>
                  <p className="mt-2 text-sm leading-7 text-zinc-400">
                    Rapor aralığını üstten değiştirin, toplu önizlemeyi açın veya listeden bir kayda tıklayarak detay panelini doldurun.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      onClick={() => visibleLeads[0] && setSelectedLead(visibleLeads[0])}
                      className="rounded-full bg-amber-400 text-zinc-950 hover:bg-amber-300"
                    >
                      İlk kaydı aç
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => openPreview('bulk')}
                      className="rounded-full border-white/10 bg-white/[0.03] text-white hover:bg-white/10"
                    >
                      Toplu önizleme
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AnimatePresence>
        {isPreviewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm sm:p-6"
            onClick={closePreview}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              onClick={(event) => event.stopPropagation()}
              className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-6xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950 shadow-[0_30px_120px_rgba(0,0,0,0.55)]"
            >
              <div className="flex flex-col gap-3 border-b border-white/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-zinc-500">
                    PDF Önizleme
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-white">{reportTitle}</h3>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="border-white/10 bg-white/5 text-zinc-200">
                    A4 Kurumsal Format
                  </Badge>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full border-white/10 bg-white/[0.03] text-white hover:bg-white/10"
                    onClick={() => window.print()}
                  >
                    <Printer className="mr-2 h-4 w-4" />
                    Yazdır
                  </Button>
                  <Button
                    type="button"
                    className="rounded-full bg-amber-400 text-zinc-950 hover:bg-amber-300"
                    onClick={handleDownloadPDF}
                    disabled={!libLoaded}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {libLoaded ? 'PDF İndir' : 'Yükleniyor...'}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={closePreview}
                    className="h-10 w-10 rounded-full text-zinc-400 hover:bg-white/5 hover:text-white"
                    aria-label="Önizlemeyi kapat"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-auto bg-black/35 p-3 sm:p-6">
                <div className="preview-paper mx-auto w-full max-w-[210mm] rounded-[1.5rem] bg-white p-5 text-zinc-900 shadow-2xl sm:p-8">
                  {isBulkPreview ? (
                    <BulkLeadReport leads={reportLeads} documentNumber={documentNumber} title={reportTitle} />
                  ) : selectedLead ? (
                    <SingleLeadReport lead={selectedLead} documentNumber={documentNumber} />
                  ) : null}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
        strategy="afterInteractive"
        onLoad={() => setLibLoaded(true)}
        onError={() => {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js';
          script.onload = () => setLibLoaded(true);
          document.body.appendChild(script);
        }}
      />

      <div className="print-view hidden">
        <div className="mx-auto w-[210mm] min-h-[297mm] bg-white p-[16mm] text-zinc-900">
          {previewMode === 'bulk' ? (
            <BulkLeadReport leads={reportLeads} documentNumber={documentNumber} title={reportTitle} />
          ) : selectedLead ? (
            <SingleLeadReport lead={selectedLead} documentNumber={documentNumber} />
          ) : null}
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body {
            background: #fff !important;
          }

          body * {
            visibility: hidden !important;
          }

          .print-view,
          .print-view * {
            visibility: visible !important;
          }

          .print-view {
            display: block !important;
            position: absolute !important;
            inset: 0 !important;
            z-index: 9999 !important;
            background: #fff !important;
          }

          .print-view .preview-paper {
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}
