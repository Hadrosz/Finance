import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (!id) {
    return NextResponse.json({ message: "ID inválido" }, { status: 400 });
  }
  const result = db
    .prepare("DELETE FROM bitcoin_purchases WHERE id = ?")
    .run(id);
  if (result.changes === 0) {
    return NextResponse.json({ message: "No encontrado" }, { status: 404 });
  }
  return new Response(null, { status: 204 });
}
