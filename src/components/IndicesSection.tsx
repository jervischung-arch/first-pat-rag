import React from 'react';
import { ChevronRight } from 'lucide-react';
import { IndexCardData } from '../types/market';

interface IndicesSectionProps {
  indices: IndexCardData[];
  onSelectIndex: (index: IndexCardData) => void;
  darkMode: boolean;
  onViewAllIndices: () => void;
}

export const IndicesSection: React.FC<IndicesSectionProps> = ({
  indices,
  onSelectIndex,
  darkMode,
  onViewAllIndices,
}) => {
  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-4">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onViewAllIndices}
          className={`inline-flex items-center gap-1.5 group text-2xl font-bold tracking-tight transition ${
            darkMode
              ? 'text-white hover:text-[#2962FF]'
              : 'text-[#131722] hover:text-[#2962FF]'
          }`}
        >
          <span>Indices</span>
          <ChevronRight
            className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${
              darkMode ? 'text-[#787B86] group-hover:text-[#2962FF]' : 'text-[#434651] group-hover:text-[#2962FF]'
            }`}
            strokeWidth={2.5}
          />
        </button>
      </div>

      {/* Indices Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {indices.map((item) => {
          const isGreen = item.changePercent >= 0;
          return (
            <article
              key={item.id}
              onClick={() => onSelectIndex(item)}
              className={`p-4 rounded-2xl border transition duration-200 cursor-pointer flex flex-col justify-between group ${
                darkMode
                  ? 'bg-[#1E222D] border-[#2A2E39] hover:bg-[#2A2E39]/80 hover:border-[#363A45]'
                  : 'bg-[#F0F3FA] border-transparent hover:bg-[#E0E3EB]/70 hover:border-[#D1D4DC]'
              }`}
            >
              {/* Top row: Badge, Name, Symbol, Percent Pill */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className="w-9 h-9 rounded-full text-white font-bold text-xs flex items-center justify-center shadow-sm shrink-0"
                    style={{ backgroundColor: item.badgeColor }}
                  >
                    {item.badge}
                  </span>
                  <div>
                    <h2
                      className={`text-sm font-bold leading-tight group-hover:text-[#2962FF] transition-colors ${
                        darkMode ? 'text-white' : 'text-[#131722]'
                      }`}
                    >
                      {item.name}
                    </h2>
                    <span className="text-xs text-[#787B86] font-medium">{item.symbol}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-md font-mono-numbers ${
                      isGreen
                        ? darkMode
                          ? 'bg-[#089981]/20 text-[#089981]'
                          : 'bg-[#E8F5E9] text-[#089981]'
                        : darkMode
                          ? 'bg-[#F23645]/20 text-[#F23645]'
                          : 'bg-[#FFEBEE] text-[#F23645]'
                    }`}
                  >
                    {isGreen ? `+${item.changePercent.toFixed(2)}%` : `${item.changePercent.toFixed(2)}%`}
                  </span>
                </div>
              </div>

              {/* Bottom row: Price, Change Amount, Sparkline */}
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p
                    className={`text-lg font-bold leading-none font-mono-numbers ${
                      darkMode ? 'text-white' : 'text-[#131722]'
                    }`}
                  >
                    {item.price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: item.price < 10 ? 4 : 2,
                    })}
                  </p>
                  <p
                    className={`text-xs mt-1 font-medium font-mono-numbers ${
                      isGreen ? 'text-[#089981]' : 'text-[#F23645]'
                    }`}
                  >
                    {isGreen ? '+' : ''}
                    {item.changeAmount.toFixed(2)} {item.currency}
                  </p>
                </div>

                {/* Sparkline SVG */}
                <svg
                  className="w-24 h-10 overflow-visible"
                  viewBox="0 0 100 40"
                  aria-hidden="true"
                >
                  <path
                    d={item.sparklinePath}
                    fill="none"
                    stroke={isGreen ? '#089981' : '#F23645'}
                    strokeLinecap="round"
                    strokeWidth="2.2"
                  />
                </svg>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
