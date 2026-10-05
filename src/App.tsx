/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { IndicesSection } from './components/IndicesSection';
import { MarketTable } from './components/MarketTable';
import { AssetDetailModal } from './components/AssetDetailModal';
import { SearchModal } from './components/SearchModal';
import { FullExplorerView } from './components/FullExplorerView';
import { WatchlistDrawer } from './components/WatchlistDrawer';
import { LanguageModal } from './components/LanguageModal';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { CATEGORIES, INITIAL_INDICES, ALL_MARKET_ASSETS } from './data/marketData';
import { MarketCategory, MoverTab, MarketAsset, IndexCardData, PaperTradePosition } from './types/market';
import { LineChart, BarChart3, Users, Landmark, ArrowLeft } from 'lucide-react';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<MarketCategory>('US stocks');
  const [selectedRegion, setSelectedRegion] = useState<string>('Everywhere (Global)');
  const [activeMoverTab, setActiveMoverTab] = useState<MoverTab>('Trending stocks');
  const [activeNav, setActiveNav] = useState<string>('Markets');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('EN');

  // Views & Modals
  const [currentView, setCurrentView] = useState<'overview' | 'explorer'>('overview');
  const [selectedAssetForDetail, setSelectedAssetForDetail] = useState<MarketAsset | IndexCardData | null>(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [languageModalOpen, setLanguageModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [watchlistDrawerOpen, setWatchlistDrawerOpen] = useState(false);

  // User & Portfolio State
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [watchlist, setWatchlist] = useState<string[]>(['NVDA', 'AAPL', 'TSLA', 'BTCUSD']);
  const [paperPositions, setPaperPositions] = useState<PaperTradePosition[]>([
    {
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      shares: 15,
      avgPrice: 775.20,
      currentPrice: 791.12,
      type: 'BUY',
      timestamp: 'Today, 10:14 AM',
    }
  ]);

  // Live simulation data state
  const [isLiveActive, setIsLiveActive] = useState(true);
  const [marketAssetsState, setMarketAssetsState] = useState(ALL_MARKET_ASSETS);
  const [indicesState, setIndicesState] = useState(INITIAL_INDICES);
  const [recentTicks, setRecentTicks] = useState<Record<string, 'up' | 'down'>>({});

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync dark mode class on HTML document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Live Ticking Simulation
  useEffect(() => {
    if (!isLiveActive) return;

    const interval = setInterval(() => {
      // Pick random asset from current category & tab
      setMarketAssetsState((prev) => {
        const catMap = prev[selectedCategory];
        if (!catMap) return prev;
        const currentList = catMap[activeMoverTab] || catMap['Trending stocks'];
        if (!currentList || currentList.length === 0) return prev;

        const randomIndex = Math.floor(Math.random() * currentList.length);
        const target = currentList[randomIndex];

        // Small tick: -0.15% to +0.15%
        const deltaPercent = (Math.random() - 0.49) * 0.3;
        const isUp = deltaPercent >= 0;
        const newPrice = Math.max(0.01, +(target.price * (1 + deltaPercent / 100)).toFixed(2));
        const priceDiff = +(newPrice - target.price).toFixed(2);
        const newChangeAmount = +(target.changeAmount + priceDiff).toFixed(2);
        const newChangePercent = +(target.changePercent + deltaPercent).toFixed(2);
        const newSparkline = [...target.sparkline.slice(1), newPrice];

        const updatedAsset: MarketAsset = {
          ...target,
          price: newPrice,
          changeAmount: newChangeAmount,
          changePercent: newChangePercent,
          sparkline: newSparkline,
        };

        const updatedList = [...currentList];
        updatedList[randomIndex] = updatedAsset;

        // Record tick for animation
        setRecentTicks((ticks) => ({ ...ticks, [target.symbol]: isUp ? 'up' : 'down' }));
        setTimeout(() => {
          setRecentTicks((ticks) => {
            const next = { ...ticks };
            delete next[target.symbol];
            return next;
          });
        }, 1200);

        return {
          ...prev,
          [selectedCategory]: {
            ...catMap,
            [activeMoverTab]: updatedList,
          },
        };
      });

      // Also fluctuate one index slightly
      setIndicesState((prev) => {
        const list = prev[selectedCategory];
        if (!list || list.length === 0) return prev;
        const randIdx = Math.floor(Math.random() * list.length);
        const target = list[randIdx];

        const delta = (Math.random() - 0.48) * (target.price * 0.0008);
        const newPrice = +(target.price + delta).toFixed(2);
        const newChange = +(target.changeAmount + delta).toFixed(2);
        const newPercent = +(target.changePercent + (delta / target.price) * 100).toFixed(2);

        const updated = [...list];
        updated[randIdx] = {
          ...target,
          price: newPrice,
          changeAmount: newChange,
          changePercent: newPercent,
          isPositive: newPercent >= 0,
        };

        return {
          ...prev,
          [selectedCategory]: updated,
        };
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [isLiveActive, selectedCategory, activeMoverTab]);

  // Current category indices
  const currentIndices = indicesState[selectedCategory] || INITIAL_INDICES['US stocks'];

  // Current category table assets
  const currentTableAssets =
    marketAssetsState[selectedCategory]?.[activeMoverTab] ||
    marketAssetsState[selectedCategory]?.['Trending stocks'] ||
    [];

  // Flat assets map for watchlist lookups
  const allAssetsMap = useMemo(() => {
    const map: Record<string, MarketAsset> = {};
    Object.values(marketAssetsState).forEach((catMap) => {
      Object.values(catMap).forEach((list) => {
        list.forEach((item) => {
          map[item.symbol] = item;
        });
      });
    });
    return map;
  }, [marketAssetsState]);

  // Watchlist handlers
  const handleToggleWatchlist = useCallback((symbol: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWatchlist((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    );
  }, []);

  const handlePlacePaperTrade = (
    symbol: string,
    type: 'BUY' | 'SELL',
    shares: number,
    price: number
  ) => {
    const newPos: PaperTradePosition = {
      symbol,
      name: allAssetsMap[symbol]?.name || symbol,
      shares,
      avgPrice: price,
      currentPrice: price,
      type,
      timestamp: 'Just now',
    };
    setPaperPositions((prev) => [newPos, ...prev]);
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-200 ${
        darkMode ? 'bg-[#131722] text-[#D1D4DC]' : 'bg-white text-[#131722]'
      }`}
    >
      {/* 1. Header (Sticky Top Bar Contract) */}
      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenLanguage={() => setLanguageModalOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenWatchlist={() => setWatchlistDrawerOpen(true)}
        watchlistCount={watchlist.length}
        activeNav={activeNav}
        onSelectNav={(nav) => {
          setActiveNav(nav);
          if (nav === 'Markets') {
            setCurrentView('overview');
          }
        }}
        selectedLanguage={selectedLanguage}
      />

      {/* Main Body Routing */}
      {activeNav !== 'Markets' && activeNav !== 'Screeners' && activeNav !== 'Supercharts' && activeNav !== 'Market Heatmaps' ? (
        /* Alternative Nav Pages (Products, Community, Brokers) */
        <main className="flex-1 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="max-w-xl mx-auto space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-[#2962FF]/10 text-[#2962FF] flex items-center justify-center mx-auto">
              {activeNav === 'Community' ? (
                <Users className="w-8 h-8" />
              ) : activeNav === 'Brokers' ? (
                <Landmark className="w-8 h-8" />
              ) : (
                <BarChart3 className="w-8 h-8" />
              )}
            </div>
            <h2 className={`text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-[#131722]'}`}>
              TradingView {activeNav}
            </h2>
            <p className="text-[#787B86] text-sm leading-relaxed">
              Explore professional charting tools, community trade ideas, and integrated brokerages with real-time execution.
            </p>
            <button
              onClick={() => {
                setActiveNav('Markets');
                setCurrentView('overview');
              }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl gradient-btn text-white text-sm font-semibold shadow-md cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Markets Overview</span>
            </button>
          </div>
        </main>
      ) : currentView === 'explorer' ? (
        /* 2. Full Directory View ("View all 500 US stocks") */
        <main className="flex-1">
          <FullExplorerView
            category={selectedCategory}
            onBack={() => setCurrentView('overview')}
            onSelectAsset={(asset) => setSelectedAssetForDetail(asset)}
            darkMode={darkMode}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
          />
        </main>
      ) : (
        /* 3. Main Screen ("Markets, everywhere" - exact replica of uploaded image) */
        <main className="flex-1">
          {/* Hero Section */}
          <HeroSection
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => setSelectedCategory(cat)}
            darkMode={darkMode}
            selectedRegion={selectedRegion}
            onSelectRegion={(reg) => setSelectedRegion(reg)}
          />

          {/* Indices Section (4 benchmark cards with sparklines) */}
          <IndicesSection
            indices={currentIndices}
            onSelectIndex={(index) => setSelectedAssetForDetail(index)}
            darkMode={darkMode}
            onViewAllIndices={() => setCurrentView('explorer')}
          />

          {/* Market Movers Table Section */}
          <MarketTable
            selectedCategory={selectedCategory}
            activeMoverTab={activeMoverTab}
            onSelectMoverTab={(tab) => setActiveMoverTab(tab)}
            assets={currentTableAssets}
            onSelectAsset={(asset) => setSelectedAssetForDetail(asset)}
            onViewAll={() => setCurrentView('explorer')}
            darkMode={darkMode}
            isLiveActive={isLiveActive}
            onToggleLive={() => setIsLiveActive(!isLiveActive)}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
            recentTicks={recentTicks}
          />
        </main>
      )}

      {/* Footer */}
      <Footer darkMode={darkMode} />

      {/* Modals & Slide-Overs */}
      {selectedAssetForDetail && (
        <AssetDetailModal
          asset={selectedAssetForDetail}
          onClose={() => setSelectedAssetForDetail(null)}
          darkMode={darkMode}
          isWatchlisted={watchlist.includes(selectedAssetForDetail.symbol)}
          onToggleWatchlist={() => handleToggleWatchlist(selectedAssetForDetail.symbol)}
          onPlacePaperTrade={handlePlacePaperTrade}
        />
      )}

      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectAsset={(asset) => setSelectedAssetForDetail(asset)}
        darkMode={darkMode}
      />

      <WatchlistDrawer
        isOpen={watchlistDrawerOpen}
        onClose={() => setWatchlistDrawerOpen(false)}
        watchlistSymbols={watchlist}
        assetsMap={allAssetsMap}
        onRemoveFromWatchlist={(sym) => handleToggleWatchlist(sym)}
        onSelectAsset={(asset) => setSelectedAssetForDetail(asset)}
        darkMode={darkMode}
        paperPositions={paperPositions}
      />

      <LanguageModal
        isOpen={languageModalOpen}
        onClose={() => setLanguageModalOpen(false)}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={(lang) => setSelectedLanguage(lang)}
        darkMode={darkMode}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        darkMode={darkMode}
        currentUser={currentUser}
        onLoginSuccess={(user) => setCurrentUser(user || null)}
      />
    </div>
  );
}
