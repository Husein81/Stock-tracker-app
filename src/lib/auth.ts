import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/database/connection";
import User from "@/database/models/user.model";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter email and password");
        }

        await connectToDatabase();

        const user = await User.findOne({ email: credentials.email });

        if (!user || !user.password) {
          throw new Error("No user found with this email");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          fullName: user.fullName,
          emailVerified: user.emailVerified,
          image: user.image,
          country: user.country,
          investmentGoals: user.investmentGoals,
          riskTolerance: user.riskTolerance,
          preferredIndustry: user.preferredIndustry,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        await connectToDatabase();

        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          await User.create({
            fullName: user.fullName,
            email: user.email,
            image: user.image,
            provider: "google",
            country: "Not Specified",
            investmentGoals: "Balanced",
            riskTolerance: "Medium",
            preferredIndustry: "Technology",
          });
        } else if (!existingUser.emailVerified) {
          existingUser.emailVerified = new Date();
          existingUser.provider = "google";
          await existingUser.save();
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.fullName = user.fullName;
        token.email = user.email;
        token.image = user.image;
        token.country = user.country;
        token.investmentGoals = user.investmentGoals;
        token.riskTolerance = user.riskTolerance;
        token.preferredIndustry = user.preferredIndustry;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.fullName = token.fullName as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
        session.user.country = token.country as string;
        session.user.investmentGoals = token.investmentGoals as string;
        session.user.riskTolerance = token.riskTolerance as string;
        session.user.preferredIndustry = token.preferredIndustry as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
