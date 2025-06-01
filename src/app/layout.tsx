import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NavBar from "./Components/NavBar"; // ✅ Add this line
import "./globals.css";
import TavusWidget from "./Components/TavusWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NYC Intelli News",
  description: "Trusted Personalized AI powered news for every New Yorker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased 	bg-[#CBB8A9]`}
      >
        <NavBar />
        <div className="mt-4 max-w-6xl mx-auto flex justify-between items-center">
          {children}
        </div>
        
        <TavusWidget />
        
        
      </body>
    </html>
  );
}
