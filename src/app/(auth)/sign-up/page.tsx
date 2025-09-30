"use client";
import {
  Button,
  CountryField,
  FooterLink,
  InputField,
  SelectField,
} from "@/components";
import {
  INVESTMENT_GOALS,
  PREFERRED_INDUSTRIES,
  RISK_TOLERANCE_OPTIONS,
} from "@/lib/constants";
import { useForm } from "@tanstack/react-form";

const Page = () => {
  const form = useForm({
    defaultValues: {
      fullname: "",
      email: "",
      country: "",
      password: "",
      investmentGoals: "Growth",
      riskTolerance: "Medium",
      preferredIndustry: "Technology",
    },
    onSubmit: ({ value }) => {
      console.log("Form Submitted", value);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.handleSubmit();
  };
  return (
    <div className="space-y-2 max-w-xl mx-auto">
      <h1 className="form-title">Sign Up & Personalize</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <form.Field
          name="fullname"
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
