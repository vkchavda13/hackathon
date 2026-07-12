import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

// Run db push programmatically to create the database and tables if they do not exist
try {
  console.log('Ensuring database exists and is synchronized...');
  execSync('npx prisma db push --skip-generate', { stdio: 'inherit' });
} catch (error) {
  console.warn('Warning: Failed to run prisma db push. Database might already exist or URL is not reachable yet.', error);
}

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing database tables...');

  // Clear tables in reverse dependency order
  await prisma.notification.deleteMany();
  await prisma.maintenance.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.auditCycle.deleteMany();
  await prisma.allocation.deleteMany();
  await prisma.asset.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.department.deleteMany();
  await prisma.category.deleteMany();
  await prisma.report.deleteMany();
  await prisma.settings.deleteMany();

  // Helper to read and parse JSON data files
  const readJson = (filename: string) => {
    const filePath = path.join(process.cwd(), 'public', 'json', filename);
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  };

  console.log('Seeding categories...');
  const categories = readJson('categories.json');
  for (const cat of categories) {
    await prisma.category.create({
      data: {
        id: cat.id,
        name: cat.name,
        code: cat.code,
        description: cat.description,
        parentId: cat.parentId,
        assetCount: cat.assetCount,
        depreciationRate: cat.depreciationRate,
        usefulLifeYears: cat.usefulLifeYears,
        isActive: cat.isActive,
        createdAt: new Date(cat.createdAt),
        updatedAt: new Date(cat.updatedAt),
      }
    });
  }

  console.log('Seeding departments (without headId initially to handle circular dependency)...');
  const departments = readJson('departments.json');
  for (const dept of departments) {
    await prisma.department.create({
      data: {
        id: dept.id,
        name: dept.name,
        code: dept.code,
        description: dept.description,
        headId: null, // Circular dependency resolved by setting null first
        headName: dept.headName,
        location: dept.location,
        employeeCount: dept.employeeCount,
        assetCount: dept.assetCount,
        budget: dept.budget,
        isActive: dept.isActive,
        createdAt: new Date(dept.createdAt),
        updatedAt: new Date(dept.updatedAt),
      }
    });
  }

  console.log('Seeding employees...');
  const employees = readJson('employees.json');
  for (const emp of employees) {
    await prisma.employee.create({
      data: {
        id: emp.id,
        employeeId: emp.employeeId,
        firstName: emp.firstName,
        lastName: emp.lastName,
        email: emp.email,
        phone: emp.phone,
        departmentId: emp.departmentId,
        departmentName: emp.departmentName,
        designation: emp.designation,
        status: emp.status,
        joinDate: emp.joinDate,
        allocatedAssets: emp.allocatedAssets,
        avatarUrl: emp.avatarUrl,
        createdAt: new Date(emp.createdAt),
        updatedAt: new Date(emp.updatedAt),
      }
    });
  }

  console.log('Updating departments with headId...');
  for (const dept of departments) {
    if (dept.headId) {
      await prisma.department.update({
        where: { id: dept.id },
        data: { headId: dept.headId }
      });
    }
  }

  console.log('Seeding assets...');
  const assets = readJson('assets.json');
  for (const asset of assets) {
    await prisma.asset.create({
      data: {
        id: asset.id,
        assetTag: asset.assetTag,
        name: asset.name,
        description: asset.description,
        categoryId: asset.categoryId,
        categoryName: asset.categoryName,
        departmentId: asset.departmentId,
        departmentName: asset.departmentName,
        status: asset.status,
        condition: asset.condition,
        serialNumber: asset.serialNumber,
        model: asset.model,
        manufacturer: asset.manufacturer,
        purchaseDate: asset.purchaseDate,
        purchasePrice: asset.purchasePrice,
        currentValue: asset.currentValue,
        warrantyExpiry: asset.warrantyExpiry,
        location: asset.location,
        assignedToId: asset.assignedToId,
        assignedToName: asset.assignedToName,
        notes: asset.notes,
        imageUrl: asset.imageUrl,
        createdAt: new Date(asset.createdAt),
        updatedAt: new Date(asset.updatedAt),
      }
    });
  }

  console.log('Seeding allocations...');
  const allocations = readJson('allocations.json');
  for (const alloc of allocations) {
    await prisma.allocation.create({
      data: {
        id: alloc.id,
        assetId: alloc.assetId,
        assetTag: alloc.assetTag,
        assetName: alloc.assetName,
        employeeId: alloc.employeeId,
        employeeName: alloc.employeeName,
        departmentId: alloc.departmentId,
        departmentName: alloc.departmentName,
        type: alloc.type,
        status: alloc.status,
        allocatedDate: alloc.allocatedDate,
        returnDate: alloc.returnDate,
        expectedReturnDate: alloc.expectedReturnDate,
        notes: alloc.notes,
        previousEmployeeId: alloc.previousEmployeeId,
        previousEmployeeName: alloc.previousEmployeeName,
        createdAt: new Date(alloc.createdAt),
        updatedAt: new Date(alloc.updatedAt),
      }
    });
  }

  console.log('Seeding audit cycles...');
  const audits = readJson('audit.json');
  for (const audit of audits) {
    await prisma.auditCycle.create({
      data: {
        id: audit.id,
        name: audit.name,
        description: audit.description,
        status: audit.status,
        startDate: audit.startDate,
        endDate: audit.endDate,
        departmentId: audit.departmentId,
        departmentName: audit.departmentName,
        totalAssets: audit.totalAssets,
        verifiedCount: audit.verifiedCount,
        discrepancyCount: audit.discrepancyCount,
        missingCount: audit.missingCount,
        conductedById: audit.conductedById,
        conductedByName: audit.conductedByName,
        createdAt: new Date(audit.createdAt),
        updatedAt: new Date(audit.updatedAt),
      }
    });
  }

  console.log('Seeding bookings...');
  const bookings = readJson('bookings.json');
  for (const book of bookings) {
    await prisma.booking.create({
      data: {
        id: book.id,
        assetId: book.assetId,
        assetTag: book.assetTag,
        assetName: book.assetName,
        requestedById: book.requestedById,
        requestedByName: book.requestedByName,
        departmentName: book.departmentName,
        status: book.status,
        startDate: new Date(book.startDate),
        endDate: new Date(book.endDate),
        purpose: book.purpose,
        notes: book.notes,
        approvedById: book.approvedById,
        approvedByName: book.approvedByName,
        approvedAt: book.approvedAt ? new Date(book.approvedAt) : null,
        createdAt: new Date(book.createdAt),
        updatedAt: new Date(book.updatedAt),
      }
    });
  }

  console.log('Seeding maintenances...');
  const maintenances = readJson('maintenance.json');
  for (const mnt of maintenances) {
    await prisma.maintenance.create({
      data: {
        id: mnt.id,
        assetId: mnt.assetId,
        assetTag: mnt.assetTag,
        assetName: mnt.assetName,
        type: mnt.type,
        status: mnt.status,
        priority: mnt.priority,
        title: mnt.title,
        description: mnt.description,
        scheduledDate: mnt.scheduledDate,
        completedDate: mnt.completedDate,
        assignedToId: mnt.assignedToId,
        assignedToName: mnt.assignedToName,
        cost: mnt.cost,
        vendor: mnt.vendor,
        notes: mnt.notes,
        createdAt: new Date(mnt.createdAt),
        updatedAt: new Date(mnt.updatedAt),
      }
    });
  }

  console.log('Seeding notifications...');
  const notifications = readJson('notifications.json');
  for (const notif of notifications) {
    await prisma.notification.create({
      data: {
        id: notif.id,
        type: notif.type,
        priority: notif.priority,
        title: notif.title,
        message: notif.message,
        isRead: notif.isRead,
        entityType: notif.entityType,
        entityId: notif.entityId,
        createdAt: new Date(notif.createdAt),
      }
    });
  }

  console.log('Seeding reports...');
  const reports = readJson('reports.json');
  for (const rpt of reports) {
    await prisma.report.create({
      data: {
        id: rpt.id,
        name: rpt.name,
        type: rpt.type,
        description: rpt.description,
        format: rpt.format,
        generatedAt: new Date(rpt.generatedAt),
        generatedByName: rpt.generatedByName,
        fileSize: rpt.fileSize,
        parameters: rpt.parameters,
      }
    });
  }

  console.log('Seeding settings...');
  const settings = readJson('settings.json');
  await prisma.settings.create({
    data: {
      organizationName: settings.organizationName,
      organizationAddress: settings.organizationAddress,
      contactEmail: settings.contactEmail,
      contactPhone: settings.contactPhone,
      assetIdPrefix: settings.assetIdPrefix,
      assetIdNextNumber: settings.assetIdNextNumber,
      financialYearStart: settings.financialYearStart,
      currency: settings.currency,
      depreciationMethod: settings.depreciationMethod,
      maintenanceReminderDays: settings.maintenanceReminderDays,
      warrantyReminderDays: settings.warrantyReminderDays,
      auditFrequency: settings.auditFrequency,
      lowStockThreshold: settings.lowStockThreshold,
      enableEmailNotifications: settings.enableEmailNotifications,
      enableBookingApproval: settings.enableBookingApproval,
      timezone: settings.timezone,
    }
  });

  console.log('Database successfully seeded!');
}

main()
  .catch((e) => {
    console.error('Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
