'use client';

import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface TradingViewChartProps {
  symbol?: string;
  theme?: 'light' | 'dark';
  height?: number;
}

export function TradingViewChart({ 
  symbol = 'BITSTAMP:BTCUSD', 
  theme = 'light',
  height = 400 
}: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any existing content
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: symbol,
      interval: '15',
      timezone: 'America/Bogota',
      theme: theme,
      style: '1',
      locale: 'es',
      enable_publishing: false,
      backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 1)',
      gridColor: theme === 'light' ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.06)',
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      container_id: 'tradingview_chart',
      studies: [
        'Volume@tv-basicstudies',
        'RSI@tv-basicstudies'
      ],
      show_popup_button: true,
      popup_width: '1000',
      popup_height: '650',
      no_referral_id: true,
      withdateranges: true,
      range: '1D',
      allow_symbol_change: true,
      details: true,
      hotlist: true,
      calendar: true,
      support_host: 'https://www.tradingview.com'
    });

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol, theme]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-orange-500" />
          Gráfico Bitcoin en Tiempo Real
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div 
          ref={containerRef}
          style={{ height: `${height}px` }}
          className="w-full rounded-b-lg overflow-hidden"
        />
      </CardContent>
    </Card>
  );
}