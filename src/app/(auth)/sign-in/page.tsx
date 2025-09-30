"use client";
import { Button, FooterLink, InputField } from "@/components";
import { useForm } from "@tanstack/react-form";

const Page = () => {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
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
    <div className="space-y-8 max-w-xl mx-auto">
      <h1 className="form-title">Log In Your Account</h1>
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
              {isSubmitting ? "Signing In" : "Sign In"}
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
export default Page;
