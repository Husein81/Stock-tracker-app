import { authAPi } from "@/lib/hooks/authApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSignUp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["sign-up"],
    mutationFn: authAPi.signUp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
    onError: (error) => {
      console.error("Error during sign-up:", error);
      toast.error("Error during sign-up. Please try again.");
    },
  });
};

export const useSignIn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["sign-in"],
    mutationFn: authAPi.signIn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
    onError: (error: Error) => {
      console.error("Error during sign-in:", error);
      toast.error(error.message || "Error during sign-in. Please try again.");
    },
  });
};

export const useSignOut = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["sign-out"],
    mutationFn: authAPi.signOut,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
    onError: (error) => {
      console.error("Error during sign-out:", error);
      toast.error("Error during sign-out. Please try again.");
    },
  });
};
