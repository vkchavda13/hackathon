import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/utils/auth';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.email || !body.password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const employee = await prisma.employee.findUnique({
      where: { email: body.email },
    });

    if (!employee) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 });
    }

    const isMatch = verifyPassword(body.password, employee.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 });
    }

    if (employee.status === 'inactive' || employee.status === 'terminated') {
      return NextResponse.json({ error: 'Your account is deactivated. Contact an administrator.' }, { status: 403 });
    }

    // Generate a secure mock session token
    const token = crypto.randomBytes(32).toString('hex');

    // Create custom success response profile
    const { password: _, ...userProfile } = employee;

    return NextResponse.json({
      token,
      user: userProfile,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
