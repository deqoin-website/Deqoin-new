'use client';

import { useState, useEffect } from 'react';
import { 
  Camera, 
  Save, 
  Loader2, 
  Globe, 
  Mail, 
  Share2 
} from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

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

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);
    try {
      const res = await fetch(`/api/upload?filename=${file.name}`, {
        method: 'POST',
        body: file
      });
      const blob = await res.json();
      setSettings({ ...settings, logoUrl: blob.url });
    } catch (err) {
      alert("Logo yüklenemedi.");
    } finally {
      setUploadLoading(false);
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
          <p>GENEL AYARLAR</p>
          <span>Sitenizin kimliğini ve logonuzu buradan yönetin.</span>
        </div>
        <button className="save-btn" onClick={saveSettings} disabled={isSaving}>
          {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          <span>DEĞİŞİKLİKLERİ KAYDET</span>
        </button>
      </div>

      <div className="settings-grid">
        {/* LOGO SECTION */}
        <section className="settings-card logo-card">
          <div className="card-header">
            <h3>Site Logosu</h3>
          </div>
          <div className="logo-preview-area">
            <div className="logo-display">
              {uploadLoading ? (
                <div className="logo-loader"><Loader2 className="animate-spin" size={32} /></div>
              ) : (
                <img src={settings.logoUrl} alt="Logo Preview" />
              )}
            </div>
            <div className="logo-actions">
              <label className="upload-btn">
                <Camera size={18} />
                <span>Logoyu Değiştir</span>
                <input type="file" className="hidden" onChange={handleLogoUpload} />
              </label>
              <p>Tavsiye edilen: Saydam arka plan (PNG), 512x512px</p>
            </div>
          </div>
        </section>

        {/* BASIC INFO */}
        <section className="settings-card">
          <div className="card-header">
            <h3>Stüdyo Bilgileri</h3>
          </div>
          <div className="form-group">
            <label><Globe size={14} /> Stüdyo İsmi</label>
            <input 
              type="text" 
              value={settings.studioName} 
              onChange={e => setSettings({ ...settings, studioName: e.target.value })} 
            />
          </div>
          <div className="form-group">
            <label><Mail size={14} /> İletişim E-posta</label>
            <input 
              type="email" 
              value={settings.contactEmail} 
              onChange={e => setSettings({ ...settings, contactEmail: e.target.value })} 
            />
          </div>
        </section>

        {/* SOCIAL LINKS */}
        <section className="settings-card">
          <div className="card-header">
            <h3>Sosyal Medya</h3>
          </div>
          <div className="form-group">
            <label><Globe size={14} /> Instagram URL</label>
            <input 
              type="text" 
              value={settings.socialLinks?.instagram || ''} 
              onChange={e => setSettings({ 
                ...settings, 
                socialLinks: { ...settings.socialLinks, instagram: e.target.value } 
              })} 
            />
          </div>
          <div className="form-group">
            <label><Share2 size={14} /> Linkedin URL</label>
            <input 
              type="text" 
              value={settings.socialLinks?.linkedin || ''} 
              onChange={e => setSettings({ 
                ...settings, 
                socialLinks: { ...settings.socialLinks, linkedin: e.target.value } 
              })} 
            />
          </div>
        </section>
      </div>

      <style jsx>{`
        .settings-container { display: flex; flex-direction: column; gap: 3rem; }
        
        .settings-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 2rem;
        }

        .header-text p { font-family: var(--font-display), sans-serif; font-size: 0.75rem; letter-spacing: 0.3em; color: #a68966; }
        .header-text span { font-size: 0.85rem; opacity: 0.4; display: block; margin-top: 0.5rem; }

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
        
        .settings-card {
          background: #141414;
          border: 1px solid rgba(255, 255, 255, 0.03);
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .card-header h3 { font-family: var(--font-display), sans-serif; font-size: 0.8rem; letter-spacing: 0.1em; opacity: 0.6; text-transform: uppercase; }

        .logo-preview-area { display: flex; align-items: center; gap: 3rem; }
        
        .logo-display {
          width: 120px;
          height: 120px;
          background: #fff;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .logo-display img { max-width: 100%; max-height: 100%; object-fit: contain; }

        .logo-actions { display: flex; flex-direction: column; gap: 1rem; }
        .logo-actions p { font-size: 0.7rem; opacity: 0.4; }

        .upload-btn {
          background: rgba(166, 137, 102, 0.1);
          color: #a68966;
          border: 1px dashed rgba(166, 137, 102, 0.3);
          padding: 0.8rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          font-size: 0.8rem;
          transition: all 0.3s;
          width: fit-content;
        }

        .upload-btn:hover { background: rgba(166, 137, 102, 0.2); border-color: #a68966; }

        .form-group { display: flex; flex-direction: column; gap: 0.75rem; }
        .form-group label { font-size: 0.75rem; opacity: 0.6; display: flex; align-items: center; gap: 0.5rem; }
        .form-group input {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 1rem;
          color: #fff;
          border-radius: 2px;
          font-size: 0.9rem;
        }

        .logo-card { grid-column: span 2; }
        .hidden { display: none; }
        .loader-wrap { height: 400px; display: flex; align-items: center; justify-content: center; color: #a68966; }

        @media (max-width: 1024px) {
          .settings-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
