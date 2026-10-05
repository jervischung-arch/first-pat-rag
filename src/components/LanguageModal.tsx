import React from 'react';
import { X, Check } from 'lucide-react';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLanguage: string;
  onSelectLanguage: (code: string) => void;
  darkMode: boolean;
}

const LANGUAGES = [
  { code: 'EN', name: 'English (US)', flag: '🇺🇸' },
  { code: 'DE', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ES', name: 'Español', flag: '🇪🇸' },
  { code: 'FR', name: 'Français', flag: '🇫🇷' },
  { code: 'IT', name: 'Italiano', flag: '🇮🇹' },
  { code: 'JA', name: '日本語', flag: '🇯🇵' },
  { code: 'KO', name: '한국어', flag: '🇰🇷' },
  { code: 'ZH', name: '简体中文', flag: '🇨🇳' },
];

export const LanguageModal: React.FC<LanguageModalProps> = ({
  isOpen,
  onClose,
  selectedLanguage,
  onSelectLanguage,
  darkMode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div
        className={`w-full max-w-sm rounded-2xl p-6 border shadow-2xl animate-in zoom-in-95 duration-150 ${
          darkMode ? 'bg-[#1E222D] border-[#2A2E39] text-[#D1D4DC]' : 'bg-white border-[#E0E3EB] text-[#131722]'
        }`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#2A2E39]/30">
          <h3 className="font-bold text-base">Select Language / 语言</h3>
          <button onClick={onClose} className="p-1 rounded text-[#787B86] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-1">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                onSelectLanguage(lang.code);
                onClose();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
                selectedLanguage === lang.code
                  ? 'bg-[#2962FF] text-white shadow-sm'
                  : darkMode
                    ? 'hover:bg-[#2A2E39] text-[#D1D4DC]'
                    : 'hover:bg-[#F0F3FA] text-[#131722]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.name}</span>
              </div>
              {selectedLanguage === lang.code && <Check className="w-4 h-4 ml-2" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
