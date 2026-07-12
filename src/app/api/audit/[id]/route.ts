import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cycle = await prisma.auditCycle.findUnique({
      where: { id },
    });
    if (!cycle) {
      return NextResponse.json({ error: 'Audit cycle not found' }, { status: 404 });
    }
    return NextResponse.json(cycle);
  } catch (error: any) {
    console.error('Error fetching audit cycle:', error);
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

    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.startDate !== undefined) updateData.startDate = body.startDate;
    if (body.endDate !== undefined) updateData.endDate = body.endDate;
    if (body.verifiedCount !== undefined) updateData.verifiedCount = Number(body.verifiedCount);
    if (body.discrepancyCount !== undefined) updateData.discrepancyCount = Number(body.discrepancyCount);
    if (body.missingCount !== undefined) updateData.missingCount = Number(body.missingCount);

    const cycle = await prisma.auditCycle.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(cycle);
  } catch (error: any) {
    console.error('Error updating audit cycle:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.auditCycle.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting audit cycle:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
