import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const record = await prisma.maintenance.findUnique({
      where: { id },
    });
    if (!record) {
      return NextResponse.json({ error: 'Maintenance record not found' }, { status: 404 });
    }
    return NextResponse.json(record);
  } catch (error: any) {
    console.error('Error fetching maintenance record:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    // Fetch existing maintenance ticket
    const record = await prisma.maintenance.findUnique({
      where: { id },
    });
    if (!record) {
      return NextResponse.json({ error: 'Maintenance record not found' }, { status: 404 });
    }

    // Resolve assignedToName if technician changes
    let assignedToName = undefined;
    if (body.assignedToId !== undefined) {
      if (body.assignedToId) {
        const technician = await prisma.employee.findUnique({
          where: { id: body.assignedToId },
        });
        if (technician) {
          assignedToName = `${technician.firstName} ${technician.lastName}`;
        }
      } else {
        assignedToName = null;
      }
    }

    const updatedRecord = await prisma.maintenance.update({
      where: { id },
      data: {
        type: body.type,
        status: body.status,
        priority: body.priority,
        title: body.title,
        description: body.description,
        scheduledDate: body.scheduledDate,
        completedDate: body.completedDate,
        assignedToId: body.assignedToId !== undefined ? (body.assignedToId || null) : undefined,
        assignedToName,
        cost: body.cost !== undefined ? Number(body.cost) : undefined,
        vendor: body.vendor,
        notes: body.notes,
      },
    });

    // Side-effects on Asset status:
    // If ticket is resolved/completed, set asset back to available.
    if (body.status === 'completed' || body.status === 'resolved') {
      await prisma.asset.update({
        where: { id: record.assetId },
        data: { status: 'available' },
      }).catch(err => console.error(err));
    }

    return NextResponse.json(updatedRecord);
  } catch (error: any) {
    console.error('Error updating maintenance record:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.maintenance.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting maintenance record:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
