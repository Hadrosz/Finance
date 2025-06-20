import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Bitcoin } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface InvestmentStatsProps {
  totalIncome: number;
  totalExpenses: number;
  bitcoinTotal: number;
  bitcoinGainLoss: number;
  bitcoinGainLossPercentage: number;
}

export function InvestmentStats({
  totalIncome,
  totalExpenses,
  bitcoinTotal,
  bitcoinGainLoss,
  bitcoinGainLossPercentage,
}: InvestmentStatsProps) {
  const isPositive = bitcoinGainLoss >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Ingresos del mes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Ingresos del Mes
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(totalIncome, "COP")}
          </div>
        </CardContent>
      </Card>

      {/* Gastos del mes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Gastos del Mes</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(totalExpenses, "COP")}
          </div>
        </CardContent>
      </Card>

      {/* Bitcoin total */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Bitcoin Total</CardTitle>
          <Bitcoin className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {bitcoinTotal.toFixed(8)} BTC
          </div>
        </CardContent>
      </Card>

      {/* Ganancia/Pérdida (Bitcoin) */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Ganancia/Pérdida (Bitcoin)
          </CardTitle>
          {isPositive ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-600" />
          )}
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {isPositive ? "+" : ""}
            {formatCurrency(bitcoinGainLoss, "COP")}
          </div>
          <p
            className={`text-xs ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {isPositive ? "+" : ""}
            {bitcoinGainLossPercentage.toFixed(2)}%
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
