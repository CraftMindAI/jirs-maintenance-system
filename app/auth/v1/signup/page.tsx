import type { Metadata } from "next";
import AnimatedTechnicianAuth from "@/components/auth/AnimatedTechnicianAuth";

export const metadata: Metadata = {
  title: "Sign Up | JMMS Technician Portal",
  description: "Create an account on the JIRS Maintenance Management System.",
};

export default function SignupPage() {
  return <AnimatedTechnicianAuth initialView="signup" />;
}

