import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const booking = await prisma.booking.findUnique({
      where: { id },
    });
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    return NextResponse.json(booking);
  } catch (error: any) {
    console.error('Error fetching booking:', error);
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
    if (body.status !== undefined) updateData.status = body.status;
    if (body.purpose !== undefined) updateData.purpose = body.purpose;
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.startDate !== undefined) updateData.startDate = new Date(body.startDate);
    if (body.endDate !== undefined) updateData.endDate = new Date(body.endDate);
    
    // Resolve approver details if status is changing
    if (body.status === 'approved' || body.status === 'rejected') {
      const emp = await prisma.employee.findFirst();
      updateData.approvedById = emp?.id || 'system';
      updateData.approvedByName = emp ? `${emp.firstName} ${emp.lastName}` : 'System Admin';
      updateData.approvedAt = new Date();
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(booking);
  } catch (error: any) {
    console.error('Error updating booking:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.booking.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting booking:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
