import Link from "next/link";

export default function AuthTabs({ active }: { active: "login" | "signup" }) {
  return (
    <div className="mb-8 flex border-b border-slate-200">
      <Link
        href="/auth/v1/login"
        className={`font-mono text-xs uppercase tracking-wider px-6 py-3 transition-all border-b-2 -mb-px font-bold ${
          active === "login"
            ? "border-[#00355f] text-[#00355f]"
            : "border-transparent text-slate-500 hover:text-[#00355f]"
        }`}
      >
        LOGIN
      </Link>
      <Link
        href="/auth/v1/signup"
        className={`font-mono text-xs uppercase tracking-wider px-6 py-3 transition-all border-b-2 -mb-px font-bold ${
          active === "signup"
            ? "border-[#00355f] text-[#00355f]"
            : "border-transparent text-slate-500 hover:text-[#00355f]"
        }`}
      >
        SIGN UP
      </Link>
    </div>
  );
}



