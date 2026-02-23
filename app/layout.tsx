import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Background from "@/components/ui/background";
import Navbar from "@/components/layout/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StudySync - Student Daily Planner",
  description: "Plan your day, track study hours, master your future.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen antialiased bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white`}>
        <Background />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
