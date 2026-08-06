import type { Metadata } from "next";
import { Suspense } from "react";
import AuthSimpleShell from "@/components/auth/AuthSimpleShell";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password | JFM",
  description: "Choose a new password for your JFM account.",
};

export default function ResetPasswordPage() {
  return (
    <AuthSimpleShell>
      <Suspense fallback={<p className="font-body-md text-on-surface-variant">Loading...</p>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthSimpleShell>
  );
}
