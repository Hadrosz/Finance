"use client";

import { useState, useEffect } from "react";
import { MarketData } from "../types/bitcoin";
import { fetchBitcoinPrice, fetchUSDCOPRate } from "../lib/api";

export function useBitcoinData() {
  const [marketData, setMarketData] = useState<MarketData>({
    bitcoinPriceUSD: 0,
    usdCopRate: 0,
    lastUpdated: "",
  });
  const [loading, setLoading] = useState(true);
  const [lastValidMarketData, setLastValidMarketData] = useState<MarketData>({
    bitcoinPriceUSD: 0,
    usdCopRate: 0,
    lastUpdated: "",
  });

  const updateMarketData = async () => {
    try {
      const [bitcoinPrice, usdCopRate] = await Promise.all([
        fetchBitcoinPrice(),
        fetchUSDCOPRate(),
      ]);

      setMarketData((prev) => ({
        bitcoinPriceUSD:
          bitcoinPrice !== 0 ? bitcoinPrice : prev.bitcoinPriceUSD,
        usdCopRate: usdCopRate !== 0 ? usdCopRate : prev.usdCopRate,
        lastUpdated: new Date().toISOString(),
      }));

      if (bitcoinPrice !== 0 && usdCopRate !== 0) {
        setLastValidMarketData({
          bitcoinPriceUSD: bitcoinPrice,
          usdCopRate: usdCopRate,
          lastUpdated: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Error updating market data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updateMarketData();

    // Update every 30 seconds
    const interval = setInterval(updateMarketData, 30000);

    return () => clearInterval(interval);
  }, []);

  return { marketData, lastValidMarketData, loading, updateMarketData };
}
