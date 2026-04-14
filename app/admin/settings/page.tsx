'use client';

import { useState, useEffect } from 'react';
import { 
  Camera, 
  Save, 
  Loader2, 
  Globe, 
  Mail, 
  Share2,
  Shield,
  Phone,
  MapPin,
  Settings as SettingsIcon,
  Hash,
  Activity,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('genel');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const [isDraggingFavicon, setIsDraggingFavicon] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadFile(file, field);
  };

  const uploadFile = async (file: File, field: string) => {
    setUploadLoading(true);
    try {
      const res = await fetch(`/api/upload?filename=${file.name}`, {
        method: 'POST',
        body: file
      });
      const blob = await res.json();
      setSettings({ ...settings, [field]: blob.url });
    } catch (err) {
      alert("Yüklenemedi.");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent, field: string) => {
    e.preventDefault();
    setIsDraggingLogo(false);
    setIsDraggingFavicon(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      uploadFile(file, field);
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      alert("Ayarlar başarıyla kaydedildi!");
    } catch (err) {
      alert("Kaydedilemedi.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="loader-wrap"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="settings-container">
      <div className="settings-header">
        <div className="header-text">
          <p>SİTE YÖNETİM MERKEZİ</p>
          <span>Kimlik, SEO, İletişim ve Sistem ayarlarını buradan yönetin.</span>
        </div>
        <button className="save-btn" onClick={saveSettings} disabled={isSaving}>
          {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          <span>KAYDET</span>
        </button>
      </div>

      <div className="tabs-navigation">
        <button className={activeTab === 'genel' ? 'active' : ''} onClick={() => setActiveTab('genel')}><SettingsIcon size={14}/> GENEL</button>
        <button className={activeTab === 'seo' ? 'active' : ''} onClick={() => setActiveTab('seo')}><Globe size={14}/> SEO</button>
        <button className={activeTab === 'iletisim' ? 'active' : ''} onClick={() => setActiveTab('iletisim')}><Phone size={14}/> İLETİŞİM</button>
        <button className={activeTab === 'sistem' ? 'active' : ''} onClick={() => setActiveTab('sistem')}><Shield size={14}/> SİSTEM</button>
      </div>

      <div className="settings-content">
        <AnimatePresence mode="wait">
          {activeTab === 'genel' && (
            <motion.div key="genel" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="settings-grid">
              <section className="settings-card logo-card">
                <div className="card-header"><h3>Site Kimliği</h3></div>
                <div className="logo-section-grid">
                  <div className="logo-upload-wrap">
                    <label>ANA LOGO</label>
                    <div 
                      className={`logo-preview-box ${isDraggingLogo ? 'drag-active' : ''}`} 
                      onClick={() => document.getElementById('logo-file')?.click()}
                      onDragOver={(e) => { e.preventDefault(); setIsDraggingLogo(true); }}
                      onDragLeave={() => setIsDraggingLogo(false)}
                      onDrop={(e) => handleDrop(e, 'logoUrl')}
                    >
                      {settings.logoUrl ? <img src={settings.logoUrl} alt="Logo" /> : <Camera size={24} />}
                      {uploadLoading && <div className="upload-overlay"><Loader2 className="animate-spin" /></div>}
                    </div>
                    <input id="logo-file" type="file" className="hidden" onChange={e => handleImageUpload(e, 'logoUrl')} />
                    <button type="button" className="upload-btn-mini" onClick={() => document.getElementById('logo-file')?.click()}>DEĞİŞTİR</button>
                  </div>
                  <div className="logo-upload-wrap">
                    <label>FAVICON</label>
                    <div 
                      className={`logo-preview-box square ${isDraggingFavicon ? 'drag-active' : ''}`} 
                      onClick={() => document.getElementById('favicon-file')?.click()}
                      onDragOver={(e) => { e.preventDefault(); setIsDraggingFavicon(true); }}
                      onDragLeave={() => setIsDraggingFavicon(false)}
                      onDrop={(e) => handleDrop(e, 'faviconUrl')}
                    >
                      {settings.faviconUrl ? <img src={settings.faviconUrl} alt="Favicon" /> : <Camera size={20} />}
                      {uploadLoading && <div className="upload-overlay"><Loader2 className="animate-spin" /></div>}
                    </div>
                    <input id="favicon-file" type="file" className="hidden" onChange={e => handleImageUpload(e, 'faviconUrl')} />
                    <button type="button" className="upload-btn-mini" onClick={() => document.getElementById('favicon-file')?.click()}>DEĞİŞTİR</button>
                  </div>
                  <div className="info-inputs">
                    <div className="form-group">
                      <label>STÜDYO İSMİ</label>
                      <input type="text" value={settings.studioName} onChange={e => setSettings({ ...settings, studioName: e.target.value })} />
                    </div>
                  </div>
                </div>
              </section>

              <section className="settings-card">
                <div className="card-header"><h3>Sosyal Medya Linkleri</h3></div>
                <div className="form-grid-2">
                  <div className="form-group"><label><Globe size={14}/> INSTAGRAM</label><input type="text" value={settings.socialLinks?.instagram || ''} onChange={e => setSettings({...settings, socialLinks: {...settings.socialLinks, instagram: e.target.value}})} /></div>
                  <div className="form-group"><label><Share2 size={14}/> LINKEDIN</label><input type="text" value={settings.socialLinks?.linkedin || ''} onChange={e => setSettings({...settings, socialLinks: {...settings.socialLinks, linkedin: e.target.value}})} /></div>
                  <div className="form-group"><label><Globe size={14}/> FACEBOOK</label><input type="text" value={settings.socialLinks?.facebook || ''} onChange={e => setSettings({...settings, socialLinks: {...settings.socialLinks, facebook: e.target.value}})} /></div>
                  <div className="form-group"><label><Share2 size={14}/> X / TWITTER</label><input type="text" value={settings.socialLinks?.x || ''} onChange={e => setSettings({...settings, socialLinks: {...settings.socialLinks, x: e.target.value}})} /></div>
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'seo' && (
            <motion.div key="seo" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="settings-grid single-col">
              <section className="settings-card">
                <div className="card-header"><h3>Arama Motoru Optimizasyonu (SEO)</h3></div>
                <div className="form-group">
                  <label><Hash size={14}/> VARSAYILAN SAYFA BAŞLIĞI</label>
                  <input type="text" value={settings.metaTitle || ''} onChange={e => setSettings({ ...settings, metaTitle: e.target.value })} placeholder="Örn: Deqoin | Architectural Design Studio" />
                </div>
                <div className="form-group">
                  <label><Mail size={14}/> META AÇIKLAMASI</label>
                  <textarea rows={4} value={settings.metaDescription || ''} onChange={e => setSettings({ ...settings, metaDescription: e.target.value })} placeholder="Siteniz hakkında arama sonuçlarında görünecek kısa açıklama..." />
                </div>
                <div className="form-group">
                  <label><Hash size={14}/> ANAHTAR KELİMELER</label>
                  <input type="text" value={settings.keywords || ''} onChange={e => setSettings({ ...settings, keywords: e.target.value })} placeholder="mimari, iç mimari, tasarım, istanbul..." />
                </div>
              </section>

              <section className="settings-card">
                <div className="card-header"><h3>Takip & Analitik Kodları</h3></div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label><Activity size={14}/> GOOGLE ANALYTICS (GA4) ID</label>
                    <input type="text" value={settings.googleAnalyticsId || ''} onChange={e => setSettings({ ...settings, googleAnalyticsId: e.target.value })} placeholder="G-XXXXXXXXXX" />
                  </div>
                  <div className="form-group">
                    <label><UserCheck size={14}/> META PIXEL ID</label>
                    <input type="text" value={settings.metaPixelId || ''} onChange={e => setSettings({ ...settings, metaPixelId: e.target.value })} placeholder="123456789012345" />
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'iletisim' && (
            <motion.div key="iletisim" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="settings-grid">
              <section className="settings-card">
                <div className="card-header"><h3>İletişim Kanalları</h3></div>
                <div className="form-group"><label><Mail size={14}/> E-POSTA</label><input type="email" value={settings.contactEmail} onChange={e => setSettings({ ...settings, contactEmail: e.target.value })} /></div>
                <div className="form-group"><label><Phone size={14}/> TELEFON</label><input type="text" value={settings.phone || ''} onChange={e => setSettings({ ...settings, phone: e.target.value })} /></div>
                <div className="form-group"><label><Phone size={14}/> WHATSAPP</label><input type="text" value={settings.whatsapp || ''} onChange={e => setSettings({ ...settings, whatsapp: e.target.value })} /></div>
              </section>
              <section className="settings-card">
                <div className="card-header"><h3>Adres Bilgileri</h3></div>
                <div className="form-group"><label><MapPin size={14}/> FİZİKSEL ADRES</label><textarea rows={2} value={settings.address || ''} onChange={e => setSettings({ ...settings, address: e.target.value })} /></div>
                <div className="form-group"><label><Globe size={14}/> GOOGLE MAPS URL</label><input type="text" value={settings.googleMapsUrl || ''} onChange={e => setSettings({ ...settings, googleMapsUrl: e.target.value })} /></div>
              </section>
            </motion.div>
          )}

          {activeTab === 'sistem' && (
            <motion.div key="sistem" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="settings-grid single-col">
              <section className="settings-card maintenance-card">
                <div className="card-header">
                   <div>
                      <h3>Bakım Modu</h3>
                      <p>Aktif edildiğinde ziyaretçiler siteyi göremez, sadece "Bakımdayız" mesajı ile karşılaşırlar.</p>
                   </div>
                   <div className={`status-toggle ${settings.maintenanceMode ? 'active' : ''}`} onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}>
                      <div className="toggle-bullet" />
                   </div>
                </div>
                <div className="maintenance-status-info">
                   {settings.maintenanceMode ? (
                     <p className="status-warn"><Shield size={16}/> SİTE ŞU AN ZİYARETÇİLERE KAPALI</p>
                   ) : (
                     <p className="status-ok"><UserCheck size={16}/> SİTE ŞU AN YAYINDA</p>
                   )}
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .settings-container { display: flex; flex-direction: column; gap: 3rem; }
        
        .settings-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 2rem;
          gap: 1.5rem;
        }
        @media (max-width: 768px) {
          .settings-header { flex-direction: column; align-items: stretch; text-align: center; }
          .save-btn { justify-content: center; }
        }

        .header-text p { font-family: var(--font-display), sans-serif; font-size: 0.75rem; letter-spacing: 0.3em; color: #a68966; margin: 0; }
        .header-text span { font-size: 0.85rem; color: var(--text-soft); opacity: 0.7; display: block; margin-top: 0.5rem; }

        .tabs-navigation { display: flex; gap: 0.5rem; margin-top: -1rem; overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none; }
        .tabs-navigation::-webkit-scrollbar { display: none; }
        .tabs-navigation button { background: transparent; border: none; border-bottom: 2px solid transparent; color: var(--text-muted); padding: 0.75rem 1rem; font-size: 0.7rem; font-weight: 800; letter-spacing: 0.1em; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; gap: 0.5rem; white-space: nowrap; }
        .tabs-navigation button:hover { color: var(--text); }
        .tabs-navigation button.active { color: #a68966; border-color: #a68966; }

        .save-btn {
          background: #a68966;
          color: #080808;
          border: none;
          padding: 1rem 2rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          font-family: var(--font-display), sans-serif;
          font-weight: 700;
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .save-btn:hover { background: #c2a785; transform: translateY(-2px); }

        .settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
        .settings-grid.single-col { grid-template-columns: 1fr; }
        
        .settings-card {
          background: var(--surface);
          border: 1px solid var(--line);
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          border-radius: 12px;
        }

        .card-header h3 { font-family: var(--font-display), sans-serif; font-size: 0.8rem; letter-spacing: 0.1em; color: #a68966; text-transform: uppercase; margin: 0; }
        .card-header p { font-size: 0.8rem; color: var(--text-soft); opacity: 0.7; margin-top: 0.5rem; }

        .logo-section-grid { display: flex; gap: 2.5rem; align-items: flex-end; }
        @media (max-width: 600px) { .logo-section-grid { flex-direction: column; align-items: flex-start; gap: 2rem; } .info-inputs { width: 100%; } }
        .logo-upload-wrap { display: flex; flex-direction: column; gap: 0.75rem; }
        .logo-upload-wrap label { font-size: 0.6rem; font-weight: 900; color: var(--text-muted); }
        .logo-preview-box { width: 140px; height: 100px; background: #fff; border-radius: 4px; display: flex; align-items: center; justify-content: center; cursor: pointer; padding: 10px; position: relative; }
        .logo-preview-box.square { width: 60px; height: 60px; }
        .logo-preview-box img { max-width: 100%; max-height: 100%; object-fit: contain; }
        .upload-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; }
        
        .upload-btn-mini { background: var(--surface-muted); color: var(--text); border: 1px solid var(--line); padding: 0.4rem; font-size: 0.6rem; font-weight: 700; cursor: pointer; border-radius: 2px; }
        .upload-btn-mini:hover { background: var(--text); color: var(--background); }
        .info-inputs { flex: 1; }

        .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.75rem; }
        .form-group label { font-size: 0.65rem; color: var(--text-muted); font-weight: 800; display: flex; align-items: center; gap: 0.5rem; }
        .form-group input, .form-group textarea {
          background: var(--background);
          border: 1px solid var(--line);
          padding: 1rem;
          color: var(--text);
          border-radius: 4px;
          font-size: 0.85rem;
          font-family: inherit;
        }

        .status-toggle { width: 60px; height: 32px; background: var(--line); border-radius: 20px; position: relative; cursor: pointer; transition: all 0.3s; }
        .status-toggle.active { background: #a68966; }
        .toggle-bullet { width: 24px; height: 24px; background: #fff; border-radius: 50%; position: absolute; top: 4px; left: 4px; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        .status-toggle.active .toggle-bullet { left: 32px; background: #000; }
        
        .maintenance-status-info { margin-top: 1rem; padding-top: 1.5rem; border-top: 1px solid var(--line); }
        .status-warn { color: #ffab40; font-size: 0.8rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem; }
        .status-ok { color: #4caf50; font-size: 0.8rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem; }

        .hidden { display: none; }
        .loader-wrap { height: 400px; display: flex; align-items: center; justify-content: center; color: #a68966; }

        @media (max-width: 1024px) {
          .settings-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
