import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Search,
  Download,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Star,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { MarketAsset, MarketCategory } from '../types/market';
import { ALL_MARKET_ASSETS } from '../data/marketData';

interface FullExplorerViewProps {
  category: MarketCategory;
  onBack: () => void;
  onSelectAsset: (asset: MarketAsset) => void;
  darkMode: boolean;
  watchlist: string[];
  onToggleWatchlist: (symbol: string, e: React.MouseEvent) => void;
}

export const FullExplorerView: React.FC<FullExplorerViewProps> = ({
  category,
  onBack,
  onSelectAsset,
  darkMode,
  watchlist,
  onToggleWatchlist,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'gainers' | 'losers'>('all');
  const [sortCol, setSortCol] = useState<'symbol' | 'price' | 'changePercent' | 'marketCap'>('marketCap');
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  // Generate extended pool of assets for this category
  const baseAssets = useMemo(() => {
    const list: MarketAsset[] = [];
    const source = ALL_MARKET_ASSETS[category];
    if (!source) return [];

    // Collect all unique
    const seen = new Set<string>();
    Object.values(source).forEach((arr) => {
      arr.forEach((item) => {
        if (!seen.has(item.symbol)) {
          seen.add(item.symbol);
          list.push(item);
        }
      });
    });

    // Generate mock extended listings so it genuinely feels like an extensive 500 stocks directory
    const extendedCount = category === 'US stocks' ? 40 : 25;
    const additionalTickers = [
      { sym: 'JPM', name: 'JPMorgan Chase & Co.', p: 198.4, c: 1.15, m: '568B', s: 'Financials' },
      { sym: 'LLY', name: 'Eli Lilly and Company', p: 782.1, c: 2.45, m: '742B', s: 'Healthcare' },
      { sym: 'AVGO', name: 'Broadcom Inc.', p: 1385.2, c: 3.12, m: '645B', s: 'Technology' },
      { sym: 'V', name: 'Visa Inc.', p: 284.5, c: -0.42, m: '575B', s: 'Financials' },
      { sym: 'UNH', name: 'UnitedHealth Group', p: 494.3, c: 0.18, m: '455B', s: 'Healthcare' },
      { sym: 'WMT', name: 'Walmart Inc.', p: 60.2, c: 0.82, m: '485B', s: 'Consumer Staples' },
      { sym: 'XOM', name: 'Exxon Mobil Corporation', p: 114.7, c: 1.64, m: '452B', s: 'Energy' },
      { sym: 'MA', name: 'Mastercard Incorporated', p: 480.9, c: -0.15, m: '448B', s: 'Financials' },
      { sym: 'JNJ', name: 'Johnson & Johnson', p: 158.3, c: -0.65, m: '381B', s: 'Healthcare' },
      { sym: 'PG', name: 'Procter & Gamble Company', p: 161.4, c: 0.32, m: '379B', s: 'Consumer Staples' },
      { sym: 'HD', name: 'The Home Depot, Inc.', p: 382.0, c: 1.05, m: '378B', s: 'Consumer Discretionary' },
      { sym: 'COST', name: 'Costco Wholesale Corp.', p: 745.2, c: 1.95, m: '330B', s: 'Consumer Staples' },
      { sym: 'ORCL', name: 'Oracle Corporation', p: 128.5, c: 4.80, m: '351B', s: 'Technology' },
      { sym: 'CRM', name: 'Salesforce, Inc.', p: 305.8, c: -1.20, m: '296B', s: 'Technology' },
      { sym: 'BAC', name: 'Bank of America Corp.', p: 36.8, c: 0.95, m: '288B', s: 'Financials' },
      { sym: 'CVX', name: 'Chevron Corporation', p: 155.6, c: 1.25, m: '286B', s: 'Energy' },
      { sym: 'NFLX', name: 'Netflix, Inc.', p: 628.4, c: 2.15, m: '272B', s: 'Communication' },
      { sym: 'KO', name: 'The Coca-Cola Company', p: 60.8, c: 0.25, m: '262B', s: 'Consumer Staples' },
      { sym: 'AMD', name: 'Advanced Micro Devices', p: 182.2, c: 2.15, m: '294B', s: 'Technology' },
      { sym: 'PEP', name: 'PepsiCo, Inc.', p: 167.3, c: -0.35, m: '230B', s: 'Consumer Staples' },
      { sym: 'LIN', name: 'Linde plc', p: 462.1, c: 0.45, m: '221B', s: 'Materials' },
      { sym: 'TMO', name: 'Thermo Fisher Scientific', p: 574.0, c: -0.75, m: '220B', s: 'Healthcare' },
      { sym: 'ADBE', name: 'Adobe Inc.', p: 524.3, c: -1.45, m: '236B', s: 'Technology' },
      { sym: 'DIS', name: 'The Walt Disney Company', p: 112.5, c: 1.85, m: '205B', s: 'Communication' },
      { sym: 'CSCO', name: 'Cisco Systems, Inc.', p: 50.1, c: 0.12, m: '202B', s: 'Technology' },
    ];

    if (category === 'US stocks') {
      additionalTickers.forEach((extra) => {
        if (!seen.has(extra.sym)) {
          seen.add(extra.sym);
          list.push({
            symbol: extra.sym,
            name: extra.name,
            category: 'US stocks',
            price: extra.p,
            changePercent: extra.c,
            changeAmount: (extra.p * extra.c) / 100,
            marketCap: extra.m,
            volume: `${(Math.random() * 20 + 5).toFixed(1)}M`,
            currency: 'USD',
            sparkline: [extra.p * 0.98, extra.p * 0.99, extra.p],
            exchange: 'NYSE',
            sector: extra.s,
            technicalSignal: extra.c > 0 ? 'Buy' : 'Neutral',
          });
        }
      });
    }

    return list;
  }, [category]);

  const filteredAssets = useMemo(() => {
    return baseAssets
      .filter((a) => {
        if (filterType === 'gainers' && a.changePercent <= 0) return false;
        if (filterType === 'losers' && a.changePercent >= 0) return false;
        if (searchTerm) {
          const q = searchTerm.toLowerCase();
          return a.symbol.toLowerCase().includes(q) || a.name.toLowerCase().includes(q);
        }
        return true;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortCol === 'symbol') diff = a.symbol.localeCompare(b.symbol);
        else if (sortCol === 'price') diff = a.price - b.price;
        else if (sortCol === 'changePercent') diff = a.changePercent - b.changePercent;
        else if (sortCol === 'marketCap') diff = a.price - b.price; // proxy
        return sortAsc ? diff : -diff;
      });
  }, [baseAssets, filterType, searchTerm, sortCol, sortAsc]);

  const paginatedAssets = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredAssets.slice(start, start + itemsPerPage);
  }, [filteredAssets, page]);

  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage) || 1;

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Symbol,Name,Price,ChangePercent,MarketCap,Volume']
        .concat(
          filteredAssets.map(
            (a) => `${a.symbol},"${a.name}",${a.price},${a.changePercent}%,${a.marketCap},${a.volume}`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${category.replace(/\s+/g, '_')}_market_data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E0E3EB] dark:border-[#2A2E39]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className={`p-2 rounded-xl border transition ${
              darkMode ? 'border-[#2A2E39] hover:bg-[#2A2E39] text-white' : 'border-[#E0E3EB] hover:bg-[#F0F3FA] text-[#131722]'
            }`}
            title="Back to Markets"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className={`text-2xl sm:text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-[#131722]'}`}>
              {category} Directory
            </h1>
            <p className="text-xs text-[#787B86] mt-0.5">
              Comprehensive index universe • {filteredAssets.length} tracked instruments
            </p>
          </div>
        </div>

        {/* Export CSV Button */}
        <button
          onClick={handleExportCSV}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition ${
            darkMode
              ? 'border-[#2A2E39] bg-[#1E222D] hover:bg-[#2A2E39] text-white'
              : 'border-[#E0E3EB] bg-white hover:bg-[#F0F3FA] text-[#131722]'
          }`}
        >
          <Download className="w-4 h-4 text-[#787B86]" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-6">
        {/* Search Input */}
        <div
          className={`flex items-center w-full sm:w-80 px-3.5 py-2 rounded-xl border ${
            darkMode ? 'bg-[#1E222D] border-[#2A2E39]' : 'bg-[#F8F9FD] border-[#E0E3EB]'
          }`}
        >
          <Search className="w-4 h-4 text-[#787B86] mr-2 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            placeholder={`Filter ${category}...`}
            className="w-full bg-transparent text-xs font-medium outline-none placeholder-[#787B86]"
          />
        </div>

        {/* Gainers / Losers Pills */}
        <div
          className={`flex items-center p-1 rounded-xl border text-xs ${
            darkMode ? 'bg-[#1E222D] border-[#2A2E39]' : 'bg-[#F0F3FA] border-[#E0E3EB]'
          }`}
        >
          {(['all', 'gainers', 'losers'] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                setFilterType(t);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition ${
                filterType === t
                  ? 'bg-[#2962FF] text-white shadow-sm'
                  : 'text-[#787B86] hover:text-[#131722] dark:hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-6">
        <table className="w-full text-left text-sm">
          <thead>
            <tr
              className={`text-xs uppercase font-semibold border-b ${
                darkMode ? 'text-[#787B86] border-[#2A2E39]' : 'text-[#787B86] border-[#F0F3FA]'
              }`}
            >
              <th
                onClick={() => {
                  setSortCol('symbol');
                  setSortAsc(!sortAsc);
                }}
                className="py-3.5 pr-4 cursor-pointer hover:text-[#2962FF]"
              >
                Symbol
              </th>
              <th
                onClick={() => {
                  setSortCol('price');
                  setSortAsc(!sortAsc);
                }}
                className="py-3.5 px-4 text-right cursor-pointer hover:text-[#2962FF]"
              >
                Price (USD)
              </th>
              <th
                onClick={() => {
                  setSortCol('changePercent');
                  setSortAsc(!sortAsc);
                }}
                className="py-3.5 px-4 text-right cursor-pointer hover:text-[#2962FF]"
              >
                Change %
              </th>
              <th className="py-3.5 px-4 text-right hidden sm:table-cell">Market Cap</th>
              <th className="py-3.5 px-4 text-right hidden md:table-cell">Volume</th>
              <th className="py-3.5 pl-4 text-right">Technical Signal</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${darkMode ? 'divide-[#2A2E39]' : 'divide-[#F0F3FA]'}`}>
            {paginatedAssets.map((asset) => {
              const isGreen = asset.changePercent >= 0;
              const isWatchlisted = watchlist.includes(asset.symbol);

              return (
                <tr
                  key={asset.symbol}
                  onClick={() => onSelectAsset(asset)}
                  className={`transition-colors cursor-pointer group ${
                    darkMode ? 'hover:bg-[#1E222D]' : 'hover:bg-[#F8F9FD]'
                  }`}
                >
                  <td className="py-3.5 pr-4 flex items-center gap-3">
                    <button
                      onClick={(e) => onToggleWatchlist(asset.symbol, e)}
                      className="p-1 rounded text-[#787B86] hover:text-amber-400"
                    >
                      <Star className={`w-3.5 h-3.5 ${isWatchlisted ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs"
                      style={{
                        backgroundColor: asset.bgColor || (darkMode ? '#2A2E39' : '#F0F3FA'),
                        color: asset.color || (darkMode ? '#FFFFFF' : '#131722'),
                      }}
                    >
                      {asset.symbol.slice(0, 3)}
                    </div>
                    <div>
                      <span className={`font-bold group-hover:text-[#2962FF] ${darkMode ? 'text-white' : 'text-[#131722]'}`}>
                        {asset.symbol}
                      </span>
                      <p className="text-xs text-[#787B86]">{asset.name}</p>
                    </div>
                  </td>

                  <td className={`py-3.5 px-4 text-right font-semibold font-mono-numbers ${darkMode ? 'text-white' : 'text-[#131722]'}`}>
                    ${asset.price.toFixed(2)}
                  </td>

                  <td className={`py-3.5 px-4 text-right font-semibold font-mono-numbers ${isGreen ? 'text-[#089981]' : 'text-[#F23645]'}`}>
                    {isGreen ? '+' : ''}
                    {asset.changePercent.toFixed(2)}%
                  </td>

                  <td className={`py-3.5 px-4 text-right font-mono-numbers hidden sm:table-cell ${darkMode ? 'text-[#D1D4DC]' : 'text-[#434651]'}`}>
                    {asset.marketCap}
                  </td>

                  <td className={`py-3.5 px-4 text-right font-mono-numbers hidden md:table-cell ${darkMode ? 'text-[#D1D4DC]' : 'text-[#434651]'}`}>
                    {asset.volume}
                  </td>

                  <td className="py-3.5 pl-4 text-right">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                        isGreen
                          ? darkMode
                            ? 'bg-[#089981]/20 text-[#089981]'
                            : 'bg-[#E8F5E9] text-[#089981]'
                          : darkMode
                            ? 'bg-[#F23645]/20 text-[#F23645]'
                            : 'bg-[#FFEBEE] text-[#F23645]'
                      }`}
                    >
                      {asset.technicalSignal || (isGreen ? 'Buy' : 'Neutral')}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#E0E3EB] dark:border-[#2A2E39]">
        <div className="text-xs text-[#787B86]">
          Showing {(page - 1) * itemsPerPage + 1} - {Math.min(page * itemsPerPage, filteredAssets.length)} of{' '}
          {filteredAssets.length} symbols
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`p-1.5 rounded-lg border transition disabled:opacity-40 ${
              darkMode ? 'border-[#2A2E39] hover:bg-[#2A2E39]' : 'border-[#E0E3EB] hover:bg-[#F0F3FA]'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-semibold px-2">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={`p-1.5 rounded-lg border transition disabled:opacity-40 ${
              darkMode ? 'border-[#2A2E39] hover:bg-[#2A2E39]' : 'border-[#E0E3EB] hover:bg-[#F0F3FA]'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
