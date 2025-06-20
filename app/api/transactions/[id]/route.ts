import { NextRequest, NextResponse } from 'next/server';
import { updateTransaction, deleteTransaction } from '@/lib/transactions';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const transaction = await request.json();
    const updatedTransaction = updateTransaction(id, transaction);
    return NextResponse.json(updatedTransaction);
  } catch (error) {
    return NextResponse.json(
      { message: 'Error al actualizar transacción' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    deleteTransaction(id);
    return NextResponse.json({ message: 'Transacción eliminada' });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error al eliminar transacción' },
      { status: 500 }
    );
  }
}