import { ReactNode } from "react";

export default function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop ${className}`}>
      {children}
    </div>
  );
}
