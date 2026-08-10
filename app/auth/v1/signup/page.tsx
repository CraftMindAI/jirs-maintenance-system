import type { Metadata } from "next";
import AnimatedTechnicianAuth from "@/components/auth/AnimatedTechnicianAuth";

export const metadata: Metadata = {
  title: "Sign Up | JFM Technician Portal",
  description: "Create an account on the JIRS Facilities Management.",
};

export default function SignupPage() {
  return <AnimatedTechnicianAuth initialView="signup" />;
}

