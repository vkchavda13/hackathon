import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [total, available, allocated, maintenance, retired] = await Promise.all([
      prisma.asset.count(),
      prisma.asset.count({ where: { status: 'available' } }),
      prisma.asset.count({ where: { status: 'allocated' } }),
      prisma.asset.count({ where: { status: 'maintenance' } }),
      prisma.asset.count({ where: { status: { in: ['retired', 'disposed'] } } }),
    ]);

    return NextResponse.json({
      total,
      available,
      allocated,
      maintenance,
      retired,
    });
  } catch (error: any) {
    console.error('Error fetching asset stats:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
