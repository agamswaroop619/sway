import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/navbar";
import React from "react";
import mobileBar from "./components/mobileBar";
import StoreProvider from "./StoreProvider";
import { Toaster } from "react-hot-toast";

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
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Afacad+Flux:wght@100..1000&family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <div className="flex flex-col min-h-[100vh] h-screen overflow-x-hidden select-none relative">
          <StoreProvider>
            {React.createElement(Navbar)}

            {/* Main content should grow and take available space */}
            <div className="flex-grow">{children}</div>

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



// npx @next/codemod@latest built-in-next-font