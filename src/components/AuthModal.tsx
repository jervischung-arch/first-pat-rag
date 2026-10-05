import React, { useState } from 'react';
import { X, Mail, CheckCircle2, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  onLoginSuccess: (email: string) => void;
  currentUser: string | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  darkMode,
  onLoginSuccess,
  currentUser,
}) => {
  const [tab, setTab] = useState<'login' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSuccess(true);
    setTimeout(() => {
      onLoginSuccess(email);
      setSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div
        className={`w-full max-w-md rounded-3xl p-6 sm:p-8 border shadow-2xl animate-in zoom-in-95 duration-150 ${
          darkMode ? 'bg-[#1E222D] border-[#2A2E39] text-[#D1D4DC]' : 'bg-white border-[#E0E3EB] text-[#131722]'
        }`}
      >
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <svg
              className={`w-7 h-5 fill-current ${darkMode ? 'text-white' : 'text-black'}`}
              fill="none"
              viewBox="0 0 36 28"
            >
              <path d="M0 4C0 1.79086 1.79086 0 4 0H8C10.2091 0 12 1.79086 12 4V24C12 26.2091 10.2091 28 8 28H4C1.79086 28 0 26.2091 0 24V4Z"></path>
              <path d="M14 12C14 9.79086 15.7909 8 18 8H22C24.2091 8 26 9.79086 26 12V24C26 26.2091 24.2091 28 22 28H18C15.7909 28 14 26.2091 14 24V12Z"></path>
              <path d="M28 2C28 0.895431 28.8954 0 30 0H34C35.1046 0 36 0.895431 36 2V26C36 27.1046 35.1046 28 34 28H30C28.8954 28 28 27.1046 28 26V2Z"></path>
            </svg>
            <span className="font-bold text-base">TradingView Account</span>
          </div>
          <button onClick={onClose} className="p-1 rounded text-[#787B86] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {currentUser ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Connected as</h3>
              <p className="text-sm text-[#787B86] font-mono mt-0.5">{currentUser}</p>
            </div>
            <p className="text-xs text-[#787B86]">
              Your real-time watchlists, paper portfolio, and indicators are synced with the cloud.
            </p>
            <button
              onClick={() => {
                onLoginSuccess('');
                onClose();
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#F23645]/10 text-[#F23645] hover:bg-[#F23645]/20 transition"
            >
              Sign Out
            </button>
          </div>
        ) : success ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-[#089981] mx-auto animate-bounce" />
            <h3 className="font-bold text-lg text-[#089981]">Welcome to TradingView</h3>
            <p className="text-xs text-[#787B86]">Your session is now active.</p>
          </div>
        ) : (
          <div className="mt-4">
            {/* Tabs */}
            <div className="flex p-1 rounded-xl bg-black/5 dark:bg-white/5 mb-5 text-xs font-semibold">
              <button
                onClick={() => setTab('signup')}
                className={`flex-1 py-2 rounded-lg transition ${
                  tab === 'signup'
                    ? 'bg-[#2962FF] text-white shadow-sm'
                    : 'text-[#787B86] hover:text-white'
                }`}
              >
                Get Started
              </button>
              <button
                onClick={() => setTab('login')}
                className={`flex-1 py-2 rounded-lg transition ${
                  tab === 'login'
                    ? 'bg-[#2962FF] text-white shadow-sm'
                    : 'text-[#787B86] hover:text-white'
                }`}
              >
                Log In
              </button>
            </div>

            {/* Social options */}
            <div className="space-y-2 mb-4">
              <button
                onClick={() => {
                  onLoginSuccess('user@google.com');
                  onClose();
                }}
                className={`w-full py-2.5 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                  darkMode
                    ? 'border-[#2A2E39] hover:bg-[#2A2E39] text-white'
                    : 'border-[#E0E3EB] hover:bg-[#F0F3FA] text-[#131722]'
                }`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E0E3EB] dark:border-[#2A2E39]"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className={`px-2 ${darkMode ? 'bg-[#1E222D] text-[#787B86]' : 'bg-white text-[#787B86]'}`}>
                  Or with email
                </span>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-[#787B86] block mb-1">Email address</label>
                <div
                  className={`flex items-center px-3 py-2 rounded-xl border ${
                    darkMode ? 'bg-[#131722] border-[#2A2E39]' : 'bg-[#F8F9FD] border-[#E0E3EB]'
                  }`}
                >
                  <Mail className="w-4 h-4 text-[#787B86] mr-2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-transparent text-xs font-medium outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl gradient-btn text-white text-xs font-bold shadow-md transition active:scale-95"
              >
                {tab === 'signup' ? 'Create Free Account' : 'Log In'}
              </button>
            </form>

            <p className="text-[11px] text-[#787B86] text-center mt-4">
              By proceeding, you agree to TradingView's Terms of Service and Privacy Policy.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
