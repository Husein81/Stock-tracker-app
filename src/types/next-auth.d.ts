import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: User;
  }

  interface User {
    id: string;
    email: string;
    fullName: string;
    image?: string;
    country: string;
    investmentGoals: string;
    riskTolerance: string;
    preferredIndustry: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: User;
  }
}
