import type { Metadata } from "next";
import { Inter } from "next/font/google"; // FIXED: Use Google Fonts instead of local files
import "./globals.css";

// Initialize the Inter font (Standard, Clean, and Reliable)
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RU Study Hub",
  description: "Ranchi University Resource Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // FIXED: Added suppressHydrationWarning to stop browser extension errors
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-gray-50`}>
        {children}
      </body>
    </html>
  );
}