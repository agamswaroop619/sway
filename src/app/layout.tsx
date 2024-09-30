import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/navbar";
import React from "react";
import mobileBar from "./components/mobileBar";
import StoreProvider from "./StoreProvider";
import { Toaster } from "react-hot-toast";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Sway Club",
  description: "Slayy with Sway!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex flex-col min-h-[100vh] h-screen overflow-x-hidden relative">
  <StoreProvider>
    {React.createElement(Navbar)}

    {/* Main content should grow and take available space */}
    <div className="flex-grow">
      {children}
    </div>

    {/* Sticky mobile bar at the bottom */}
    <div className="sticky bottom-0">
      {React.createElement(mobileBar)}
    </div>

    <Toaster />
  </StoreProvider>
</div>

      </body>
    </html>
  );
}
