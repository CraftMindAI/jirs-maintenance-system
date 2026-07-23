import type { Metadata } from "next";
import AuthSimpleShell from "@/components/auth/AuthSimpleShell";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password | JMMS",
  description: "Reset your JMMS account password.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthSimpleShell>
      <ForgotPasswordForm />
    </AuthSimpleShell>
  );
}
