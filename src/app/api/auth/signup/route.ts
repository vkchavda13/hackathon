import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/utils/auth';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    if (!body.firstName || !body.lastName || !body.email || !body.phone || !body.password || !body.departmentId) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Check if email already registered
    const existing = await prisma.employee.findUnique({
      where: { email: body.email },
    });
    if (existing) {
      return NextResponse.json({ error: 'Email is already registered' }, { status: 400 });
    }

    // Look up departmentName
    const dept = await prisma.department.findUnique({
      where: { id: body.departmentId },
    });
    if (!dept) {
      return NextResponse.json({ error: 'Selected department does not exist' }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const employeeId = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;

    const employee = await prisma.employee.create({
      data: {
        id,
        employeeId,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        password: hashPassword(body.password),
        departmentId: body.departmentId,
        departmentName: dept.name,
        designation: body.designation || 'Software Engineer',
        status: 'active',
        role: 'employee', // Always creates employee account only
        joinDate: new Date().toISOString().split('T')[0],
        avatarUrl: null,
      },
    });

    // Increment employee count
    await prisma.department.update({
      where: { id: body.departmentId },
      data: {
        employeeCount: {
          increment: 1,
        },
      },
    }).catch(err => console.error("Failed to update department employee count:", err));

    // Return created user profile (without password hash)
    const { password: _, ...userProfile } = employee;
    return NextResponse.json(userProfile, { status: 201 });
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
