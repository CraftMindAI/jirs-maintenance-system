import type { Metadata } from "next";
import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";
import FormField from "@/components/auth/FormField";

export const metadata: Metadata = {
  title: "Sign Up | JMMS",
  description: "Create an account on the JIRS Maintenance Management System.",
};

export default function SignupPage() {
  return (
    <AuthCard
      title="Create Account"
      subtitle="Sign up to start raising and tracking maintenance requests."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-semibold hover:opacity-80">
            Log in
          </Link>
        </>
      }
    >
      <form className="space-y-6">
        <FormField id="name" label="Full Name" autoComplete="name" />
        <FormField id="email" label="Email" type="email" autoComplete="email" />
        <FormField id="password" label="Password" type="password" autoComplete="new-password" />
        <button
          type="submit"
          className="w-full bg-primary text-white py-3.5 rounded-xl font-label-md font-bold hover:shadow-lg hover:shadow-primary/20 transition-all"
        >
          Sign Up
        </button>
      </form>
    </AuthCard>
  );
}
