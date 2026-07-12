import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const employee = await prisma.employee.findFirst({
      where: {
        OR: [
          { id },
          { employeeId: id },
        ],
      },
    });
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }
    return NextResponse.json(employee);
  } catch (error: any) {
    console.error('Error fetching employee:', error);
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

    // Check if employee exists
    const employee = await prisma.employee.findUnique({
      where: { id },
    });
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    // Resolve departmentName if departmentId changed
    let departmentName = undefined;
    if (body.departmentId && body.departmentId !== employee.departmentId) {
      const dept = await prisma.department.findUnique({
        where: { id: body.departmentId },
      });
      if (dept) {
        departmentName = dept.name;
      }
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        departmentId: body.departmentId,
        departmentName: departmentName,
        designation: body.designation,
        status: body.status,
        role: body.role,
        joinDate: body.joinDate,
        avatarUrl: body.avatarUrl,
      },
    });

    // Update employee count in departments if changed
    if (body.departmentId && body.departmentId !== employee.departmentId) {
      // Decrement old
      await prisma.department.update({
        where: { id: employee.departmentId },
        data: { employeeCount: { decrement: 1 } },
      }).catch(err => console.error("Failed to update old dept employee count:", err));

      // Increment new
      await prisma.department.update({
        where: { id: body.departmentId },
        data: { employeeCount: { increment: 1 } },
      }).catch(err => console.error("Failed to update new dept employee count:", err));
    }

    return NextResponse.json(updatedEmployee);
  } catch (error: any) {
    console.error('Error updating employee:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const employee = await prisma.employee.findUnique({
      where: { id },
    });
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    await prisma.employee.delete({
      where: { id },
    });

    // Update employee count of department
    await prisma.department.update({
      where: { id: employee.departmentId },
      data: {
        employeeCount: {
          decrement: 1,
        },
      },
    }).catch(err => console.error("Failed to update dept employee count:", err));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting employee:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
