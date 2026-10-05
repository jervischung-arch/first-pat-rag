import React from 'react';
import { X, Star, Trash2, ArrowUpRight, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { MarketAsset, PaperTradePosition } from '../types/market';

interface WatchlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  watchlistSymbols: string[];
  assetsMap: Record<string, MarketAsset>;
  onRemoveFromWatchlist: (symbol: string) => void;
  onSelectAsset: (asset: MarketAsset) => void;
  darkMode: boolean;
  paperPositions: PaperTradePosition[];
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({
  isOpen,
  onClose,
  watchlistSymbols,
  assetsMap,
  onRemoveFromWatchlist,
  onSelectAsset,
  darkMode,
  paperPositions,
}) => {
  const [activeTab, setActiveTab] = React.useState<'watchlist' | 'portfolio'>('watchlist');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className={`w-full max-w-md h-full shadow-2xl border-l flex flex-col animate-in slide-in-from-right duration-200 ${
          darkMode ? 'bg-[#1E222D] border-[#2A2E39] text-[#D1D4DC]' : 'bg-white border-[#E0E3EB] text-[#131722]'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-5 py-4 border-b ${
            darkMode ? 'border-[#2A2E39] bg-[#131722]/50' : 'border-[#F0F3FA] bg-[#F8F9FD]'
          }`}
        >
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <h2 className={`font-bold text-base ${darkMode ? 'text-white' : 'text-[#131722]'}`}>
              Watchlist & Portfolio
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#787B86] hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex p-2 border-b border-[#E0E3EB] dark:border-[#2A2E39] gap-2">
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'watchlist'
                ? 'bg-[#2962FF] text-white shadow-sm'
                : 'text-[#787B86] hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            Watchlist ({watchlistSymbols.length})
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'portfolio'
                ? 'bg-[#2962FF] text-white shadow-sm'
                : 'text-[#787B86] hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            Paper Orders ({paperPositions.length})
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {activeTab === 'watchlist' ? (
            watchlistSymbols.length === 0 ? (
              <div className="py-12 text-center text-[#787B86]">
                <Star className="w-10 h-10 mx-auto mb-3 opacity-30 text-amber-400" />
                <p className="font-semibold text-sm">Your watchlist is empty</p>
                <p className="text-xs mt-1 max-w-xs mx-auto">
                  Click the star icon next to any asset to track it in real time here.
                </p>
              </div>
            ) : (
              watchlistSymbols.map((sym) => {
                const asset = assetsMap[sym];
                if (!asset) return null;
                const isGreen = asset.changePercent >= 0;

                return (
                  <div
                    key={sym}
                    className={`flex items-center justify-between p-3 rounded-xl border transition group ${
                      darkMode
                        ? 'bg-[#131722]/50 border-[#2A2E39] hover:border-[#363A45]'
                        : 'bg-[#F8F9FD] border-[#E0E3EB] hover:border-[#D1D4DC]'
                    }`}
                  >
                    <div
                      onClick={() => {
                        onSelectAsset(asset);
                        onClose();
                      }}
                      className="cursor-pointer min-w-0 flex-1"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-[#131722]'}`}>
                          {asset.symbol}
                        </span>
                        <span className="text-[10px] text-[#787B86] font-mono px-1 rounded bg-black/5 dark:bg-white/5">
                          {asset.category}
                        </span>
                      </div>
                      <p className="text-xs text-[#787B86] truncate">{asset.name}</p>
                    </div>

                    <div className="text-right shrink-0 px-3">
                      <div className={`font-bold text-sm font-mono-numbers ${darkMode ? 'text-white' : 'text-[#131722]'}`}>
                        ${asset.price.toFixed(2)}
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

                    <button
                      onClick={() => onRemoveFromWatchlist(sym)}
                      className="p-1.5 rounded-lg text-[#787B86] hover:text-[#F23645] hover:bg-black/5 dark:hover:bg-white/5 transition opacity-60 group-hover:opacity-100"
                      title="Remove from Watchlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )
          ) : paperPositions.length === 0 ? (
            <div className="py-12 text-center text-[#787B86]">
              <DollarSign className="w-10 h-10 mx-auto mb-3 opacity-30 text-[#089981]" />
              <p className="font-semibold text-sm">No Paper Positions Yet</p>
              <p className="text-xs mt-1 max-w-xs mx-auto">
                Open any asset and click "Paper Trade" to execute practice market orders with live quotes!
              </p>
            </div>
          ) : (
            paperPositions.map((pos, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border ${
                  darkMode ? 'bg-[#131722]/50 border-[#2A2E39]' : 'bg-[#F8F9FD] border-[#E0E3EB]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm">{pos.symbol}</span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                      pos.type === 'BUY'
                        ? 'bg-[#089981]/20 text-[#089981]'
                        : 'bg-[#F23645]/20 text-[#F23645]'
                    }`}
                  >
                    {pos.type}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-[#787B86] font-mono-numbers">
                  <span>{pos.shares} units @ ${pos.avgPrice.toFixed(2)}</span>
                  <span className="font-semibold text-[#2962FF]">
                    ${(pos.shares * pos.avgPrice).toFixed(2)}
                  </span>
                </div>
                <div className="text-[10px] text-[#787B86] mt-1">{pos.timestamp}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
