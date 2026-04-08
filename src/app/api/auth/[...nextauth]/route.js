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
      if (session?.user && token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.profileComplete = token.profileComplete; // Ensure boolean
        session.user.questionnaire = token.questionnaire; // Ensure array
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      // This is called first. `user` is only available on initial sign-in.
      // We fetch the full user details from the DB and put them in the token.
      if (trigger === "update" && session) {
        // Update token with new profile data but keep the existing ID
        if (session.user) {
          token.name = session.user.name || token.name;
          token.email = session.user.email || token.email;
          token.picture = session.user.image || token.picture;
          token.profileComplete = session.user.profileComplete !== undefined 
            ? session.user.profileComplete 
            : token.profileComplete;
          token.questionnaire = session.user.questionnaire || token.questionnaire;
        }
        return token;
      }
      if (user) {
        await connectDB();
        // Search by googleId (sub) first, then fallback to email
        const dbUser = await User.findOne({
          $or: [
            { googleId: user.id },
            { googleId: token?.sub },
            { email: user.email },
          ]
        }).select('-password');

        if (dbUser) {
          token.id = dbUser._id.toString(); // Ensure we use the MongoDB ID
          token.name = dbUser.name;
          token.email = dbUser.email;
          token.picture = dbUser.image || user.image;
          token.profileComplete = dbUser.profileComplete;
          token.questionnaire = dbUser.questionnaire;
        }
      }
      return token;
    },
   

    async signIn({ user, account }) {
      if (account.provider === "google") {
        const { name, email, id, image } = user;
        try {
          await connectDB();
          
          // 1. Always check by Google ID first (sub)
          let userExists = await User.findOne({ googleId: id });

          if (userExists) {
            // Account exists. Even if email was changed in Profile, 
            // they prove identity via Google ID.
            return true;
          }

          // 2. Fallback: If no Google ID link, check by Email to link accounts
            userExists = await User.findOne({ email });
            if (userExists) {
              userExists.googleId = id;
              if (!userExists.image) userExists.image = image; // Link initial image if missing
              await userExists.save();
            } else {
              // 3. Truly new user
              await User.create({ name, email, googleId: id, image }); 
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