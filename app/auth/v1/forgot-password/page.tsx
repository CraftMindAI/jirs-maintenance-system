import type { Metadata } from "next";
import AnimatedTechnicianAuth from "@/components/auth/AnimatedTechnicianAuth";

export const metadata: Metadata = {
  title: "Forgot Password | JMMS Technician Portal",
  description: "Reset your JMMS account password.",
};

export default function ForgotPasswordPage() {
  return <AnimatedTechnicianAuth initialView="forgot" />;
}

