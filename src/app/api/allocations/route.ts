import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function GET() {
  try {
    const allocations = await prisma.allocation.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(allocations);
  } catch (error: any) {
    console.error('Error fetching allocations:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = crypto.randomUUID();

    // 1. Fetch asset details
    const asset = await prisma.asset.findUnique({
      where: { id: body.assetId },
    });
    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    // 2. Fetch employee details
    const employee = await prisma.employee.findUnique({
      where: { id: body.employeeId },
      include: { department: true }
    });
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    // 3. Keep track of previous holder for transfers
    let previousEmployeeId = null;
    let previousEmployeeName = null;
    if (body.type === 'transfer' && asset.assignedToId) {
      previousEmployeeId = asset.assignedToId;
      previousEmployeeName = asset.assignedToName;
    }

    // 4. Create allocation record
    const allocation = await prisma.allocation.create({
      data: {
        id,
        assetId: body.assetId,
        assetTag: asset.assetTag,
        assetName: asset.name,
        employeeId: body.employeeId,
        employeeName: `${employee.firstName} ${employee.lastName}`,
        departmentId: employee.departmentId,
        departmentName: employee.departmentName,
        type: body.type,
        status: body.type === 'return' ? 'returned' : 'active',
        allocatedDate: body.allocatedDate,
        expectedReturnDate: body.expectedReturnDate || null,
        notes: body.notes || '',
        previousEmployeeId,
        previousEmployeeName,
        returnDate: body.type === 'return' ? body.allocatedDate : null,
      },
    });

    // 5. Update Asset status, location and assignments
    const nextStatus = body.type === 'return' ? 'available' : 'allocated';
    const nextEmpId = body.type === 'return' ? null : employee.id;
    const nextEmpName = body.type === 'return' ? null : `${employee.firstName} ${employee.lastName}`;
    
    await prisma.asset.update({
      where: { id: asset.id },
      data: {
        status: nextStatus,
        assignedToId: nextEmpId,
        assignedToName: nextEmpName,
      },
    });

    // 6. Update Employee allocated asset count
    if (body.type !== 'return') {
      await prisma.employee.update({
        where: { id: employee.id },
        data: { allocatedAssets: { increment: 1 } },
      }).catch(err => console.error(err));
      
      if (previousEmployeeId) {
        await prisma.employee.update({
          where: { id: previousEmployeeId },
          data: { allocatedAssets: { decrement: 1 } },
        }).catch(err => console.error(err));
      }
    } else {
      // It is a return
      if (asset.assignedToId) {
        await prisma.employee.update({
          where: { id: asset.assignedToId },
          data: { allocatedAssets: { decrement: 1 } },
        }).catch(err => console.error(err));
      }
    }

    return NextResponse.json(allocation, { status: 201 });
  } catch (error: any) {
    console.error('Error creating allocation:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
