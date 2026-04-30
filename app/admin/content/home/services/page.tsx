'use client';

import { useState, useEffect } from 'react';
import { 
  Save, 
  Loader2, 
  Image as ImageIcon, 
  PenTool, 
  Layers, 
  Hammer,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNotification } from '@/components/admin/AdminNotificationProvider';
import { AdminSaveBar } from '@/components/admin/AdminSaveBar';
import { resolveStudioCardImage } from '@/lib/image-resolvers';

export default function HomeServicesAdmin() {
  const { showToast } = useNotification();
  const [cards, setCards] = useState<any[]>([]);
  const [initialCards, setInitialCards] = useState<any[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [draggingCard, setDraggingCard] = useState<number | null>(null);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const res = await fetch('/api/admin/content/home/services');
      if (res.ok) {
        const data = await res.json();
        setCards(data);
        setInitialCards(JSON.parse(JSON.stringify(data)));
      }
    } catch (err) {
      console.error(err);
      showToast("Kartlar yüklenemedi.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/content/home/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cards)
      });
      if (res.ok) {
        showToast("Kartlar başarıyla güncellendi!", "success");
        setInitialCards(JSON.parse(JSON.stringify(cards)));
        setIsDirty(false);
      } else {
        showToast("Kayıt sırasında hata oluştu.", "error");
      }
    } catch (err) {
      showToast("Bağlantı hatası.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setCards(JSON.parse(JSON.stringify(initialCards)));
    setIsDirty(false);
    showToast("Değişiklikler geri alındı.", "info");
  };

  const updateCard = (index: number, field: string, value: any) => {
    const newCards = [...cards];
    newCards[index][field] = value;
    setCards(newCards);
    setIsDirty(true);
  };

  const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadFile(index, file);
  };

  const uploadFile = async (index: number, file: File) => {
    try {
      const res = await fetch(`/api/upload?filename=${file.name}`, {
        method: 'POST',
        body: file
      });
      const blob = await res.json();
      updateCard(index, 'image', blob.url);
      setIsDirty(true);
    } catch (err) {
      showToast("Görsel yüklenemedi.", "error");
    }
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDraggingCard(null);
    const file = e.dataTransfer.files[0];
    if (file) {
      uploadFile(index, file);
    }
  };

  if (loading) return <div className="loader-wrap"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="lux-admin-container">
      <div className="lux-header">
        <div className="header-text">
          <h1>STÜDYO SEÇİM KARTLARI</h1>
          <p>Ana sayfada yer alan Design, Material ve Execution kartlarını yönetin.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {isDirty && (
            <button 
              className="lux-save-btn" 
              style={{ background: 'transparent', border: '1px solid rgba(166,137,102,0.4)', color: '#a68966', boxShadow: 'none' }}
              onClick={handleCancel}
            >
              <RotateCcw size={18} />
              <span>SIFIRLA</span>
            </button>
          )}
          <button className={`lux-save-btn ${isDirty ? 'dirty-pulse' : ''}`} onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            <span>{isDirty ? 'KAYDETMEYİ UNUTMAYIN' : 'KARTLARI GÜNCELLE'}</span>
          </button>
        </div>
      </div>

      <AdminSaveBar 
        isVisible={isDirty} 
        onSave={handleSave} 
        onCancel={handleCancel}
        isSaving={saving}
      />

      <div className="services-admin-grid">
        {cards.map((card, idx) => (
          <motion.div 
            key={card.studioType} 
            className="service-admin-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="card-type-header">
              <div className="type-left">
                {card.studioType === 'design' && <PenTool size={18} />}
                {card.studioType === 'material' && <Layers size={18} />}
                {card.studioType === 'execution' && <Hammer size={18} />}
                <span>{card.studioType.toUpperCase()} STUDIO</span>
              </div>
              <div className="lux-order-badge">SIRA: {idx + 1}</div>
            </div>

            <div 
              className={`card-image-preview ${draggingCard === idx ? 'drag-active' : ''}`} 
              onClick={() => document.getElementById(`img-${idx}`)?.click()}
              onDragOver={(e) => { e.preventDefault(); setDraggingCard(idx); }}
              onDragLeave={() => setDraggingCard(null)}
              onDrop={(e) => handleDrop(e, idx)}
            >
              {(() => {
                const fallbackImg = card.studioType === 'design' 
                  ? "/images/workflow/design-studio-home.png"
                  : card.studioType === 'material'
                  ? "/images/workflow/material-studio-home.png"
                  : "/images/workflow/execution-studio-home.png";
                const resolvedImage = resolveStudioCardImage(card.image, card.studioType) || fallbackImg;
                
                return resolvedImage ? (
                  <img 
                    src={resolvedImage} 
                    alt={card.title} 
                    style={{ 
                      filter: `blur(${card.blur || 0}px)`,
                      transition: 'filter 0.3s ease'
                    }}
                  />
                ) : (
                  <div className="img-placeholder">
                    <ImageIcon size={32} />
                    <p>Kart Görseli Yükle</p>
                  </div>
                );
              })()}
              <div 
                className="img-live-overlay" 
                style={{ 
                  background: `rgba(0,0,0,${(card.overlay ?? 30) / 100})`,
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none'
                }} 
              />
              <input 
                id={`img-${idx}`} 
                type="file" 
                className="hidden" 
                onChange={(e) => handleImageUpload(idx, e)} 
              />
              <div className="img-overlay">GÖRSELİ DEĞİŞTİR</div>
            </div>

            <div className="card-fields">
              <div className="lux-group">
                <label>BAŞLIK (TITLE)</label>
                <input 
                  type="text" 
                  value={card.title} 
                  placeholder="Kart Başlığı..."
                  onChange={(e) => updateCard(idx, 'title', e.target.value)} 
                />
              </div>
              <div className="lux-group">
                <label>ALT METİN (SUB TITLE)</label>
                <input 
                  type="text" 
                  value={card.description} 
                  placeholder="Kısa Açıklama..."
                  onChange={(e) => updateCard(idx, 'description', e.target.value)} 
                />
              </div>

              <div className="effect-controls">
                <div className="effect-header">GÖRSEL EFEKTLER</div>
                <div className="effect-row">
                  <div className="effect-col">
                    <label>BULANIKLIK (Blur) <span>{card.blur || 0}px</span></label>
                    <input 
                      type="range" min="0" max="20" step="1"
                      value={card.blur || 0}
                      onChange={(e) => updateCard(idx, 'blur', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="effect-col">
                    <label>KARANLIK (Darkness) <span>%{card.overlay || 30}</span></label>
                    <input 
                      type="range" min="0" max="100" step="5"
                      value={card.overlay || 30}
                      onChange={(e) => updateCard(idx, 'overlay', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bottom-save-section">
        <button className={`lux-save-btn wide ${isDirty ? 'dirty-pulse' : ''}`} onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          <span>{isDirty ? 'DEĞİŞİKLİKLERİ ŞİMDİ KAYDET' : 'HİÇBİR DEĞİŞİKLİK YOK'}</span>
        </button>
      </div>

      <style jsx>{`
        .lux-admin-container { display: flex; flex-direction: column; gap: 3rem; }
        
        .lux-header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 1px solid rgba(166,137,102,0.2); padding-bottom: 2.5rem; }
        .header-text h1 { font-family: var(--font-display), sans-serif; font-size: 1.5rem; letter-spacing: 0.3em; color: #a68966; margin: 0; }
        .header-text p { font-size: 0.85rem; color: var(--text-soft); opacity: 0.7; margin-top: 0.5rem; }
        
        .lux-save-btn.dirty-pulse { background: #a68966; box-shadow: 0 0 20px rgba(166,137,102,0.4); animation: pulse-border 2s infinite; }
        @keyframes pulse-border { 0% { box-shadow: 0 0 0 0 rgba(166,137,102,0.4); } 70% { box-shadow: 0 0 0 10px rgba(166,137,102,0); } 100% { box-shadow: 0 0 0 0 rgba(166,137,102,0); } }

        .lux-save-btn { background: #a68966; color: #000; border: none; padding: 1rem 2rem; border-radius: 4px; font-family: var(--font-display); font-weight: 800; letter-spacing: 0.15em; font-size: 0.75rem; cursor: pointer; display: flex; align-items: center; gap: 1rem; transition: all 0.3s; box-shadow: 0 10px 30px rgba(166,137,102,0.3); }
        .lux-save-btn.wide { width: 100%; justify-content: center; padding: 1.5rem; font-size: 0.9rem; }
        .lux-save-btn:hover { background: #d4b591; transform: translateY(-2px); }

        .bottom-save-section { margin-top: 4rem; padding-top: 2rem; border-top: 1px solid rgba(166,137,102,0.1); }

        .services-admin-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2.5rem; }
        
        .service-admin-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; position: relative; overflow: hidden; }
        .service-admin-card::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: #a68966; opacity: 0.3; }
        
        .card-type-header { display: flex; align-items: center; justify-content: space-between; color: #a68966; font-family: var(--font-display); font-size: 0.75rem; letter-spacing: 0.1em; font-weight: 800; margin-bottom: 2rem; }
        .type-left { display: flex; align-items: center; gap: 0.75rem; }
        .lux-order-badge { 
          background: rgba(166, 137, 102, 0.1); border: 1px solid rgba(166, 137, 102, 0.3);
          padding: 0.3rem 0.8rem; border-radius: 4px; font-size: 0.6rem; color: #a68966; letter-spacing: 0.1em;
        }
        
        .card-image-preview { width: 100%; aspect-ratio: 16/10; background: rgba(0,0,0,0.4); border-radius: 12px; overflow: hidden; cursor: pointer; position: relative; border: 1px dashed rgba(166,137,102,0.3); transition: all 0.4s; }
        .card-image-preview:hover { border-color: #a68966; transform: scale(1.02); box-shadow: 0 10px 30px rgba(0,0,0,0.4); }
        .card-image-preview img { width: 100%; height: 100%; object-fit: cover; }
        .img-placeholder { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.75rem; color: var(--text-soft); }
        .img-placeholder p { font-size: 0.7rem; letter-spacing: 0.1em; }
        
        .img-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.6); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: 800; letter-spacing: 0.2em; opacity: 0; transition: 0.3s; backdrop-filter: blur(5px); }
        .card-image-preview:hover .img-overlay { opacity: 1; }

        .card-fields { display: flex; flex-direction: column; gap: 1.2rem; background: rgba(255,255,255,0.01); padding: 1rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.03); }
        .lux-group { display: flex; flex-direction: column; gap: 0.6rem; }
        .lux-group label { font-size: 0.55rem; color: #a68966; font-weight: 900; letter-spacing: 0.2em; opacity: 0.8; }
        
        /* Effect Sliders */
        .effect-controls { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(166,137,102,0.1); }
        .effect-header { font-size: 0.55rem; color: #a68966; font-weight: 900; letter-spacing: 0.25em; margin-bottom: 1.2rem; opacity: 0.9; }
        .effect-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .effect-col { display: flex; flex-direction: column; gap: 0.75rem; }
        .effect-col label { display: flex; justify-content: space-between; font-size: 0.5rem; letter-spacing: 0.1em; color: var(--text-soft); }
        .effect-col label span { color: #a68966; font-weight: 700; }
        .effect-col input[type="range"] { 
          -webkit-appearance: none; width: 100%; height: 4px; background: rgba(166,137,102,0.15); border-radius: 2px; outline: none; cursor: pointer;
        }
        .effect-col input[type="range"]::-webkit-slider-thumb { 
          -webkit-appearance: none; width: 14px; height: 14px; background: #a68966; border-radius: 50%; border: 2px solid #000; box-shadow: 0 0 10px rgba(166,137,102,0.3);
        }

        .lux-group input { 
          background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.08); 
          padding: 1rem; color: var(--text); border-radius: 8px; font-size: 0.85rem; 
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          font-family: inherit;
        }
        .lux-group input:focus { 
          outline: none; border-color: #a68966; background: rgba(0,0,0,0.4); 
          box-shadow: 0 0 20px rgba(166, 137, 102, 0.15);
          transform: translateY(-1px);
        }

        .card-footer-info { display: none; }

        .loader-wrap { height: 400px; display: flex; align-items: center; justify-content: center; color: #a68966; }
        .hidden { display: none; }
      `}</style>
    </div>
  );
}
