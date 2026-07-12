import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function GET() {
  try {
    const reports = await prisma.report.findMany({
      orderBy: { generatedAt: 'desc' },
    });
    return NextResponse.json(reports);
  } catch (error: any) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = crypto.randomUUID();

    // Map report types to descriptions
    const descriptions: Record<string, string> = {
      asset_summary: 'Complete inventory details including conditions and statuses.',
      allocation_history: 'Chronological list of all asset movements and assignments.',
      maintenance_log: 'Ticket logs and external cost sheets.',
      depreciation: 'Straight-line or declining balance value details.',
    };

    const description = descriptions[body.type] || 'Custom filtered report profiles.';

    // Fallback user details for generatedByName (mocking auth session)
    let emp = await prisma.employee.findFirst();
    const generatedByName = emp ? `${emp.firstName} ${emp.lastName}` : 'System Admin';

    const report = await prisma.report.create({
      data: {
        id,
        name: body.name || `Asset Report ${new Date().toLocaleDateString('en-IN')}`,
        type: body.type || 'asset_summary',
        description,
        format: body.format || 'pdf',
        generatedByName,
        fileSize: `${(1.2 + Math.random() * 3.5).toFixed(1)} MB`,
        parameters: body.parameters || {},
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error: any) {
    console.error('Error generating report:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
