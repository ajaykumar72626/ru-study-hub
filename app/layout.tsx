import type { Metadata } from "next";
import { Inter } from "next/font/google";
// CRITICAL: This import applies the Tailwind styles to the whole app
import "./globals.css";

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-gray-50`}>
        {children}
      </body>
    </html>
  );
}