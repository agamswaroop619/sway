import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/navbar";
import React from "react";
import StoreProvider from "./StoreProvider";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";

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
        <div className="flex flex-col  overflow-x-hidden select-none relative">
          <StoreProvider>
            {React.createElement(Navbar)}

            {/* Main content should grow and take available space */}
            <div className="flex-grow">{children}</div>
           
            <Footer/>
            <Toaster />
          </StoreProvider>
        </div>
      </body>
    </html>
  );
}



// npx @next/codemod@latest built-in-next-font