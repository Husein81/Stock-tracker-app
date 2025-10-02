import { signIn, signOut } from "next-auth/react";
import { api } from "./api";
import { User } from "@/types";

export const authAPi = {
  signUp: async (data: User) => {
    try {
      const response = await api.post("/auth/sign-up", data);
      return response.data;
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  },
  signIn: async (data: { email: string; password: string }) => {
    try {
      const response = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (response?.error) {
        throw new Error(response.error);
      }

      if (!response?.ok) {
        throw new Error("Sign in failed. Please check your credentials.");
      }

      return response;
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  },
  signOut: async () => {
    try {
      const response = await signOut();
      return response;
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  },
};
