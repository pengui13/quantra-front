// app/[locale]/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import Header from "../components/Header";
import ClientBoot from "./ClientBoot"; // ⬅️ mounts client-side ping + splash

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quantra",
  description: "Next.js + next-intl demo",
  icons: { icon: "/logo.png", shortcut: "/logo.png", apple: "/logo.png" },
};

type LayoutProps = { children: React.ReactNode; params: { locale: string } };

export default async function RootLayout({ children, params: { locale } }: LayoutProps) {
  let messages: Record<string, unknown> = {};
  try {
    messages = (await import(`../../../messages/${locale}.json`)).default;
  } catch (err) {
    console.error(`Missing translation file for "${locale}"`, err);
  }

  return (
    <html lang={locale} data-api-online="false">
      <head>
        <link rel="preload" as="image" href="/logo.png" />
        <style>{`
          #splash{position:fixed;inset:0;display:grid;place-items:center;background:#000;z-index:9999;transition:opacity 220ms ease}
          #main{opacity:0;pointer-events:none;transition:opacity 220ms ease}
          .logo{width:96px;height:96px;border-radius:16px}
        `}</style>
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} aria-busy="true">
        {/* Splash */}
        <div id="splash" role="status" aria-live="polite" aria-label="Loading">
          <img className="logo" src="/logo.png" alt="Logo" />
        </div>

        {/* Boot (client) handles: splash fade + ApiWrapper.GetPing + re-ping on nav + interval */}
        <ClientBoot />

        <div id="main">
          <NextIntlClientProvider locale={locale as string} messages={messages}>
            <Header />
            {children}
          </NextIntlClientProvider>
        </div>
      </body>
    </html>
  );
}
