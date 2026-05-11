import type { Metadata } from "next";

import { Poppins } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";

import { ThemeProvider } from "@/components/theme-provider";

import { QueryProvider } from "@/providers/query-provider";
import { BoneyardProvider } from "@/components/boneyard/boneyard-provider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],

  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Client Portal",

  description: "Client event management portal",
};

import { NavigationLoader } from "@/components/ui/navigation-loader";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${poppins.className}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <BoneyardProvider />
          <QueryProvider>
            <NavigationLoader>
               {children}
            </NavigationLoader>
            <Toaster position="top-right" offset="80px" richColors />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
