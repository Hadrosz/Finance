import { NextRequest, NextResponse } from 'next/server';
import { updateCategory, deleteCategory } from '@/lib/transactions';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const { name, color } = await request.json();
    const updatedCategory = updateCategory(id, name, color);
    return NextResponse.json(updatedCategory);
  } catch (error) {
    return NextResponse.json(
      { message: 'Error al actualizar categoría' },
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
    deleteCategory(id);
    return NextResponse.json({ message: 'Categoría eliminada' });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error al eliminar categoría' },
      { status: 500 }
    );
  }
}