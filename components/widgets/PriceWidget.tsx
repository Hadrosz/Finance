'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { Bitcoin, DollarSign, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PriceWidgetProps {
  bitcoinPrice: number;
  usdCopRate: number;
  loading: boolean;
  onRefresh: () => void;
  lastUpdated: string;
}

export function PriceWidget({ 
  bitcoinPrice, 
  usdCopRate, 
  loading, 
  onRefresh, 
  lastUpdated 
}: PriceWidgetProps) {
  const formatLastUpdated = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('es-CO');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Precio Bitcoin</CardTitle>
          <Bitcoin className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${bitcoinPrice.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">USD</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">USD/COP</CardTitle>
          <DollarSign className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${usdCopRate.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">COP por USD</p>
        </CardContent>
      </Card>
      
      <div className="md:col-span-2 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Última actualización: {formatLastUpdated(lastUpdated)}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>
    </div>
  );
}