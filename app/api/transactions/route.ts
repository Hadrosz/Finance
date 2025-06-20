import { NextRequest, NextResponse } from "next/server";
import { getTransactions, addTransaction } from "@/lib/transactions";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      category: searchParams.get("category") || undefined,
      type: searchParams.get("type") as "income" | "expense" | undefined,
      dateFrom: searchParams.get("dateFrom") || undefined,
      dateTo: searchParams.get("dateTo") || undefined,
      search: searchParams.get("search") || undefined,
      type_payment: searchParams.get("type_payment") as
        | "debit"
        | "credit"
        | undefined,
    };

    const transactions = getTransactions(filters);
    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json(
      { message: "Error al obtener transacciones" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const transaction = await request.json();
    const newTransaction = addTransaction(transaction);
    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error al crear transacción" },
      { status: 500 }
    );
  }
}
