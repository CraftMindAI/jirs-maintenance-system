import { redirect } from "next/navigation";

export default function ForgotPasswordRedirect() {
  redirect("/auth/v1/forgot-password");
}

