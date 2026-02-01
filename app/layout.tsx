import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "./components/Navbar"; 
import Footer from "./components/Footer"; // Import the new Footer
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
        {/* Fixed Navbar at the top */}
        <Navbar />
        
        {/* Main content grows to fill space */}
        <div className="flex-grow">
          {children}
        </div>

        {/* Global Footer at the bottom */}
        <Footer />
      </body>
    </html>
  );
}