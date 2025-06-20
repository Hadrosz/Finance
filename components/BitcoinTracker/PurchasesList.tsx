'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BitcoinPurchase } from '@/types/bitcoin';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Trash2, TrendingUp, TrendingDown } from 'lucide-react';

interface PurchasesListProps {
  purchases: BitcoinPurchase[];
  currentBitcoinPrice: number;
  currentUSDCOPRate: number;
  onDeletePurchase: (id: string) => void;
}

export function PurchasesList({ 
  purchases, 
  currentBitcoinPrice, 
  currentUSDCOPRate, 
  onDeletePurchase 
}: PurchasesListProps) {
  const calculatePurchasePerformance = (purchase: BitcoinPurchase) => {
    const currentValueUSD = purchase.bitcoinAmount * currentBitcoinPrice;
    const currentValueCOP = currentValueUSD * currentUSDCOPRate;
    const gainLossCOP = currentValueCOP - purchase.amountCOP;
    const gainLossPercentage = (gainLossCOP / purchase.amountCOP) * 100;

    return {
      currentValueCOP,
      gainLossCOP,
      gainLossPercentage,
    };
  };

  if (purchases.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No hay compras registradas. Agrega tu primera compra de Bitcoin.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {purchases.map((purchase) => {
        const performance = calculatePurchasePerformance(purchase);
        const isPositive = performance.gainLossCOP >= 0;

        return (
          <Card key={purchase.id} className="transition-all hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {formatDate(purchase.date)}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeletePurchase(purchase.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Invertido</p>
                  <p className="font-semibold">{formatCurrency(purchase.amountCOP, 'COP')}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Bitcoin Comprado</p>
                  <p className="font-semibold">{purchase.bitcoinAmount.toFixed(8)} BTC</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Precio BTC (USD)</p>
                  <p className="font-semibold">${purchase.bitcoinPrice.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Tasa USD/COP</p>
                  <p className="font-semibold">${purchase.usdCopRate.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t">
                <div>
                  <p className="text-muted-foreground text-sm">Valor Actual</p>
                  <p className="font-semibold text-lg">
                    {formatCurrency(performance.currentValueCOP, 'COP')}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Ganancia/Pérdida</p>
                  <p className={`font-semibold text-lg flex items-center gap-1 ${
                    isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    {formatCurrency(Math.abs(performance.gainLossCOP), 'COP')}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Porcentaje</p>
                  <p className={`font-semibold text-lg ${
                    isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {isPositive ? '+' : ''}{performance.gainLossPercentage.toFixed(2)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}