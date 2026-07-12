import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(categories);
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = crypto.randomUUID();
    const category = await prisma.category.create({
      data: {
        id,
        name: body.name,
        code: body.code,
        description: body.description || '',
        parentId: body.parentId || null,
        depreciationRate: Number(body.depreciationRate) || 0,
        usefulLifeYears: Number(body.usefulLifeYears) || 0,
        isActive: body.isActive !== undefined ? body.isActive : true,
      },
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
