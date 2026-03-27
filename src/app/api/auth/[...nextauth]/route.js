import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/Users";

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials;
        try {
          await connectDB();
          const user = await User.findOne({ email });

          if (!user) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (!passwordsMatch) return null;

          return user;
        } catch (error) {
          console.log("Error: ", error);
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Pass custom user data from the token to the session object
      if (token) {
        session.user.id = token.id;
        session.user.profileComplete = token.profileComplete;
        session.user.questionnaire = token.questionnaire;
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      // This is called first. `user` is only available on initial sign-in.
      // We fetch the full user details from the DB and put them in the token.
      if (trigger === "update" && session) {
        // When the session is updated (e.g., from preferences page),
        // update the token with new data.
        token.profileComplete = session.user.profileComplete;
        token.questionnaire = session.user.questionnaire;
        return token;
      }
      if (user) {
        await connectDB();
        const dbUser = await User.findOne({ email: user.email }).select('-password');
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.profileComplete = dbUser.profileComplete;
          token.questionnaire = dbUser.questionnaire;
        }
      }
      return token;
    },
   

    async signIn({ user, account }) {
      if (account.provider === "google") {
        const { name, email } = user;
        try {
          await connectDB();
          const userExists = await User.findOne({ email });

          if (!userExists) {
            await User.create({ name, email }); // Mongoose model defaults will apply
          }
          return true;
        } catch (error) {
          console.log("Error saving user from Google OAuth: ", error);
          return false;
        }
      }
      return true;
    },
    async redirect({ baseUrl }) {
      return baseUrl; 
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };