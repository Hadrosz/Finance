export interface BitcoinPurchase {
  id: string;
  date: string;
  amountCOP: number;
  bitcoinPrice: number; // Price in USD at time of purchase
  usdCopRate: number; // USD/COP rate at time of purchase
  bitcoinAmount: number; // Amount of Bitcoin purchased
}

export interface MarketData {
  bitcoinPriceUSD: number;
  usdCopRate: number;
  lastUpdated: string;
}

export interface InvestmentSummary {
  totalInvestedCOP: number;
  currentValueCOP: number;
  totalGainLossCOP: number;
  totalGainLossPercentage: number;
  totalBitcoinAmount: number;
}