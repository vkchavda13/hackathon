import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const department = await prisma.department.findUnique({
      where: { id },
    });
    if (!department) {
      return NextResponse.json({ error: 'Department not found' }, { status: 404 });
    }
    return NextResponse.json(department);
  } catch (error: any) {
    console.error('Error fetching department:', error);
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

    let headName = undefined;
    if (body.headId !== undefined) {
      if (body.headId) {
        const headEmployee = await prisma.employee.findUnique({
          where: { id: body.headId },
        });
        if (headEmployee) {
          headName = `${headEmployee.firstName} ${headEmployee.lastName}`;
        }
      } else {
        headName = null;
      }
    }

    const department = await prisma.department.update({
      where: { id },
      data: {
        name: body.name,
        code: body.code,
        description: body.description,
        headId: body.headId !== undefined ? (body.headId || null) : undefined,
        headName: headName,
        location: body.location,
        budget: body.budget !== undefined ? Number(body.budget) : undefined,
        isActive: body.isActive,
      },
    });
    return NextResponse.json(department);
  } catch (error: any) {
    console.error('Error updating department:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.department.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting department:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
