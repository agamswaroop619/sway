import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import StoreProvider from "./StoreProvider";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import ClientLayout from "./ClientLayout";
import CursorEffect from "./components/CursorEffect";

export const metadata: Metadata = {
  title: "Sway Club",
  description: "Slayy with Sway!",
  viewport:
    "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Afacad+Flux:wght@100..1000&family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <CursorEffect />
        <div className="overflow-x-hidden select-none min-h-screen flex flex-col">
          <StoreProvider>
            {/* Main content area that grows to fill available space */}
            <div className="flex-1">
              <ClientLayout>{children}</ClientLayout>
            </div>

            {/* Footer that stays at the bottom */}
            <Footer />

            <Toaster
              position="top-center"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#363636",
                  color: "#fff",
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: "#22c55e",
                    secondary: "#fff",
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: "#ef4444",
                    secondary: "#fff",
                  },
                },
              }}
            />
          </StoreProvider>
        </div>
      </body>
    </html>
  );
}

// npx @next/codemod@latest built-in-next-font
