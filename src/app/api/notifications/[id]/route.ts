import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const notification = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
    return NextResponse.json(notification);
  } catch (error: any) {
    console.error('Error updating notification:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
