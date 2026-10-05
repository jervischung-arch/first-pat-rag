import React, { useState } from 'react';
import { X, ShieldAlert, FileText, HelpCircle, Lock } from 'lucide-react';

interface FooterProps {
  darkMode: boolean;
}

export const Footer: React.FC<FooterProps> = ({ darkMode }) => {
  const [modalType, setModalType] = useState<string | null>(null);

  const modalContents: Record<string, { title: string; content: string }> = {
    terms: {
      title: 'Terms of Use',
      content:
        'By using the TradingView Markets applet, you agree to access financial market feeds for personal educational, investment research, and informational purposes. Real-time market tick rates and historical sparklines are provided with low latency.',
    },
    privacy: {
      title: 'Privacy Policy',
      content:
        'We respect your financial privacy. Your watchlists, paper orders, selected categories, and preference configurations remain stored securely in your browser session and are never sold to third parties.',
    },
    disclaimer: {
      title: 'Market Disclaimer',
      content:
        'Trading and investing in stocks, cryptocurrencies, futures, forex, and bonds involve substantial risk of loss. Market data and quotes are provided for analytical purposes. Nothing herein constitutes financial or investment advice.',
    },
    help: {
      title: 'Help Center',
      content:
        'Need assistance navigating markets or charting indicators? Use Ctrl+K or ⌘K to quickly search any ticker symbol, click indices cards to inspect candlestick charts, or star assets to track them in your live watchlist.',
    },
  };

  return (
    <>
      <footer
        className={`border-t py-6 transition-colors ${
          darkMode
            ? 'border-[#2A2E39] bg-[#131722] text-[#787B86]'
            : 'border-[#F0F3FA] bg-[#F8F9FD] text-[#787B86]'
        }`}
        data-purpose="site-footer"
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs gap-3">
          <p>© 2024 TradingView, Inc. All rights reserved.</p>
          <div className="flex items-center space-x-6 font-medium">
            <button
              onClick={() => setModalType('terms')}
              className={`transition cursor-pointer ${
                darkMode ? 'hover:text-white' : 'hover:text-[#131722]'
              }`}
            >
              Terms of use
            </button>
            <button
              onClick={() => setModalType('privacy')}
              className={`transition cursor-pointer ${
                darkMode ? 'hover:text-white' : 'hover:text-[#131722]'
              }`}
            >
              Privacy policy
            </button>
            <button
              onClick={() => setModalType('disclaimer')}
              className={`transition cursor-pointer ${
                darkMode ? 'hover:text-white' : 'hover:text-[#131722]'
              }`}
            >
              Disclaimer
            </button>
            <button
              onClick={() => setModalType('help')}
              className={`transition cursor-pointer ${
                darkMode ? 'hover:text-white' : 'hover:text-[#131722]'
              }`}
            >
              Help Center
            </button>
          </div>
        </div>
      </footer>

      {/* Footer Info Modal */}
      {modalType && modalContents[modalType] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div
            className={`w-full max-w-md rounded-2xl p-6 border shadow-2xl animate-in zoom-in-95 duration-150 ${
              darkMode ? 'bg-[#1E222D] border-[#2A2E39] text-[#D1D4DC]' : 'bg-white border-[#E0E3EB] text-[#131722]'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#2A2E39]/30">
              <h3 className="font-bold text-base">{modalContents[modalType].title}</h3>
              <button
                onClick={() => setModalType(null)}
                className="p-1 rounded text-[#787B86] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="mt-4 text-xs sm:text-sm text-[#787B86] leading-relaxed">
              {modalContents[modalType].content}
            </p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#2962FF] text-white hover:bg-[#1E53E5] transition"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
