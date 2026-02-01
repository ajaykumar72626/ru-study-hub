import type { Metadata, Viewport } from "next"; // Added Viewport type
import { Inter } from "next/font/google";
import Navbar from "./components/Navbar"; 
import Footer from "./components/Footer"; 
import GoogleAnalytics from "./components/GoogleAnalytics"; 
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RU Study Hub - Ranchi University Resources",
  description: "Official notes, syllabus, and PYQs for BCA Honours at Ranchi University.",
  manifest: "/manifest.json", // Link to the manifest we will create (Next.js generates this)
};

// NEW: Mobile App Branding
export const viewport: Viewport = {
  themeColor: "#1d4ed8", // Matches the bg-blue-700 header
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-slate-50 flex flex-col min-h-screen`}>
        {/* Replace with your actual ID if not already done */}
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