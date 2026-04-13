'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="admin-login-layout">

      {/* Left / Visual Side (Desktop) */}
      <div className="login-visual-side">
        <div className="bg-gradient"></div>
        <div className="bg-pattern"></div>
        <div className="visual-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="visual-logo-wrapper">
               <img src="/images/logo-new.jpeg" alt="DEQOIN" onError={(e) => e.currentTarget.style.display = 'none'} />
            </div>
            <h1 className="visual-title">DEQOIN STUDIO</h1>
            <p className="visual-subtitle">Exclusive Management Portal</p>
            <div className="visual-divider"></div>
            <p className="visual-text">Sistem yönetimi ve içerik güncelleme merkezi. Yalnızca yetkili personel erişimine açıktır.</p>
          </motion.div>
        </div>
      </div>

      {/* Right / Form Side */}
      <div className="login-form-side">
        <div className="login-wrapper">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="login-box"
          >
            {/* Mobile Header (Hidden on Desktop) */}
            <div className="mobile-header-section">
              <div className="logo-container">
                <img src="/images/logo-new.jpeg" alt="DEQOIN" onError={(e) => e.currentTarget.style.display = 'none'} />
              </div>
              <h2 className="mobile-page-title">DEQOIN</h2>
              <p className="mobile-page-subtitle">Yönetim Paneli</p>
            </div>

            <div className="form-header">
              <h3>Hoş Geldiniz</h3>
              <p>Devam etmek için giriş yapın</p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="login-form">
              <div className="form-field">
                <label className="field-label">Kullanıcı Adı</label>
                <div className="input-container">
                  <User className="field-icon" size={18} />
                  <input 
                    type="text" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Kullanıcı adınızı girin"
                    className="text-input"
                    autoComplete="username"
                    required 
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="field-label">Şifre</label>
                <div className="input-container">
                  <Lock className="field-icon" size={18} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Şifrenizi girin"
                    className="text-input"
                    autoComplete="current-password"
                    required 
                  />
                  <button
                    type="button"
                    className="visibility-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="error-alert"
                >
                  {error}
                </motion.div>
              )}

              <button 
                type="submit" 
                disabled={isLoading} 
                className="login-button"
              >
                <span className="button-label">
                  {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                </span>
                {!isLoading && <ArrowRight className="button-arrow" size={18} />}
                {isLoading && <span className="spinner"></span>}
              </button>
            </form>
            
            {/* Footer inside form side */}
            <div className="login-footer">
              <p>&copy; {new Date().getFullYear()} DEQOIN</p>
            </div>
            
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .admin-login-layout {
          min-height: 100vh;
          min-height: 100dvh;
          display: flex;
          background: #050505;
          color: #fff;
          font-family: inherit;
        }

        /* --- VISUAL SIDE (DESKTOP) --- */
        .login-visual-side {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: #0a0a0a;
          border-right: 1px solid rgba(166, 137, 102, 0.1);
        }

        .bg-gradient {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(circle at 30% 50%, rgba(166, 137, 102, 0.15) 0%, transparent 60%),
            radial-gradient(circle at 70% 80%, rgba(166, 137, 102, 0.1) 0%, transparent 50%);
          z-index: 0;
        }

        .bg-pattern {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(166, 137, 102, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(166, 137, 102, 0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          z-index: 0;
        }

        .visual-content {
          position: relative;
          z-index: 10;
          max-width: 500px;
          padding: 40px;
        }

        .visual-logo-wrapper {
          width: 80px;
          height: 80px;
          margin-bottom: 30px;
          background: #fff;
          border-radius: 12px;
          padding: 12px;
          box-shadow: 0 10px 30px rgba(166, 137, 102, 0.2);
        }

        .visual-logo-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .visual-title {
          font-family: var(--font-display), sans-serif;
          font-size: 2.5rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #a68966;
          margin: 0 0 10px 0;
          line-height: 1.2;
        }

        .visual-subtitle {
          font-size: 1rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          color: rgba(255, 255, 255, 0.6);
          margin: 0 0 24px 0;
          text-transform: uppercase;
        }

        .visual-divider {
          width: 60px;
          height: 2px;
          background: #a68966;
          margin-bottom: 24px;
        }

        .visual-text {
          font-size: 0.95rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.4);
          max-width: 80%;
        }

        /* --- FORM SIDE --- */
        .login-form-side {
          flex: 0 0 45%; /* Symmetrical balance */
          min-width: 450px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0a0a0a;
          position: relative;
          z-index: 10;
        }

        .login-wrapper {
          width: 100%;
          max-width: 440px;
          padding: 60px 40px;
        }

        .login-box {
          width: 100%;
        }

        /* Mobile Header */
        .mobile-header-section {
          display: none; /* hidden on desktop */
          text-align: center;
          margin-bottom: 32px;
        }

        .logo-container {
          width: 64px;
          height: 64px;
          margin: 0 auto 16px;
          background: #ffffff;
          border-radius: 12px;
          padding: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(166, 137, 102, 0.2);
        }

        .logo-container img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .mobile-page-title {
          font-family: var(--font-display), sans-serif;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: 0.25em;
          color: #a68966;
          margin: 0 0 6px 0;
        }

        .mobile-page-subtitle {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.15em;
          color: rgba(255, 255, 255, 0.5);
          margin: 0;
          text-transform: uppercase;
        }

        .form-header {
          margin-bottom: 32px;
        }

        .form-header h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0 0 8px 0;
          color: #fff;
        }

        .form-header p {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.4);
          margin: 0;
        }

        /* Form Controls */
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .field-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.6);
        }

        .input-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .field-icon {
          position: absolute;
          left: 14px;
          color: #a68966;
          opacity: 0.7;
          pointer-events: none;
        }

        .text-input {
          width: 100%;
          height: 54px;
          padding: 0 48px 0 44px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          color: #ffffff;
          font-size: 14px;
          font-family: inherit;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        .text-input::placeholder {
          color: rgba(255, 255, 255, 0.25);
        }

        .text-input:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.15);
        }

        .text-input:focus {
          outline: none;
          background: rgba(255, 255, 255, 0.08);
          border-color: #a68966;
          box-shadow: 0 0 0 3px rgba(166, 137, 102, 0.15);
        }

        .visibility-toggle {
          position: absolute;
          right: 14px;
          background: none;
          border: none;
          color: #a68966;
          opacity: 0.5;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.2s ease;
        }

        .visibility-toggle:hover {
          opacity: 0.9;
        }

        /* Error */
        .error-alert {
          padding: 12px 16px;
          background: rgba(239, 68, 68, 0.05);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 10px;
          color: #ef4444;
          font-size: 0.85rem;
          line-height: 1.5;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Submit Button */
        .login-button {
          margin-top: 10px;
          height: 54px;
          background: linear-gradient(135deg, #a68966 0%, #b89a76 100%);
          border: none;
          border-radius: 12px;
          color: #050505;
          font-family: var(--font-display), sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .login-button::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transform: skewX(-20deg);
          transition: left 0.5s ease;
        }

        .login-button:hover:not(:disabled)::after {
          left: 150%;
        }

        .login-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(166, 137, 102, 0.3);
          background: linear-gradient(135deg, #b89a76 0%, #c5ac8c 100%);
        }

        .login-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          background: rgba(166, 137, 102, 0.5);
          color: rgba(0,0,0,0.5);
        }

        .button-arrow {
          transition: transform 0.2s ease;
        }

        .login-button:hover:not(:disabled) .button-arrow {
          transform: translateX(4px);
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(5, 5, 5, 0.2);
          border-top-color: #050505;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Footer */
        .login-footer {
          margin-top: 40px;
          text-align: center;
        }

        .login-footer p {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.2);
          letter-spacing: 0.05em;
          margin: 0;
        }


        /* ================== RESPONSIVE DESIGN ================== */

        /* TABLET (up to 1100px) */
        @media (max-width: 1100px) {
          .login-visual-side {
            display: none;
          }

          .login-form-side {
            flex: 1;
            width: 100%;
            max-width: 100%;
            min-width: 0;
            background: radial-gradient(circle at top right, rgba(166, 137, 102, 0.1) 0%, transparent 60%), #050505;
          }

          .login-wrapper {
            background: rgba(15, 15, 15, 0.8);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(166, 137, 102, 0.15);
            border-radius: 24px;
            box-shadow: 0 30px 60px rgba(0,0,0,0.6);
            max-width: 460px;
            padding: 56px 48px;
            margin: 20px;
          }

          .mobile-header-section {
            display: block; /* Show header inside the form card */
          }

          .form-header {
            display: none; /* Hide the generic 'Welcome' form header to use mobile header */
          }
        }

        /* MOBILE (up to 768px) */
        @media (max-width: 768px) {
          .admin-login-layout {
            padding: 0;
            background: #050505;
          }

          .login-form-side {
            align-items: flex-start;
            padding-top: 10vh;
          }

          .login-wrapper {
            background: transparent;
            backdrop-filter: none;
            border: none;
            box-shadow: none;
            padding: 32px 24px;
            margin: 0;
            max-width: 100%;
          }

          .text-input {
            height: 50px;
            font-size: 14px;
          }

          .login-button {
            height: 50px;
          }

          .mobile-page-title {
            font-size: 22px;
          }
        }

        /* SMALL MOBILE (up to 480px) */
        @media (max-width: 480px) {
          .admin-login-layout {
            padding: 12px;
          }

          .login-wrapper {
            padding: 28px 20px;
            border-radius: 12px;
          }

          .logo-container {
            width: 56px;
            height: 56px;
            border-radius: 10px;
            padding: 8px;
            margin-bottom: 12px;
          }

          .mobile-page-title {
            font-size: 20px;
            letter-spacing: 0.15em;
          }

          .mobile-page-subtitle {
            font-size: 10px;
          }

          .text-input {
            height: 48px;
            padding-left: 40px;
          }

          .field-icon {
            left: 12px;
          }

          .login-button {
            height: 48px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}
