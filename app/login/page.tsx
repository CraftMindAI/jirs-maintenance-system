import type { Metadata } from "next";
import AuthPageShell from "@/components/auth/AuthPageShell";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login | JMMS",
  description: "Log in to the JIRS Maintenance Management System.",
};

export default function LoginPage() {
  return (
    <AuthPageShell active="login">
      <LoginForm />
    </AuthPageShell>
  );
}
