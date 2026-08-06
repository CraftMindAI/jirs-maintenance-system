import type { Metadata } from "next";
import AnimatedTechnicianAuth from "@/components/auth/AnimatedTechnicianAuth";

export const metadata: Metadata = {
  title: "Login | JFM Technician Portal",
  description: "Log in to the JIRS Maintenance Management System.",
};

export default function LoginPage() {
  return <AnimatedTechnicianAuth initialView="login" />;
}

