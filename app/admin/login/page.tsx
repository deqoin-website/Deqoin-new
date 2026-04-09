'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push('/admin');
      } else {
        setError('Geçersiz kullanıcı adı veya şifre.');
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-master">
      <div className="login-bg-overlay" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="login-card"
      >
        <div className="login-header">
          <div className="login-logo-wrap">
             <img src="/images/logo-new.jpeg" alt="DEQOIN" />
          </div>
          <h1>MASTER ADMIN</h1>
          <p>Yönetim paneline erişmek için kimlik bilgilerinizi girin.</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>Kullanıcı Adı</label>
            <div className="input-field">
              <User size={18} className="input-icon" />
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required 
              />
            </div>
          </div>

          <div className="input-group">
            <label>Şifre</label>
            <div className="input-field">
              <Lock size={18} className="input-icon" />
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••"
                required 
              />
            </div>
          </div>

          {error && <div className="login-error-msg">{error}</div>}

          <button type="submit" disabled={isLoading} className="login-submit-btn">
            <span>{isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}</span>
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="login-footer">
          <p>&copy; 2024 DEQOIN Architectural Studio. Tüm hakları saklıdır.</p>
        </div>
      </motion.div>

      <style jsx>{`
        .admin-login-master {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #080808;
          position: relative;
          color: #fff;
          font-family: var(--font-body), sans-serif;
          padding: 2rem;
        }

        .login-bg-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(166, 137, 102, 0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .login-card {
          width: 100%;
          max-width: 440px;
          background: rgba(18, 18, 18, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(166, 137, 102, 0.15);
          padding: 3.5rem 3rem;
          border-radius: 4px;
          position: relative;
          z-index: 10;
        }

        .login-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .login-logo-wrap {
          width: 60px;
          height: 60px;
          margin: 0 auto 1.5rem;
          background: #fff;
          padding: 0.5rem;
          border-radius: 2px;
        }

        .login-logo-wrap img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .login-header h1 {
          font-family: var(--font-display), sans-serif;
          font-size: 1.5rem;
          letter-spacing: 0.4em;
          color: #a68966;
          margin-bottom: 0.75rem;
        }

        .login-header p {
          font-size: 0.8rem;
          opacity: 0.5;
          letter-spacing: 0.05em;
          line-height: 1.6;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .input-group label {
          display: block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          margin-bottom: 0.75rem;
          opacity: 0.6;
        }

        .input-field {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          color: #a68966;
          opacity: 0.5;
        }

        .input-field input {
          width: 100%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 1rem 1rem 1rem 3rem;
          color: #fff;
          font-size: 0.9rem;
          transition: all 0.4s ease;
          border-radius: 2px;
        }

        .input-field input:focus {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(166, 137, 102, 0.4);
          outline: none;
        }

        .login-submit-btn {
          margin-top: 1rem;
          background: #a68966;
          color: #080808;
          border: none;
          padding: 1.25rem;
          font-family: var(--font-display), sans-serif;
          font-weight: 700;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .login-submit-btn:hover:not(:disabled) {
          background: #c2a785;
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(166, 137, 102, 0.2);
        }

        .login-submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .login-error-msg {
          color: #ff4d4d;
          font-size: 0.75rem;
          text-align: center;
          background: rgba(255, 77, 77, 0.1);
          padding: 0.75rem;
          border-radius: 2px;
        }

        .login-footer {
          margin-top: 3rem;
          text-align: center;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 1.5rem;
        }

        .login-footer p {
          font-size: 0.6rem;
          opacity: 0.3;
          letter-spacing: 0.1em;
        }
      `}</style>
    </div>
  );
}
