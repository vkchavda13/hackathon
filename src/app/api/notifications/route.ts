import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(notifications);
  } catch (error: any) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH() {
  try {
    await prisma.notification.updateMany({
      data: { isRead: true },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error marking all notifications read:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
