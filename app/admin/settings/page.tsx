'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Globe,
  Hash,
  Loader2,
  Mail,
  Phone,
  Save,
  Settings2,
  Shield,
  Sparkles,
  UserCheck,
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
import { cn } from '@/lib/utils';

type SettingsDraft = {
  key: string;
  logoUrl: string;
  faviconUrl: string;
  studioName: string;
  contactEmail: string;
  maintenanceMode: boolean;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  googleAnalyticsId: string;
  metaPixelId: string;
  phone: string;
  whatsapp: string;
  address: string;
  googleMapsUrl: string;
  socialLinks: {
    instagram: string;
    linkedin: string;
    facebook: string;
    x: string;
  };
};

type TabKey = 'genel' | 'seo' | 'iletisim' | 'sistem';

const TABS: Array<{
  key: TabKey;
  label: string;
  description: string;
  icon: typeof Settings2;
}> = [
  { key: 'genel', label: 'Genel', description: 'Marka kimliği ve sosyal profiller', icon: Settings2 },
  { key: 'seo', label: 'SEO', description: 'Meta başlıklar ve takip kodları', icon: Globe },
  { key: 'iletisim', label: 'İletişim', description: 'E-posta, telefon ve adres', icon: Phone },
  { key: 'sistem', label: 'Sistem', description: 'Bakım modu ve yayın durumu', icon: Shield },
];

const DEFAULT_SETTINGS: SettingsDraft = {
  key: 'site-settings',
  logoUrl: '/images/logo-new.jpeg',
  faviconUrl: '',
  studioName: 'DEQOIN | Architectural Studio',
  contactEmail: 'randevu@deqoin.com',
  maintenanceMode: false,
  metaTitle: '',
  metaDescription: '',
  keywords: '',
  googleAnalyticsId: '',
  metaPixelId: '',
  phone: '',
  whatsapp: '',
  address: '',
  googleMapsUrl: '',
  socialLinks: {
    instagram: '',
    linkedin: '',
    facebook: '',
    x: '',
  },
};

function cloneSettings(value: SettingsDraft) {
  return JSON.parse(JSON.stringify(value)) as SettingsDraft;
}

function normalizeSettings(payload: any): SettingsDraft {
  return {
    ...DEFAULT_SETTINGS,
    ...(payload || {}),
    socialLinks: {
      ...DEFAULT_SETTINGS.socialLinks,
      ...(payload?.socialLinks || {}),
    },
  };
}

function TabButton({
  active,
  icon: Icon,
  label,
  description,
  onClick,
}: {
  active: boolean;
  icon: typeof Settings2;
  label: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      className={cn(
        'h-auto w-full justify-start rounded-[1.35rem] border px-4 py-4 text-left transition-all',
        active
          ? 'border-white/20 bg-white/10 text-white shadow-[0_18px_50px_rgba(0,0,0,0.22)]'
          : 'border-white/10 bg-white/[0.03] text-white/65 hover:border-white/15 hover:bg-white/[0.06] hover:text-white',
      )}
    >
      <Icon className="mr-3 h-4 w-4 shrink-0" />
      <span className="flex min-w-0 flex-col items-start gap-1">
        <span className="text-[0.66rem] uppercase tracking-[0.35em]">{label}</span>
        <span className="text-[0.68rem] normal-case tracking-normal text-white/70">{description}</span>
      </span>
    </Button>
  );
}

function SummaryMetric({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof Sparkles;
}) {
  return (
    <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center gap-2 text-white/45">
        <Icon className="h-4 w-4" />
        <span className="text-[0.55rem] uppercase tracking-[0.45em]">{label}</span>
      </div>
      <p className="mt-3 text-sm uppercase tracking-[0.24em] text-white">{value}</p>
    </div>
  );
}

