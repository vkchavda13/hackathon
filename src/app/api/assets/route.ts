import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function GET() {
  try {
    const assets = await prisma.asset.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(assets);
  } catch (error: any) {
    console.error('Error fetching assets:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = crypto.randomUUID();
    const assetTag = `AF-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`;

    // Resolve categoryName from categoryId
    let categoryName = '';
    if (body.categoryId) {
      const cat = await prisma.category.findUnique({
        where: { id: body.categoryId },
      });
      if (cat) {
        categoryName = cat.name;
      }
    }

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

    const asset = await prisma.asset.create({
      data: {
        id,
        assetTag,
        name: body.name,
        description: body.description || '',
        categoryId: body.categoryId,
        categoryName,
        departmentId: body.departmentId,
        departmentName,
        status: body.status || 'available',
        condition: body.condition || 'excellent',
        serialNumber: body.serialNumber,
        model: body.model,
        manufacturer: body.manufacturer,
        purchaseDate: body.purchaseDate,
        purchasePrice: Number(body.purchasePrice) || 0,
        currentValue: Number(body.purchasePrice) || 0,
        warrantyExpiry: body.warrantyExpiry || '',
        location: body.location,
        assignedToId: body.assignedToId || null,
        assignedToName: body.assignedToName || null,
        notes: body.notes || '',
        imageUrl: body.imageUrl || null,
      },
    });

    // Update asset counts
    if (body.categoryId) {
      await prisma.category.update({
        where: { id: body.categoryId },
        data: { assetCount: { increment: 1 } },
      }).catch(err => console.error("Failed to increment category asset count:", err));
    }
    if (body.departmentId) {
      await prisma.department.update({
        where: { id: body.departmentId },
        data: { assetCount: { increment: 1 } },
      }).catch(err => console.error("Failed to increment department asset count:", err));
    }

    return NextResponse.json(asset, { status: 201 });
  } catch (error: any) {
    console.error('Error creating asset:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
