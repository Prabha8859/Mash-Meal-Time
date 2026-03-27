import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
    },

    image: {
      type: String,
    },

    phone: {
      type: String,
    },

    gender: {
      type: String,
    },

    questionnaire: [
      {
        questionId: String,
        answer: [String],
      },
    ],

    // All user preferences are stored in the questionnaire array above
  },
  { timestamps: true }
);

// Export single model
export default mongoose.models.User || mongoose.model("User", UserSchema);