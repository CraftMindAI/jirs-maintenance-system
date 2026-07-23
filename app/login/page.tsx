import type { Metadata } from "next";
import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";
import FormField from "@/components/auth/FormField";

export const metadata: Metadata = {
  title: "Login | JMMS",
  description: "Log in to the JIRS Maintenance Management System.",
};

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome Back"
      subtitle="Log in to manage your maintenance requests."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary font-semibold hover:opacity-80">
            Sign up
          </Link>
        </>
      }
    >
      <form className="space-y-6">
        <FormField id="email" label="Email" type="email" autoComplete="email" />
        <FormField id="password" label="Password" type="password" autoComplete="current-password" />
        <button
          type="submit"
          className="w-full bg-primary text-white py-3.5 rounded-xl font-label-md font-bold hover:shadow-lg hover:shadow-primary/20 transition-all"
        >
          Log In
        </button>
      </form>
    </AuthCard>
  );
}
