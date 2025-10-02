"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useCallback } from "react";

export const useAuth = () => {
  const { data: session, status, update } = useSession();

  const user = session?.user;

  const login = useCallback(async (email: string, password: string) => {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      throw new Error(result.error);
    }

    return result;
  }, []);

  const loginWithGoogle = useCallback(async () => {
    const result = await signIn("google", { redirect: false });

    if (result?.error) {
      throw new Error(result.error);
    }

    return result;
  }, []);

  const logout = useCallback(async () => {
    await signOut({ redirect: false });
  }, []);

  const updateSession = useCallback(async () => {
    await update();
  }, [update]);

  return {
    // User data
    user,
    session,
    isAuthenticated: !!session?.user,
    isLoading: status === "loading",

    // Investment preferences (from user profile)
    riskTolerance: user?.riskTolerance,
    investmentGoals: user?.investmentGoals,
    preferredIndustry: user?.preferredIndustry,
    country: user?.country,

    // Auth methods
    login,
    loginWithGoogle,
    logout,
    updateSession,
  };
};

export default useAuth;
