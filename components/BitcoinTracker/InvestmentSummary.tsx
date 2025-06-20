'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BitcoinPurchase, InvestmentSummary } from '@/types/bitcoin';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, TrendingDown, Wallet, Bitcoin } from 'lucide-react';

interface InvestmentSummaryProps {
  purchases: BitcoinPurchase[];
  currentBitcoinPrice: number;
  currentUSDCOPRate: number;
}

export function InvestmentSummaryComponent({ 
  purchases, 
  currentBitcoinPrice, 
  currentUSDCOPRate 
}: InvestmentSummaryProps) {
  const calculateSummary = (): InvestmentSummary => {
    const totalInvestedCOP = purchases.reduce((sum, purchase) => sum + purchase.amountCOP, 0);
    const totalBitcoinAmount = purchases.reduce((sum, purchase) => sum + purchase.bitcoinAmount, 0);
    const currentValueUSD = totalBitcoinAmount * currentBitcoinPrice;
    const currentValueCOP = currentValueUSD * currentUSDCOPRate;
    const totalGainLossCOP = currentValueCOP - totalInvestedCOP;
    const totalGainLossPercentage = totalInvestedCOP > 0 ? (totalGainLossCOP / totalInvestedCOP) * 100 : 0;

    return {
      totalInvestedCOP,
      currentValueCOP,
      totalGainLossCOP,
      totalGainLossPercentage,
      totalBitcoinAmount,
    };
  };

  const summary = calculateSummary();
  const isPositive = summary.totalGainLossCOP >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Invertido</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(summary.totalInvestedCOP, 'COP')}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Bitcoin Total</CardTitle>
          <Bitcoin className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {summary.totalBitcoinAmount.toFixed(8)} BTC
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Valor Actual</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(summary.currentValueCOP, 'COP')}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ganancia/Pérdida</CardTitle>
          {isPositive ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-600" />
          )}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{formatCurrency(summary.totalGainLossCOP, 'COP')}
          </div>
          <p className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{summary.totalGainLossPercentage.toFixed(2)}%
          </p>
        </CardContent>
      </Card>
    </div>
  );
}