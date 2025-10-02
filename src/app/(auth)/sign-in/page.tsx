"use client";
import { Button, FooterLink, InputField, PulseLoader } from "@/components";
import { useSignIn } from "@/hooks/auth";
import { useForm } from "@tanstack/react-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const SignInForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const signInMutation = useSignIn();
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [emailForResend, setEmailForResend] = useState("");

  useEffect(() => {
    // Check for verification success
    if (searchParams.get("verified") === "true") {
      toast.success("Email verified successfully! You can now sign in.");
    }

    // Check for verification errors
    const error = searchParams.get("error");
    if (error === "invalid-token") {
      toast.error("Invalid verification link. Please request a new one.");
    } else if (error === "token-expired") {
      toast.error("Verification link has expired. Please request a new one.");
    } else if (error === "verification-failed") {
      toast.error("Email verification failed. Please try again.");
    }
  }, [searchParams]);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      try {
        setEmailForResend(value.email);
        await signInMutation.mutateAsync(value);
        router.push("/");
      } catch (error: any) {
        // Check if error is about unverified email
        if (error?.message?.includes("verify your email")) {
          setShowResendVerification(true);
        }
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.handleSubmit();
  };

  const handleResendVerification = async () => {
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailForResend }),
      });
      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Verification email sent!");
        setShowResendVerification(false);
      } else {
        toast.error(data.message || "Failed to send verification email");
      }
    } catch (error) {
      toast.error("Failed to resend email. Please try again.");
    }
  };

  return (
    <div className="space-y-8 max-w-xl mx-auto">
      <h1 className="form-title">Log In Your Account</h1>

      {showResendVerification && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <p className="text-sm text-yellow-500 mb-3">
            Your email is not verified. Please check your inbox for the
            verification link.
          </p>
          <Button
            onClick={handleResendVerification}
            variant="outline"
            className="w-full"
            size="sm"
          >
            Resend Verification Email
          </Button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <form.Field name="email">
          {(field) => (
            <InputField
              name={field.name}
              label="Email"
              placeholder="Enter your email"
              type="email"
              field={field}
            />
          )}
        </form.Field>
        <form.Field name="password">
          {(field) => (
            <InputField
              name={field.name}
              label="Password"
              placeholder="Enter your password"
              type="password"
              field={field}
            />
          )}
        </form.Field>

        <form.Subscribe
          selector={(state) => [state.isSubmitting, state.canSubmit]}
        >
          {([isSubmitting, canSubmit]) => (
            <Button
              className="yellow-btn w-full mt-5"
              disabled={isSubmitting || !canSubmit}
            >
              {isSubmitting ? <PulseLoader /> : "Sign In"}
            </Button>
          )}
        </form.Subscribe>
      </form>
      <FooterLink
        title="Don't have an account?"
        href="/sign-up"
        linkText="Sign Up"
      />
    </div>
  );
};

const Page = () => {
  return (
    <>
      <SignInForm />
    </>
  );
};

export default Page;
