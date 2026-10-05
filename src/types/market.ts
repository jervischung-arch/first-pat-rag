export type MarketCategory =
  | 'US stocks'
  | 'World stocks'
  | 'Crypto'
  | 'Futures'
  | 'Forex'
  | 'Government bonds'
  | 'Corporate bonds'
  | 'ETFs'
  | 'Economy';

export type MoverTab = 'Trending stocks' | 'Most active' | 'Top gainers' | 'Top losers';

export interface SparklinePoint {
  x: number;
  y: number;
}

export interface ChartDataPoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketAsset {
  symbol: string;
  name: string;
  category: MarketCategory;
  price: number;
  changePercent: number;
  changeAmount: number;
  marketCap: string;
  volume: string;
  currency: string;
  sparkline: number[]; // 8-12 normalized values or trend
  color?: string;
  bgColor?: string;
  badgeText?: string;
  exchange?: string;
  sector?: string;
  industry?: string;
  high52w?: number;
  low52w?: number;
  dayHigh?: number;
  dayLow?: number;
  open?: number;
  prevClose?: number;
  peRatio?: number;
  eps?: number;
  dividendYield?: string;
  beta?: number;
  description?: string;
  technicalSignal?: 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';
  technicalScore?: number; // -100 to 100
}

export interface IndexCardData {
  id: string;
  name: string;
  symbol: string;
  badge: string;
  badgeColor: string;
  price: number;
  changeAmount: number;
  changePercent: number;
  currency: string;
  sparklinePath: string;
  isPositive: boolean;
  category: MarketCategory;
  high52w?: number;
  low52w?: number;
  dayHigh?: number;
  dayLow?: number;
  description?: string;
}

export interface PaperTradePosition {
  symbol: string;
  name: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  type: 'BUY' | 'SELL';
  timestamp: string;
}
