import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function GET() {
  try {
    const maintenanceRecords = await prisma.maintenance.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(maintenanceRecords);
  } catch (error: any) {
    console.error('Error fetching maintenance records:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = crypto.randomUUID();

    // 1. Fetch asset details
    const asset = await prisma.asset.findUnique({
      where: { id: body.assetId },
    });
    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    // 2. Fetch technician details if assigned
    let assignedToName = null;
    if (body.assignedToId) {
      const technician = await prisma.employee.findUnique({
        where: { id: body.assignedToId },
      });
      if (technician) {
        assignedToName = `${technician.firstName} ${technician.lastName}`;
      }
    }

    // 3. Create maintenance record
    const record = await prisma.maintenance.create({
      data: {
        id,
        assetId: body.assetId,
        assetTag: asset.assetTag,
        assetName: asset.name,
        type: body.type || 'corrective',
        status: 'scheduled',
        priority: body.priority || 'medium',
        title: body.title,
        description: body.description,
        scheduledDate: body.scheduledDate,
        assignedToId: body.assignedToId || null,
        assignedToName,
        cost: Number(body.cost) || 0,
        vendor: body.vendor || '',
        notes: body.notes || '',
      },
    });

    // 4. Update Asset status to 'maintenance'
    await prisma.asset.update({
      where: { id: asset.id },
      data: { status: 'maintenance' },
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error: any) {
    console.error('Error creating maintenance record:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
