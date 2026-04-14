'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Save, RotateCcw, Loader2 } from 'lucide-react';

interface AdminSaveBarProps {
  isVisible: boolean;
  onSave: () => void;
  onCancel?: () => void;
  isSaving: boolean;
}

export function AdminSaveBar({ isVisible, onSave, onCancel, isSaving }: AdminSaveBarProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          style={{
            position: 'fixed',
            bottom: '2rem',
            left: '55%', // Sidebar'ı hesaba katarak ortala (yaklaşık)
            transform: 'translateX(-50%)',
            zIndex: 1000,
            width: 'calc(100% - 4rem)',
            maxWidth: '600px',
            pointerEvents: 'none'
          }}
          className="admin-save-bar-wrapper"
        >
          <div 
            style={{
              pointerEvents: 'auto',
              background: 'rgba(15, 15, 15, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(166, 137, 102, 0.3)',
              borderRadius: '100px',
              padding: '0.75rem 1rem 0.75rem 2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 20px rgba(166, 137, 102, 0.1)'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ 
                fontFamily: 'var(--font-display)', 
                fontSize: '0.65rem', 
                color: '#a68966', 
                fontWeight: 800, 
                letterSpacing: '0.15em' 
              }}>
                DEĞİŞİKLİKLER VAR
              </span>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
                Yaptığınız değişiklikler henüz kaydedilmedi.
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {onCancel && (
                <button
                  onClick={onCancel}
                  disabled={isSaving}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    padding: '0.6rem 1.2rem',
                    borderRadius: '100px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: '0.3s'
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                  onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                >
                  <RotateCcw size={14} /> SIFIRLA
                </button>
              )}
              
              <button
                onClick={onSave}
                disabled={isSaving}
                style={{
                  background: '#a68966',
                  border: 'none',
                  color: '#000',
                  padding: '0.6rem 2rem',
                  borderRadius: '100px',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: '0.3s',
                  boxShadow: '0 10px 20px rgba(166, 137, 102, 0.2)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#c5a680';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = '#a68966';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {isSaving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                {isSaving ? 'KAYDEDİLİYOR...' : 'KAYDET'}
              </button>
            </div>
          </div>

          <style jsx>{`
            @media (max-width: 900px) {
              .admin-save-bar-wrapper {
                left: 50% !important;
                width: calc(100% - 2rem) !important;
                bottom: 1rem !important;
              }
              .admin-save-bar-wrapper > div {
                flex-direction: column !important;
                padding: 1.25rem !important;
                gap: 1.25rem !important;
                border-radius: 20px !important;
                align-items: stretch !important;
                text-align: center;
              }
              .admin-save-bar-wrapper > div > div {
                justify-content: center !important;
              }
              .admin-save-bar-wrapper button {
                flex: 1;
                justify-content: center;
              }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
