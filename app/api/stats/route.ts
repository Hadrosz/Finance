import { NextRequest, NextResponse } from 'next/server';
import { getMonthlyStats, getYearlyData } from '@/lib/transactions';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());
    const month = parseInt(searchParams.get('month') || (new Date().getMonth() + 1).toString());

    const monthlyStats = getMonthlyStats(year, month);
    const yearlyData = getYearlyData(year);

    return NextResponse.json({
      monthlyStats,
      yearlyData,
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error al obtener estadísticas' },
      { status: 500 }
    );
  }
}