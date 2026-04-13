'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Plus, Edit2, Trash2, GripVertical, Save, X, Layers, Paintbrush, Hammer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StudioManagerPage() {
  const params = useParams();
  // Safe decoding of parameter if it's a promise in the new Next.js structure
  const rawType = params?.type; 
  const studioType = Array.isArray(rawType) ? rawType[0] : rawType || 'design';

  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'Layers'
  });

  const getStudioTitle = () => {
    switch (studioType) {
      case 'design': return 'Design Studio (Mimari İlkeler)';
      case 'material': return 'Material Studio (İçerik & Doku)';
      case 'execution': return 'Execution Studio (Uygulama Alanları)';
      default: return 'Stüdyo Yönetimi';
    }
  };

  useEffect(() => {
    fetchCards();
  }, [studioType]);

  const fetchCards = async () => {
    try {
      const res = await fetch(`/api/admin/studiocards?studioType=${studioType}`);
      const data = await res.json();
      setCards(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData, studioType };
    
    const url = editingCard ? `/api/admin/studiocards/${editingCard._id}` : '/api/admin/studiocards';
    const method = editingCard ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchCards();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Silmek istediğinizden emin misiniz?')) return;
    try {
      await fetch(`/api/admin/studiocards/${id}`, { method: 'DELETE' });
      fetchCards();
    } catch (e) {
      console.error(e);
    }
  };

  const openNewModal = () => {
    setEditingCard(null);
    setFormData({ title: '', description: '', icon: 'Layers' });
    setIsModalOpen(true);
  };

  const openEditModal = (card: any) => {
    setEditingCard(card);
    setFormData({
      title: card.title,
      description: card.description,
      icon: card.icon
    });
    setIsModalOpen(true);
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Paintbrush': return <Paintbrush size={32} />;
      case 'Hammer': return <Hammer size={32} />;
      default: return <Layers size={32} />;
    }
  };

  return (
    <div className="studio-manager">
      <div className="manager-header">
        <div>
          <h2>{getStudioTitle()}</h2>
          <p>Departmanın anasayfada ve listelemede görünecek alt kartlarını yönetin.</p>
        </div>
        <button className="add-btn" onClick={openNewModal}>
          <Plus size={18} /> YENİ KART EKLE
        </button>
      </div>

      {loading ? (
        <div className="loading">Yükleniyor...</div>
      ) : (
        <div className="cards-list">
          {cards.map((card, idx) => (
            <motion.div 
              key={card._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="studio-card-row admin-card"
            >
              <div className="drag-handle"><GripVertical size={20} /></div>
              <div className="card-icon">{renderIcon(card.icon)}</div>
              <div className="card-content">
                <h4>{card.title}</h4>
                <p>{card.description}</p>
              </div>
              <div className="card-actions">
                <button onClick={() => openEditModal(card)} className="icon-btn edit"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(card._id)} className="icon-btn delete"><Trash2 size={16} /></button>
              </div>
            </motion.div>
          ))}
          {cards.length === 0 && (
            <div className="empty-state">Bu departman için henüz kart eklenmemiş.</div>
          )}
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-overlay">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="modal-content admin-card"
            >
              <div className="modal-header">
                <h3>{editingCard ? 'KART DÜZENLE' : 'YENİ KART OLUŞTUR'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="close-btn"><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-group">
                  <label>KART BAŞLIĞI</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>KISA AÇIKLAMA</label>
                  <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>İKON SEÇİMİ</label>
                  <select value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})}>
                    <option value="Layers">Katmanlar / Varsayılan</option>
                    <option value="Paintbrush">Fırça / Sanat / İç Mimari</option>
                    <option value="Hammer">Çekiç / İnşaat / Uygulama</option>
                  </select>
                </div>
                <button type="submit" className="submit-btn">
                   <Save size={18} /> {editingCard ? 'GÜNCELLE' : 'KAYDET'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .studio-manager { display: flex; flex-direction: column; gap: 2rem; }
        
        .manager-header { display: flex; justify-content: space-between; align-items: flex-end; }
        .manager-header h2 { font-family: var(--font-display); font-size: 1.5rem; letter-spacing: 0.1em; color: #fff; margin: 0 0 0.5rem 0; text-transform: uppercase; }
        .manager-header p { margin: 0; color: rgba(255,255,255,0.5); font-size: 0.85rem; }

        .add-btn { background: #a68966; color: #000; border: none; padding: 0.8rem 1.5rem; border-radius: 4px; font-weight: 700; letter-spacing: 0.1em; cursor: pointer; display: flex; align-items: center; gap: 0.75rem; transition: transform 0.3s ease; }
        .add-btn:hover { transform: translateY(-2px); }

        .cards-list { display: flex; flex-direction: column; gap: 1rem; }
        .studio-card-row { display: flex; align-items: center; gap: 1.5rem; padding: 1.5rem; }
        
        .drag-handle { color: rgba(255,255,255,0.2); cursor: grab; }
        .card-icon { width: 60px; height: 60px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #a68966; }
        
        .card-content { flex: 1; }
        .card-content h4 { margin: 0 0 0.5rem 0; font-family: var(--font-display); font-size: 1rem; }
        .card-content p { margin: 0; color: rgba(255,255,255,0.5); font-size: 0.85rem; }

        .card-actions { display: flex; gap: 0.5rem; }
        .icon-btn { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.05); border: none; border-radius: 4px; color: #fff; cursor: pointer; transition: background 0.3s; }
        .icon-btn.edit:hover { background: #4dabf7; }
        .icon-btn.delete:hover { background: #ff4d4d; }

        .empty-state { text-align: center; padding: 4rem; color: rgba(255,255,255,0.3); border: 1px dashed rgba(255,255,255,0.1); border-radius: 8px; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(5px); z-index: 1000; display: flex; align-items: center; justify-content: center; }
        .modal-content { width: 100%; max-width: 500px; padding: 0; overflow: hidden; display: flex; flex-direction: column; }
        
        .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .modal-header h3 { margin: 0; color: #a68966; font-family: var(--font-display); letter-spacing: 0.1em; font-size: 0.9rem; }
        .close-btn { background: none; border: none; color: #fff; opacity: 0.5; cursor: pointer; }

        .modal-form { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .form-group label { font-size: 0.65rem; color: rgba(255,255,255,0.5); letter-spacing: 0.1em; }
        .form-group input, .form-group textarea, .form-group select { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 0.8rem; color: #fff; border-radius: 4px; font-family: inherit; }
        
        .submit-btn { margin-top: 1rem; background: #a68966; color: #000; border: none; padding: 1rem; font-weight: 700; letter-spacing: 0.1em; display: flex; align-items: center; justify-content: center; gap: 0.75rem; border-radius: 4px; cursor: pointer; }
      `}</style>
    </div>
  );
}
