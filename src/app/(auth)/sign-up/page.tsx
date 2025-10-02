"use client";
import {
  Button,
  CountryField,
  FooterLink,
  InputField,
  SelectField,
} from "@/components";
import { useSignUp } from "@/hooks/auth";
import {
  INVESTMENT_GOALS,
  PREFERRED_INDUSTRIES,
  RISK_TOLERANCE_OPTIONS,
} from "@/lib/constants";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const router = useRouter();
  const signUpMutation = useSignUp();
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);

  const form = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      country: "",
      password: "",
      investmentGoals: "Growth",
      riskTolerance: "Medium",
      preferredIndustry: "Technology",
    },
    onSubmit: async ({ value }) => {
      try {
        await signUpMutation.mutateAsync(value);
        setRegisteredEmail(value.email);
        setShowVerificationMessage(true);
        toast.success("Account created! Please check your email to verify your account.", {
          duration: 6000,
        });
      } catch (error: any) {
        toast.error(error?.message || "Failed to create account");
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
        body: JSON.stringify({ email: registeredEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Verification email sent! Please check your inbox.", {
          duration: 5000,
        });
      } else {
        toast.error(data.message || "Failed to send verification email");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  if (showVerificationMessage) {
    return (
      <div className="space-y-8 max-w-xl mx-auto">
        <div className="text-center">
          <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-500/10">
            <svg
              className="w-8 h-8 text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="form-title mb-4">Verify Your Email</h1>
          <p className="text-gray-300 mb-6">
            We've sent a verification email to:
          </p>
          <p className="text-yellow-500 font-medium text-lg mb-6">
            {registeredEmail}
          </p>
          <p className="text-gray-400 text-sm mb-8">
            Please check your inbox and click the verification link to activate your account.
            The link will expire in 24 hours.
          </p>

          <div className="space-y-4">
            <Button
              onClick={() => router.push("/sign-in")}
              className="yellow-btn w-full"
            >
              Go to Sign In
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-2">
                Didn't receive the email?
              </p>
              <button
                onClick={handleResendVerification}
                className="text-yellow-500 hover:text-yellow-400 text-sm font-medium underline"
              >
                Resend Verification Email
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-w-xl mx-auto">
      <h1 className="form-title">Sign Up & Personalize</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <form.Field
          name="fullName"
          validators={{
            onChange: (value) => (!value ? "Full name is required" : undefined),
          }}
        >
          {(field) => (
            <InputField
              name={field.name}
              label="Full Name"
              placeholder="Enter your full name"
              field={field}
            />
          )}
        </form.Field>

        <form.Field
          name="email"
          validators={{
            onChange: (value) => (!value ? "Email is required" : undefined),
          }}
        >
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

        <form.Field name="country">
          {(field) => (
            <CountryField
              name={field.name}
              label="Country"
              field={field}
              required
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

        <form.Field name="investmentGoals">
          {(field) => (
            <SelectField
              name={field.name}
              label="Investment Goals"
              placeholder="Select your investment goals"
              options={INVESTMENT_GOALS}
              field={field}
              required
            />
          )}
        </form.Field>
        <form.Field name="riskTolerance">
          {(field) => (
            <SelectField
              name={field.name}
              label="Risk Tolerance"
              placeholder="Select your risk tolerance"
              options={RISK_TOLERANCE_OPTIONS}
              field={field}
              required
            />
          )}
        </form.Field>
        <form.Field name="preferredIndustry">
          {(field) => (
            <SelectField
              name={field.name}
              label="Preferred Industry"
              placeholder="Select your preferred industry"
              options={PREFERRED_INDUSTRIES}
              field={field}
              required
            />
          )}
        </form.Field>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="w-full yellow-btn mt-4"
            >
              {isSubmitting
                ? "Creating Account"
                : "Start Your Investing Journey"}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <FooterLink
        title="Already have an account?"
        href="/sign-in"
        linkText="Sign In"
      />
    </div>
  );
};
export default Page;
