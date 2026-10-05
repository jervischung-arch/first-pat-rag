import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, TrendingDown, ArrowRight, Clock } from 'lucide-react';
import { MarketAsset, MarketCategory } from '../types/market';
import { ALL_MARKET_ASSETS, INITIAL_INDICES } from '../data/marketData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAsset: (asset: MarketAsset) => void;
  darkMode: boolean;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectAsset,
  darkMode,
}) => {
  const [query, setQuery] = useState('');
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>('All');
  const inputRef = useRef<HTMLInputElement>(null);

  // Flatten all items into searchable pool
  const allSearchableAssets = React.useMemo(() => {
    const list: MarketAsset[] = [];
    const seen = new Set<string>();

    Object.values(ALL_MARKET_ASSETS).forEach((tabMap) => {
      Object.values(tabMap).forEach((assets) => {
        assets.forEach((a) => {
          if (!seen.has(a.symbol)) {
            seen.add(a.symbol);
            list.push(a);
          }
        });
      });
    });

    // Also include indices as assets
    Object.values(INITIAL_INDICES).forEach((indices) => {
      indices.forEach((idx) => {
        if (!seen.has(idx.symbol)) {
          seen.add(idx.symbol);
          list.push({
            symbol: idx.symbol,
            name: idx.name,
            category: idx.category,
            price: idx.price,
            changePercent: idx.changePercent,
            changeAmount: idx.changeAmount,
            marketCap: 'Index',
            volume: 'High',
            currency: idx.currency,
            sparkline: [idx.price * 0.98, idx.price * 0.99, idx.price],
            bgColor: idx.badgeColor,
            color: '#FFFFFF',
            description: idx.description,
          });
        }
      });
    });

    return list;
  }, []);

  const searchCategories = ['All', 'Stocks', 'Crypto', 'Futures', 'Forex', 'Indices', 'Bonds'];

  const filteredAssets = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return allSearchableAssets.filter((item) => {
      // Category tab filter
      if (activeCategoryTab !== 'All') {
        if (activeCategoryTab === 'Stocks' && !item.category.includes('stocks')) return false;
        if (activeCategoryTab === 'Crypto' && item.category !== 'Crypto') return false;
        if (activeCategoryTab === 'Futures' && item.category !== 'Futures') return false;
        if (activeCategoryTab === 'Forex' && item.category !== 'Forex') return false;
        if (activeCategoryTab === 'Indices' && !item.name.includes('Index') && item.marketCap !== 'Index') return false;
        if (activeCategoryTab === 'Bonds' && !item.category.includes('bonds')) return false;
      }

      if (!q) return true;
      return (
        item.symbol.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    });
  }, [allSearchableAssets, query, activeCategoryTab]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div
        className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[80vh] ${
          darkMode ? 'bg-[#1E222D] border-[#2A2E39] text-[#D1D4DC]' : 'bg-white border-[#E0E3EB] text-[#131722]'
        }`}
      >
        {/* Search Input Bar */}
        <div
          className={`flex items-center px-4 py-3.5 border-b ${
            darkMode ? 'border-[#2A2E39] bg-[#131722]/50' : 'border-[#F0F3FA] bg-[#F8F9FD]'
          }`}
        >
          <Search className="w-5 h-5 text-[#787B86] shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search symbols, companies, markets... (e.g. NVDA, Bitcoin, S&P 500)"
            className={`w-full bg-transparent text-sm sm:text-base font-medium outline-none placeholder-[#787B86] ${
              darkMode ? 'text-white' : 'text-[#131722]'
            }`}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-[#787B86] hover:text-white mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className={`text-xs px-2 py-1 rounded-md font-mono border transition ${
              darkMode ? 'border-[#2A2E39] text-[#787B86] hover:bg-[#2A2E39]' : 'border-[#E0E3EB] text-[#787B86] hover:bg-[#F0F3FA]'
            }`}
          >
            ESC
          </button>
        </div>

        {/* Category Filter Pills */}
        <div
          className={`flex items-center gap-1.5 px-4 py-2 border-b overflow-x-auto no-scrollbar text-xs ${
            darkMode ? 'border-[#2A2E39] bg-[#131722]/30' : 'border-[#F0F3FA] bg-[#F8F9FD]'
          }`}
        >
          {searchCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategoryTab(cat)}
              className={`px-3 py-1 rounded-full font-medium whitespace-nowrap transition cursor-pointer ${
                activeCategoryTab === cat
                  ? 'bg-[#2962FF] text-white shadow-sm'
                  : darkMode
                    ? 'text-[#787B86] hover:text-white hover:bg-[#2A2E39]'
                    : 'text-[#434651] hover:text-[#131722] hover:bg-[#E0E3EB]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="overflow-y-auto p-2 space-y-1 divide-y divide-transparent">
          {filteredAssets.length === 0 ? (
            <div className="p-8 text-center text-[#787B86]">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="font-semibold text-sm">No symbols found for "{query}"</p>
              <p className="text-xs mt-1">Try searching for tickers like NVDA, AAPL, BTC, or Gold</p>
            </div>
          ) : (
            filteredAssets.map((asset) => {
              const isGreen = asset.changePercent >= 0;
              return (
                <div
                  key={asset.symbol}
                  onClick={() => {
                    onSelectAsset(asset);
                    onClose();
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition ${
                    darkMode ? 'hover:bg-[#2A2E39]' : 'hover:bg-[#F0F3FA]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0"
                      style={{
                        backgroundColor: asset.bgColor || (darkMode ? '#2A2E39' : '#F0F3FA'),
                        color: asset.color || (darkMode ? '#FFFFFF' : '#131722'),
                      }}
                    >
                      {asset.symbol.slice(0, 3)}
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-[#131722]'}`}>
                          {asset.symbol}
                        </span>
                        <span className="text-[10px] text-[#787B86] px-1 rounded bg-black/5 dark:bg-white/5 font-mono">
                          {asset.category}
                        </span>
                      </div>
                      <p className="text-xs text-[#787B86] truncate max-w-xs sm:max-w-md">
                        {asset.name}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 pl-3">
                    <div className={`font-bold text-sm font-mono-numbers ${darkMode ? 'text-white' : 'text-[#131722]'}`}>
                      {asset.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: asset.price < 5 ? 4 : 2,
                      })}{' '}
                      <span className="text-[10px] text-[#787B86] uppercase">{asset.currency}</span>
                    </div>
                    <div
                      className={`text-xs font-semibold font-mono-numbers ${
                        isGreen ? 'text-[#089981]' : 'text-[#F23645]'
                      }`}
                    >
                      {isGreen ? '+' : ''}
                      {asset.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Hint */}
        <div
          className={`px-4 py-2.5 border-t text-[11px] text-[#787B86] flex items-center justify-between ${
            darkMode ? 'border-[#2A2E39] bg-[#131722]/50' : 'border-[#F0F3FA] bg-[#F8F9FD]'
          }`}
        >
          <span>Quick symbol search across 100,000+ financial instruments</span>
          <span className="flex items-center gap-1">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 font-mono">↵ Enter</kbd>
            <span>to open</span>
          </span>
        </div>
      </div>
    </div>
  );
};
