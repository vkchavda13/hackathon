import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    let settings = await prisma.settings.findFirst();
    if (!settings) {
      // Fallback create initial settings record if none exists
      settings = await prisma.settings.create({
        data: {
          id: 1,
          organizationName: 'AssetFlow Enterprise',
          organizationAddress: 'Mumbai, Maharashtra, India',
          contactEmail: 'admin@assetflow.com',
          contactPhone: '+919999999999',
          assetIdPrefix: 'AF',
          assetIdNextNumber: 1001,
          financialYearStart: '04-01',
          currency: 'INR',
          depreciationMethod: 'straight_line',
          maintenanceReminderDays: 7,
          warrantyReminderDays: 30,
          auditFrequency: 'quarterly',
          lowStockThreshold: 5,
          enableEmailNotifications: true,
          enableBookingApproval: true,
          timezone: 'Asia/Kolkata',
        },
      });
    }
    return NextResponse.json(settings);
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const settings = await prisma.settings.upsert({
      where: { id: 1 },
      update: {
        organizationName: body.organizationName,
        organizationAddress: body.organizationAddress,
        contactEmail: body.contactEmail,
        contactPhone: body.contactPhone,
        assetIdPrefix: body.assetIdPrefix,
        assetIdNextNumber: body.assetIdNextNumber !== undefined ? Number(body.assetIdNextNumber) : undefined,
        financialYearStart: body.financialYearStart,
        currency: body.currency,
        depreciationMethod: body.depreciationMethod,
        maintenanceReminderDays: body.maintenanceReminderDays !== undefined ? Number(body.maintenanceReminderDays) : undefined,
        warrantyReminderDays: body.warrantyReminderDays !== undefined ? Number(body.warrantyReminderDays) : undefined,
        auditFrequency: body.auditFrequency,
        lowStockThreshold: body.lowStockThreshold !== undefined ? Number(body.lowStockThreshold) : undefined,
        enableEmailNotifications: body.enableEmailNotifications,
        enableBookingApproval: body.enableBookingApproval,
        timezone: body.timezone,
      },
      create: {
        id: 1,
        organizationName: body.organizationName || 'AssetFlow Enterprise',
        organizationAddress: body.organizationAddress || '',
        contactEmail: body.contactEmail || '',
        contactPhone: body.contactPhone || '',
        assetIdPrefix: body.assetIdPrefix || 'AF',
        assetIdNextNumber: body.assetIdNextNumber !== undefined ? Number(body.assetIdNextNumber) : 1001,
        financialYearStart: body.financialYearStart || '04-01',
        currency: body.currency || 'INR',
        depreciationMethod: body.depreciationMethod || 'straight_line',
        maintenanceReminderDays: body.maintenanceReminderDays !== undefined ? Number(body.maintenanceReminderDays) : 7,
        warrantyReminderDays: body.warrantyReminderDays !== undefined ? Number(body.warrantyReminderDays) : 30,
        auditFrequency: body.auditFrequency || 'quarterly',
        lowStockThreshold: body.lowStockThreshold !== undefined ? Number(body.lowStockThreshold) : 5,
        enableEmailNotifications: body.enableEmailNotifications !== undefined ? body.enableEmailNotifications : true,
        enableBookingApproval: body.enableBookingApproval !== undefined ? body.enableBookingApproval : true,
        timezone: body.timezone || 'Asia/Kolkata',
      },
    });
    return NextResponse.json(settings);
  } catch (error: any) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
