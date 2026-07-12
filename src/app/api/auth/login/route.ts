import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import * as fs from 'fs';
import * as path from 'path';

// Helper to determine role from designation
export function getRoleFromDesignation(designation: string): 'admin' | 'manager' | 'head' | 'employee' {
  const desc = designation.toLowerCase();
  if (desc.includes('it director') || desc.includes('vp')) return 'admin';
  if (desc.includes('director')) return 'head';
  if (desc.includes('manager') || desc.includes('supervisor') || desc.includes('lead')) return 'manager';
  return 'employee';
}

// Fallback to read employees from JSON file
function getFallbackEmployee(email: string) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'json', 'employees.json');
    if (!fs.existsSync(filePath)) return null;
    const employees = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return employees.find((emp: any) => emp.email.toLowerCase() === email.toLowerCase()) || null;
  } catch (error) {
    console.error('Error reading fallback employees JSON:', error);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    let employee = null;

    // Try DB first
    try {
      employee = await prisma.employee.findUnique({
        where: { email: email.toLowerCase() },
      });
    } catch (dbError) {
      console.warn('Database query failed, falling back to JSON storage:', dbError);
    }

    // Fallback if not found in DB
    if (!employee) {
      employee = getFallbackEmployee(email);
    }

    if (!employee) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Prepare user session object
    const role = getRoleFromDesignation(employee.designation);
    const user = {
      id: employee.id,
      employeeId: employee.employeeId,
      email: employee.email,
      firstName: employee.firstName,
      lastName: employee.lastName,
      designation: employee.designation,
      role,
    };

    // Serialize and encode to base64
    const sessionToken = Buffer.from(JSON.stringify(user)).toString('base64');

    // Set HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'session',
      value: sessionToken,
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
