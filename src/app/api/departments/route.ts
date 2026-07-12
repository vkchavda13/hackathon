import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function GET() {
  try {
    const departments = await prisma.department.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(departments);
  } catch (error: any) {
    console.error('Error fetching departments:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = crypto.randomUUID();
    
    // Find Head name if headId is provided
    let headName = null;
    if (body.headId) {
      const headEmployee = await prisma.employee.findUnique({
        where: { id: body.headId },
      });
      if (headEmployee) {
        headName = `${headEmployee.firstName} ${headEmployee.lastName}`;
      }
    }

    const department = await prisma.department.create({
      data: {
        id,
        name: body.name,
        code: body.code,
        description: body.description || '',
        headId: body.headId || null,
        headName: headName,
        location: body.location,
        budget: Number(body.budget) || 0,
        isActive: body.isActive !== undefined ? body.isActive : true,
      },
    });
    return NextResponse.json(department, { status: 201 });
  } catch (error: any) {
    console.error('Error creating department:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
