import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/Users';

export async function POST(req) {
  try {
    await connectDB();
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ message: 'Email is required.' }, { status: 400 });
    }
    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select('_id');
    return NextResponse.json({ user });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'An error occurred.' }, { status: 500 });
  }
}
