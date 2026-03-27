import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db'; // Assuming you have a db connection utility in src/lib/db.js
import User from '@/models/Users';

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
    }

    await connectDB();

    const userExists = await User.findOne({ email }).select('_id');
    if (userExists) {
      return NextResponse.json({ message: 'User already exists.' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    // We don't want to send the password hash to the client.
    // The user object will have default values from the schema, like `profileComplete: false`.
    const userToReturn = await User.findById(newUser._id).select('-password');

    return NextResponse.json({ message: 'User registered.', user: userToReturn }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'An error occurred while registering the user.' },
      { status: 500 }
    );
  }
}
