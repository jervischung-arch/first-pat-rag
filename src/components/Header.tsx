import React, { useState } from 'react';
import { Search, Globe, User, Moon, Sun, Star, Menu, X, ChevronDown, Check } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenSearch: () => void;
  onOpenLanguage: () => void;
  onOpenAuth: () => void;
  onOpenWatchlist: () => void;
  watchlistCount: number;
  activeNav: string;
  onSelectNav: (nav: string) => void;
  selectedLanguage: string;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  onOpenSearch,
  onOpenLanguage,
  onOpenAuth,
  onOpenWatchlist,
  watchlistCount,
  activeNav,
  onSelectNav,
  selectedLanguage,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);

  const navLinks = [
    { name: 'Products', hasDropdown: true },
    { name: 'Community', hasDropdown: false },
    { name: 'Markets', hasDropdown: false },
    { name: 'Brokers', hasDropdown: false },
    { name: 'More', hasDropdown: true },
  ];

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${
      darkMode 
        ? 'bg-[#131722]/95 border-[#2A2E39] text-[#D1D4DC]' 
        : 'bg-white/95 border-[#F0F3FA] text-[#131722]'
    }`}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left side: TV Logo & Global Search */}
        <div className="flex items-center gap-5">
          {/* TradingView Stylized Logo */}
          <button
            onClick={() => onSelectNav('Markets')}
            aria-label="TradingView Home"
            className="flex items-center gap-1 group focus:outline-none"
            title="TradingView Home"
          >
            <svg
              className={`w-9 h-7 fill-current transition-colors ${
                darkMode ? 'text-white' : 'text-black'
              }`}
              fill="none"
              viewBox="0 0 36 28"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 4C0 1.79086 1.79086 0 4 0H8C10.2091 0 12 1.79086 12 4V24C12 26.2091 10.2091 28 8 28H4C1.79086 28 0 26.2091 0 24V4Z"></path>
              <path d="M14 12C14 9.79086 15.7909 8 18 8H22C24.2091 8 26 9.79086 26 12V24C26 26.2091 24.2091 28 22 28H18C15.7909 28 14 26.2091 14 24V12Z"></path>
              <path d="M28 2C28 0.895431 28.8954 0 30 0H34C35.1046 0 36 0.895431 36 2V26C36 27.1046 35.1046 28 34 28H30C28.8954 28 28 27.1046 28 26V2Z"></path>
              <circle cx="20" cy="3" fill="currentColor" r="3"></circle>
            </svg>
          </button>

          {/* Global Search Input Bar (Ctrl+K) */}
          <div
            onClick={onOpenSearch}
            className={`relative hidden sm:flex items-center w-52 md:w-64 h-9 pl-9 pr-3 rounded-full cursor-pointer transition border border-transparent ${
              darkMode
                ? 'bg-[#1E222D] text-[#787B86] hover:bg-[#2A2E39] hover:text-[#D1D4DC]'
                : 'bg-[#F0F3FA] text-[#787B86] hover:bg-[#E0E3EB] hover:text-[#131722]'
            }`}
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-[#787B86]" />
            </div>
            <span className="text-xs font-medium truncate">Search (Ctrl+K)</span>
            <kbd className={`ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded ${
              darkMode ? 'bg-[#2A2E39] text-[#787B86]' : 'bg-[#E0E3EB] text-[#787B86]'
            }`}>
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Center Links Navigation */}
        <nav aria-label="Header Menu" className="hidden md:flex items-center space-x-7 text-[15px] font-medium relative">
          {navLinks.map((link) => {
            const isActive = activeNav === link.name;
            return (
              <div key={link.name} className="relative group">
                <button
                  onClick={() => {
                    if (link.name === 'Products') {
                      setProductsDropdownOpen(!productsDropdownOpen);
                      setMoreDropdownOpen(false);
                    } else if (link.name === 'More') {
                      setMoreDropdownOpen(!moreDropdownOpen);
                      setProductsDropdownOpen(false);
                    } else {
                      onSelectNav(link.name);
                      setProductsDropdownOpen(false);
                      setMoreDropdownOpen(false);
                    }
                  }}
                  className={`flex items-center gap-1 transition-colors ${
                    isActive
                      ? 'text-[#2962FF] font-semibold border-b-2 border-[#2962FF] pb-0.5'
                      : darkMode
                        ? 'text-[#D1D4DC] hover:text-[#2962FF]'
                        : 'text-[#131722] hover:text-[#2962FF]'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.hasDropdown && (
                    <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>

                {/* Products Dropdown */}
                {link.name === 'Products' && productsDropdownOpen && (
                  <div
                    onMouseLeave={() => setProductsDropdownOpen(false)}
                    className={`absolute top-full left-0 mt-3 w-56 p-2 rounded-xl shadow-xl border z-50 animate-in fade-in slide-in-from-top-1 duration-150 ${
                      darkMode ? 'bg-[#1E222D] border-[#2A2E39]' : 'bg-white border-[#E0E3EB]'
                    }`}
                  >
                    {[
                      { title: 'Supercharts', desc: 'Advanced technical analysis' },
                      { title: 'Screeners', desc: 'Stock, crypto & forex filter' },
                      { title: 'Market Heatmaps', desc: 'Visual market performance' },
                      { title: 'Economic Calendar', desc: 'Global macroeconomic events' },
                    ].map((item) => (
                      <button
                        key={item.title}
                        onClick={() => {
                          onSelectNav(item.title);
                          setProductsDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-lg transition ${
                          darkMode ? 'hover:bg-[#2A2E39]' : 'hover:bg-[#F0F3FA]'
                        }`}
                      >
                        <div className={`text-xs font-semibold ${darkMode ? 'text-white' : 'text-[#131722]'}`}>
                          {item.title}
                        </div>
                        <div className="text-[11px] text-[#787B86]">{item.desc}</div>
                      </button>
                    ))}
                  </div>
                )}

                {/* More Dropdown */}
                {link.name === 'More' && moreDropdownOpen && (
                  <div
                    onMouseLeave={() => setMoreDropdownOpen(false)}
                    className={`absolute top-full right-0 mt-3 w-48 p-2 rounded-xl shadow-xl border z-50 animate-in fade-in slide-in-from-top-1 duration-150 ${
                      darkMode ? 'bg-[#1E222D] border-[#2A2E39]' : 'bg-white border-[#E0E3EB]'
                    }`}
                  >
                    {[
                      'Help Center',
                      'Desktop & Mobile Apps',
                      'Market Data Coverage',
                      'Pine Script™ Editor',
                      'Pricing Plans',
                    ].map((item) => (
                      <button
                        key={item}
                        onClick={() => setMoreDropdownOpen(false)}
                        className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg transition ${
                          darkMode ? 'hover:bg-[#2A2E39] text-[#D1D4DC]' : 'hover:bg-[#F0F3FA] text-[#131722]'
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Search Button */}
          <button
            onClick={onOpenSearch}
            aria-label="Search"
            className={`sm:hidden p-2 rounded-full transition ${
              darkMode ? 'text-[#D1D4DC] hover:bg-[#1E222D]' : 'text-[#131722] hover:bg-[#F0F3FA]'
            }`}
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Watchlist Quick Button */}
          <button
            onClick={onOpenWatchlist}
            aria-label="View Watchlist"
            className={`relative p-2 rounded-full transition ${
              darkMode ? 'text-[#D1D4DC] hover:bg-[#1E222D]' : 'text-[#131722] hover:bg-[#F0F3FA]'
            }`}
            title="Watchlist"
          >
            <Star className={`w-5 h-5 ${watchlistCount > 0 ? 'fill-amber-400 text-amber-400' : ''}`} />
            {watchlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#2962FF] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {watchlistCount}
              </span>
            )}
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            aria-label="Toggle theme"
            className={`p-2 rounded-full transition ${
              darkMode ? 'text-amber-400 hover:bg-[#1E222D]' : 'text-[#787B86] hover:bg-[#F0F3FA]'
            }`}
            title={darkMode ? 'Switch to Light mode' : 'Switch to Dark mode'}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Language Switcher */}
          <button
            onClick={onOpenLanguage}
            aria-label="Language selection"
            className={`hidden sm:flex items-center gap-1.5 text-sm font-semibold transition py-1 px-1.5 rounded-md ${
              darkMode ? 'text-[#D1D4DC] hover:text-[#2962FF]' : 'text-[#131722] hover:text-[#2962FF]'
            }`}
            type="button"
          >
            <Globe className="w-5 h-5" />
            <span>{selectedLanguage}</span>
          </button>

          {/* User profile icon button */}
          <button
            onClick={onOpenAuth}
            aria-label="User Account"
            className={`p-1.5 rounded-full transition ${
              darkMode ? 'text-[#D1D4DC] hover:bg-[#1E222D]' : 'text-[#131722] hover:bg-[#F0F3FA]'
            }`}
            type="button"
          >
            <User className="w-5 h-5" />
          </button>

          {/* Get Started Gradient CTA */}
          <button
            onClick={onOpenAuth}
            className="gradient-btn text-white text-xs sm:text-sm font-semibold px-3.5 sm:px-4 py-2 rounded-lg shadow-sm transition active:scale-[0.98] inline-flex items-center whitespace-nowrap"
          >
            Get started
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg ${
              darkMode ? 'text-[#D1D4DC]' : 'text-[#131722]'
            }`}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className={`md:hidden px-4 pt-2 pb-6 border-t ${
          darkMode ? 'bg-[#131722] border-[#2A2E39]' : 'bg-white border-[#F0F3FA]'
        }`}>
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => {
                  onSelectNav(link.name);
                  setMobileMenuOpen(false);
                }}
                className={`text-left text-sm font-medium py-2 px-3 rounded-lg ${
                  activeNav === link.name
                    ? 'bg-[#2962FF]/10 text-[#2962FF] font-bold'
                    : darkMode
                      ? 'text-[#D1D4DC] hover:bg-[#1E222D]'
                      : 'text-[#131722] hover:bg-[#F0F3FA]'
                }`}
              >
                {link.name}
              </button>
            ))}
            <div className="pt-2 border-t border-[#E0E3EB] dark:border-[#2A2E39] flex items-center justify-between">
              <button
                onClick={onOpenLanguage}
                className="flex items-center gap-2 text-sm text-[#787B86]"
              >
                <Globe className="w-4 h-4" />
                <span>Language: {selectedLanguage}</span>
              </button>
              <button
                onClick={onToggleDarkMode}
                className="flex items-center gap-2 text-sm text-[#787B86]"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
                <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
