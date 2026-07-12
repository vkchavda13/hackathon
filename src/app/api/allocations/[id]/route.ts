import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const allocation = await prisma.allocation.findUnique({
      where: { id },
    });
    if (!allocation) {
      return NextResponse.json({ error: 'Allocation record not found' }, { status: 404 });
    }
    return NextResponse.json(allocation);
  } catch (error: any) {
    console.error('Error fetching allocation:', error);
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

    const allocation = await prisma.allocation.update({
      where: { id },
      data: {
        type: body.type,
        status: body.status,
        allocatedDate: body.allocatedDate,
        returnDate: body.returnDate || null,
        expectedReturnDate: body.expectedReturnDate || null,
        notes: body.notes,
      },
    });

    return NextResponse.json(allocation);
  } catch (error: any) {
    console.error('Error updating allocation:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.allocation.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting allocation:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
