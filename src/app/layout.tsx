import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "DIU Job Utsob 2026 — Live NFC Card Branding & Studio",
  description:
    "Official Live NFC Card Branding and Personalization System for Skill Jobs at DIU Job Utsob 2026.",
  icons: {
    icon: "/assets/job-utsob-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-50 min-h-screen text-slate-900 antialiased selection:bg-sky-500 selection:text-white">
        {children}
        <Toaster position="top-right" richColors theme="light" />
      </body>
    </html>
  );
}
