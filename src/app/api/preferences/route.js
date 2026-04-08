import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/Users';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req) {
  try {
    await connectDB();
    const { userId, answers } = await req.json();

    if (!userId || !answers) {
      return NextResponse.json({ message: "Missing userId or answers." }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    if (!session || session.user.id !== userId) {
      return NextResponse.json({ message: "Unauthorized to update these preferences." }, { status: 403 });
    }

    // Find user by the ID from the session, not just the request body
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

  // 1. Save to the main questionnaire field for the Home page filters
    user.questionnaire = answers;
    // Help Mongoose detect changes to mixed/array types
    user.markModified('questionnaire');

    const fieldMapping = {
      "dietType": "foodPreference",
      // "spiceLevel": "spicePreference",
      "allergies": "allergies",
      // "healthSuggestions": "healthySuggestions",/
      "weightGoal": "weightGoal",
      
    };

    answers.forEach(item => {
      const schemaField = fieldMapping[item.questionId];
      if (schemaField) {
        user[schemaField] = item.answer;
      }
    });

    // User ka profile complete ho gaya hai, isse database mein set karein
    user.profileComplete = true;

    await user.save();
    console.log('User preferences updated successfully for userId:', userId);

    // Return updated user data for session refresh
    return NextResponse.json({ 
      message: "Preferences Saved Successfully ✅",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        image: user.image,
        profileComplete: user.profileComplete,
        questionnaire: user.questionnaire,
      }
    }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "An error occurred while saving preferences." }, { status: 500 });
  }
}