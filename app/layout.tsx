import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import ToastProvider from "@/components/ui/ToastProvider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "JMMS — JIRS Maintenance Management System",
  description:
    "Elevating the JIRS residential experience through a centralized, enterprise-grade digital platform for facility management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${poppins.variable} ${inter.variable} scroll-smooth h-full antialiased`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-full flex flex-col bg-background-surface font-body text-on-background"
        suppressHydrationWarning
      >
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}
