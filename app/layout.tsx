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
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: "JMMS — Jain International Residential School Maintenance Management System",
    template: "%s | JMMS JIRS Portal",
  },
  description:
    "Official JMMS Portal for Jain International Residential School (JIRS). Centralized digital facility management, ticket tracking, maintenance management system for campus, hostel, electrical, plumbing, and HVAC support.",
  keywords: [
    "JMMS",
    "JMMS Portal",
    "Jain",
    "JIRS",
    "JMMS JIRS",
    "Jain International Residential School",
    "JIRS Maintenance System",
    "JMMS Maintenance Management System",
    "JIRS Facility Portal",
    "Jain School Maintenance",
    "JIRS Complaints",
    "JIRS Campus Maintenance",
  ],
  authors: [{ name: "Jain International Residential School (JIRS)" }],
  creator: "JIRS IT & Facilities Team",
  publisher: "Jain Group of Institutions",
  applicationName: "JMMS JIRS Portal",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "http://localhost:3000",
    siteName: "JMMS JIRS Portal",
    title: "JMMS — Jain International Residential School Maintenance System",
    description:
      "Enterprise facility management portal for JIRS students, staff, and technicians. Real-time complaint tracking and resolution.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "JMMS - Jain International Residential School Maintenance Management System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JMMS — Jain International Residential School Maintenance System",
    description:
      "Enterprise facility management portal for JIRS students, staff, and technicians.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "/",
  },
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
        className="min-h-full flex flex-col bg-background-surface font-body text-on-background overflow-x-hidden w-full"
        suppressHydrationWarning
      >
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}
