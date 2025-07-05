"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  Plus,
  Calendar,
  Filter,
  Download,
  LogOut,
  Settings,
} from "lucide-react";
import { TransactionForm } from "./TransactionForm";
import { TransactionList } from "./TransactionList";
import { StatsCards } from "./StatsCards";
import { ChartsView } from "./ChartsView";
import { FilterPanel } from "./FilterPanel";
import { ExportButton } from "./ExportButton";
import { CategoryManager } from "./CategoryManager";
import type { Transaction, Category } from "@/lib/database";
import { useRouter } from "next/navigation";

export function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [filters, setFilters] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, [filters]);

  const fetchTransactions = async () => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value as string);
      });

      const response = await fetch(`/api/transactions?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Ensure data is always an array
      setTransactions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]); // Set empty array on error
    }
  };

  const handleLogout = async () => {
    try {
      // Call logout API to clear the cookie
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Clear the cookie on the client side as well
      document.cookie =
        "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      // Redirect to login page
      router.push("/auth/login");
    } catch (error) {
      console.error("Error during logout:", error);
      // Even if there's an error, try to redirect to login
      router.push("/auth/login");
    }
  };

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
      try {
        await fetch(`/api/transactions/${id}`, { method: "DELETE" });
        fetchTransactions();
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
    }
  };

  const handleCategoryChange = () => {
    fetchCategories();
    fetchTransactions(); // Refresh transactions to update category names
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Transacciones</h2>
            <p className="text-muted-foreground">
              Gestiona y analiza todas tus transacciones financieras
            </p>
          </div>
          <div className="flex space-x-2">
            <FilterPanel onFiltersChange={setFilters} categories={categories} />
            <ExportButton transactions={transactions} />
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
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="transactions">Transacciones</TabsTrigger>
            <TabsTrigger value="analytics">Análisis</TabsTrigger>
            <TabsTrigger value="categories">Categorías</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-6">
            <StatsCards transactions={transactions} />
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
              <ChartsView transactions={transactions} />
              <Card>
                <CardHeader>
                  <CardTitle>Transacciones Recientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <TransactionList
                    transactions={transactions.slice(0, 5)}
                    onEdit={handleEditTransaction}
                    onDelete={handleDeleteTransaction}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="transactions" className="space-y-6">
            <TransactionList
              transactions={transactions}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
            />
          </TabsContent>
          <TabsContent value="analytics" className="space-y-6">
            <ChartsView transactions={transactions} />
          </TabsContent>
          <TabsContent value="categories" className="space-y-6">
            <CategoryManager
              categories={categories}
              onCategoryChange={handleCategoryChange}
            />
          </TabsContent>
        </Tabs>
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
    </div>
  );
}
