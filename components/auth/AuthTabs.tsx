import Link from "next/link";

export default function AuthTabs({ active }: { active: "login" | "signup" }) {
  return (
    <div className="mb-10 flex border-b border-outline-variant/30">
      <Link
        href="/login"
        className={`font-label-md px-6 py-3 transition-all border-b-2 -mb-px ${
          active === "login"
            ? "border-primary text-primary font-bold"
            : "border-transparent text-on-surface-variant hover:text-primary"
        }`}
      >
        LOGIN
      </Link>
      <Link
        href="/signup"
        className={`font-label-md px-6 py-3 transition-all border-b-2 -mb-px ${
          active === "signup"
            ? "border-primary text-primary font-bold"
            : "border-transparent text-on-surface-variant hover:text-primary"
        }`}
      >
        SIGN UP
      </Link>
    </div>
  );
}
