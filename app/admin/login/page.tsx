'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, ArrowRight, Shield, Eye, EyeOff } from 'lucide-react';
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
    <div className="admin-login-new">
      {/* Animated Background */}
      <div className="login-background">
        <div className="bg-gradient-1"></div>
        <div className="bg-gradient-2"></div>
        <div className="bg-grid"></div>
      </div>

      <div className="login-container">
        {/* Left Side - Branding */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="login-branding"
        >
          <div className="branding-content">
            <div className="brand-logo">
              <img src="/images/logo-new.jpeg" alt="DEQOIN" />
            </div>
            <h1 className="brand-title">DEQOIN</h1>
            <p className="brand-subtitle">Architectural Studio</p>
            <div className="brand-divider"></div>
            <p className="brand-description">
              Yönetim paneline hoş geldiniz.
              <br />
              Projelerinizi ve içeriklerinizi buradan yönetin.
            </p>
            <div className="brand-features">
              <div className="feature-item">
                <Shield size={20} />
                <span>Güvenli Erişim</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="login-form-section"
        >
          <div className="form-wrapper">
            <div className="form-header">
              <h2>Giriş Yap</h2>
              <p>Hesabınıza erişmek için bilgilerinizi girin</p>
            </div>

            <form onSubmit={handleLogin} className="login-form-new">
              <div className="form-group">
                <label className="form-label">Kullanıcı Adı</label>
                <div className="input-wrapper">
                  <User size={18} className="input-icon" />
                  <input 
                    type="text" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Kullanıcı adınızı girin"
                    className="form-input"
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Şifre</label>
                <div className="input-wrapper">
                  <Lock size={18} className="input-icon" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Şifrenizi girin"
                    className="form-input"
                    required 
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="error-message"
                >
                  {error}
                </motion.div>
              )}

              <button type="submit" disabled={isLoading} className="submit-button">
                <span className="btn-text">
                  {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                </span>
                {!isLoading && <ArrowRight size={18} className="btn-icon" />}
                {isLoading && <span className="loading-spinner"></span>}
              </button>
            </form>

            <div className="form-footer">
              <p>&copy; 2024 DEQOIN. Tüm hakları saklıdır.</p>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .admin-login-new {
          min-height: 100vh;
          min-height: 100dvh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0a0a0a;
          position: relative;
          overflow: hidden;
          padding: 1rem;
        }

        /* Background Effects */
        .login-background {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .bg-gradient-1 {
          position: absolute;
          top: -50%;
          right: -20%;
          width: 80%;
          height: 120%;
          background: radial-gradient(circle, rgba(166, 137, 102, 0.15) 0%, transparent 70%);
          animation: float 20s ease-in-out infinite;
        }

        .bg-gradient-2 {
          position: absolute;
          bottom: -50%;
          left: -20%;
          width: 80%;
          height: 120%;
          background: radial-gradient(circle, rgba(166, 137, 102, 0.1) 0%, transparent 70%);
          animation: float 25s ease-in-out infinite reverse;
        }

        .bg-grid {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(166, 137, 102, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(166, 137, 102, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -30px) scale(1.1); }
        }

        /* Main Container */
        .login-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          max-width: 1200px;
          width: 100%;
          max-height: 90vh;
          background: rgba(18, 18, 18, 0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(166, 137, 102, 0.2);
          border-radius: 24px;
          overflow: hidden;
          position: relative;
          z-index: 10;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        /* Left Branding Section */
        .login-branding {
          background: linear-gradient(135deg, rgba(166, 137, 102, 0.1) 0%, rgba(18, 18, 18, 0.8) 100%);
          padding: 4rem 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          border-right: 1px solid rgba(166, 137, 102, 0.1);
        }

        .branding-content {
          text-align: center;
          color: #fff;
        }

        .brand-logo {
          width: 100px;
          height: 100px;
          margin: 0 auto 2rem;
          background: #fff;
          padding: 1rem;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(166, 137, 102, 0.3);
        }

        .brand-logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .brand-title {
          font-family: var(--font-display), sans-serif;
          font-size: 2.5rem;
          font-weight: 700;
          letter-spacing: 0.3em;
          color: #a68966;
          margin-bottom: 0.5rem;
        }

        .brand-subtitle {
          font-size: 1rem;
          letter-spacing: 0.2em;
          opacity: 0.6;
          margin-bottom: 2rem;
        }

        .brand-divider {
          width: 60px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #a68966, transparent);
          margin: 0 auto 2rem;
        }

        .brand-description {
          font-size: 0.95rem;
          line-height: 1.8;
          opacity: 0.7;
          margin-bottom: 2.5rem;
        }

        .brand-features {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: rgba(166, 137, 102, 0.1);
          border: 1px solid rgba(166, 137, 102, 0.2);
          border-radius: 12px;
          font-size: 0.85rem;
          color: #a68966;
        }

        /* Right Form Section */
        .login-form-section {
          padding: 4rem 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(18, 18, 18, 0.4);
        }

        .form-wrapper {
          width: 100%;
          max-width: 420px;
        }

        .form-header {
          margin-bottom: 3rem;
        }

        .form-header h2 {
          font-family: var(--font-display), sans-serif;
          font-size: 2rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 0.75rem;
          letter-spacing: 0.05em;
        }

        .form-header p {
          font-size: 0.9rem;
          opacity: 0.5;
          line-height: 1.6;
        }

        /* Form Styles */
        .login-form-new {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .form-label {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #fff;
          opacity: 0.7;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 1.25rem;
          color: #a68966;
          opacity: 0.5;
          pointer-events: none;
        }

        .form-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 1.1rem 1.25rem 1.1rem 3.25rem;
          color: #fff;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          border-radius: 12px;
          box-sizing: border-box;
        }

        .form-input:focus {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(166, 137, 102, 0.5);
          outline: none;
          box-shadow: 0 0 0 3px rgba(166, 137, 102, 0.1);
        }

        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }

        .password-toggle {
          position: absolute;
          right: 1.25rem;
          background: none;
          border: none;
          color: #a68966;
          opacity: 0.5;
          cursor: pointer;
          transition: opacity 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .password-toggle:hover {
          opacity: 0.8;
        }

        .error-message {
          color: #ff6b6b;
          font-size: 0.85rem;
          text-align: center;
          background: rgba(255, 107, 107, 0.1);
          padding: 1rem;
          border-radius: 12px;
          border: 1px solid rgba(255, 107, 107, 0.2);
        }

        .submit-button {
          margin-top: 1rem;
          background: linear-gradient(135deg, #a68966 0%, #c2a785 100%);
          color: #0a0a0a;
          border: none;
          padding: 1.2rem;
          font-family: var(--font-display), sans-serif;
          font-weight: 700;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          border-radius: 12px;
          position: relative;
          overflow: hidden;
        }

        .submit-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .submit-button:hover:not(:disabled)::before {
          left: 100%;
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 15px 35px rgba(166, 137, 102, 0.3);
        }

        .submit-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-icon {
          transition: transform 0.3s ease;
        }

        .submit-button:hover:not(:disabled) .btn-icon {
          transform: translateX(4px);
        }

        .loading-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(10, 10, 10, 0.3);
          border-top-color: #0a0a0a;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .form-footer {
          margin-top: 3rem;
          text-align: center;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .form-footer p {
          font-size: 0.75rem;
          opacity: 0.4;
          letter-spacing: 0.05em;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .login-container {
            max-width: 900px;
          }

          .login-branding {
            padding: 3rem 2rem;
          }

          .login-form-section {
            padding: 3rem 2rem;
          }

          .brand-title {
            font-size: 2rem;
          }

          .form-header h2 {
            font-size: 1.75rem;
          }
        }

        @media (max-width: 768px) {
          .login-container {
            grid-template-columns: 1fr;
            max-width: 500px;
            max-height: none;
          }

          .login-branding {
            display: none;
          }

          .login-form-section {
            padding: 3rem 2rem;
          }

          .form-header {
            text-align: center;
          }
        }

        @media (max-width: 640px) {
          .admin-login-new {
            padding: 0.75rem;
          }

          .login-container {
            border-radius: 16px;
            max-width: 100%;
          }

          .login-form-section {
            padding: 2.5rem 1.5rem;
          }

          .form-header h2 {
            font-size: 1.5rem;
          }

          .form-header p {
            font-size: 0.85rem;
          }

          .form-input {
            padding: 1rem 1rem 1rem 3rem;
            font-size: 0.9rem;
          }

          .submit-button {
            padding: 1.1rem;
            font-size: 0.8rem;
          }
        }

        @media (max-width: 480px) {
          .admin-login-new {
            padding: 0.5rem;
          }

          .login-container {
            border-radius: 12px;
          }

          .login-form-section {
            padding: 2rem 1.25rem;
          }

          .form-header {
            margin-bottom: 2rem;
          }

          .form-header h2 {
            font-size: 1.35rem;
          }

          .login-form-new {
            gap: 1.5rem;
          }

          .form-label {
            font-size: 0.7rem;
          }

          .form-input {
            padding: 0.95rem 0.95rem 0.95rem 2.75rem;
            font-size: 0.85rem;
            border-radius: 10px;
          }

          .input-icon {
            left: 1rem;
            size: 16px;
          }

          .password-toggle {
            right: 1rem;
          }

          .submit-button {
            padding: 1rem;
            font-size: 0.75rem;
            border-radius: 10px;
          }

          .error-message {
            font-size: 0.8rem;
            padding: 0.85rem;
          }
        }

        @media (max-width: 360px) {
          .login-form-section {
            padding: 1.5rem 1rem;
          }

          .form-header h2 {
            font-size: 1.25rem;
          }

          .form-input {
            padding: 0.9rem 0.9rem 0.9rem 2.5rem;
            font-size: 0.8rem;
          }

          .submit-button {
            padding: 0.9rem;
            font-size: 0.7rem;
          }
        }
      `}</style>
    </div>
  );
}
