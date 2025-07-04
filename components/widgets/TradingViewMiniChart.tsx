"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bitcoin } from "lucide-react";

interface TradingViewMiniChartProps {
  symbol?: string;
  height?: number;
}

export function TradingViewMiniChart({
  symbol = "BITSTAMP:BTCUSD",
  height = 220,
}: TradingViewMiniChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!containerRef.current || !mounted) return;

    // Clear any existing content
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: symbol,
      width: "100%",
      height: height,
      locale: "es",
      dateRange: "1D",
      colorTheme: resolvedTheme === "dark" ? "dark" : "light",
      trendLineColor: "rgba(251, 146, 60, 1)",
      underLineColor: "rgba(251, 146, 60, 0.3)",
      underLineBottomColor: "rgba(251, 146, 60, 0)",
      isTransparent: false,
      autosize: true,
      largeChartUrl: "",
      chartOnly: false,
      noTimeScale: false,
    });

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [symbol, resolvedTheme, height, mounted]);

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Bitcoin className="h-4 w-4 text-orange-500" />
          Bitcoin - Vista Rápida
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
