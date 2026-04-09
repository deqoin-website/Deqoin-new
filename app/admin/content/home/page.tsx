'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Upload, 
  Save, 
  Loader2,
  MoveUp,
  MoveDown,
  Layout
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HomeEditor() {
  const [slides, setSlides] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/content?page=home');
      const data = await res.json();
      if (data.sections) {
        const heroSection = data.sections.find((s: any) => s.id === 'hero');
        if (heroSection?.content?.slides?.length > 0) {
          setSlides(heroSection.content.slides);
        } else {
          // Fallback to defaults if DB is empty
          loadDefaults();
        }
      } else {
        loadDefaults();
      }
    } catch (err) {
      console.error(err);
      loadDefaults();
    } finally {
      setIsLoading(false);
    }
  };

  const loadDefaults = () => {
    setSlides([
      {
        image: "/images/slider/mimari_slide.png",
        title: "DESIGN STUDIO",
        motto: "Estetik ve Fonksiyonun Mimari Uyumu",
        buttonText: "DESIGN STUDIO İÇİN RANDEVU TALEP EDİNİZ",
        caption: "Design Studio"
      },
      {
        image: "/images/slider/tasarim_slide.png",
        title: "MATERIAL STUDIO",
        motto: "Dokunulabilir Lüks, Zamansız Detaylar",
        buttonText: "MATERIAL STUDIO İÇİN RANDEVU TALEP EDİNİZ",
        caption: "Material Studio"
      },
      {
        image: "/images/slider/uygulama_slide.png",
        title: "EXECUTION STUDIO",
        motto: "Hayallerin Kusursuz İnşası",
        buttonText: "EXECUTION STUDIO İÇİN RANDEVU TALEP EDİNİZ",
        caption: "Execution Studio"
      }
    ]);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await fetch(`/api/upload?filename=${file.name}`, {
        method: 'POST',
        body: file
      });
      const blob = await res.json();
      
      const newSlides = [...slides];
      newSlides[index].image = blob.url;
      setSlides(newSlides);
    } catch (err) {
      alert("Yükleme başarısız.");
    }
  };

  const addSlide = () => {
    setSlides([...slides, {
      image: '',
      title: 'YENİ SLAYT',
      motto: 'Motto buraya gelecek',
      buttonText: 'RANDEVU TALEP ET',
      caption: 'Kategori'
    }]);
  };

  const removeSlide = (index: number) => {
    setSlides(slides.filter((_, i) => i !== index));
  };

  const updateSlide = (index: number, field: string, value: string) => {
    const newSlides = [...slides];
    newSlides[index][field] = value;
    setSlides(newSlides);
  };

  const moveSlide = (index: number, direction: 'up' | 'down') => {
    const newSlides = [...slides];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= slides.length) return;
    [newSlides[index], newSlides[target]] = [newSlides[target], newSlides[index]];
    setSlides(newSlides);
  };

  const saveContent = async () => {
    setIsSaving(true);
    try {
      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: 'home',
          sections: [
            {
              id: 'hero',
              type: 'hero',
              title: 'Ana Sayfa Slider',
              content: { slides }
            }
          ]
        })
      });
      alert('Ana sayfa içeriği başarıyla güncellendi!');
    } catch (err) {
      alert('Kaydedilirken bir hata oluştu.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="loader-wrap"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="home-editor-container">
      <div className="editor-header">
        <div className="header-text">
          <p>ANA SAYFA YÖNETİMİ</p>
          <span>Slider görsellerini ve ana bölümleri buradan düzenleyin.</span>
        </div>
        <button className="save-btn" onClick={saveContent} disabled={isSaving}>
          {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          <span>DEĞİŞİKLİKLERİ KAYDET</span>
        </button>
      </div>

      <div className="editor-section">
        <div className="section-title">
          <h3>HERO SLIDER (KAHRAMAN GÖRSELLERİ)</h3>
          <button className="add-slide-btn" onClick={addSlide}>
            <Plus size={16} />
            <span>YENİ SLAYT EKLE</span>
          </button>
        </div>

        <div className="slides-list">
          {slides.map((slide, index) => (
            <motion.div layout key={index} className="slide-card">
              <div className="slide-preview-container">
                <div className="slide-preview" onClick={() => document.getElementById(`slide-up-${index}`)?.click()}>
                  {slide.image ? <img src={slide.image} alt="Slide" /> : <div className="upload-placeholder"><Upload size={24} /></div>}
                  <div className="preview-overlay">
                    <Upload size={20} />
                    <span>GÖRSELİ DEĞİŞTİR</span>
                  </div>
                  <input id={`slide-up-${index}`} type="file" className="hidden" onChange={e => handleImageUpload(e, index)} />
                  <div className="slide-index">SLAYT #{index + 1}</div>
                </div>
              </div>

              <div className="slide-details">
                <div className="form-row">
                  <div className="input-group">
                    <label>Büyük Başlık (TITLE)</label>
                    <input type="text" placeholder="Örn: DESIGN STUDIO" value={slide.title} onChange={e => updateSlide(index, 'title', e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label>Kategori / Etiket (CAPTION)</label>
                    <input type="text" placeholder="Örn: Interior Design" value={slide.caption} onChange={e => updateSlide(index, 'caption', e.target.value)} />
                  </div>
                </div>

                <div className="input-group">
                  <label>Motto / Alt Metin</label>
                  <input type="text" placeholder="Slaytın altında görünecek kısa cümle" value={slide.motto} onChange={e => updateSlide(index, 'motto', e.target.value)} />
                </div>

                <div className="input-group">
                  <label>Buton Yazısı</label>
                  <input type="text" value={slide.buttonText} onChange={e => updateSlide(index, 'buttonText', e.target.value)} />
                </div>
              </div>

              <div className="slide-actions">
                <button onClick={() => moveSlide(index, 'up')} disabled={index === 0}><MoveUp size={16} /></button>
                <button onClick={() => moveSlide(index, 'down')} disabled={index === slides.length - 1}><MoveDown size={16} /></button>
                <button className="delete" onClick={() => removeSlide(index)}><Trash2 size={16} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .home-editor-container { display: flex; flex-direction: column; gap: 3rem; }
        
        .editor-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 2rem;
        }

        .header-text p { font-family: var(--font-display), sans-serif; font-size: 0.75rem; letter-spacing: 0.3em; color: #a68966; margin-bottom: 0.5rem; }
        .header-text span { font-size: 0.85rem; opacity: 0.4; }

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

        .editor-section { display: flex; flex-direction: column; gap: 2rem; }
        
        .section-title { display: flex; justify-content: space-between; align-items: center; }
        .section-title h3 { font-family: var(--font-display), sans-serif; font-size: 0.9rem; letter-spacing: 0.1em; opacity: 0.6; }

        .add-slide-btn { 
          background: transparent; 
          border: 1px dashed rgba(166, 137, 102, 0.3); 
          color: #a68966; 
          padding: 0.6rem 1.2rem; 
          display: flex; 
          align-items: center; 
          gap: 0.75rem; 
          font-size: 0.7rem; 
          cursor: pointer; 
          transition: all 0.3s;
        }
        .add-slide-btn:hover { border-color: #a68966; background: rgba(166, 137, 102, 0.05); }

        .slides-list { display: flex; flex-direction: column; gap: 1.5rem; }

        .slide-card {
          background: #141414;
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 4px;
          display: grid;
          grid-template-columns: 240px 1fr 60px;
          overflow: hidden;
        }

        .slide-preview {
          position: relative;
          aspect-ratio: 16/9;
          background: #080808;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .slide-preview img { width: 100%; height: 100%; object-fit: cover; transition: all 0.5s ease; }
        
        .preview-overlay {
          position: absolute;
          inset: 0;
          background: rgba(166, 137, 102, 0.85);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          opacity: 0;
          transition: all 0.3s ease;
          color: #080808;
          z-index: 5;
        }

        .preview-overlay span { font-size: 0.6rem; font-weight: 800; letter-spacing: 0.1em; }

        .slide-preview:hover .preview-overlay { opacity: 1; }
        .slide-preview:hover img { transform: scale(1.1); filter: blur(2px); }
        
        .slide-index { position: absolute; top: 15px; left: 15px; background: #a68966; color: #080808; padding: 4px 10px; font-size: 0.55rem; font-weight: 800; border-radius: 2px; z-index: 10; letter-spacing: 0.05em; }

        .slide-details { padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; }
        
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }

        .input-group label { display: block; font-size: 0.65rem; opacity: 0.4; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.1em; }
        .input-group input {
          width: 100%;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 0.8rem;
          color: #fff;
          font-size: 0.85rem;
          border-radius: 2px;
        }

        .slide-actions { 
          display: flex; 
          flex-direction: column; 
          border-left: 1px solid rgba(255, 255, 255, 0.03); 
        }
        .slide-actions button {
          flex: 1;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.3);
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .slide-actions button:hover { background: rgba(255, 255, 255, 0.03); color: #fff; }
        .slide-actions button.delete:hover { background: rgba(255, 77, 77, 0.1); color: #ff4d4d; }
        .slide-actions button:disabled { opacity: 0.1; cursor: not-allowed; }

        .hidden { display: none; }
        .loader-wrap { height: 400px; display: flex; align-items: center; justify-content: center; color: #a68966; }
      `}</style>
    </div>
  );
}
