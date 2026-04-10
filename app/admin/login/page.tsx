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
    <div className="admin-login-page">
      {/* Background */}
      <div className="page-background">
        <div className="bg-gradient"></div>
        <div className="bg-pattern"></div>
      </div>

      {/* Login Container */}
      <div className="login-wrapper">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="login-box"
        >
          {/* Header */}
          <div className="login-header-section">
            <div className="logo-container">
              <img src="/images/logo-new.jpeg" alt="DEQOIN" onError={(e) => e.currentTarget.style.display = 'none'} />
            </div>
            <h1 className="page-title">DEQOIN</h1>
            <p className="page-subtitle">Yönetim Paneli</p>
            <div className="title-underline"></div>
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
                  aria-label={showPassword ? "Hide password" : "Show password"}
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

          {/* Footer */}
          <div className="login-footer">
            <p>&copy; 2024 DEQOIN Architectural Studio</p>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .admin-login-page {
          min-height: 100vh;
          min-height: 100dvh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0a0a0a;
          position: relative;
          overflow: hidden;
          padding: 20px;
        }

        /* Background */
        .page-background {
          position: fixed;
          inset: 0;
          z-index: 0;
        }

        .bg-gradient {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse at 20% 50%, rgba(166, 137, 102, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 50%, rgba(166, 137, 102, 0.06) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 0%, rgba(166, 137, 102, 0.04) 0%, transparent 60%);
        }

        .bg-pattern {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(166, 137, 102, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(166, 137, 102, 0.02) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        /* Wrapper */
        .login-wrapper {
          position: relative;
          z-index: 1;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        /* Login Box */
        .login-box {
          width: 100%;
          max-width: 420px;
          background: rgba(20, 20, 20, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(166, 137, 102, 0.15);
          border-radius: 16px;
          padding: 48px 40px;
          box-shadow: 
            0 20px 60px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(166, 137, 102, 0.1);
        }

        /* Header Section */
        .login-header-section {
          text-align: center;
          margin-bottom: 40px;
        }

        .logo-container {
          width: 72px;
          height: 72px;
          margin: 0 auto 20px;
          background: #ffffff;
          border-radius: 12px;
          padding: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(166, 137, 102, 0.25);
        }

        .logo-container img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .page-title {
          font-family: var(--font-display), sans-serif;
          font-size: 28px;
          font-weight: 700;
          letter-spacing: 0.3em;
          color: #a68966;
          margin: 0 0 8px 0;
        }

        .page-subtitle {
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.15em;
          color: rgba(255, 255, 255, 0.5);
          margin: 0 0 16px 0;
          text-transform: uppercase;
        }

        .title-underline {
          width: 50px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #a68966, transparent);
          margin: 0 auto;
        }

        /* Form */
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
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
          opacity: 0.5;
          pointer-events: none;
        }

        .text-input {
          width: 100%;
          height: 52px;
          padding: 0 48px 0 44px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
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
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(255, 255, 255, 0.12);
        }

        .text-input:focus {
          outline: none;
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(166, 137, 102, 0.4);
          box-shadow: 0 0 0 3px rgba(166, 137, 102, 0.08);
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
          opacity: 0.8;
        }

        /* Error */
        .error-alert {
          padding: 12px 16px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 8px;
          color: #fca5a5;
          font-size: 13px;
          line-height: 1.5;
          text-align: center;
        }

        /* Button */
        .login-button {
          margin-top: 8px;
          height: 52px;
          background: linear-gradient(135deg, #a68966 0%, #b89a76 100%);
          border: none;
          border-radius: 10px;
          color: #0a0a0a;
          font-family: var(--font-display), sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .login-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .login-button:hover:not(:disabled)::before {
          left: 100%;
        }

        .login-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(166, 137, 102, 0.35);
          background: linear-gradient(135deg, #b89a76 0%, #c4a785 100%);
        }

        .login-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .login-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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
          border: 2px solid rgba(10, 10, 10, 0.3);
          border-top-color: #0a0a0a;
          border-radius: 50%;
          animation: rotate 0.6s linear infinite;
        }

        @keyframes rotate {
          to { transform: rotate(360deg); }
        }

        /* Footer */
        .login-footer {
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          text-align: center;
        }

        .login-footer p {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.3);
          letter-spacing: 0.05em;
          margin: 0;
        }

        /* Responsive - Tablet */
        @media (max-width: 768px) {
          .admin-login-page {
            padding: 24px;
          }

          .login-box {
            max-width: 400px;
            padding: 40px 32px;
          }

          .page-title {
            font-size: 26px;
          }
        }

        /* Responsive - Mobile */
        @media (max-width: 640px) {
          .admin-login-page {
            padding: 16px;
          }

          .login-box {
            max-width: 100%;
            padding: 36px 28px;
            border-radius: 14px;
          }

          .login-header-section {
            margin-bottom: 32px;
          }

          .logo-container {
            width: 64px;
            height: 64px;
            margin-bottom: 16px;
          }

          .page-title {
            font-size: 24px;
          }

          .page-subtitle {
            font-size: 12px;
          }

          .form-field {
            gap: 6px;
          }

          .text-input {
            height: 48px;
            font-size: 14px;
          }

          .login-button {
            height: 48px;
            font-size: 12px;
          }
        }

        /* Responsive - Small Mobile */
        @media (max-width: 480px) {
          .admin-login-page {
            padding: 12px;
          }

          .login-box {
            padding: 32px 24px;
            border-radius: 12px;
          }

          .logo-container {
            width: 60px;
            height: 60px;
          }

          .page-title {
            font-size: 22px;
            letter-spacing: 0.25em;
          }

          .page-subtitle {
            font-size: 11px;
          }

          .login-form {
            gap: 20px;
          }

          .text-input {
            height: 46px;
            padding: 0 44px 0 40px;
            font-size: 13px;
          }

          .field-icon {
            left: 12px;
          }

          .visibility-toggle {
            right: 12px;
          }

          .login-button {
            height: 46px;
            font-size: 12px;
          }

          .login-footer {
            margin-top: 28px;
            padding-top: 20px;
          }
        }

        /* Responsive - Extra Small */
        @media (max-width: 360px) {
          .admin-login-page {
            padding: 8px;
          }

          .login-box {
            padding: 28px 20px;
          }

          .logo-container {
            width: 56px;
            height: 56px;
          }

          .page-title {
            font-size: 20px;
          }

          .text-input {
            height: 44px;
            padding: 0 40px 0 38px;
            font-size: 13px;
          }

          .login-button {
            height: 44px;
          }
        }
      `}</style>
    </div>
  );
}
