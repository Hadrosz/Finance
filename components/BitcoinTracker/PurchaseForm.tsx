"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BitcoinPurchase } from "@/types/bitcoin";
import {
  fetchHistoricalBitcoinPrice,
  fetchHistoricalUSDCOPRate,
} from "@/lib/api";
import { PlusCircle, Clock, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PurchaseFormProps {
  onAddPurchase: (purchase: BitcoinPurchase) => void;
  currentBitcoinPrice: number;
  currentUSDCOPRate: number;
}

export function PurchaseForm({
  onAddPurchase,
  currentBitcoinPrice,
  currentUSDCOPRate,
}: PurchaseFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 16),
    amountCOP: "",
    bitcoinPrice: currentBitcoinPrice.toString(),
    usdCopRate: currentUSDCOPRate.toString(),
  });
  const [loadingHistoricalData, setLoadingHistoricalData] = useState(false);
  const [hasAutoFetched, setHasAutoFetched] = useState(false);

  // Auto-fetch historical data when date changes
  useEffect(() => {
    const fetchHistoricalData = async () => {
      if (!formData.date) return;

      const selectedDate = new Date(formData.date);
      const now = new Date();
      const timeDiff = now.getTime() - selectedDate.getTime();
      const daysDiff = timeDiff / (1000 * 3600 * 24);

      // Only fetch historical data if the date is more than 1 day ago
      if (daysDiff > 1) {
        setLoadingHistoricalData(true);
        setHasAutoFetched(true);

        try {
          const [historicalBitcoinPrice, historicalUSDCOPRate] =
            await Promise.all([
              fetchHistoricalBitcoinPrice(formData.date),
              fetchHistoricalUSDCOPRate(formData.date),
            ]);

          setFormData((prev) => ({
            ...prev,
            bitcoinPrice: historicalBitcoinPrice.toString(),
            usdCopRate: historicalUSDCOPRate.toString(),
          }));

          toast({
            title: "Datos históricos cargados",
            description: `Precio BTC: $${historicalBitcoinPrice.toLocaleString()} USD | Tasa USD/COP: $${historicalUSDCOPRate.toFixed(
              2
            )}`,
          });
        } catch (error) {
          console.error("Error fetching historical data:", error);
          toast({
            title: "Error al cargar datos históricos",
            description:
              "Se mantuvieron los valores actuales. Puedes editarlos manualmente.",
            variant: "destructive",
          });
        } finally {
          setLoadingHistoricalData(false);
        }
      } else {
        // Use current prices for recent dates
        setFormData((prev) => ({
          ...prev,
          bitcoinPrice: currentBitcoinPrice.toString(),
          usdCopRate: currentUSDCOPRate.toString(),
        }));
        setHasAutoFetched(false);
      }
    };

    const timeoutId = setTimeout(fetchHistoricalData, 500); // Debounce
    return () => clearTimeout(timeoutId);
  }, [formData.date, currentBitcoinPrice, currentUSDCOPRate, toast]);

  const handleManualRefresh = async () => {
    if (!formData.date) return;

    setLoadingHistoricalData(true);

    try {
      const [historicalBitcoinPrice, historicalUSDCOPRate] = await Promise.all([
        fetchHistoricalBitcoinPrice(formData.date),
        fetchHistoricalUSDCOPRate(formData.date),
      ]);

      setFormData((prev) => ({
        ...prev,
        bitcoinPrice: historicalBitcoinPrice.toString(),
        usdCopRate: historicalUSDCOPRate.toString(),
      }));

      toast({
        title: "Datos actualizados",
        description: `Precio BTC: $${historicalBitcoinPrice.toLocaleString()} USD | Tasa USD/COP: $${historicalUSDCOPRate.toFixed(
          2
        )}`,
      });
    } catch (error) {
      console.error("Error fetching historical data:", error);
      toast({
        title: "Error al actualizar datos",
        description: "No se pudieron obtener los datos históricos.",
        variant: "destructive",
      });
    } finally {
      setLoadingHistoricalData(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const amountCOP = parseFloat(formData.amountCOP);
    const bitcoinPrice = parseFloat(formData.bitcoinPrice);
    const usdCopRate = parseFloat(formData.usdCopRate);

    if (!amountCOP || !bitcoinPrice || !usdCopRate) {
      toast({
        title: "Error en el formulario",
        description: "Por favor completa todos los campos requeridos.",
        variant: "destructive",
      });
      return;
    }

    const amountUSD = amountCOP / usdCopRate;
    const bitcoinAmount = amountUSD / bitcoinPrice;

    const purchase: BitcoinPurchase = {
      id: Date.now().toString(),
      date: formData.date,
      amountCOP,
      bitcoinPrice,
      usdCopRate,
      bitcoinAmount,
    };

    onAddPurchase(purchase);
    setFormData({
      date: new Date().toISOString().slice(0, 16),
      amountCOP: "",
      bitcoinPrice: currentBitcoinPrice.toString(),
      usdCopRate: currentUSDCOPRate.toString(),
    });
    setHasAutoFetched(false);

    toast({
      title: "Compra registrada",
      description: `Se registró la compra de ${bitcoinAmount.toFixed(8)} BTC`,
    });
  };

  const selectedDate = new Date(formData.date);
  const now = new Date();
  const isHistoricalDate =
    (now.getTime() - selectedDate.getTime()) / (1000 * 3600 * 24) > 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlusCircle className="h-5 w-5 text-orange-500" />
          Registrar Nueva Compra
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start justify-start">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Fecha y Hora de la Compra
              </Label>
              <Input
                id="date"
                type="datetime-local"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
              {isHistoricalDate && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Se cargarán automáticamente los precios históricos
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Monto Invertido (COP)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Ej: 100000"
                value={formData.amountCOP}
                onChange={(e) =>
                  setFormData({ ...formData, amountCOP: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="bitcoinPrice">Precio Bitcoin (USD)</Label>
                {isHistoricalDate && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleManualRefresh}
                    disabled={loadingHistoricalData}
                    className="h-6 px-2 text-xs"
                  >
                    <RefreshCw
                      className={`h-3 w-3 mr-1 ${
                        loadingHistoricalData ? "animate-spin" : ""
                      }`}
                    />
                    Actualizar
                  </Button>
                )}
              </div>
              <Input
                id="bitcoinPrice"
                type="number"
                step="0.01"
                value={formData.bitcoinPrice}
                onChange={(e) =>
                  setFormData({ ...formData, bitcoinPrice: e.target.value })
                }
                required
                disabled={loadingHistoricalData}
              />
              {loadingHistoricalData && (
                <p className="text-xs text-muted-foreground">
                  Cargando precio histórico...
                </p>
              )}
            </div>
          </div>

          {hasAutoFetched && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                ✅ Se cargaron automáticamente los precios históricos para la
                fecha seleccionada. Puedes editarlos manualmente si es
                necesario.
              </p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600"
            disabled={loadingHistoricalData}
          >
            {loadingHistoricalData ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Cargando datos históricos...
              </>
            ) : (
              "Agregar Compra"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
