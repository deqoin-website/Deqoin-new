'use client';

import { useEffect, useMemo, useState } from 'react';
import { Loader2, Save, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminSaveBar } from '@/components/admin/AdminSaveBar';
import { useNotification } from '@/components/admin/AdminNotificationProvider';

type WorkflowStep = {
  id: string;
  title: string;
  description: string;
  image: string;
};

export default function WorkflowAdminPage() {
  const { showToast } = useNotification();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [initialData, setInitialData] = useState<{ title: string; steps: WorkflowStep[] } | null>(null);
  const [data, setData] = useState<{ title: string; steps: WorkflowStep[] }>({
    title: 'İŞ AKIŞI',
    steps: [],
  });

  useEffect(() => {
    void fetchWorkflow();
  }, []);

  const fetchWorkflow = async () => {
    try {
      const res = await fetch('/api/workflow', { cache: 'no-store' });
      if (!res.ok) throw new Error('Workflow içerikleri alınamadı');
      const json = await res.json();
      const formatted = {
        title: json.title || 'İŞ AKIŞI',
        steps: Array.isArray(json.steps) ? json.steps : [],
      };
      setData(formatted);
      setInitialData(JSON.parse(JSON.stringify(formatted)));
    } catch (error) {
      console.error(error);
      showToast('Workflow içerikleri yüklenemedi.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/workflow', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Workflow kaydedilemedi');
      const json = await res.json();
      const formatted = {
        title: json.title || 'İŞ AKIŞI',
        steps: Array.isArray(json.steps) ? json.steps : [],
      };
      setData(formatted);
      setInitialData(JSON.parse(JSON.stringify(formatted)));
      setIsDirty(false);
      showToast('Workflow başarıyla güncellendi.', 'success');
    } catch (error) {
      console.error(error);
      showToast('Workflow kaydedilemedi.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (!initialData) return;
    setData(JSON.parse(JSON.stringify(initialData)));
    setIsDirty(false);
    showToast('Değişiklikler geri alındı.', 'info');
  };

  const addStep = () => {
    setData(prev => ({
      ...prev,
      steps: [
        ...prev.steps,
        { id: String(prev.steps.length + 1).padStart(2, '0'), title: '', description: '', image: '' },
      ],
    }));
    setIsDirty(true);
  };

  const updateStep = (index: number, field: keyof WorkflowStep, value: string) => {
    setData(prev => {
      const next = [...prev.steps];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, steps: next };
    });
    setIsDirty(true);
  };

  const removeStep = (index: number) => {
    setData(prev => ({ ...prev, steps: prev.steps.filter((_, i) => i !== index) }));
    setIsDirty(true);
  };

  const uploadImage = async (index: number, file: File) => {
    const res = await fetch(`/api/upload?filename=${file.name}`, { method: 'POST', body: file });
    if (!res.ok) throw new Error('Upload failed');
    const blob = await res.json();
    updateStep(index, 'image', blob.url);
  };

  const canSave = useMemo(() => data.steps.length > 0, [data.steps.length]);

  if (loading) {
    return (
      <div className="loader-wrap">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="corporate-manager">
      <div className="manager-header">
        <div>
          <h2>PROFESYONEL İŞ AKIŞI</h2>
          <p>Ana sayfada kullanılan workflow kartlarını burada yönet.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {isDirty && (
            <button className="save-btn" style={{ background: 'transparent', border: '1px solid var(--line)', color: 'var(--text-muted)' }} onClick={handleCancel}>
              SIFIRLA
            </button>
          )}
          <button className={`save-btn ${isDirty ? 'dirty-pulse' : ''}`} onClick={handleSave} disabled={isSaving || !canSave}>
            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {isSaving ? 'KAYDEDİLİYOR...' : (isDirty ? 'KAYDET' : 'DEĞİŞİKLİKLERİ KAYDET')}
          </button>
        </div>
      </div>

      <AdminSaveBar isVisible={isDirty} onSave={handleSave} onCancel={handleCancel} isSaving={isSaving} />

      <div className="tab-content admin-card">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="panel">
          <div className="panel-header-inline">
            <h3>Workflow Adımları</h3>
            <button className="add-btn-small" onClick={addStep}>
              <Plus size={16} /> YENİ ADIM EKLE
            </button>
          </div>

          <div className="workflow-list-admin">
            <AnimatePresence initial={false}>
              {data.steps.map((step, i) => (
                <motion.div
                  key={`${step.id}-${i}`}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="workflow-item-card"
                >
                  <div className="workflow-image-wrap" onClick={() => document.getElementById(`workflow-image-${i}`)?.click()}>
                    {step.image ? <img src={step.image} alt={`Adım ${i + 1}`} /> : <div className="workflow-image-placeholder"><ImageIcon size={20} /><span>Görsel Yükle</span></div>}
                  </div>
                  <input
                    id={`workflow-image-${i}`}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) void uploadImage(i, file).then(() => setIsDirty(true)).catch(() => showToast('Fotoğraf yüklenemedi.', 'error'));
                    }}
                  />
                  <div className="step-inputs-wrap">
                    <div className="form-group border-none">
                      <input
                        type="text"
                        className="title-input-large"
                        placeholder="Adım Başlığı"
                        value={step.title}
                        onChange={e => updateStep(i, 'title', e.target.value)}
                      />
                    </div>
                    <div className="form-group border-none">
                      <textarea
                        rows={3}
                        placeholder="Adım açıklaması"
                        value={step.description}
                        onChange={e => updateStep(i, 'description', e.target.value)}
                      />
                    </div>
                    <div className="form-group border-none">
                      <input
                        type="text"
                        placeholder="Görsel URL"
                        value={step.image}
                        onChange={e => updateStep(i, 'image', e.target.value)}
                      />
                    </div>
                  </div>
                  <button className="delete-step-btn" onClick={() => removeStep(i)}>
                    <Trash2 size={18} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .corporate-manager { display: flex; flex-direction: column; gap: 2.5rem; }
        .manager-header { display: flex; justify-content: space-between; align-items: flex-end; }
        .manager-header h2 { font-family: var(--font-display); font-size: 1.5rem; letter-spacing: 0.1em; color: var(--text); margin: 0 0 0.5rem 0; }
        .manager-header p { margin: 0; color: var(--text-soft); opacity: 0.7; font-size: 0.85rem; }
        .save-btn { background: #a68966; color: #000; border: none; padding: 1rem 2rem; border-radius: 4px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 0.75rem; transition: transform 0.3s; }
        .save-btn:hover { transform: translateY(-2px); }
        .save-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .save-btn.dirty-pulse { background: #a68966; box-shadow: 0 0 20px rgba(166,137,102,0.4); animation: pulse-border 2s infinite; }
        @keyframes pulse-border { 0% { box-shadow: 0 0 0 0 rgba(166,137,102,0.4); } 70% { box-shadow: 0 0 0 10px rgba(166,137,102,0); } 100% { box-shadow: 0 0 0 0 rgba(166,137,102,0); } }
        .panel { display: flex; flex-direction: column; gap: 2rem; }
        .panel-header-inline { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .panel-header-inline h3 { margin: 0; font-family: var(--font-display); font-size: 1rem; letter-spacing: 0.1em; color: #a68966; }
        .add-btn-small { background: var(--surface-muted); color: var(--text); border: 1px solid var(--line); padding: 0.5rem 1rem; border-radius: 4px; font-size: 0.7rem; display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }
        .workflow-list-admin { display: flex; flex-direction: column; gap: 1.5rem; }
        .workflow-item-card { background: var(--surface-muted); border: 1px solid var(--line); border-radius: 12px; padding: 1.5rem; position: relative; display: flex; gap: 1.5rem; align-items: flex-start; }
        .workflow-image-wrap { width: 180px; height: 240px; border-radius: 12px; overflow: hidden; background: #0b0b0b; border: 1px solid var(--line); cursor: pointer; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
        .workflow-image-wrap img { width: 100%; height: 100%; object-fit: cover; }
        .workflow-image-placeholder { display: flex; flex-direction: column; gap: 0.5rem; align-items: center; justify-content: center; color: var(--text-muted); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.15em; }
        .step-inputs-wrap { flex: 1; display: flex; flex-direction: column; gap: 1rem; }
        .border-none input, .border-none textarea { background: var(--background) !important; border: 1px solid var(--line) !important; color: var(--text) !important; }
        .title-input-large { font-size: 1.1rem !important; font-weight: 600; color: #a68966 !important; }
        .delete-step-btn { background: rgba(255,77,77,0.05); color: #ff4d4d; border: 1px solid rgba(255,77,77,0.1); width: 44px; height: 44px; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s; flex-shrink: 0; }
        .delete-step-btn:hover { background: #ff4d4d; color: #fff; }
        .loader-wrap { height: 60vh; display: flex; align-items: center; justify-content: center; }
        .hidden { display: none; }
        @media (max-width: 800px) {
          .manager-header { flex-direction: column; align-items: stretch; gap: 1rem; }
          .workflow-item-card { flex-direction: column; }
          .workflow-image-wrap { width: 100%; height: 260px; }
          .delete-step-btn { position: absolute; top: 1rem; right: 1rem; }
        }
      `}</style>
    </div>
  );
}
