import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "./components/Navbar"; 
import Footer from "./components/Footer"; 
import GoogleAnalytics from "./components/GoogleAnalytics"; 
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RU Study Hub - Ranchi University Resources",
  description: "Official notes, syllabus, and PYQs for BCA Honours at Ranchi University.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-slate-50 flex flex-col min-h-screen`}>
        {/* PASTE YOUR ID HERE inside the quotes */}
        <GoogleAnalytics GA_MEASUREMENT_ID="G-T525WD2DRQ" />
        
        <Navbar />
        <div className="flex-grow">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}