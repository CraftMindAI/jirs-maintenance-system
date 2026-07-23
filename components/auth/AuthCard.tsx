import { ReactNode } from "react";

export default function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-16 px-margin-mobile bg-surface-container-low/40">
      <div className="w-full max-w-md bg-white p-10 rounded-3xl border border-outline-variant/20 shadow-xl shadow-primary/5">
        <div className="text-center mb-8 space-y-2">
          <span className="font-display text-2xl text-primary font-bold">JMMS</span>
          <h1 className="font-headline text-2xl font-semibold text-primary">{title}</h1>
          <p className="text-on-surface-variant text-sm">{subtitle}</p>
        </div>
        {children}
        <div className="mt-8 text-center text-sm text-on-surface-variant">{footer}</div>
      </div>
    </div>
  );
}
