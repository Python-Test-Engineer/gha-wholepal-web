// app/layout.tsx
import { NextIntlClientProvider } from "next-intl";
// import { ThemeProvider } from "@/providers/theme-provider";
import Application from "@/components/Application";
import "./globals.css";
import { Suspense } from "react";
// import { Navbar } from "@/components/Navbar";

export const metadata = {
  title: "Wholepal System",
  description: "Seamless, instant collaboration across the supply chain",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <NextIntlClientProvider>
          {/* <ThemeProvider> */}
          <Suspense fallback={<></>}>
            <Application>{children}</Application>
          </Suspense>
          {/* </ThemeProvider> */}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
