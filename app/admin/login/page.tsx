'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Lock, User, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
        // Success animation or direct redirect
        router.push('/admin');
      } else {
        setError('Erişim Reddedildi. Kimlik bilgilerini kontrol edin.');
      }
    } catch (err) {
      setError('Sistem hatası. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="premium-login-root">
      {/* Dynamic Background */}
      <div className="ambient-background">
        <div className="light-orb orb-1"></div>
        <div className="light-orb orb-2"></div>
        <div className="grid-overlay"></div>
      </div>

      <main className="login-container">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="glass-card"
        >
          {/* Decorative Corner */}
          <div className="card-accent accent-tl"></div>
          <div className="card-accent accent-br"></div>

          <div className="content-wrapper">
            {/* Logo & Header */}
            <header className="login-header">
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="brand-identity"
              >
                <div className="logo-box">
                  <Image src="/images/logo-new.jpeg" alt="DEQOIN" width={120} height={120} />
                  <div className="logo-glow"></div>
                </div>
                <h1 className="brand-name">DEQOIN</h1>
                <div className="brand-divider">
                  <span>SYSTEM ACCESS</span>
                </div>
              </motion.div>
            </header>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="auth-form">
              <div className="input-group">
                <div className="field-wrapper">
                  <span className="field-icon"><User size={16} /></span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="USERNAME"
                    required
                    className="premium-input"
                    autoComplete="username"
                  />
                  <div className="input-line"></div>
                </div>
              </div>

              <div className="input-group">
                <div className="field-wrapper">
                  <span className="field-icon"><Lock size={16} /></span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="PASSWORD"
                    required
                    className="premium-input"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <div className="input-line"></div>
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="error-message"
                  >
                    <ShieldCheck size={14} className="error-icon" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={isLoading}
                className={`submit-btn ${isLoading ? 'btn-loading' : ''}`}
              >
                <span className="btn-text">
                  {isLoading ? 'VERIFYING...' : 'ENTER STUDIO'}
                </span>
                {!isLoading && (
                  <motion.span 
                    animate={{ x: [0, 5, 0] }} 
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="btn-arrow"
                  >
                    <ArrowRight size={18} />
                  </motion.span>
                )}
                <div className="btn-shimmer"></div>
              </button>
            </form>

            <footer className="login-footer">
              <p className="footer-copyright">
                &copy; {new Date().getFullYear()} DEQOIN ARCHITECTURAL STUDIO. ALL RIGHTS RESERVED.
              </p>
            </footer>
          </div>
        </motion.div>
      </main>

      <style jsx>{`
        .premium-login-root {
          min-height: 100vh;
          min-height: 100dvh;
          width: 100%;
          background: #020202;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          color: #fff;
          font-family: inherit;
        }

        /* Ambient Background */
        .ambient-background {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .light-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.15;
          pointer-events: none;
        }

        .orb-1 {
          width: 50vw;
          height: 50vw;
          background: #a68966;
          top: -20%;
          left: -10%;
          animation: float 20s infinite alternate ease-in-out;
        }

        .orb-2 {
          width: 40vw;
          height: 40vw;
          background: #bf1f5a;
          bottom: -15%;
          right: -5%;
          animation: float 15s infinite alternate-reverse ease-in-out;
        }

        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
          background-size: 50px 50px;
          mask-image: radial-gradient(circle at center, black, transparent 80%);
        }

        @keyframes float {
          0% { transform: translate(0, 0); }
          100% { transform: translate(5%, 5%); }
        }

        /* Container & Card */
        .login-container {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 500px;
          padding: 24px;
        }

        .glass-card {
          position: relative;
          background: rgba(10, 10, 10, 0.4);
          backdrop-filter: blur(40px) saturate(180%);
          border: 1px solid rgba(166, 137, 102, 0.2);
          border-radius: 2px; /* Brutalist/Minimalist sharp corners */
          overflow: hidden;
          box-shadow: 0 40px 100px rgba(0, 0, 0, 0.8);
        }

        .card-accent {
          position: absolute;
          width: 20px;
          height: 20px;
          border-color: #a68966;
          border-style: solid;
          opacity: 0.6;
        }

        .accent-tl { top: 0; left: 0; border-width: 1px 0 0 1px; }
        .accent-br { bottom: 0; right: 0; border-width: 0 1px 1px 0; }

        .content-wrapper {
          padding: 64px 48px;
        }

        /* Header */
        .login-header {
          text-align: center;
          margin-bottom: 56px;
        }

        .brand-identity {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .logo-box {
          width: 72px;
          height: 72px;
          background: #fff;
          padding: 12px;
          position: relative;
          margin-bottom: 24px;
        }

        .logo-box img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .logo-glow {
          position: absolute;
          inset: -10px;
          background: #a68966;
          filter: blur(20px);
          opacity: 0.1;
          z-index: -1;
        }

        .brand-name {
          font-family: var(--font-display), sans-serif;
          font-size: 1.8rem;
          font-weight: 700;
          letter-spacing: 0.4em;
          color: #fff;
          margin: 0 0 16px 0;
        }

        .brand-divider {
          display: flex;
          align-items: center;
          width: 100%;
          gap: 15px;
          color: rgba(255, 255, 255, 0.3);
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          font-weight: 800;
        }

        .brand-divider::before,
        .brand-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(166, 137, 102, 0.3), transparent);
        }

        /* Form Controls */
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .input-group {
          position: relative;
        }

        .field-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .field-icon {
          position: absolute;
          left: 0;
          color: #a68966;
          opacity: 0.6;
        }

        .premium-input {
          width: 100%;
          background: transparent;
          border: none;
          padding: 12px 12px 12px 32px;
          color: #fff;
          font-size: 0.9rem;
          letter-spacing: 0.1em;
          font-family: inherit;
        }

        .premium-input:focus {
          outline: none;
        }

        .premium-input::placeholder {
          color: rgba(255, 255, 255, 0.2);
          font-size: 0.75rem;
          letter-spacing: 0.2em;
        }

        .input-line {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
          transition: all 0.4s ease;
        }

        .premium-input:focus ~ .input-line {
          background: #a68966;
          box-shadow: 0 4px 12px rgba(166, 137, 102, 0.2);
        }

        .password-toggle {
          position: absolute;
          right: 0;
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.3);
          cursor: pointer;
          padding: 4px;
          transition: color 0.3s ease;
        }

        .password-toggle:hover {
          color: #a68966;
        }

        /* Error Message */
        .error-message {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #ff4d4d;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
          background: rgba(255, 77, 77, 0.05);
          padding: 12px 16px;
          border-left: 2px solid #ff4d4d;
          border-radius: 4px;
        }

        .error-icon {
          flex-shrink: 0;
        }

        /* Submit Button */
        .submit-btn {
          position: relative;
          height: 56px;
          background: #a68966;
          border: none;
          color: #fff;
          font-weight: 800;
          font-size: 0.75rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(166, 137, 102, 0.2);
        }

        .submit-btn:hover:not(:disabled) {
          background: #b89a76;
          transform: translateY(-2px);
          box-shadow: 0 15px 40px rgba(166, 137, 102, 0.3);
        }

        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-btn:disabled {
          background: rgba(166, 137, 102, 0.4);
          cursor: not-allowed;
        }

        .btn-shimmer {
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          transform: skewX(-20deg);
          transition: left 0.8s ease;
        }

        .submit-btn:hover .btn-shimmer {
          left: 150%;
        }

        .btn-loading {
          opacity: 0.8;
        }

        /* Footer */
        .login-footer {
          margin-top: 48px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 24px;
          text-align: center;
        }

        .footer-copyright {
          font-size: 0.55rem;
          color: rgba(255, 255, 255, 0.2);
          letter-spacing: 0.15em;
          line-height: 1.6;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .content-wrapper {
            padding: 48px 32px;
          }

          .brand-name {
            font-size: 1.5rem;
          }

          .submit-btn {
            height: 52px;
          }
        }

        @media (max-width: 480px) {
          .premium-login-root {
            padding: 16px;
            align-items: flex-start;
          }

          .login-container {
            padding: 0;
            margin-top: 5vh;
          }

          .glass-card {
            background: transparent;
            backdrop-filter: none;
            border: none;
            box-shadow: none;
          }

          .content-wrapper {
            padding: 32px 12px;
          }
          
          .accent-tl, .accent-br { display: none; }
        }
      `}</style>
    </div>
  );
}
