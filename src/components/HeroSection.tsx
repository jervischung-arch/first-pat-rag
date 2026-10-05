import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { CATEGORIES } from '../data/marketData';
import { MarketCategory } from '../types/market';

interface HeroSectionProps {
  selectedCategory: MarketCategory;
  onSelectCategory: (category: MarketCategory) => void;
  darkMode: boolean;
  selectedRegion: string;
  onSelectRegion: (region: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  selectedCategory,
  onSelectCategory,
  darkMode,
  selectedRegion,
  onSelectRegion,
}) => {
  const [regionMenuOpen, setRegionMenuOpen] = useState(false);

  const regions = [
    'Everywhere (Global)',
    'Americas',
    'Europe & UK',
    'Asia-Pacific',
    'Middle East & Africa',
  ];

  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6 text-center select-none">
      {/* Hero Headline with Region Dropdown */}
      <div className="relative inline-block">
        <button
          onClick={() => setRegionMenuOpen(!regionMenuOpen)}
          className="inline-flex items-center justify-center gap-2 group cursor-pointer focus:outline-none"
          aria-expanded={regionMenuOpen}
        >
          <h1
            className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight transition-colors ${
              darkMode ? 'text-white' : 'text-[#131722]'
            }`}
          >
            Markets, {selectedRegion.includes('Everywhere') ? 'everywhere' : selectedRegion.toLowerCase()}
          </h1>
          <ChevronDown
            className={`w-8 h-8 sm:w-10 sm:h-10 transition-transform duration-200 group-hover:translate-y-0.5 ${
              darkMode ? 'text-[#D1D4DC]' : 'text-[#131722]'
            } ${regionMenuOpen ? 'rotate-180' : ''}`}
            strokeWidth={2.8}
          />
        </button>

        {/* Region Dropdown Menu */}
        {regionMenuOpen && (
          <div
            className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 p-2 rounded-2xl shadow-2xl border z-50 animate-in fade-in zoom-in-95 duration-150 ${
              darkMode ? 'bg-[#1E222D] border-[#2A2E39]' : 'bg-white border-[#E0E3EB]'
            }`}
          >
            <div className="text-[11px] font-semibold text-[#787B86] uppercase tracking-wider px-3 py-1.5 text-left">
              Select Regional Focus
            </div>
            {regions.map((reg) => (
              <button
                key={reg}
                onClick={() => {
                  onSelectRegion(reg);
                  setRegionMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl text-left transition ${
                  selectedRegion === reg
                    ? 'bg-[#2962FF] text-white'
                    : darkMode
                      ? 'text-[#D1D4DC] hover:bg-[#2A2E39]'
                      : 'text-[#131722] hover:bg-[#F0F3FA]'
                }`}
              >
                <span>{reg}</span>
                {selectedRegion === reg && <Check className="w-4 h-4 ml-2" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Category Filter Pills Bar */}
      <nav
        aria-label="Market Categories"
        className="mt-8 flex items-center justify-start lg:justify-center overflow-x-auto no-scrollbar py-2 px-1"
      >
        <div
          className={`flex items-center rounded-full p-1 shadow-sm mx-auto border transition-colors ${
            darkMode
              ? 'bg-[#1E222D] border-[#2A2E39]'
              : 'bg-[#F8F9FD] border-[#E0E3EB]/70'
          }`}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`text-xs sm:text-sm font-medium px-3 sm:px-4 py-1.5 rounded-full transition whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? darkMode
                      ? 'bg-[#2962FF] text-white shadow-sm font-semibold'
                      : 'bg-[#2A2E39] text-white shadow-sm font-semibold'
                    : darkMode
                      ? 'text-[#9598A1] hover:text-white'
                      : 'text-[#434651] hover:text-[#131722]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </nav>
    </section>
  );
};
