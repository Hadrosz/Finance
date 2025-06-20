"use client";

import { useState, useEffect } from "react";
import { BitcoinPurchase } from "@/types/bitcoin";
import { useBitcoinData } from "@/hooks/useBitcoinData";
import { PurchaseForm } from "@/components/BitcoinTracker/PurchaseForm";
import { PurchasesList } from "@/components/BitcoinTracker/PurchasesList";
import { InvestmentSummaryComponent } from "@/components/BitcoinTracker/InvestmentSummary";
import { PriceWidget } from "@/components/widgets/PriceWidget";
import { CurrencyConverter } from "@/components/widgets/CurrencyConverter";
import { TradingViewChart } from "@/components/widgets/TradingViewChart";
import { TradingViewMiniChart } from "@/components/widgets/TradingViewMiniChart";
import { MarketOverview } from "@/components/widgets/MarketOverview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bitcoin,
  TrendingUp,
  Calculator,
  List,
  BarChart3,
  Activity,
} from "lucide-react";
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  const { marketData, loading, updateMarketData } = useBitcoinData();
  const [purchases, setPurchases] = useState<BitcoinPurchase[]>([]);
  const [purchasesLoading, setPurchasesLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

  // Fetch purchases from backend
  const fetchPurchases = async () => {
    setPurchasesLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/bitcoin-purchases`);
      const data = await res.json();
      setPurchases(
        Array.isArray(data)
          ? data.map((p) => ({
              id: p.id.toString(),
              date: p.purchase_time,
              amountCOP: p.invested_value,
              bitcoinPrice: p.bitcoin_price,
              usdCopRate: p.usd_cop_rate,
              bitcoinAmount:
                p.invested_value / p.usd_cop_rate / p.bitcoin_price,
            }))
          : []
      );
    } catch {
      setPurchases([]);
    } finally {
      setPurchasesLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
    // eslint-disable-next-line
  }, []);

  const handleAddPurchase = async (purchase: BitcoinPurchase) => {
    await fetch(`${API_URL}/api/bitcoin-purchases`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        purchase_time: purchase.date,
        invested_value: purchase.amountCOP,
        bitcoin_price: purchase.bitcoinPrice,
        usd_cop_rate: purchase.usdCopRate,
      }),
    });
    fetchPurchases();
  };

  const handleDeletePurchase = async (id: string) => {
    await fetch(`${API_URL}/api/bitcoin-purchases/${id}`, { method: "DELETE" });
    fetchPurchases();
  };

  if (purchasesLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br  flex items-center justify-center">
        <div className="text-center">
          <Bitcoin className="h-12 w-12 text-orange-500 animate-pulse mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br ">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
            <Bitcoin className="h-10 w-10 text-orange-500" />
            Bitcoin Investment Tracker
          </h1>
          <p className="text-muted-foreground text-lg">
            Rastrea y analiza tus inversiones en Bitcoin en tiempo real
          </p>
        </div>

        <div className="space-y-8">
          {/* Market Data Widgets */}
          <div className="space-y-6">
            <PriceWidget
              bitcoinPrice={marketData.bitcoinPriceUSD}
              usdCopRate={marketData.usdCopRate}
              loading={loading}
              onRefresh={updateMarketData}
              lastUpdated={marketData.lastUpdated}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CurrencyConverter usdCopRate={marketData.usdCopRate} />
              <TradingViewMiniChart />
            </div>
          </div>

          {/* Investment Summary */}
          {purchases.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-green-600" />
                Resumen de Inversión
              </h2>
              <InvestmentSummaryComponent
                purchases={purchases}
                currentBitcoinPrice={marketData.bitcoinPriceUSD}
                currentUSDCOPRate={marketData.usdCopRate}
              />
            </div>
          )}

          {/* Main Content Tabs */}
          <Tabs defaultValue="add" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="add" className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Agregar Compra
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                Mis Compras ({purchases.length})
              </TabsTrigger>
              <TabsTrigger value="chart" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Gráfico BTC
              </TabsTrigger>
              <TabsTrigger value="market" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Mercado
              </TabsTrigger>
            </TabsList>

            <TabsContent value="add" className="space-y-6">
              <PurchaseForm
                onAddPurchase={handleAddPurchase}
                currentBitcoinPrice={marketData.bitcoinPriceUSD}
                currentUSDCOPRate={marketData.usdCopRate}
              />
            </TabsContent>

            <TabsContent value="list" className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <List className="h-6 w-6 text-blue-600" />
                  Historial de Compras
                </h2>
                <PurchasesList
                  purchases={purchases}
                  currentBitcoinPrice={marketData.bitcoinPriceUSD}
                  currentUSDCOPRate={marketData.usdCopRate}
                  onDeletePurchase={handleDeletePurchase}
                />
              </div>
            </TabsContent>

            <TabsContent value="chart" className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Activity className="h-6 w-6 text-orange-600" />
                  Análisis Técnico de Bitcoin
                </h2>
                <TradingViewChart height={500} />
              </div>
            </TabsContent>

            <TabsContent value="market" className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                  Resumen del Mercado Financiero
                </h2>
                <MarketOverview height={450} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
