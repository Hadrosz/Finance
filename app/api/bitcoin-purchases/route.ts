import { NextRequest, NextResponse } from "next/server";
import { addBitcoinPurchase, getBitcoinPurchases } from "@/lib/transactions";

export async function GET() {
  try {
    const purchases = getBitcoinPurchases();
    return NextResponse.json(purchases);
  } catch (error) {
    return NextResponse.json(
      { message: "Error al obtener compras de bitcoin" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { purchase_time, invested_value, bitcoin_price, usd_cop_rate } =
      await request.json();
    if (!purchase_time || !invested_value || !bitcoin_price || !usd_cop_rate) {
      return NextResponse.json(
        { message: "Faltan campos requeridos" },
        { status: 400 }
      );
    }
    const purchase = addBitcoinPurchase({
      purchase_time,
      invested_value,
      bitcoin_price,
      usd_cop_rate,
    });
    return NextResponse.json(purchase, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error al registrar compra de bitcoin" },
      { status: 500 }
    );
  }
}
