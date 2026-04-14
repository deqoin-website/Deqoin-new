'use client';

import { useState, useEffect } from 'react';
import { 
  Save, 
  Loader2, 
  Image as ImageIcon, 
  PenTool, 
  Layers, 
  Hammer,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomeServicesAdmin() {
  const [cards, setCards] = useState<any[]>([]);
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
      }
    } catch (err) {
      console.error(err);
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
        alert("Kartlar başarıyla güncellendi!");
      }
    } catch (err) {
      alert("Hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  const updateCard = (index: number, field: string, value: string) => {
    const newCards = [...cards];
    newCards[index][field] = value;
    setCards(newCards);
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
    } catch (err) {
      alert("Görsel yüklenemedi.");
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
        <button className="lux-save-btn" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          <span>KARTLARI GÜNCELLE</span>
        </button>
      </div>

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
              {card.studioType === 'design' && <PenTool size={20} />}
              {card.studioType === 'material' && <Layers size={20} />}
              {card.studioType === 'execution' && <Hammer size={20} />}
              <span>{card.studioType.toUpperCase()} STUDIO</span>
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
                  ? "https://lh3.googleusercontent.com/aida-public/AB6AXuDbQTBOayjmIt4JzHbORA9-NQOes7Uaoo4WrcuGAAwzEXJzUo0V4OeCDNGGyxzFDBzG1_DbgXDr5aROetwtqZ4iPhEiaV39HyWZ67_PbpZY6a2KYJHEC2_-3JaDiLZ_71qMkfLsbA991AHjCOdDh70fnYJ3lWy-tXN7nbh5DnUk-PZt4xV5nniOugFFMI4ACHWAkPu85H_YU43TPpuqCiveXM-RLOTvgub4LA47ECVZBRKJhuyDW83lyXynnNyLY1ieUH6-gh23YZs"
                  : card.studioType === 'material'
                  ? "https://lh3.googleusercontent.com/aida-public/AB6AXuCVUCHLvB4gqKIu87ZlNcr3oZLDY1XgwMEMQcp-pzAUlFS1Nn-nmjan1oheeXLiJ94VJmZA_oBfMSPF7jZZuVG47cEkP7h1goKj5Y9WgqVshN-x4CHN0Cdm1zFfAK5KszWNO6pl8w1-gfW6Wb3njqQOsjkQ8-pCuF6dDd8ggmvjFL-N9m4Fe4Lj-pi8WbEEAKONv-Sz-Yl9wNOSPvazMnMZ5Gjdm2myTHVi_vIL4aoeENqkME8bn_RKrHn4r6XvpVXXxsRugi5gKPU"
                  : "https://lh3.googleusercontent.com/aida-public/AB6AXuBg-MKl4zF6vfhExOXkEX-PKVlktOgQYI9EevfKIIYXVJ2wtmRpvybiQLaOtQdeYc_lIPrntEOUrCatq_Efo6fw-z-0-6TilLvAsA4tcYK-QcbjqdetFT2T2EreDjugTzsElsUeoEqEM9i_daWDWBBOJXiZvrjMKWtS2z5I5ZuzOLXWozpZ8MroEnEj5yRtFuaubPctxfeO_ZAZ5E5Tawo9b6yB5w0pmG4_axQCW--XoR8nAAImAE_M5UpM2vFx3tuR2ePYvZ-VmaY";
                
                return (card.image || fallbackImg) ? (
                  <img src={card.image || fallbackImg} alt={card.title} />
                ) : (
                  <div className="img-placeholder">
                    <ImageIcon size={32} />
                    <p>Kart Görseli Yükle</p>
                  </div>
                );
              })()}
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
                <label>BAŞLIK (Title)</label>
                <input 
                  type="text" 
                  value={card.title} 
                  onChange={(e) => updateCard(idx, 'title', e.target.value)} 
                />
              </div>
              <div className="lux-group">
                <label>ALT METİN (Sub Title)</label>
                <input 
                  type="text" 
                  value={card.description} 
                  onChange={(e) => updateCard(idx, 'description', e.target.value)} 
                />
              </div>
            </div>

            <div className="card-footer-info">
              <span>Sıra: {idx + 1}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <style jsx>{`
        .lux-admin-container { display: flex; flex-direction: column; gap: 3rem; }
        
        .lux-header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 1px solid rgba(166,137,102,0.2); padding-bottom: 2.5rem; }
        .header-text h1 { font-family: var(--font-display), sans-serif; font-size: 1.5rem; letter-spacing: 0.3em; color: #a68966; margin: 0; }
        .header-text p { font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem; }
        
        .lux-save-btn { background: #a68966; color: #000; border: none; padding: 1rem 2rem; border-radius: 4px; font-family: var(--font-display); font-weight: 800; letter-spacing: 0.15em; font-size: 0.75rem; cursor: pointer; display: flex; align-items: center; gap: 1rem; transition: all 0.3s; box-shadow: 0 10px 30px rgba(166,137,102,0.3); }
        .lux-save-btn:hover { background: #d4b591; transform: translateY(-2px); }

        .services-admin-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2.5rem; }
        
        .service-admin-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; position: relative; overflow: hidden; }
        .service-admin-card::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: #a68966; opacity: 0.3; }
        
        .card-type-header { display: flex; align-items: center; gap: 1rem; color: #a68966; font-family: var(--font-display); font-size: 0.75rem; letter-spacing: 0.1em; font-weight: 800; }
        
        .card-image-preview { width: 100%; aspect-ratio: 4/3; background: rgba(0,0,0,0.4); border-radius: 12px; overflow: hidden; cursor: pointer; position: relative; border: 1px dashed rgba(255,255,255,0.1); }
        .card-image-preview img { width: 100%; height: 100%; object-fit: cover; }
        .img-placeholder { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.75rem; color: var(--text-soft); }
        .img-placeholder p { font-size: 0.75rem; }
        
        .img-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.6); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 800; letter-spacing: 0.2em; opacity: 0; transition: 0.3s; }
        .card-image-preview:hover .img-overlay { opacity: 1; }

        .card-fields { display: flex; flex-direction: column; gap: 1.5rem; }
        .lux-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .lux-group label { font-size: 0.6rem; color: var(--text-muted); font-weight: 900; letter-spacing: 0.1em; }
        .lux-group input { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 0.9rem; color: var(--text); border-radius: 6px; font-size: 0.85rem; transition: 0.3s; }
        .lux-group input:focus { outline: none; border-color: #a68966; background: rgba(255,255,255,0.05); }

        .card-footer-info { border-top: 1px solid rgba(255,255,255,0.05); padding-top: 1rem; display: flex; justify-content: space-between; font-size: 0.65rem; color: var(--text-muted); }

        .loader-wrap { height: 400px; display: flex; align-items: center; justify-content: center; color: #a68966; }
        .hidden { display: none; }
      `}</style>
    </div>
  );
}
