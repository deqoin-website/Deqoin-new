'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Video, Save, Sliders, Type } from 'lucide-react';

export default function SliderConfigPage() {
  // Mock data representing what would come from PageContent or Slide models
  const [slides, setSlides] = useState([
    { id: 1, title: 'TASARIM & KEŞİF', subtitle: 'HAYALLERİN MİMARİSİ', image: '/images/slider1.jpg', blur: 20, overlay: 40, type: 'video' },
    { id: 2, title: 'MATERIAL STUDIO', subtitle: 'DOKUNUN GÜCÜ', image: '/images/slider2.jpg', blur: 0, overlay: 20, type: 'image' },
  ]);

  const updateSlide = (id: number, key: string, value: any) => {
    setSlides(slides.map(s => s.id === id ? { ...s, [key]: value } : s));
  };

  return (
    <div className="slider-manager">
      <div className="manager-header">
        <div>
          <h2>SİNEMATİK MEDYA & SLIDER</h2>
          <p>Anasayfa "Snap-Scroll" geçişlerini ve arka plan görsel efektlerini (Blur & Gradient) ayarlayın.</p>
        </div>
        <button className="save-btn"><Save size={18} /> TÜMÜNÜ KAYDET</button>
      </div>

      <div className="slides-container">
        {slides.map((slide, i) => (
          <motion.div 
            key={slide.id} 
            className="slide-card admin-card"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="slide-preview-area">
              <div className="preview-box">
                {/* Simulated preview with actual blur/overlay applied inline to show admin accurate preview */}
                <div className="real-preview" style={{ 
                  backgroundImage: `url(${slide.image})`,
                  filter: `blur(${slide.blur}px)`
                }}></div>
                <div className="real-overlay" style={{ background: `rgba(0,0,0,${slide.overlay / 100})` }}></div>
                
                <div className="preview-content">
                  <span className="subtitle-prev">{slide.subtitle}</span>
                  <span className="title-prev">{slide.title}</span>
                </div>
                
                <div className="badge">{slide.type === 'video' ? <Video size={14}/> : <ImageIcon size={14} />} {slide.type.toUpperCase()}</div>
              </div>
            </div>

            <div className="slide-settings">
              <div className="setting-group">
                 <label><Type size={14} /> TİPOGRAFİ METİNLERİ</label>
                 <input type="text" value={slide.title} onChange={e => updateSlide(slide.id, 'title', e.target.value)} placeholder="Ana Başlık (Örn: TASARIM)" />
                 <input type="text" value={slide.subtitle} onChange={e => updateSlide(slide.id, 'subtitle', e.target.value)} placeholder="Alt Başlık" />
              </div>

              <div className="setting-group">
                 <label><Sliders size={14} /> SİNEMATİK ETKİLER (BLUR & OPACITY)</label>
                 
                 <div className="range-control">
                   <span>Arka Plan Flu (Blur) Seviyesi: {slide.blur}px</span>
                   <input type="range" min="0" max="50" value={slide.blur} onChange={e => updateSlide(slide.id, 'blur', parseInt(e.target.value))} />
                 </div>

                 <div className="range-control">
                   <span>Karanlık Maske (Overlay): %{slide.overlay}</span>
                   <input type="range" min="0" max="100" value={slide.overlay} onChange={e => updateSlide(slide.id, 'overlay', parseInt(e.target.value))} />
                 </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <style jsx>{`
        .slider-manager { display: flex; flex-direction: column; gap: 2.5rem; }
        
        .manager-header { display: flex; justify-content: space-between; align-items: flex-end; }
        .manager-header h2 { font-family: var(--font-display); font-size: 1.5rem; letter-spacing: 0.1em; margin: 0 0 0.5rem 0; color: #fff; }
        .manager-header p { margin: 0; color: rgba(255,255,255,0.5); font-size: 0.85rem; }
        
        .save-btn { background: #a68966; color: #000; border: none; padding: 1rem 2rem; border-radius: 4px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 0.75rem; letter-spacing: 0.1em; }

        .slides-container { display: flex; flex-direction: column; gap: 2rem; }

        .slide-card { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; padding: 2rem; }

        .preview-box {
          position: relative; aspect-ratio: 16/9; background: #222; border-radius: 8px; overflow: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center;
        }

        .real-preview {
          position: absolute; inset: -20px; /* offset blur edges */ background-size: cover; background-position: center; z-index: 1; transition: filter 0.3s;
        }

        .real-overlay {
          position: absolute; inset: 0; z-index: 2; transition: background 0.3s;
        }

        .preview-content {
          position: relative; z-index: 3; display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
        }

        .title-prev { font-family: var(--font-display); font-size: 2rem; font-weight: 300; letter-spacing: 0.2em; color: #fff; text-shadow: 0 4px 10px rgba(0,0,0,0.5); }
        .subtitle-prev { font-size: 0.8rem; letter-spacing: 0.3em; color: rgba(255,255,255,0.8); }

        .badge { position: absolute; top: 1rem; left: 1rem; z-index: 4; background: rgba(255,255,255,0.1); backdrop-filter: blur(5px); padding: 5px 10px; border-radius: 4px; font-size: 0.6rem; display: flex; align-items: center; gap: 5px; color: #fff; letter-spacing: 0.1em; }

        .slide-settings { display: flex; flex-direction: column; gap: 2rem; justify-content: center; }

        .setting-group { display: flex; flex-direction: column; gap: 1rem; }
        .setting-group label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; letter-spacing: 0.1em; color: #a68966; border-bottom: 1px solid rgba(166,137,102,0.2); padding-bottom: 0.5rem; }
        
        .setting-group input[type="text"] {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); color: #fff; padding: 1rem; border-radius: 4px; font-family: inherit; font-size: 0.9rem;
        }
        .setting-group input[type="text"]:focus { outline: none; border-color: #a68966; }

        .range-control { display: flex; flex-direction: column; gap: 0.5rem; }
        .range-control span { font-size: 0.75rem; color: rgba(255,255,255,0.6); }
        .range-control input[type="range"] {
          width: 100%; cursor: pointer; accent-color: #a68966;
        }

        @media (max-width: 1024px) {
          .slide-card { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
