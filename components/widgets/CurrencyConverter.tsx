'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CurrencyConverterProps {
  usdCopRate: number;
}

export function CurrencyConverter({ usdCopRate }: CurrencyConverterProps) {
  const [usdAmount, setUsdAmount] = useState('');
  const [copAmount, setCopAmount] = useState('');

  const handleUsdChange = (value: string) => {
    setUsdAmount(value);
    const usd = parseFloat(value);
    if (!isNaN(usd)) {
      setCopAmount((usd * usdCopRate).toFixed(2));
    } else {
      setCopAmount('');
    }
  };

  const handleCopChange = (value: string) => {
    setCopAmount(value);
    const cop = parseFloat(value);
    if (!isNaN(cop)) {
      setUsdAmount((cop / usdCopRate).toFixed(2));
    } else {
      setUsdAmount('');
    }
  };

  const handleSwap = () => {
    const tempUsd = usdAmount;
    const tempCop = copAmount;
    setUsdAmount(tempCop);
    setCopAmount(tempUsd);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRightLeft className="h-5 w-5 text-blue-500" />
          Convertidor USD/COP
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="usd">Dólares (USD)</Label>
            <Input
              id="usd"
              type="number"
              placeholder="0.00"
              value={usdAmount}
              onChange={(e) => handleUsdChange(e.target.value)}
              step="0.01"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cop">Pesos Colombianos (COP)</Label>
            <Input
              id="cop"
              type="number"
              placeholder="0.00"
              value={copAmount}
              onChange={(e) => handleCopChange(e.target.value)}
              step="0.01"
            />
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSwap}
            className="flex items-center gap-2"
          >
            <ArrowRightLeft className="h-4 w-4" />
            Intercambiar
          </Button>
        </div>
        
        <div className="text-center text-sm text-muted-foreground">
          Tasa actual: 1 USD = ${usdCopRate.toFixed(2)} COP
        </div>
      </CardContent>
    </Card>
  );
}