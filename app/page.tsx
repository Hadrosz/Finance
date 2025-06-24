"use client";

import { useEffect, useState } from "react";
import { StatsCards } from "@/components/StatsCards";
import { TransactionList } from "@/components/TransactionList";
import { ChartsView } from "@/components/ChartsView";
import { FilterPanel } from "@/components/FilterPanel";
import { ExportButton } from "@/components/ExportButton";
import { CategoryManager } from "@/components/CategoryManager";
import { TransactionForm } from "@/components/TransactionForm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, Calendar } from "lucide-react";
import Link from "next/link";
import type { Transaction, Category } from "@/lib/database";
import { InvestmentStats } from "@/components/widgets/InvestmentStats";
import { useBitcoinData } from "@/hooks/useBitcoinData";
import type { BitcoinPurchase } from "@/types/bitcoin";
import { PurchasesList } from "@/components/BitcoinTracker/PurchasesList";

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [bitcoinPurchases, setBitcoinPurchases] = useState<BitcoinPurchase[]>(
    []
  );
  const [bitcoinLoading, setBitcoinLoading] = useState(true);
  const { marketData, loading: marketLoading } = useBitcoinData();
  const [purchases, setPurchases] = useState<BitcoinPurchase[]>([]);
  const [purchasesLoading, setPurchasesLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
    fetchBitcoinPurchases();
    fetchPurchases();
    // eslint-disable-next-line
  }, [filters]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value as string);
      });
      const res = await fetch(`/api/transactions?${params}`);
      const data = await res.json();
      setTransactions(Array.isArray(data) ? data : []);
    } catch {
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      setCategories([]);
    }
  };

  const fetchBitcoinPurchases = async () => {
    setBitcoinLoading(true);
    try {
      const res = await fetch("/api/bitcoin-purchases");
      const data = await res.json();
      setBitcoinPurchases(
        Array.isArray(data)
          ? data.map((p: any) => ({
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
      setBitcoinPurchases([]);
    } finally {
      setBitcoinLoading(false);
    }
  };

  const fetchPurchases = async () => {
    setPurchasesLoading(true);
    try {
      const res = await fetch(`/api/bitcoin-purchases`);
      const data = await res.json();
      setPurchases(
        Array.isArray(data)
          ? data.map((p: any) => ({
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

  // Calcular ingresos y gastos del mes actual
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const currentMonthTransactions = transactions.filter((t) => {
    const date = new Date(t.date);
    return (
      date.getMonth() === currentMonth && date.getFullYear() === currentYear
    );
  });
  const totalIncome = currentMonthTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = currentMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  // Calcular stats de bitcoin
  let bitcoinTotal = 0;
  let bitcoinGainLoss = 0;
  let bitcoinGainLossPercentage = 0;
  if (
    bitcoinPurchases.length > 0 &&
    marketData.bitcoinPriceUSD &&
    marketData.usdCopRate
  ) {
    const totalInvestedCOP = bitcoinPurchases.reduce(
      (sum, p) => sum + p.amountCOP,
      0
    );
    bitcoinTotal = bitcoinPurchases.reduce(
      (sum, p) => sum + p.bitcoinAmount,
      0
    );
    const currentValueUSD = bitcoinTotal * marketData.bitcoinPriceUSD;
    const currentValueCOP = currentValueUSD * marketData.usdCopRate;
    bitcoinGainLoss = currentValueCOP - totalInvestedCOP;
    bitcoinGainLossPercentage =
      totalInvestedCOP > 0 ? (bitcoinGainLoss / totalInvestedCOP) * 100 : 0;
  }

  const handleTransactionSaved = () => {
    fetchTransactions();
    setShowForm(false);
    setEditingTransaction(null);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleDeleteTransaction = async (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta transacción?")) {
      await fetch(`/api/transactions/${id}`, { method: "DELETE" });
      fetchTransactions();
    }
  };
  const handleCategoryChange = () => {
    fetchCategories();
    fetchTransactions();
  };

  const handleDeletePurchase = async (id: string) => {
    await fetch(`/api/bitcoin-purchases/${id}`, { method: "DELETE" });
    fetchPurchases();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              Resumen de tus finanzas personales
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={() => {
                setShowForm(true);
                setEditingTransaction(null);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Transacción
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <InvestmentStats
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          bitcoinTotal={bitcoinTotal}
          bitcoinGainLoss={bitcoinGainLoss}
          bitcoinGainLossPercentage={bitcoinGainLossPercentage}
        />

        {/* Filtros y Exportar transacciones recientes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Acciones rápidas */}
          <PurchasesList
            purchases={purchases.slice(0, 3)}
            currentBitcoinPrice={marketData.bitcoinPriceUSD}
            currentUSDCOPRate={marketData.usdCopRate}
            onDeletePurchase={handleDeletePurchase}
          />
          {/* Transacciones recientes */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Transacciones Recientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length > 0 ? (
                <TransactionList
                  transactions={transactions.slice(0, 6)}
                  onEdit={handleEditTransaction}
                  onDelete={handleDeleteTransaction}
                />
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <p>No hay transacciones registradas</p>
                  <Button
                    className="mt-3"
                    size="sm"
                    onClick={() => setShowForm(true)}
                  >
                    Agregar Primera Transacción
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-3">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Acciones Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  setShowForm(true);
                  setEditingTransaction(null);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Transacción
              </Button>
              <Link href="/invest" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Registrar Inversión BTC
                </Button>
              </Link>
              <Link href="#" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Ver Declaración de Renta
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de transacción */}
      {showForm && (
        <TransactionForm
          transaction={editingTransaction}
          categories={categories}
          onClose={() => {
            setShowForm(false);
            setEditingTransaction(null);
          }}
          onSave={handleTransactionSaved}
        />
      )}
    </div>
  );
}
