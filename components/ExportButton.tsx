"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, Table } from "lucide-react";
import jsPDF from "jspdf";
import type { Transaction } from "@/lib/database";

interface ExportButtonProps {
  transactions: Transaction[];
}

export function ExportButton({ transactions }: ExportButtonProps) {
  const [loading, setLoading] = useState(false);

  const exportToCSV = () => {
    setLoading(true);

    const headers = ["Fecha", "Título", "Tipo", "Categoría", "Monto"];
    const csvContent = [
      headers.join(","),
      ...transactions.map((t) =>
        [
          t.date,
          t.title,
          t.type === "income" ? "Ingreso" : "Gasto",
          t.category_name || "Sin categoría",
          t.type_payment || "Sin tipo de pago",
          t.amount.toLocaleString("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0, // Puedes ajustarlo según necesidad
          }),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `transacciones_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    setLoading(false);
  };

  const exportToPDF = () => {
    setLoading(true);

    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.text("Reporte de Transacciones", 20, 20);

    // Date
    doc.setFontSize(12);
    doc.text(`Generado el: ${new Date().toLocaleDateString("es-ES")}`, 20, 30);

    // Summary
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpenses;

    doc.text(`Total Ingresos: $${totalIncome.toFixed(2)}`, 20, 45);
    doc.text(`Total Gastos: $${totalExpenses.toFixed(2)}`, 20, 55);
    doc.text(`Balance: $${balance.toFixed(2)}`, 20, 65);

    // Transactions table
    let y = 85;
    doc.setFontSize(10);
    doc.text("Fecha", 20, y);
    doc.text("Título", 60, y);
    doc.text("Tipo", 120, y);
    doc.text("Tipo de Pago", 120, y);
    doc.text("Monto", 160, y);

    y += 10;

    transactions.forEach((transaction) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      doc.text(transaction.date, 20, y);
      doc.text(transaction.title.substring(0, 20), 60, y);
      doc.text(transaction.type === "income" ? "Ingreso" : "Gasto", 120, y);
      doc.text(transaction.type_payment || "Sin tipo de pago", 120, y);
      doc.text(`$${transaction.amount.toFixed(2)}`, 160, y);

      y += 8;
    });

    doc.save(`transacciones_${new Date().toISOString().split("T")[0]}.pdf`);
    setLoading(false);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={loading}>
          <Download className="h-4 w-4 mr-2" />
          {loading ? "Exportando..." : "Exportar"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportToCSV}>
          <Table className="h-4 w-4 mr-2" />
          Exportar CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToPDF}>
          <FileText className="h-4 w-4 mr-2" />
          Exportar PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
