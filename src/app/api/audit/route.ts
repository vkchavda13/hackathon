import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function GET() {
  try {
    const auditCycles = await prisma.auditCycle.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(auditCycles);
  } catch (error: any) {
    console.error('Error fetching audit cycles:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = crypto.randomUUID();

    // Resolve department details and count scope assets
    let departmentName = null;
    let totalAssets = 0;

    if (body.departmentId) {
      const dept = await prisma.department.findUnique({
        where: { id: body.departmentId },
      });
      if (dept) {
        departmentName = dept.name;
        totalAssets = await prisma.asset.count({
          where: { departmentId: body.departmentId },
        });
      }
    } else {
      totalAssets = await prisma.asset.count();
    }

    // Resolve auditor details
    let conductedByName = null;
    if (body.conductedById) {
      const auditor = await prisma.employee.findUnique({
        where: { id: body.conductedById },
      });
      if (auditor) {
        conductedByName = `${auditor.firstName} ${auditor.lastName}`;
      }
    } else {
      // Fallback auditor if not provided
      const defaultAuditor = await prisma.employee.findFirst();
      body.conductedById = defaultAuditor?.id || null;
      conductedByName = defaultAuditor ? `${defaultAuditor.firstName} ${defaultAuditor.lastName}` : null;
    }

    const cycle = await prisma.auditCycle.create({
      data: {
        id,
        name: body.name,
        description: body.description || '',
        status: body.status || 'planned',
        startDate: body.startDate,
        endDate: body.endDate || null,
        departmentId: body.departmentId || null,
        departmentName,
        totalAssets,
        verifiedCount: 0,
        discrepancyCount: 0,
        missingCount: 0,
        conductedById: body.conductedById,
        conductedByName,
      },
    });

    return NextResponse.json(cycle, { status: 201 });
  } catch (error: any) {
    console.error('Error creating audit cycle:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
