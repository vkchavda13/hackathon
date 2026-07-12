import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { hashPassword } from '@/utils/auth';

export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: { firstName: 'asc' },
    });
    return NextResponse.json(employees);
  } catch (error: any) {
    console.error('Error fetching employees:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = crypto.randomUUID();
    const employeeId = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;

    // Resolve departmentName from departmentId
    let departmentName = '';
    if (body.departmentId) {
      const dept = await prisma.department.findUnique({
        where: { id: body.departmentId },
      });
      if (dept) {
        departmentName = dept.name;
      }
    }

    const employee = await prisma.employee.create({
      data: {
        id,
        employeeId,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        departmentId: body.departmentId,
        departmentName,
        designation: body.designation,
        status: body.status || 'active',
        role: body.role || 'employee',
        password: hashPassword('password123'),
        joinDate: body.joinDate,
        avatarUrl: body.avatarUrl || null,
        allocatedAssets: 0,
      },
    });

    // Update the employee count of the department
    if (body.departmentId) {
      await prisma.department.update({
        where: { id: body.departmentId },
        data: {
          employeeCount: {
            increment: 1,
          },
        },
      });
    }

    return NextResponse.json(employee, { status: 201 });
  } catch (error: any) {
    console.error('Error creating employee:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
