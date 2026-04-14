'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, XCircle, Info, X, HelpCircle } from 'lucide-react';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: NotificationType;
}

interface ConfirmState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
}

interface NotificationContextType {
  showToast: (message: string, type?: NotificationType) => void;
  confirm: (options: Omit<ConfirmState, 'isOpen' | 'onConfirm' | 'onCancel'>) => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within an AdminNotificationProvider');
  }
  return context;
}

export function AdminNotificationProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    onCancel: () => {},
  });

  const showToast = useCallback((message: string, type: NotificationType = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const confirm = useCallback((options: Omit<ConfirmState, 'isOpen' | 'onConfirm' | 'onCancel'>) => {
    return new Promise<boolean>((resolve) => {
      setConfirmState({
        ...options,
        isOpen: true,
        onConfirm: () => {
          setConfirmState((prev) => ({ ...prev, isOpen: false }));
          resolve(true);
        },
        onCancel: () => {
          setConfirmState((prev) => ({ ...prev, isOpen: false }));
          resolve(false);
        },
      });
    });
  }, []);

  return (
    <NotificationContext.Provider value={{ showToast, confirm }}>
      {children}

      {/* TOAST CONTAINER */}
      <div className="admin-toast-container">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              className={`premium-toast ${toast.type}`}
            >
              <div className="toast-icon">
                {toast.type === 'success' && <CheckCircle2 size={18} />}
                {toast.type === 'error' && <XCircle size={18} />}
                {toast.type === 'warning' && <AlertCircle size={18} />}
                {toast.type === 'info' && <Info size={18} />}
              </div>
              <div className="toast-content">{toast.message}</div>
              <button className="toast-close" onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}>
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* CONFIRM MODAL */}
      <AnimatePresence>
        {confirmState.isOpen && (
          <div className="admin-confirm-overlay">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="confirm-backdrop"
              onClick={confirmState.onCancel}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="confirm-modal-box"
            >
              <div className={`confirm-icon-wrap ${confirmState.isDanger ? 'danger' : 'info'}`}>
                {confirmState.isDanger ? <AlertCircle size={32} /> : <HelpCircle size={32} />}
              </div>
              <div className="confirm-body">
                <h3>{confirmState.title}</h3>
                <p>{confirmState.message}</p>
              </div>
              <div className="confirm-footer">
                <button className="confirm-btn-cancel" onClick={confirmState.onCancel}>
                  {confirmState.cancelText || 'VAZGEÇ'}
                </button>
                <button className={`confirm-btn-action ${confirmState.isDanger ? 'danger' : 'primary'}`} onClick={confirmState.onConfirm}>
                  {confirmState.confirmText || 'EVET, DEVAM ET'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .admin-toast-container {
          position: fixed;
          top: 2rem;
          right: 2rem;
          z-index: 10000;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          pointer-events: none;
        }

        .premium-toast {
          pointer-events: auto;
          background: rgba(15, 15, 15, 0.85);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 1rem 1.25rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 1rem;
          min-width: 300px;
          max-width: 450px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
        }

        .premium-toast.success .toast-icon { color: #10b981; }
        .premium-toast.error .toast-icon { color: #ef4444; }
        .premium-toast.warning .toast-icon { color: #f59e0b; }
        .premium-toast.info .toast-icon { color: #3b82f6; }

        .toast-content {
          flex: 1;
          color: #fff;
          font-size: 0.85rem;
          font-weight: 500;
          letter-spacing: 0.02em;
        }

        .toast-close {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.3);
          cursor: pointer;
          transition: 0.3s;
        }

        .toast-close:hover { color: #fff; }

        /* CONFIRM MODAL */
        .admin-confirm-overlay {
          position: fixed;
          inset: 0;
          z-index: 10001;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .confirm-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(8px);
        }

        .confirm-modal-box {
          position: relative;
          background: rgba(20, 20, 20, 0.95);
          border: 1px solid rgba(166, 137, 102, 0.2);
          width: 100%;
          max-width: 440px;
          border-radius: 24px;
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          box-shadow: 0 40px 100px rgba(0, 0, 0, 0.8);
        }

        .confirm-icon-wrap {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .confirm-icon-wrap.info { background: rgba(166, 137, 102, 0.1); color: #a68966; }
        .confirm-icon-wrap.danger { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

        .confirm-body h3 {
          margin: 0 0 0.75rem 0;
          font-family: var(--font-display);
          font-size: 1.25rem;
          color: #fff;
          letter-spacing: 0.05em;
        }

        .confirm-body p {
          margin: 0;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.6;
        }

        .confirm-footer {
          margin-top: 2.5rem;
          display: flex;
          gap: 1rem;
          width: 100%;
        }

        .confirm-btn-cancel {
          flex: 1;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          padding: 0.85rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: 0.3s;
        }

        .confirm-btn-cancel:hover { background: rgba(255, 255, 255, 0.1); }

        .confirm-btn-action {
          flex: 1.5;
          border: none;
          padding: 0.85rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: 0.3s;
        }

        .confirm-btn-action.primary { background: #a68966; color: #000; }
        .confirm-btn-action.primary:hover { background: #c5a680; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(166, 137, 102, 0.3); }

        .confirm-btn-action.danger { background: #ef4444; color: #fff; }
        .confirm-btn-action.danger:hover { background: #f87171; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(239, 68, 68, 0.3); }

        @media (max-width: 600px) {
          .admin-confirm-overlay { padding: 1rem; }
          .confirm-modal-box { padding: 2rem 1.5rem; }
          .confirm-footer { flex-direction: column-reverse; }
        }
      `}</style>
    </NotificationContext.Provider>
  );
}