export default function SettingsPage() {
  const { showToast } = useNotification();
  const [settings, setSettings] = useState<SettingsDraft>(() => cloneSettings(DEFAULT_SETTINGS));
  const [initialSettings, setInitialSettings] = useState<SettingsDraft>(() => cloneSettings(DEFAULT_SETTINGS));
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('genel');
  const [uploadingField, setUploadingField] = useState<keyof Pick<SettingsDraft, 'logoUrl' | 'faviconUrl'> | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings', { cache: 'no-store' });
      const data = await res.json().catch(() => null);
      const normalized = normalizeSettings(res.ok ? data : null);
      setSettings(cloneSettings(normalized));
      setInitialSettings(cloneSettings(normalized));

      if (!res.ok) {
        showToast('Ayarlar varsayılan veriyle yüklendi.', 'warning');
      }
    } catch (error) {
      console.error('Settings fetch error:', error);
      const fallback = cloneSettings(DEFAULT_SETTINGS);
      setSettings(fallback);
      setInitialSettings(cloneSettings(fallback));
      showToast('Ayarlar yüklenemedi, varsayılan değerler gösteriliyor.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    void fetchSettings();
  }, [fetchSettings]);

  const patchSettings = useCallback((updater: (current: SettingsDraft) => SettingsDraft) => {
    setSettings((current) => {
      const next = updater(current);
      setIsDirty(true);
      return next;
    });
  }, []);

  const updateSocialLink = useCallback((key: keyof SettingsDraft['socialLinks'], value: string) => {
    patchSettings((current) => ({
      ...current,
      socialLinks: {
        ...current.socialLinks,
        [key]: value,
      },
    }));
  }, [patchSettings]);

  const uploadFile = useCallback(
    async (file: File, field: keyof Pick<SettingsDraft, 'logoUrl' | 'faviconUrl'>) => {
      setUploadingField(field);

      try {
        const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
          method: 'POST',
          body: file,
        });

        const blob = await res.json().catch(() => null);
        const uploadedUrl = blob?.url || blob?.secure_url || blob?.downloadUrl;

        if (!res.ok || !uploadedUrl) {
          throw new Error(blob?.error || 'Upload failed');
        }

        patchSettings((current) => ({
          ...current,
          [field]: uploadedUrl,
        }));
      } catch (error) {
        console.error('Settings upload error:', error);
        showToast('Görsel yüklenemedi.', 'error');
      } finally {
        setUploadingField(null);
      }
    },
    [patchSettings, showToast],
  );

  const saveSettings = useCallback(async () => {
    setIsSaving(true);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || 'Save failed');
      }

      const normalized = normalizeSettings(data || settings);
      setSettings(cloneSettings(normalized));
      setInitialSettings(cloneSettings(normalized));
      setIsDirty(false);
      showToast('Ayarlar başarıyla kaydedildi.', 'success');
    } catch (error) {
      console.error('Settings save error:', error);
      showToast('Kaydetme sırasında bir hata oluştu.', 'error');
    } finally {
      setIsSaving(false);
    }
  }, [settings, showToast]);

  const handleCancel = useCallback(() => {
    setSettings(cloneSettings(initialSettings));
    setIsDirty(false);
    showToast('Değişiklikler geri alındı.', 'info');
  }, [initialSettings, showToast]);

  const activeTabConfig = useMemo(() => TABS.find((tab) => tab.key === activeTab) ?? TABS[0], [activeTab]);

  const logoUploadLabel = uploadingField === 'logoUrl' ? 'Yükleniyor' : settings.logoUrl ? 'Değiştir' : 'Yükle';
  const faviconUploadLabel = uploadingField === 'faviconUrl' ? 'Yükleniyor' : settings.faviconUrl ? 'Değiştir' : 'Yükle';

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[color:var(--accent)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <Card className="relative overflow-hidden border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(166,137,102,0.2),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] shadow-[0_35px_120px_rgba(0,0,0,0.28)]">
        <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.22)_1px,transparent_0)] [background-size:24px_24px]" />
        <CardContent className="relative flex flex-col gap-6 p-6 md:p-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="border-white/10 bg-white/5 text-white/80">
                SITE SETTINGS
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  'border-white/10 text-white/80',
                  isDirty ? 'bg-rose-500/10 text-rose-100' : 'bg-emerald-500/10 text-emerald-100',
                )}
              >
                {isDirty ? 'KAYDEDİLMEMİŞ DEĞİŞİKLİK' : 'SENKRONİZE'}
              </Badge>
              <Badge variant="outline" className="border-amber-500/20 bg-amber-500/10 text-amber-100">
                API: {uploadingField ? 'GÖRSEL YÜKLENİYOR' : 'BAĞLI'}
              </Badge>
            </div>

            <div className="space-y-3">
              <p className="text-[0.62rem] uppercase tracking-[0.5em] text-white/42">YÖNETİM PANELİ</p>
              <h1
                className="max-w-4xl text-[clamp(2.3rem,5vw,4.8rem)] font-thin uppercase leading-[0.86] tracking-[0.1em] text-white"
                style={{ fontFamily: 'Smooch Sans, sans-serif' }}
              >
                AYARLAR
              </h1>
              <p className="max-w-3xl text-sm uppercase tracking-[0.28em] text-white/62 md:text-[0.85rem]">
                Marka kimliği, SEO, iletişim kanalları ve sistem davranışlarını tek bir responsive panelden yönetin.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <SummaryMetric label="Kimlik" value={settings.studioName || 'DEQOIN'} icon={Sparkles} />
              <SummaryMetric label="SEO" value={settings.metaTitle ? 'DOLU' : 'BOŞ'} icon={Hash} />
              <SummaryMetric label="İletişim" value={settings.contactEmail || 'E-POSTA YOK'} icon={Mail} />
              <SummaryMetric label="Durum" value={settings.maintenanceMode ? 'BAKIM' : 'YAYINDA'} icon={settings.maintenanceMode ? Shield : UserCheck} />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              className="border border-white/10 bg-white/[0.03] text-white hover:bg-white hover:text-zinc-950"
              onClick={handleCancel}
              disabled={!isDirty}
            >
              SIFIRLA
            </Button>
            <Button
              type="button"
              className="border border-white/10 bg-white text-zinc-950 hover:bg-white/90"
              onClick={saveSettings}
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {isDirty ? 'KAYDET' : 'KAYDEDİLDİ'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <AdminSaveBar
        isVisible={isDirty}
        onSave={saveSettings}
        onCancel={handleCancel}
        isSaving={isSaving}
      />

      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
          <Card className="border-white/10 bg-white/[0.04] shadow-none">
            <CardHeader className="space-y-3">
              <CardTitle className="text-sm uppercase tracking-[0.32em] text-white/90">Bölümler</CardTitle>
              <CardDescription className="text-white/55">Panel alanları arasında hızlı geçiş yapın.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {TABS.map((tab) => (
                <TabButton
                  key={tab.key}
                  active={activeTab === tab.key}
                  icon={tab.icon}
                  label={tab.label}
                  description={tab.description}
                  onClick={() => setActiveTab(tab.key)}
                />
              ))}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.04] shadow-none">
            <CardHeader className="space-y-3">
              <CardTitle className="text-sm uppercase tracking-[0.32em] text-white/90">Durum Özeti</CardTitle>
              <CardDescription className="text-white/55">Son API bağlantısı ve yayın durumu.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-white/65">
              <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-[0.58rem] uppercase tracking-[0.45em] text-white/35">AKTİF TAB</p>
                <p className="mt-2 text-sm uppercase tracking-[0.24em] text-white">{activeTabConfig.label}</p>
              </div>
              <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-[0.58rem] uppercase tracking-[0.45em] text-white/35">API BAĞLANTISI</p>
                <p className="mt-2 text-sm uppercase tracking-[0.24em] text-white">/api/settings</p>
              </div>
              <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-[0.58rem] uppercase tracking-[0.45em] text-white/35">YAYIN DURUMU</p>
                <p className="mt-2 text-sm uppercase tracking-[0.24em] text-white">
                  {settings.maintenanceMode ? 'Bakım modu açık' : 'Site yayında'}
                </p>
              </div>
            </CardContent>
          </Card>
        </aside>

        <section className="space-y-6">
          <AnimatePresence mode="wait">
            {activeTab === 'genel' && (
              <motion.div
                key="genel"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                className="grid gap-6 lg:grid-cols-2"
              >
                <Card className="border-white/10 bg-white/[0.04] shadow-none">
                  <CardHeader className="space-y-3">
                    <CardTitle className="text-sm uppercase tracking-[0.32em] text-white/90">Site Kimliği</CardTitle>
                    <CardDescription className="text-white/55">Logo ve favicon dosyalarını sürükleyip bırakabilirsiniz.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 xl:grid-cols-2">
                      <AdminImageDropzone
                        accept="image/*"
                        aspectClassName="aspect-[16/10]"
                        buttonLabel={logoUploadLabel}
                        className="min-h-[260px] rounded-[1.35rem] border-white/10 bg-white/[0.03]"
                        description="Kurumsal logo dosyasını yükleyin."
                        emptySubtitle="Ana logo görseli"
                        emptyTitle="Logo ekleyin"
                        onFileSelect={async (file) => uploadFile(file, 'logoUrl')}
                        previewAlt="Logo"
                        previewUrl={settings.logoUrl}
                        title="ANA LOGO"
                      />
                      <AdminImageDropzone
                        accept="image/*"
                        aspectClassName="aspect-square"
                        buttonLabel={faviconUploadLabel}
                        className="min-h-[260px] rounded-[1.35rem] border-white/10 bg-white/[0.03]"
                        description="Tarayıcı sekmesinde kullanılacak ikon."
                        emptySubtitle="Favicon görseli"
                        emptyTitle="Favicon ekleyin"
                        onFileSelect={async (file) => uploadFile(file, 'faviconUrl')}
                        previewAlt="Favicon"
                        previewUrl={settings.faviconUrl}
                        title="FAVICON"
                      />
                    </div>

                    <div className="space-y-2">
                      <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">STÜDYO İSMİ</p>
                      <Input
                        value={settings.studioName}
                        onChange={(event) =>
                          patchSettings((current) => ({
                            ...current,
                            studioName: event.target.value,
                          }))
                        }
                        className="bg-white/[0.03]"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/[0.04] shadow-none">
                  <CardHeader className="space-y-3">
                    <CardTitle className="text-sm uppercase tracking-[0.32em] text-white/90">Sosyal Profiller</CardTitle>
                    <CardDescription className="text-white/55">Footer ve paylaşım alanlarında kullanılan profiller.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">INSTAGRAM</p>
                        <Input
                          value={settings.socialLinks.instagram}
                          onChange={(event) => updateSocialLink('instagram', event.target.value)}
                          className="bg-white/[0.03]"
                          placeholder="https://instagram.com/..."
                        />
                      </div>
                      <div className="space-y-2">
                        <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">LINKEDIN</p>
                        <Input
                          value={settings.socialLinks.linkedin}
                          onChange={(event) => updateSocialLink('linkedin', event.target.value)}
                          className="bg-white/[0.03]"
                          placeholder="https://linkedin.com/..."
                        />
                      </div>
                      <div className="space-y-2">
                        <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">FACEBOOK</p>
                        <Input
                          value={settings.socialLinks.facebook}
                          onChange={(event) => updateSocialLink('facebook', event.target.value)}
                          className="bg-white/[0.03]"
                          placeholder="https://facebook.com/..."
                        />
                      </div>
                      <div className="space-y-2">
                        <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">X / TWITTER</p>
                        <Input
                          value={settings.socialLinks.x}
                          onChange={(event) => updateSocialLink('x', event.target.value)}
                          className="bg-white/[0.03]"
                          placeholder="https://x.com/..."
                        />
                      </div>
                    </div>

                    <Separator className="bg-white/10" />

                    <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4 text-sm leading-7 text-white/60">
                      Sosyal linkler boş bırakılabilir. Sistemin diğer bölümleri bu alanları opsiyonel olarak kullanır.
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === 'seo' && (
              <motion.div
                key="seo"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                className="grid gap-6 lg:grid-cols-2"
              >
                <Card className="border-white/10 bg-white/[0.04] shadow-none">
                  <CardHeader className="space-y-3">
                    <CardTitle className="text-sm uppercase tracking-[0.32em] text-white/90">Meta Bilgiler</CardTitle>
                    <CardDescription className="text-white/55">Arama sonuçları ve sosyal önizleme başlıkları.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">VARSAYILAN SAYFA BAŞLIĞI</p>
                      <Input
                        value={settings.metaTitle}
                        onChange={(event) =>
                          patchSettings((current) => ({
                            ...current,
                            metaTitle: event.target.value,
                          }))
                        }
                        className="bg-white/[0.03]"
                        placeholder="Örn: Deqoin | Architectural Design Studio"
                      />
                    </div>

                    <div className="space-y-2">
                      <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">META AÇIKLAMASI</p>
                      <Textarea
                        rows={5}
                        value={settings.metaDescription}
                        onChange={(event) =>
                          patchSettings((current) => ({
                            ...current,
                            metaDescription: event.target.value,
                          }))
                        }
                        className="min-h-[160px] bg-white/[0.03] uppercase tracking-[0.08em] text-white"
                        placeholder="Siteniz hakkında arama sonuçlarında görünecek kısa açıklama..."
                      />
                    </div>

                    <div className="space-y-2">
                      <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">ANAHTAR KELİMELER</p>
                      <Input
                        value={settings.keywords}
                        onChange={(event) =>
                          patchSettings((current) => ({
                            ...current,
                            keywords: event.target.value,
                          }))
                        }
                        className="bg-white/[0.03]"
                        placeholder="mimari, iç mimari, tasarım, istanbul..."
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/[0.04] shadow-none">
                  <CardHeader className="space-y-3">
                    <CardTitle className="text-sm uppercase tracking-[0.32em] text-white/90">Takip Kodları</CardTitle>
                    <CardDescription className="text-white/55">Analytics ve reklam platformu kimlikleri.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">GOOGLE ANALYTICS (GA4)</p>
                        <Input
                          value={settings.googleAnalyticsId}
                          onChange={(event) =>
                            patchSettings((current) => ({
                              ...current,
                              googleAnalyticsId: event.target.value,
                            }))
                          }
                          className="bg-white/[0.03]"
                          placeholder="G-XXXXXXXXXX"
                        />
                      </div>
                      <div className="space-y-2">
                        <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">META PIXEL ID</p>
                        <Input
                          value={settings.metaPixelId}
                          onChange={(event) =>
                            patchSettings((current) => ({
                              ...current,
                              metaPixelId: event.target.value,
                            }))
                          }
                          className="bg-white/[0.03]"
                          placeholder="123456789012345"
                        />
                      </div>
                    </div>

                    <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4 text-sm leading-7 text-white/60">
                      Bu alanlar boş bırakıldığında izleme kodu eklenmez. API tarafı boş değerleri bozmadan saklar.
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === 'iletisim' && (
              <motion.div
                key="iletisim"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                className="grid gap-6 lg:grid-cols-2"
              >
                <Card className="border-white/10 bg-white/[0.04] shadow-none">
                  <CardHeader className="space-y-3">
                    <CardTitle className="text-sm uppercase tracking-[0.32em] text-white/90">İletişim Kanalları</CardTitle>
                    <CardDescription className="text-white/55">Site üstbilgisi ve iletişim sayfasında kullanılan bilgiler.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">E-POSTA</p>
                      <Input
                        type="email"
                        value={settings.contactEmail}
                        onChange={(event) =>
                          patchSettings((current) => ({
                            ...current,
                            contactEmail: event.target.value,
                          }))
                        }
                        className="bg-white/[0.03]"
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">TELEFON</p>
                        <Input
                          value={settings.phone}
                          onChange={(event) =>
                            patchSettings((current) => ({
                              ...current,
                              phone: event.target.value,
                            }))
                          }
                          className="bg-white/[0.03]"
                        />
                      </div>
                      <div className="space-y-2">
                        <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">WHATSAPP</p>
                        <Input
                          value={settings.whatsapp}
                          onChange={(event) =>
                            patchSettings((current) => ({
                              ...current,
                              whatsapp: event.target.value,
                            }))
                          }
                          className="bg-white/[0.03]"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/[0.04] shadow-none">
                  <CardHeader className="space-y-3">
                    <CardTitle className="text-sm uppercase tracking-[0.32em] text-white/90">Adres ve Harita</CardTitle>
                    <CardDescription className="text-white/55">İletişim sayfasındaki adres ve yönlendirme bileşenleri.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">FİZİKSEL ADRES</p>
                      <Textarea
                        rows={4}
                        value={settings.address}
                        onChange={(event) =>
                          patchSettings((current) => ({
                            ...current,
                            address: event.target.value,
                          }))
                        }
                        className="min-h-[130px] bg-white/[0.03] uppercase tracking-[0.08em] text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">GOOGLE MAPS URL</p>
                      <Input
                        value={settings.googleMapsUrl}
                        onChange={(event) =>
                          patchSettings((current) => ({
                            ...current,
                            googleMapsUrl: event.target.value,
                          }))
                        }
                        className="bg-white/[0.03]"
                        placeholder="https://www.google.com/maps/embed?..."
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === 'sistem' && (
              <motion.div
                key="sistem"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]"
              >
                <Card className="border-white/10 bg-white/[0.04] shadow-none">
                  <CardHeader className="space-y-3">
                    <CardTitle className="text-sm uppercase tracking-[0.32em] text-white/90">Bakım Modu</CardTitle>
                    <CardDescription className="text-white/55">
                      Aktif edildiğinde ziyaretçiler siteyi bakım ekranı üzerinden görür.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <button
                      type="button"
                      className={cn(
                        'flex w-full items-center justify-between rounded-[1.35rem] border p-4 text-left transition-all',
                        settings.maintenanceMode
                          ? 'border-amber-400/20 bg-amber-500/10'
                          : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]',
                      )}
                      onClick={() =>
                        patchSettings((current) => ({
                          ...current,
                          maintenanceMode: !current.maintenanceMode,
                        }))
                      }
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={cn(
                            'flex h-11 w-11 items-center justify-center rounded-full border',
                            settings.maintenanceMode
                              ? 'border-amber-400/30 bg-amber-400/15 text-amber-100'
                              : 'border-white/10 bg-white/[0.04] text-white/60',
                          )}
                        >
                          {settings.maintenanceMode ? <Shield className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </span>
                        <span className="flex flex-col">
                          <span className="text-[0.68rem] uppercase tracking-[0.35em] text-white/70">
                            {settings.maintenanceMode ? 'Bakım modu açık' : 'Bakım modu kapalı'}
                          </span>
                          <span className="mt-1 text-sm text-white/55">
                            Tek tıkla yayın davranışını değiştirin.
                          </span>
                        </span>
                      </span>
                      <span
                        className={cn(
                          'flex h-8 w-14 items-center rounded-full border p-1 transition-colors',
                          settings.maintenanceMode ? 'justify-end border-amber-400/20 bg-amber-400/20' : 'justify-start border-white/10 bg-white/[0.03]',
                        )}
                      >
                        <span className={cn('h-6 w-6 rounded-full', settings.maintenanceMode ? 'bg-amber-100' : 'bg-white/75')} />
                      </span>
                    </button>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4">
                        <p className="text-[0.58rem] uppercase tracking-[0.45em] text-white/35">YAYIN DURUMU</p>
                        <p className="mt-2 text-sm uppercase tracking-[0.24em] text-white">
                          {settings.maintenanceMode ? 'Bakım ekranı aktif' : 'Normal yayın'}
                        </p>
                      </div>
                      <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4">
                        <p className="text-[0.58rem] uppercase tracking-[0.45em] text-white/35">API KAYIT</p>
                        <p className="mt-2 text-sm uppercase tracking-[0.24em] text-white">/api/settings</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/[0.04] shadow-none">
                  <CardHeader className="space-y-3">
                    <CardTitle className="text-sm uppercase tracking-[0.32em] text-white/90">Hızlı Kontroller</CardTitle>
                    <CardDescription className="text-white/55">Bu alan kaydetmeden önce son kontrol için kullanılır.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm leading-7 text-white/65">
                    <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-[0.58rem] uppercase tracking-[0.45em] text-white/35">GÖRSEL YÜKLEME</p>
                      <p className="mt-2">
                        Logo ve favicon dosyaları doğrudan <span className="text-white">/api/upload</span> üzerinden yüklenir.
                      </p>
                    </div>
                    <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-[0.58rem] uppercase tracking-[0.45em] text-white/35">KAYIT BAĞLANTISI</p>
                      <p className="mt-2">
                        Değişiklikler <span className="text-white">POST /api/settings</span> ile saklanır ve anında üst bileşenlere yansır.
                      </p>
                    </div>
                    <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-[0.58rem] uppercase tracking-[0.45em] text-white/35">SON DURUM</p>
                      <p className="mt-2">
                        {isDirty ? 'Taslak değişti, kaydedilmesi gerekiyor.' : 'Mevcut değerler ile senkron durumdasınız.'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
}
