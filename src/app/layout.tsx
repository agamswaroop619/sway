import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/navbar";
import React from "react";
import mobileBar from "./components/mobileBar";

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
        <div className="relative h-[100vh] overflow-x-hidden">
          {React.createElement(Navbar)}
          {children}
          <div className=" bottom-0 sticky">
            {React.createElement(mobileBar)}
          </div>
        </div>
      </body>
    </html>
  );
}
