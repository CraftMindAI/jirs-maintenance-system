import type { Metadata } from "next";
import AnimatedTechnicianAuth from "@/components/auth/AnimatedTechnicianAuth";

export const metadata: Metadata = {
  title: "Forgot Password | JFM Technician Portal",
  description: "Reset your JFM account password.",
};

export default function ForgotPasswordPage() {
  return <AnimatedTechnicianAuth initialView="forgot" />;
}

