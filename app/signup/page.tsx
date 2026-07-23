import type { Metadata } from "next";
import AuthPageShell from "@/components/auth/AuthPageShell";
import SignupForm from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Sign Up | JMMS",
  description: "Create an account on the JIRS Maintenance Management System.",
};

export default function SignupPage() {
  return (
    <AuthPageShell active="signup">
      <SignupForm />
    </AuthPageShell>
  );
}
