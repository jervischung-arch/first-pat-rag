import React, { useState } from 'react';
import { ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Play, Pause, Star } from 'lucide-react';
import { MarketAsset, MarketCategory, MoverTab } from '../types/market';
import { MOVER_TABS } from '../data/marketData';

interface MarketTableProps {
  selectedCategory: MarketCategory;
  activeMoverTab: MoverTab;
  onSelectMoverTab: (tab: MoverTab) => void;
  assets: MarketAsset[];
  onSelectAsset: (asset: MarketAsset) => void;
  onViewAll: () => void;
  darkMode: boolean;
  isLiveActive: boolean;
  onToggleLive: () => void;
  watchlist: string[];
  onToggleWatchlist: (symbol: string, e: React.MouseEvent) => void;
  recentTicks: Record<string, 'up' | 'down'>;
}

type SortField = 'symbol' | 'price' | 'changePercent' | 'changeAmount' | 'marketCap' | 'volume';

export const MarketTable: React.FC<MarketTableProps> = ({
  selectedCategory,
  activeMoverTab,
  onSelectMoverTab,
  assets,
  onSelectAsset,
  onViewAll,
  darkMode,
  isLiveActive,
  onToggleLive,
  watchlist,
  onToggleWatchlist,
  recentTicks,
}) => {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (!sortAsc) {
        setSortAsc(true);
      } else {
        setSortField(null);
      }
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const sortedAssets = [...assets].sort((a, b) => {
    if (!sortField) return 0;
    let valA = a[sortField];
    let valB = b[sortField];

    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return sortAsc ? Number(valA) - Number(valB) : Number(valB) - Number(valA);
  });

  // Helper to generate smooth SVG sparkline curve from array of numbers
  const renderSparkline = (values: number[], isPositive: boolean) => {
    if (!values || values.length < 2) {
      return (
        <svg className="w-20 h-6 ml-auto" viewBox="0 0 80 24">
          <path
            d={isPositive ? 'M0,18 Q20,19 40,8 T80,4' : 'M0,6 Q20,8 40,16 T80,20'}
            fill="none"
            stroke={isPositive ? '#089981' : '#F23645'}
            strokeLinecap="round"
            strokeWidth="2"
          />
        </svg>
      );
    }

    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const width = 80;
    const height = 20;

    const points = values.map((val, idx) => {
      const x = (idx / (values.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    // Simple bezier smooth path approximation
    const d = `M${points[0]} ` + points.slice(1).map((pt) => `L${pt}`).join(' ');

    return (
      <svg className="w-20 h-6 ml-auto overflow-visible" viewBox="0 0 80 24">
        <path
          d={d}
          fill="none"
          stroke={isPositive ? '#089981' : '#F23645'}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    );
  };

  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-12 pb-8">
      {/* Table Controls & Tabs */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${
          darkMode ? 'border-[#2A2E39]' : 'border-[#E0E3EB]'
        }`}
      >
        {/* Mover Tabs */}
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
          {MOVER_TABS.map((tab) => {
            const isActive = activeMoverTab === tab;
            return (
              <button
                key={tab}
                onClick={() => onSelectMoverTab(tab)}
                className={`text-base font-semibold pb-3 -mb-4 transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? darkMode
                      ? 'text-white border-b-2 border-white'
                      : 'text-[#131722] border-b-2 border-[#131722]'
                    : darkMode
                      ? 'text-[#787B86] hover:text-[#D1D4DC]'
                      : 'text-[#787B86] hover:text-[#131722]'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Live feed status indicator */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleLive}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
              darkMode
                ? 'bg-[#1E222D] hover:bg-[#2A2E39] text-[#D1D4DC]'
                : 'bg-[#F0F3FA] hover:bg-[#E0E3EB] text-[#434651]'
            }`}
            title={isLiveActive ? 'Click to pause simulated feed' : 'Click to resume simulated feed'}
          >
            {isLiveActive ? (
              <>
                <span className="text-xs text-[#787B86]">Live feed updated</span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <Pause className="w-3 h-3 text-[#787B86] ml-1" />
              </>
            ) : (
              <>
                <span className="text-xs text-[#787B86]">Feed paused</span>
                <span className="inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                <Play className="w-3 h-3 text-[#787B86] ml-1" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Financial Table */}
      <div className="overflow-x-auto mt-1">
        <table className="w-full text-left text-sm" id="stocks-market-table">
          <thead>
            <tr
              className={`text-xs uppercase font-semibold border-b ${
                darkMode
                  ? 'text-[#787B86] border-[#2A2E39]'
                  : 'text-[#787B86] border-[#F0F3FA]'
              }`}
            >
              <th
                onClick={() => handleSort('symbol')}
                className="py-3.5 pr-4 cursor-pointer hover:text-[#2962FF] select-none"
                scope="col"
              >
                <div className="flex items-center gap-1">
                  <span>Symbol</span>
                  {sortField === 'symbol' ? (
                    sortAsc ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 opacity-40" />
                  )}
                </div>
              </th>

              <th
                onClick={() => handleSort('price')}
                className="py-3.5 px-4 text-right cursor-pointer hover:text-[#2962FF] select-none"
                scope="col"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Price ({assets[0]?.currency || 'USD'})</span>
                  {sortField === 'price' ? (
                    sortAsc ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 opacity-40" />
                  )}
                </div>
              </th>

              <th
                onClick={() => handleSort('changePercent')}
                className="py-3.5 px-4 text-right cursor-pointer hover:text-[#2962FF] select-none"
                scope="col"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Change %</span>
                  {sortField === 'changePercent' ? (
                    sortAsc ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 opacity-40" />
                  )}
                </div>
              </th>

              <th
                onClick={() => handleSort('changeAmount')}
                className="py-3.5 px-4 text-right cursor-pointer hover:text-[#2962FF] select-none"
                scope="col"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Change ({assets[0]?.currency || 'USD'})</span>
                  {sortField === 'changeAmount' ? (
                    sortAsc ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 opacity-40" />
                  )}
                </div>
              </th>

              <th
                onClick={() => handleSort('marketCap')}
                className="py-3.5 px-4 text-right hidden sm:table-cell cursor-pointer hover:text-[#2962FF] select-none"
                scope="col"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Market Cap</span>
                  {sortField === 'marketCap' ? (
                    sortAsc ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 opacity-40" />
                  )}
                </div>
              </th>

              <th
                onClick={() => handleSort('volume')}
                className="py-3.5 px-4 text-right hidden md:table-cell cursor-pointer hover:text-[#2962FF] select-none"
                scope="col"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Volume</span>
                  {sortField === 'volume' ? (
                    sortAsc ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 opacity-40" />
                  )}
                </div>
              </th>

              <th className="py-3.5 pl-4 text-right" scope="col">
                Trend (24h)
              </th>
            </tr>
          </thead>

          <tbody className={`divide-y ${darkMode ? 'divide-[#2A2E39]' : 'divide-[#F0F3FA]'}`}>
            {sortedAssets.map((asset) => {
              const isGreen = asset.changePercent >= 0;
              const isWatchlisted = watchlist.includes(asset.symbol);
              const tickState = recentTicks[asset.symbol];

              return (
                <tr
                  key={asset.symbol}
                  onClick={() => onSelectAsset(asset)}
                  className={`transition-colors cursor-pointer group ${
                    darkMode ? 'hover:bg-[#1E222D]/80' : 'hover:bg-[#F8F9FD]'
                  }`}
                >
                  {/* Symbol & Company Name */}
                  <td className="py-3.5 pr-4 flex items-center gap-3">
                    {/* Star Watchlist */}
                    <button
                      onClick={(e) => onToggleWatchlist(asset.symbol, e)}
                      className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 text-[#787B86] hover:text-amber-400 transition"
                      title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          isWatchlisted ? 'fill-amber-400 text-amber-400' : 'opacity-40 group-hover:opacity-100'
                        }`}
                      />
                    </button>

                    {/* Logo/Ticker Badge */}
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0"
                      style={{
                        backgroundColor: asset.bgColor || (darkMode ? '#2A2E39' : '#F0F3FA'),
                        color: asset.color || (darkMode ? '#FFFFFF' : '#131722'),
                      }}
                    >
                      {asset.symbol.slice(0, 4)}
                    </div>

                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-bold transition-colors ${
                            darkMode ? 'text-white group-hover:text-[#2962FF]' : 'text-[#131722] group-hover:text-[#2962FF]'
                          }`}
                        >
                          {asset.symbol}
                        </span>
                        {asset.exchange && (
                          <span className="text-[10px] text-[#787B86] px-1 py-0.2 rounded bg-black/5 dark:bg-white/5 font-mono">
                            {asset.exchange}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#787B86] truncate max-w-[200px] sm:max-w-[260px]">
                        {asset.name}
                      </p>
                    </div>
                  </td>

                  {/* Price (USD) with live tick flash */}
                  <td
                    className={`py-3.5 px-4 text-right font-semibold font-mono-numbers transition-colors ${
                      tickState === 'up'
                        ? 'tick-up text-[#089981]'
                        : tickState === 'down'
                          ? 'tick-down text-[#F23645]'
                          : darkMode
                            ? 'text-white'
                            : 'text-[#131722]'
                    }`}
                  >
                    {asset.price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: asset.price < 5 ? 4 : 2,
                    })}
                  </td>

                  {/* Change % */}
                  <td
                    className={`py-3.5 px-4 text-right font-semibold font-mono-numbers ${
                      isGreen ? 'text-[#089981]' : 'text-[#F23645]'
                    }`}
                  >
                    {isGreen ? `+${asset.changePercent.toFixed(2)}%` : `${asset.changePercent.toFixed(2)}%`}
                  </td>

                  {/* Change (USD) */}
                  <td
                    className={`py-3.5 px-4 text-right font-medium font-mono-numbers ${
                      isGreen ? 'text-[#089981]' : 'text-[#F23645]'
                    }`}
                  >
                    {isGreen ? `+${asset.changeAmount.toFixed(2)}` : `${asset.changeAmount.toFixed(2)}`}
                  </td>

                  {/* Market Cap */}
                  <td
                    className={`py-3.5 px-4 text-right font-mono-numbers hidden sm:table-cell ${
                      darkMode ? 'text-[#D1D4DC]' : 'text-[#434651]'
                    }`}
                  >
                    {asset.marketCap}
                  </td>

                  {/* Volume */}
                  <td
                    className={`py-3.5 px-4 text-right font-mono-numbers hidden md:table-cell ${
                      darkMode ? 'text-[#D1D4DC]' : 'text-[#434651]'
                    }`}
                  >
                    {asset.volume}
                  </td>

                  {/* Trend (24h) Sparkline */}
                  <td className="py-3.5 pl-4 text-right">
                    {renderSparkline(asset.sparkline, isGreen)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer Link */}
      <div className="mt-4 pt-3 flex items-center justify-end">
        <button
          onClick={onViewAll}
          className="inline-flex items-center text-sm font-semibold text-[#2962FF] hover:underline cursor-pointer group"
        >
          <span>View all {selectedCategory === 'US stocks' ? '500 US stocks' : `all ${selectedCategory}`}</span>
          <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </section>
  );
};
