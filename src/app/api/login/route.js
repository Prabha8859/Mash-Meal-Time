import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/Users';

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
    }

    // In a real application, you would generate a JWT or create a session here.
    // This response is simplified for demonstration.
    return NextResponse.json({ message: 'Login successful', user: { id: user._id, name: user.name, email: user.email } }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred during login.' }, { status: 500 });
  }
}