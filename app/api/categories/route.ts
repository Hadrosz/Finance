import { NextRequest, NextResponse } from 'next/server';
import { getCategories, addCategory } from '@/lib/transactions';

export async function GET() {
  try {
    const categories = getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { message: 'Error al obtener categorías' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, color } = await request.json();
    const newCategory = addCategory(name, color);
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error al crear categoría' },
      { status: 500 }
    );
  }
}