import type { Metadata } from "next";
import AuthPageShell from "@/components/auth/AuthPageShell";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Admin Portal Sign In | JMMS",
  description: "Secure administrator authentication portal for JIRS Maintenance Management System.",
};

export default function AdminLoginPage() {
  return (
    <AuthPageShell active="login">
      <LoginForm defaultRole="admin" />
    </AuthPageShell>
  );
}
