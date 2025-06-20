"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Target } from "lucide-react";
import type { Transaction } from "@/lib/database";

interface StatsCardsProps {
  transactions: Transaction[];
}

export function StatsCards({ transactions }: StatsCardsProps) {
  // Calculate current month stats
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

  const balance = totalIncome - totalExpenses;

  // Top spending category
  const categorySpending = currentMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      const category = t.category_name || "Sin categoría";
      acc[category] = (acc[category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const topCategory = Object.entries(categorySpending).sort(
    ([, a], [, b]) => b - a
  )[0];

  const stats = [
    {
      title: "Ingresos del Mes",
      value: `${totalIncome.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0, // Puedes ajustarlo según necesidad
      })}`,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      title: "Gastos del Mes",
      value: `${totalExpenses.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0, // Puedes ajustarlo según necesidad
      })}`,
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-100",
      change: "-8%",
      changeType: "negative" as const,
    },
    {
      title: "Balance Mensual",
      value: `${balance.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0, // Puedes ajustarlo según necesidad
      })}`,
      icon: DollarSign,
      color: balance >= 0 ? "text-green-600" : "text-red-600",
      bgColor: balance >= 0 ? "bg-green-100" : "bg-red-100",
      change: balance >= 0 ? "+" : "",
      changeType: balance >= 0 ? ("positive" as const) : ("negative" as const),
    },
    {
      title: "Mayor Gasto",
      value: topCategory ? topCategory[0] : "N/A",
      subtitle: topCategory
        ? `${topCategory[1].toLocaleString("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0, // Puedes ajustarlo según necesidad
          })}`
        : "",
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      change: "",
      changeType: "neutral" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`p-2 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-1">
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.subtitle && (
                <div className="text-sm text-muted-foreground">
                  {stat.subtitle}
                </div>
              )}
              {stat.change && (
                <div className="flex items-center space-x-1">
                  <Badge
                    variant="secondary"
                    className={`text-xs ${
                      stat.changeType === "positive"
                        ? "bg-green-100 text-green-800"
                        : stat.changeType === "negative"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {stat.change}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    vs mes anterior
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
