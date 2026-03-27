import type { Metadata } from "next";
import { Geist, Inter } from "next/font/google";
import localFont from "next/font/local";
import Link from "next/link";
import "./globals.css";
import { LiquidGlassCard } from "react-liquid-glass-card";
import { IntroProvider } from "@/components/Intro";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geist = Geist({ subsets: ["latin"] });

const chillax = localFont({
  src: [
    {
      path: "../public/Chillax/Fonts/OTF/Chillax-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/Chillax/Fonts/OTF/Chillax-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/Chillax/Fonts/OTF/Chillax-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-chillax",
});

export const metadata: Metadata = {
  title: "PJBANK",
  description: "Sistema Bancário",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={cn("dark font-sans", inter.variable, chillax.variable)}>
      <body
        className={`${geist.className} bg-zinc-950 text-white min-h-screen font-chillax`}
      >
        <IntroProvider>
          <nav className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <Link href="/" className="text-3xl font-chillax font-bold text-transparent bg-gradient-to-bl from-yellow-500 to-orange-400 bg-clip-text">
                PJ<span className="text-white font-chillax">BANK</span>
              </Link>
              <div className="flex gap-6 text-sm text-zinc-400">
                <Link
                  href="/clientes"
                  className="hover:text-white transition-colors"
                >
                  Clientes
                </Link>
                <Link
                  href="/contas"
                  className="hover:text-white transition-colors"
                >
                  Contas
                </Link>
                <Link
                  href="/operacoes"
                  className="hover:text-white transition-colors"
                >
                  Operações
                </Link>
              </div>
            </div>
          </nav>

          {/* Conteúdo da página */}
          <main className="max-w-6xl mx-auto px-6 py-8 relative z-10">{children}</main>
        </IntroProvider>
      </body>
    </html>
  );
}
