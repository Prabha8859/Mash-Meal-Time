import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/Users';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { name, email, image } = await req.json();
    const userId = session.user.id;

    if (!userId) {
      return NextResponse.json({ message: "User ID not found in session" }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, image },
      { new: true, runValidators: true } // Return the updated document and run schema validators
    ).select('-password'); // Exclude password from the returned user object

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    // Return only necessary user data for the session update
    return NextResponse.json({
      message: "Profile updated successfully!",
      user: {
        id: updatedUser._id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image,
        profileComplete: updatedUser.profileComplete,
        questionnaire: updatedUser.questionnaire,
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ message: "An error occurred while updating profile." }, { status: 500 });
  }
}
