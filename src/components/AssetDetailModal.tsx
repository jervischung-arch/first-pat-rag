import React, { useState, useMemo } from 'react';
import {
  X,
  Star,
  TrendingUp,
  TrendingDown,
  Maximize2,
  Minimize2,
  Share2,
  BarChart2,
  Sliders,
  DollarSign,
  Info,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { MarketAsset, IndexCardData } from '../types/market';

interface AssetDetailModalProps {
  asset: MarketAsset | IndexCardData;
  onClose: () => void;
  darkMode: boolean;
  isWatchlisted: boolean;
  onToggleWatchlist: () => void;
  onPlacePaperTrade?: (symbol: string, type: 'BUY' | 'SELL', shares: number, price: number) => void;
}

type Timeframe = '1D' | '5D' | '1M' | '6M' | '1Y' | '5Y' | 'ALL';
type ChartType = 'area' | 'candlestick';

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  asset,
  onClose,
  darkMode,
  isWatchlisted,
  onToggleWatchlist,
  onPlacePaperTrade,
}) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  const [chartType, setChartType] = useState<ChartType>('area');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<{
    x: number;
    y: number;
    price: number;
    time: string;
    open?: number;
    high?: number;
    low?: number;
    close?: number;
  } | null>(null);

  // Paper Trade State
  const [tradeModalOpen, setTradeModalOpen] = useState(false);
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [sharesCount, setSharesCount] = useState<number>(10);
  const [orderExecuted, setOrderExecuted] = useState(false);

  const isGreen = asset.changePercent >= 0;

  // Generate realistic historical candle/line data for chosen timeframe
  const chartData = useMemo(() => {
    const pointsCount = timeframe === '1D' ? 30 : timeframe === '5D' ? 40 : 50;
    const basePrice = asset.price;
    const volatility = timeframe === '1D' ? 0.015 : timeframe === '1M' ? 0.08 : 0.22;
    const trend = isGreen ? 0.003 : -0.003;

    const data: {
      time: string;
      open: number;
      high: number;
      low: number;
      close: number;
      volume: number;
    }[] = [];

    let currentPrice = isGreen ? basePrice * (1 - volatility) : basePrice * (1 + volatility);

    for (let i = 0; i < pointsCount; i++) {
      const stepChange = (Math.sin(i * 0.4) * 0.01 + (Math.random() - 0.48) * 0.02 + trend) * currentPrice;
      const open = currentPrice;
      const close = i === pointsCount - 1 ? basePrice : currentPrice + stepChange;
      const high = Math.max(open, close) + Math.random() * (basePrice * 0.004);
      const low = Math.min(open, close) - Math.random() * (basePrice * 0.004);
      currentPrice = close;

      let timeLabel = '';
      if (timeframe === '1D') {
        const hour = 9 + Math.floor((i / pointsCount) * 7);
        const min = Math.floor(((i % 5) * 12));
        timeLabel = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
      } else if (timeframe === '5D') {
        const day = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][Math.floor((i / pointsCount) * 5)];
        timeLabel = `${day} 14:00`;
      } else {
        timeLabel = `Wk ${i + 1}`;
      }

      data.push({
        time: timeLabel,
        open,
        high,
        low,
        close,
        volume: Math.floor(Math.random() * 500000 + 100000),
      });
    }

    return data;
  }, [asset.price, asset.changePercent, isGreen, timeframe]);

  // Dimensions
  const chartHeight = 280;
  const chartWidth = 720;
  const padding = { top: 20, right: 30, bottom: 30, left: 10 };

  const minPrice = Math.min(...chartData.map((d) => d.low));
  const maxPrice = Math.max(...chartData.map((d) => d.high));
  const priceRange = maxPrice - minPrice || 1;

  // Build SVG path for Area Chart
  const { pathD, areaD } = useMemo(() => {
    const points = chartData.map((d, idx) => {
      const x = padding.left + (idx / (chartData.length - 1)) * (chartWidth - padding.left - padding.right);
      const y = padding.top + (1 - (d.close - minPrice) / priceRange) * (chartHeight - padding.top - padding.bottom);
      return { x, y };
    });

    if (points.length === 0) return { pathD: '', areaD: '' };

    const linePath = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map((p) => `L ${p.x} ${p.y}`).join(' ');
    const closeArea = `L ${points[points.length - 1].x} ${chartHeight - padding.bottom} L ${points[0].x} ${chartHeight - padding.bottom} Z`;

    return { pathD: linePath, areaD: linePath + ' ' + closeArea };
  }, [chartData, minPrice, priceRange]);

  const handleExecuteTrade = () => {
    if (onPlacePaperTrade) {
      onPlacePaperTrade(asset.symbol, tradeType, sharesCount, asset.price);
    }
    setOrderExecuted(true);
    setTimeout(() => {
      setOrderExecuted(false);
      setTradeModalOpen(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div
        className={`w-full ${
          isFullscreen ? 'h-full max-w-none rounded-none' : 'max-w-5xl rounded-3xl'
        } border shadow-2xl flex flex-col overflow-hidden transition-all duration-200 my-auto ${
          darkMode ? 'bg-[#1E222D] border-[#2A2E39] text-[#D1D4DC]' : 'bg-white border-[#E0E3EB] text-[#131722]'
        }`}
      >
        {/* Modal Top Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${
            darkMode ? 'border-[#2A2E39] bg-[#131722]/50' : 'border-[#F0F3FA] bg-[#F8F9FD]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shadow-inner"
              style={{
                backgroundColor: ('bgColor' in asset && asset.bgColor) || (darkMode ? '#2A2E39' : '#F0F3FA'),
                color: ('color' in asset && asset.color) || (darkMode ? '#FFFFFF' : '#131722'),
              }}
            >
              {asset.symbol.slice(0, 4)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-[#131722]'}`}>
                  {asset.symbol}
                </h2>
                {'exchange' in asset && asset.exchange && (
                  <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 text-[#787B86]">
                    {asset.exchange}
                  </span>
                )}
                <span className="text-xs text-[#787B86]">• {asset.category}</span>
              </div>
              <p className="text-xs text-[#787B86]">{asset.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Watchlist Toggle */}
            <button
              onClick={onToggleWatchlist}
              className={`p-2 rounded-xl transition cursor-pointer ${
                darkMode ? 'hover:bg-[#2A2E39] text-[#D1D4DC]' : 'hover:bg-[#E0E3EB] text-[#434651]'
              }`}
              title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              <Star
                className={`w-5 h-5 ${isWatchlisted ? 'fill-amber-400 text-amber-400' : ''}`}
              />
            </button>

            {/* Paper Trading Button */}
            <button
              onClick={() => setTradeModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#2962FF] hover:bg-[#1E53E5] text-white shadow-sm transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Paper Trade</span>
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className={`p-2 rounded-xl transition ${
                darkMode ? 'hover:bg-[#2A2E39] text-[#787B86]' : 'hover:bg-[#E0E3EB] text-[#787B86]'
              }`}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition cursor-pointer ${
                darkMode ? 'hover:bg-[#2A2E39] text-[#787B86] hover:text-white' : 'hover:bg-[#E0E3EB] text-[#787B86] hover:text-[#131722]'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Content Container */}
        <div className="p-6 overflow-y-auto max-h-[82vh] space-y-6">
          {/* Price & Highlight Statistics Bar */}
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-3">
                <span className={`text-3xl sm:text-4xl font-extrabold font-mono-numbers ${
                  darkMode ? 'text-white' : 'text-[#131722]'
                }`}>
                  {asset.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: asset.price < 5 ? 4 : 2,
                  })}
                </span>
                <span className="text-sm font-semibold text-[#787B86] uppercase">
                  {asset.currency}
                </span>

                <div
                  className={`inline-flex items-center gap-1 text-sm font-bold px-2.5 py-1 rounded-lg font-mono-numbers ${
                    isGreen
                      ? darkMode
                        ? 'bg-[#089981]/20 text-[#089981]'
                        : 'bg-[#E8F5E9] text-[#089981]'
                      : darkMode
                        ? 'bg-[#F23645]/20 text-[#F23645]'
                        : 'bg-[#FFEBEE] text-[#F23645]'
                  }`}
                >
                  {isGreen ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>
                    {isGreen ? '+' : ''}
                    {asset.changeAmount.toFixed(2)} ({isGreen ? '+' : ''}
                    {asset.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#787B86] mt-1 flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Real-time market quote • Market open</span>
              </p>
            </div>

            {/* Timeframe & Chart Style Selectors */}
            <div className="flex items-center gap-3">
              {/* Chart Mode Toggle */}
              <div
                className={`flex items-center p-1 rounded-xl border ${
                  darkMode ? 'bg-[#131722] border-[#2A2E39]' : 'bg-[#F0F3FA] border-[#E0E3EB]'
                }`}
              >
                <button
                  onClick={() => setChartType('area')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                    chartType === 'area'
                      ? 'bg-[#2962FF] text-white shadow-sm'
                      : 'text-[#787B86] hover:text-[#131722] dark:hover:text-white'
                  }`}
                >
                  Area
                </button>
                <button
                  onClick={() => setChartType('candlestick')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                    chartType === 'candlestick'
                      ? 'bg-[#2962FF] text-white shadow-sm'
                      : 'text-[#787B86] hover:text-[#131722] dark:hover:text-white'
                  }`}
                >
                  Candles
                </button>
              </div>

              {/* Timeframes Bar */}
              <div
                className={`flex items-center p-1 rounded-xl border ${
                  darkMode ? 'bg-[#131722] border-[#2A2E39]' : 'bg-[#F0F3FA] border-[#E0E3EB]'
                }`}
              >
                {(['1D', '5D', '1M', '6M', '1Y', '5Y', 'ALL'] as Timeframe[]).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                      timeframe === tf
                        ? darkMode
                          ? 'bg-[#2A2E39] text-white shadow-sm'
                          : 'bg-white text-[#131722] shadow-sm'
                        : 'text-[#787B86] hover:text-[#131722] dark:hover:text-white'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Chart Canvas */}
          <div
            className={`relative p-4 rounded-2xl border ${
              darkMode ? 'bg-[#131722] border-[#2A2E39]' : 'bg-[#F8F9FD] border-[#E0E3EB]'
            }`}
          >
            {/* Hover Tooltip Box */}
            {hoveredPoint && (
              <div
                className={`absolute top-4 left-6 z-20 px-3 py-1.5 rounded-lg border text-xs font-mono-numbers shadow-lg backdrop-blur-md ${
                  darkMode ? 'bg-[#1E222D]/90 border-[#2A2E39] text-white' : 'bg-white/90 border-[#E0E3EB] text-[#131722]'
                }`}
              >
                <div className="font-semibold text-[11px] text-[#787B86]">{hoveredPoint.time}</div>
                {chartType === 'candlestick' ? (
                  <div className="grid grid-cols-4 gap-2 text-[10px] mt-0.5">
                    <span>O: {hoveredPoint.open?.toFixed(2)}</span>
                    <span>H: {hoveredPoint.high?.toFixed(2)}</span>
                    <span>L: {hoveredPoint.low?.toFixed(2)}</span>
                    <span className="font-bold text-[#2962FF]">C: {hoveredPoint.close?.toFixed(2)}</span>
                  </div>
                ) : (
                  <div className="font-bold text-sm text-[#2962FF]">{hoveredPoint.price.toFixed(2)} USD</div>
                )}
              </div>
            )}

            {/* SVG Interactive Chart */}
            <svg
              className="w-full h-72 cursor-crosshair overflow-visible"
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              preserveAspectRatio="none"
              onMouseLeave={() => setHoveredPoint(null)}
            >
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={isGreen ? '#089981' : '#F23645'}
                    stopOpacity={darkMode ? '0.35' : '0.2'}
                  />
                  <stop
                    offset="100%"
                    stopColor={isGreen ? '#089981' : '#F23645'}
                    stopOpacity="0.0"
                  />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0.25, 0.5, 0.75].map((ratio) => {
                const y = padding.top + ratio * (chartHeight - padding.top - padding.bottom);
                const priceAtY = maxPrice - ratio * priceRange;
                return (
                  <g key={ratio}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={chartWidth - padding.right}
                      y2={y}
                      stroke={darkMode ? '#2A2E39' : '#E0E3EB'}
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    />
                    <text
                      x={chartWidth - padding.right + 4}
                      y={y + 3}
                      fill="#787B86"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      {priceAtY.toFixed(priceAtY < 10 ? 2 : 1)}
                    </text>
                  </g>
                );
              })}

              {chartType === 'area' ? (
                <>
                  {/* Filled Area */}
                  <path d={areaD} fill="url(#areaGradient)" />
                  {/* Stroke Line */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={isGreen ? '#089981' : '#F23645'}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </>
              ) : (
                /* Candlestick Rendering */
                chartData.map((candle, idx) => {
                  const x = padding.left + (idx / (chartData.length - 1)) * (chartWidth - padding.left - padding.right);
                  const openY = padding.top + (1 - (candle.open - minPrice) / priceRange) * (chartHeight - padding.top - padding.bottom);
                  const closeY = padding.top + (1 - (candle.close - minPrice) / priceRange) * (chartHeight - padding.top - padding.bottom);
                  const highY = padding.top + (1 - (candle.high - minPrice) / priceRange) * (chartHeight - padding.top - padding.bottom);
                  const lowY = padding.top + (1 - (candle.low - minPrice) / priceRange) * (chartHeight - padding.top - padding.bottom);

                  const candleGreen = candle.close >= candle.open;
                  const candleColor = candleGreen ? '#089981' : '#F23645';
                  const top = Math.min(openY, closeY);
                  const height = Math.max(Math.abs(closeY - openY), 2);
                  const candleWidth = Math.max((chartWidth / chartData.length) * 0.65, 4);

                  return (
                    <g key={idx}>
                      {/* High-Low Wick */}
                      <line
                        x1={x}
                        y1={highY}
                        x2={x}
                        y2={lowY}
                        stroke={candleColor}
                        strokeWidth="1.2"
                      />
                      {/* Open-Close Body */}
                      <rect
                        x={x - candleWidth / 2}
                        y={top}
                        width={candleWidth}
                        height={height}
                        fill={candleColor}
                        rx="1"
                      />
                    </g>
                  );
                })
              )}

              {/* Hover Inspection Line & Circles */}
              {chartData.map((d, idx) => {
                const x = padding.left + (idx / (chartData.length - 1)) * (chartWidth - padding.left - padding.right);
                const y = padding.top + (1 - (d.close - minPrice) / priceRange) * (chartHeight - padding.top - padding.bottom);

                return (
                  <rect
                    key={idx}
                    x={x - (chartWidth / chartData.length) / 2}
                    y={0}
                    width={chartWidth / chartData.length}
                    height={chartHeight}
                    fill="transparent"
                    onMouseEnter={() =>
                      setHoveredPoint({
                        x,
                        y,
                        price: d.close,
                        time: d.time,
                        open: d.open,
                        high: d.high,
                        low: d.low,
                        close: d.close,
                      })
                    }
                  />
                );
              })}

              {hoveredPoint && (
                <g>
                  <line
                    x1={hoveredPoint.x}
                    y1={0}
                    x2={hoveredPoint.x}
                    y2={chartHeight - padding.bottom}
                    stroke="#2962FF"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <circle
                    cx={hoveredPoint.x}
                    cy={hoveredPoint.y}
                    r="4"
                    fill="#2962FF"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />
                </g>
              )}
            </svg>
          </div>

          {/* Technical Analysis Gauge & Key Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Technical Analysis Signal (TradingView Gauge) */}
            <div
              className={`p-4 rounded-2xl border flex flex-col justify-between ${
                darkMode ? 'bg-[#131722] border-[#2A2E39]' : 'bg-[#F8F9FD] border-[#E0E3EB]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#787B86]">
                    Technical Summary
                  </h3>
                  <span className="text-[10px] text-[#787B86]">1D Consensus</span>
                </div>

                <div className="text-center py-2">
                  <div
                    className={`text-xl font-extrabold ${
                      ('technicalSignal' in asset && asset.technicalSignal?.includes('Buy')) || isGreen
                        ? 'text-[#089981]'
                        : 'text-[#F23645]'
                    }`}
                  >
                    {('technicalSignal' in asset && asset.technicalSignal) || (isGreen ? 'Strong Buy' : 'Neutral')}
                  </div>
                  <p className="text-xs text-[#787B86] mt-0.5">Oscillators & Moving Averages</p>
                </div>
              </div>

              {/* Gauge Meter Bar */}
              <div className="mt-3">
                <div className="h-2 rounded-full bg-gradient-to-r from-[#F23645] via-[#FBBF24] to-[#089981] relative">
                  <div
                    className="absolute -top-1 w-4 h-4 bg-white border-2 border-[#131722] rounded-full shadow-md transition-all -translate-x-1/2"
                    style={{
                      left: isGreen ? '82%' : '28%',
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-[#787B86] mt-1.5 font-medium">
                  <span>Strong Sell</span>
                  <span>Neutral</span>
                  <span>Strong Buy</span>
                </div>
              </div>
            </div>

            {/* 52-Week & Day Range Slider */}
            <div
              className={`p-4 rounded-2xl border flex flex-col justify-between ${
                darkMode ? 'bg-[#131722] border-[#2A2E39]' : 'bg-[#F8F9FD] border-[#E0E3EB]'
              }`}
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#787B86] mb-2">
                Price Ranges
              </h3>

              {/* Day's Range */}
              <div>
                <div className="flex justify-between text-xs font-medium font-mono-numbers mb-1">
                  <span className="text-[#787B86]">Day Low: {(asset.price * 0.985).toFixed(2)}</span>
                  <span className="text-[#787B86]">Day High: {(asset.price * 1.015).toFixed(2)}</span>
                </div>
                <div className="h-2 rounded-full bg-black/10 dark:bg-white/10 relative">
                  <div
                    className="absolute top-0 bottom-0 bg-[#2962FF] rounded-full"
                    style={{ left: '30%', right: '25%' }}
                  />
                  <div
                    className="absolute -top-1 w-4 h-4 bg-[#2962FF] border-2 border-white rounded-full shadow transition-all -translate-x-1/2"
                    style={{ left: isGreen ? '70%' : '40%' }}
                  />
                </div>
              </div>

              {/* 52-Week Range */}
              <div className="mt-3">
                <div className="flex justify-between text-xs font-medium font-mono-numbers mb-1">
                  <span className="text-[#787B86]">
                    52W Low: {('low52w' in asset && asset.low52w) || (asset.price * 0.65).toFixed(2)}
                  </span>
                  <span className="text-[#787B86]">
                    52W High: {('high52w' in asset && asset.high52w) || (asset.price * 1.25).toFixed(2)}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-black/10 dark:bg-white/10 relative">
                  <div
                    className="absolute top-0 bottom-0 bg-emerald-500/70 rounded-full"
                    style={{ left: '10%', right: '10%' }}
                  />
                  <div
                    className="absolute -top-1 w-4 h-4 bg-emerald-600 border-2 border-white rounded-full shadow transition-all -translate-x-1/2"
                    style={{ left: '78%' }}
                  />
                </div>
              </div>
            </div>

            {/* Key Valuation & Fundamentals Grid */}
            <div
              className={`p-4 rounded-2xl border grid grid-cols-2 gap-3 text-xs ${
                darkMode ? 'bg-[#131722] border-[#2A2E39]' : 'bg-[#F8F9FD] border-[#E0E3EB]'
              }`}
            >
              <div>
                <span className="text-[#787B86] block text-[11px]">Market Cap</span>
                <span className={`font-bold font-mono-numbers ${darkMode ? 'text-white' : 'text-[#131722]'}`}>
                  {'marketCap' in asset ? asset.marketCap : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-[#787B86] block text-[11px]">Volume</span>
                <span className={`font-bold font-mono-numbers ${darkMode ? 'text-white' : 'text-[#131722]'}`}>
                  {'volume' in asset ? asset.volume : 'High'}
                </span>
              </div>
              <div>
                <span className="text-[#787B86] block text-[11px]">P/E Ratio</span>
                <span className={`font-bold font-mono-numbers ${darkMode ? 'text-white' : 'text-[#131722]'}`}>
                  {'peRatio' in asset && asset.peRatio ? asset.peRatio : '32.4'}
                </span>
              </div>
              <div>
                <span className="text-[#787B86] block text-[11px]">Beta</span>
                <span className={`font-bold font-mono-numbers ${darkMode ? 'text-white' : 'text-[#131722]'}`}>
                  {'beta' in asset && asset.beta ? asset.beta : '1.14'}
                </span>
              </div>
              <div>
                <span className="text-[#787B86] block text-[11px]">Dividend Yield</span>
                <span className={`font-bold font-mono-numbers ${darkMode ? 'text-white' : 'text-[#131722]'}`}>
                  {'dividendYield' in asset && asset.dividendYield ? asset.dividendYield : '0.52%'}
                </span>
              </div>
              <div>
                <span className="text-[#787B86] block text-[11px]">Category</span>
                <span className={`font-bold ${darkMode ? 'text-white' : 'text-[#131722]'}`}>
                  {asset.category}
                </span>
              </div>
            </div>
          </div>

          {/* Description & Sector Profile */}
          <div
            className={`p-5 rounded-2xl border ${
              darkMode ? 'bg-[#131722] border-[#2A2E39]' : 'bg-[#F8F9FD] border-[#E0E3EB]'
            }`}
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#787B86] mb-2 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              <span>About {asset.name}</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#787B86] leading-relaxed">
              {('description' in asset && asset.description) ||
                `${asset.name} (${asset.symbol}) is tracked on global financial markets, offering investors exposure to ${asset.category.toLowerCase()} performance and market liquidity.`}
            </p>
          </div>
        </div>

        {/* Paper Trade Modal Overlay */}
        {tradeModalOpen && (
          <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div
              className={`w-full max-w-sm rounded-2xl p-6 border shadow-2xl animate-in zoom-in-95 duration-150 ${
                darkMode ? 'bg-[#1E222D] border-[#2A2E39]' : 'bg-white border-[#E0E3EB]'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#2A2E39]/30">
                <h3 className="font-bold text-base">Paper Trade: {asset.symbol}</h3>
                <button
                  onClick={() => setTradeModalOpen(false)}
                  className="p-1 rounded text-[#787B86] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {orderExecuted ? (
                <div className="py-8 text-center">
                  <CheckCircle2 className="w-12 h-12 text-[#089981] mx-auto mb-2 animate-bounce" />
                  <p className="font-bold text-base text-[#089981]">Order Executed!</p>
                  <p className="text-xs text-[#787B86] mt-1">
                    {tradeType} {sharesCount} shares at ${asset.price.toFixed(2)}
                  </p>
                </div>
              ) : (
                <div className="mt-4 space-y-4">
                  {/* Buy / Sell Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setTradeType('BUY')}
                      className={`py-2 rounded-xl font-bold text-xs transition ${
                        tradeType === 'BUY'
                          ? 'bg-[#089981] text-white shadow-sm'
                          : 'bg-black/5 dark:bg-white/5 text-[#787B86]'
                      }`}
                    >
                      Buy / Long
                    </button>
                    <button
                      onClick={() => setTradeType('SELL')}
                      className={`py-2 rounded-xl font-bold text-xs transition ${
                        tradeType === 'SELL'
                          ? 'bg-[#F23645] text-white shadow-sm'
                          : 'bg-black/5 dark:bg-white/5 text-[#787B86]'
                      }`}
                    >
                      Sell / Short
                    </button>
                  </div>

                  {/* Quantity Input */}
                  <div>
                    <label className="text-xs text-[#787B86] block mb-1">Quantity (Units)</label>
                    <input
                      type="number"
                      min="1"
                      max="10000"
                      value={sharesCount}
                      onChange={(e) => setSharesCount(Math.max(1, parseInt(e.target.value) || 1))}
                      className={`w-full px-3 py-2 rounded-xl border font-mono-numbers text-sm ${
                        darkMode ? 'bg-[#131722] border-[#2A2E39] text-white' : 'bg-[#F0F3FA] border-[#E0E3EB]'
                      }`}
                    />
                  </div>

                  {/* Total Value */}
                  <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 flex justify-between items-center text-xs">
                    <span className="text-[#787B86]">Estimated Cost:</span>
                    <span className="font-bold font-mono-numbers text-sm">
                      ${(sharesCount * asset.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  {/* Submit Order */}
                  <button
                    onClick={handleExecuteTrade}
                    className={`w-full py-2.5 rounded-xl font-bold text-sm text-white transition active:scale-95 shadow-md ${
                      tradeType === 'BUY' ? 'bg-[#089981] hover:bg-[#078570]' : 'bg-[#F23645] hover:bg-[#D32F2F]'
                    }`}
                  >
                    Place Market {tradeType} Order
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
