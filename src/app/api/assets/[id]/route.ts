import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const asset = await prisma.asset.findFirst({
      where: {
        OR: [
          { id },
          { assetTag: id },
        ],
      },
    });
    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }
    return NextResponse.json(asset);
  } catch (error: any) {
    console.error('Error fetching asset:', error);
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

    // Check if asset exists
    const asset = await prisma.asset.findFirst({
      where: {
        OR: [
          { id },
          { assetTag: id },
        ],
      },
    });
    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    // Resolve categoryName if categoryId changed
    let categoryName = undefined;
    if (body.categoryId && body.categoryId !== asset.categoryId) {
      const cat = await prisma.category.findUnique({
        where: { id: body.categoryId },
      });
      if (cat) {
        categoryName = cat.name;
      }
    }

    // Resolve departmentName if departmentId changed
    let departmentName = undefined;
    if (body.departmentId && body.departmentId !== asset.departmentId) {
      const dept = await prisma.department.findUnique({
        where: { id: body.departmentId },
      });
      if (dept) {
        departmentName = dept.name;
      }
    }

    const updatedAsset = await prisma.asset.update({
      where: { id: asset.id },
      data: {
        name: body.name,
        description: body.description,
        categoryId: body.categoryId,
        categoryName: categoryName,
        departmentId: body.departmentId,
        departmentName: departmentName,
        status: body.status,
        condition: body.condition,
        serialNumber: body.serialNumber,
        model: body.model,
        manufacturer: body.manufacturer,
        purchaseDate: body.purchaseDate,
        purchasePrice: body.purchasePrice !== undefined ? Number(body.purchasePrice) : undefined,
        currentValue: body.currentValue !== undefined ? Number(body.currentValue) : undefined,
        warrantyExpiry: body.warrantyExpiry,
        location: body.location,
        assignedToId: body.assignedToId !== undefined ? body.assignedToId : undefined,
        assignedToName: body.assignedToName !== undefined ? body.assignedToName : undefined,
        notes: body.notes,
        imageUrl: body.imageUrl,
      },
    });

    // Update category asset count if categoryId changed
    if (body.categoryId && body.categoryId !== asset.categoryId) {
      await prisma.category.update({
        where: { id: asset.categoryId },
        data: { assetCount: { decrement: 1 } },
      }).catch(err => console.error("Failed to decrement old category asset count:", err));

      await prisma.category.update({
        where: { id: body.categoryId },
        data: { assetCount: { increment: 1 } },
      }).catch(err => console.error("Failed to increment new category asset count:", err));
    }

    // Update department asset count if departmentId changed
    if (body.departmentId && body.departmentId !== asset.departmentId) {
      await prisma.department.update({
        where: { id: asset.departmentId },
        data: { assetCount: { decrement: 1 } },
      }).catch(err => console.error("Failed to decrement old department asset count:", err));

      await prisma.department.update({
        where: { id: body.departmentId },
        data: { assetCount: { increment: 1 } },
      }).catch(err => console.error("Failed to increment new department asset count:", err));
    }

    return NextResponse.json(updatedAsset);
  } catch (error: any) {
    console.error('Error updating asset:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const asset = await prisma.asset.findFirst({
      where: {
        OR: [
          { id },
          { assetTag: id },
        ],
      },
    });
    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    await prisma.asset.delete({
      where: { id: asset.id },
    });

    // Decrement asset counts
    await prisma.category.update({
      where: { id: asset.categoryId },
      data: { assetCount: { decrement: 1 } },
    }).catch(err => console.error("Failed to decrement category asset count:", err));

    await prisma.department.update({
      where: { id: asset.departmentId },
      data: { assetCount: { decrement: 1 } },
    }).catch(err => console.error("Failed to decrement department asset count:", err));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting asset:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
