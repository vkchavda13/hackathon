import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(bookings);
  } catch (error: any) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = crypto.randomUUID();

    const start = new Date(body.startDate);
    const end = new Date(body.endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json({ error: 'Invalid start or end date' }, { status: 400 });
    }

    if (start >= end) {
      return NextResponse.json({ error: 'Start date must be before end date' }, { status: 400 });
    }

    // 1. Fetch asset details
    const asset = await prisma.asset.findUnique({
      where: { id: body.assetId },
    });
    if (!asset) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }

    // 2. Overlap Validation
    const overlap = await prisma.booking.findFirst({
      where: {
        assetId: body.assetId,
        status: { in: ['approved', 'pending', 'active'] },
        AND: [
          { startDate: { lt: end } },
          { endDate: { gt: start } }
        ]
      }
    });

    if (overlap) {
      return NextResponse.json({
        error: `Time slot conflict: Overlaps with an existing booking from ${new Date(overlap.startDate).toLocaleString()} to ${new Date(overlap.endDate).toLocaleString()}`
      }, { status: 400 });
    }

    // 3. Fallback to first available employee for request attributes (mocking auth session)
    let emp = await prisma.employee.findFirst();
    const requestedById = emp?.id || 'system';
    const requestedByName = emp ? `${emp.firstName} ${emp.lastName}` : 'System Admin';
    const departmentName = emp?.departmentName || 'IT Support';

    const booking = await prisma.booking.create({
      data: {
        id,
        assetId: body.assetId,
        assetTag: asset.assetTag,
        assetName: asset.name,
        requestedById,
        requestedByName,
        departmentName,
        status: 'pending',
        startDate: start,
        endDate: end,
        purpose: body.purpose,
        notes: body.notes || '',
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error: any) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
